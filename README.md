## Mousey App

Mousey is a mobile application that allows you to control your laptop or PC with your phone. Whether you're looking to navigate your system effortlessly or execute custom keyboard shortcuts, this app has you covered. With a sleek and intuitive design, you can easily turn your phone into a remote control for your computer.

Features

- Keyboard Screen: Create and execute custom keyboard shortcuts on your laptop/PC. The keyboard screen allows you to define your own key combinations for quick execution.

  - The app integrates with the 'keyboard' module (more info at https://github.com/boppreh/keyboard#api) to handle key press events.

- Mouse Screen: Use your phone to control your laptop/PC mouse movements. The mouse screen records the X and Y coordinates of your finger movements and sends them to the backend using the PanRecorder library for seamless mouse control.

Technologies

Frontend

- React Native (Expo): Built using React Native with Expo for fast and responsive mobile app development. The app is compatible with both Android and iOS devices.

Backend

- FastAPI: The backend is powered by FastAPI, providing fast and efficient handling of WebSocket connections for near-zero latency control.
- WebSocket: For real-time communication between the mobile app and the laptop/PC.
- keyboard module: Used for capturing and sending custom key presses from the app to the backend.
- pyautogui: Used for mouse event handling on the backend, enabling seamless control of mouse movements.

Screens

1. Keyboard Screen: This screen allows users to define and send custom keyboard shortcuts to their computer.
2. Mouse Screen: On this screen, users can move their phone to control the mouse pointer on their computer. The app tracks finger movements and sends real-time X and Y coordinates to the backend for mouse positioning.

Installation

Frontend
To run the app locally:

1. Clone this repository.
2. Install dependencies:
   npm install
3. Start the development server:
   expo start
4. Follow the Expo QR code instructions to open the app on your mobile device.

Backend

1. Clone the backend repository (if separate).
2. Install dependencies:
   pip install -r requirements.txt
3. Run the FastAPI server:
   uvicorn main:app --reload

The backend should now be running and listening for WebSocket connections.

Usage

1. Open the app on your mobile device.
2. Choose the Keyboard or Mouse screen to begin controlling your computer.
3. On the Keyboard screen, create your custom key combinations and execute them on your computer.
4. On the Mouse screen, move your phone to control your laptop/PC's mouse cursor in real-time.

Contributing

Feel free to fork this project and contribute by submitting pull requests, reporting issues, or improving the documentation.
