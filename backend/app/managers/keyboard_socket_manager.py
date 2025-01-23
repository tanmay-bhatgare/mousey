from typing import List
from fastapi import WebSocket


class KeyboardSocketManager:
    def __init__(self) -> None:
        self.connected_clients: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        """Accept a new WebSocket connection and add it to the list."""
        await websocket.accept()
        self.connected_clients.append(websocket)

    async def disconnect(self, websocket: WebSocket):
        """Remove the WebSocket from the list and close the connection."""
        if websocket in self.connected_clients:
            self.connected_clients.remove(websocket)
            try:
                await websocket.close()  # Properly await the asynchronous close
            except Exception as e:
                # Handle cases where WebSocket is already closed
                print(f"Error closing WebSocket: {e}")

    async def broadcast(self, message: str):
        """Send a message to all connected WebSocket clients."""
        for client in self.connected_clients:
            try:
                await client.send_text(message)
            except Exception as e:
                print(f"Error sending message to a client: {e}")
