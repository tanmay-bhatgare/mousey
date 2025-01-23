import json
import os
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from pydantic import ValidationError
import logging
import keyboard
import pyautogui
from dotenv import load_dotenv

# * ----------------- Custom Imports ----------------- *#
from .managers.mouse_socket_manager import MouseSocketManager
from .managers.keyboard_socket_manager import KeyboardSocketManager

load_dotenv()
logging.basicConfig(level=logging.INFO)

API = os.getenv("API")
ALLOWED_IPS = os.getenv("ALLOWED_IPS", "").split(",")

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

mouse_socket_manager = MouseSocketManager()
keyboard_socket_manager = KeyboardSocketManager()


def validate_client_ip(client_ip: str) -> bool:
    """
    Validate if the client IP is in the list of allowed IPs.
    Supports individual IPs and CIDR notation.
    """
    if not ALLOWED_IPS:
        logging.warning("No allowed IPs configured - allowing all connections")
        return True

    # Remove any whitespace and convert to lowercase
    client_ip = client_ip.strip().lower()

    # Check if the client IP is in the allowed list
    return client_ip in [ip.strip().lower() for ip in ALLOWED_IPS]


def validate_api_token(api_token: str):
    """
    Validate if the provided API token matches the expected token.
    """
    if not API:
        logging.warning("No API token configured")
        return False

    return api_token == API


@app.get("/")
def root():
    return {"message": "Server is running..."}


@app.websocket("/ws/keyboard")
async def keyboard_websocket(websocket: WebSocket):
    # Get client IP
    client_ip = websocket.client.host
    api_token = websocket.query_params.get("token")

    # Validate IP before accepting connection
    if not validate_client_ip(client_ip):
        logging.warning(
            f"Rejected connection attempt from unauthorized IP: {client_ip}"
        )
        await websocket.close(code=1008, reason="Unauthorized IP address")
        return

    if not validate_api_token(api_token):
        logging.warning(
            f"Rejected connection attempt from unauthorized API token: {api_token}"
        )
        await websocket.close(code=1008, reason="Unauthorized IP address")
        return

    logging.info(f"Authorized connection from IP: {client_ip}")
    await keyboard_socket_manager.connect(websocket)
    logging.info("New client connected.")

    try:
        while True:
            data = await websocket.receive_text()
            try:
                keys = data
                keyboard.send(keys)
            except ValidationError as e:
                logging.error(f"Validation error: {e}")
                await websocket.send_text(f"Invalid data format: {e}")
    except WebSocketDisconnect:
        await keyboard_socket_manager.disconnect(websocket)
        # logging.info("Client disconnected.")
    except Exception as e:
        logging.error(f"Unexpected error: {e}")
    finally:
        logging.warning(keyboard_socket_manager.connected_clients)
        logging.info("WebSocket connection cleaned up.")


@app.websocket("/ws/mouse")
async def mouse_websocket(websocket: WebSocket):
    client_ip = websocket.client.host
    api_token = websocket.query_params.get("token")

    # Validation checks
    if not validate_client_ip(client_ip):
        await websocket.close(code=1008, reason="Unauthorized IP address")
        return
    if not validate_api_token(api_token):
        await websocket.close(code=1008, reason="Unauthorized IP address")
        return

    await mouse_socket_manager.connect(websocket)
    try:
        # Disable pyautogui's built-in pause and animation
        pyautogui.MINIMUM_DURATION = 0
        pyautogui.MINIMUM_SLEEP = 0
        pyautogui.PAUSE = 0

        while True:
            data = await websocket.receive_text()
            try:
                message: dict = json.loads(data)
                if "type" not in message:
                    raise ValueError("Invalid data format: Missing 'type' field.")

                if message["type"] == "button":
                    button_name: str = message.get("buttonName")
                    if button_name:
                        pyautogui.click(button=button_name.upper())

                elif message["type"] == "relative_mouse":
                    try:
                        delta_x = message.get("deltaX", 0)
                        delta_y = message.get("deltaY", 0)

                        # Get current mouse position
                        current_x, current_y = pyautogui.position()

                        # Move relative to current position
                        pyautogui.moveRel(delta_x, delta_y, _pause=False)
                    except Exception as e:
                        logging.error(f"Error moving mouse: {e}")

                elif message["type"] == "scroll":
                    try:
                        delta_y = message.get("deltaY", 0)
                        # Negative deltaY scrolls up, positive scrolls down
                        clicks = (
                            -delta_y // 10
                        )  # Adjust divisor to control scroll speed
                        if clicks != 0:
                            pyautogui.scroll(clicks)
                    except Exception as e:
                        logging.error(f"Error scrolling: {e}")

            except (json.JSONDecodeError, ValueError) as e:
                logging.error(f"Error processing message: {e}")

    except WebSocketDisconnect:
        await mouse_socket_manager.disconnect(websocket)
    except Exception as e:
        logging.error(f"Unexpected error: {e}")
    finally:
        logging.info("WebSocket connection cleaned up.")
