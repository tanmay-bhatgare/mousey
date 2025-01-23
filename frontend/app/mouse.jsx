import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  PanResponder,
  Dimensions,
  Alert,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const TOKEN = process.env.EXPO_PUBLIC_API_TOKEN;
const IP = process.env.EXPO_PUBLIC_IP;

const Mouse = () => {
  const [websocket, setWebsocket] = useState(null);
  const alertingRef = useRef(false);
  const lastTouchPosition = useRef(null);
  const isDraggingRef = useRef(false);
  const sensitivity = 2; // Adjust this value to change movement sensitivity
  const dragSensitivity = 1; // Adjust this value to change drag sensitivity

  const connectWebSocket = () => {
    const ws = new WebSocket(`ws://${IP}/ws/mouse?token=${TOKEN}`);

    ws.onopen = () => console.log("Mouse: Connected to the server");
    ws.onmessage = (e) => console.log(e.data);

    ws.onerror = (e) => {
      if (!alertingRef.current) {
        alertingRef.current = true;
        Alert.alert("Mouse: Connection Forbidden", `${e.message}`, [
          {
            text: "Reconnect",
            onPress: () => {
              alertingRef.current = false;
              connectWebSocket();
            },
          },
          {
            text: "Abort",
            onPress: () => {
              alertingRef.current = false;
            },
          },
        ]);
      }
    };

    ws.onclose = () => {
      if (!alertingRef.current) {
        alertingRef.current = true;
        setWebsocket(null);
        Alert.alert(
          "Server Disconnected",
          "Unable to establish connection with server.",
          [
            {
              text: "Reconnect",
              onPress: () => {
                alertingRef.current = false;
                connectWebSocket();
              },
            },
            {
              text: "Ok",
              onPress: () => {
                alertingRef.current = false;
              },
            },
          ]
        );
      }
    };

    setWebsocket(ws);
  };

  useEffect(() => {
    connectWebSocket();

    return () => {
      alertingRef.current = false;
      websocket?.close();
    };
  }, []);

  const handleMouseClick = (btnName) => {
    if (websocket?.readyState === WebSocket.OPEN) {
      websocket.send(JSON.stringify({ type: "button", buttonName: btnName }));
    } else {
      Alert.alert("Request Failed", "Unable to send request to backend.");
    }
  };

  const sendRelativeMovement = (deltaX, deltaY) => {
    if (websocket?.readyState !== WebSocket.OPEN) return;

    // Scale the movement and ensure it's an integer
    const scaledDeltaX = Math.round(deltaX * sensitivity);
    const scaledDeltaY = Math.round(deltaY * sensitivity);

    // Only send if there's actual movement
    if (scaledDeltaX !== 0 || scaledDeltaY !== 0) {
      const data = {
        type: "relative_mouse",
        deltaX: scaledDeltaX,
        deltaY: scaledDeltaY,
      };
      websocket.send(JSON.stringify(data));
    }
  };

  const sendDragEvent = (deltaY) => {
    if (websocket?.readyState !== WebSocket.OPEN) return;

    const scaledDelta = Math.round(deltaY * dragSensitivity);

    if (scaledDelta !== 0) {
      const data = {
        type: "scroll",
        deltaY: scaledDelta,
      };
      websocket.send(JSON.stringify(data));
    }
  };

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,

    onPanResponderGrant: (evt) => {
      const { locationX, locationY } = evt.nativeEvent;
      const touches = evt.nativeEvent.touches;

      if (touches.length === 2) {
        isDraggingRef.current = true;
      } else {
        isDraggingRef.current = false;
      }

      lastTouchPosition.current = { x: locationX, y: locationY };
    },

    onPanResponderMove: (evt, gestureState) => {
      const touches = evt.nativeEvent.touches;
      const { moveX, moveY } = gestureState;

      if (touches.length === 2) {
        // Two-finger drag - handle scrolling
        if (lastTouchPosition.current) {
          const deltaY = moveY - lastTouchPosition.current.y;
          sendDragEvent(deltaY);
        }
      } else {
        // Single-finger movement - handle mouse movement
        if (lastTouchPosition.current && !isDraggingRef.current) {
          const deltaX = moveX - lastTouchPosition.current.x;
          const deltaY = moveY - lastTouchPosition.current.y;
          sendRelativeMovement(deltaX, deltaY);
        }
      }

      lastTouchPosition.current = { x: moveX, y: moveY };
    },

    onPanResponderRelease: () => {
      lastTouchPosition.current = null;
      isDraggingRef.current = false;
    },
  });

  return (
    <SafeAreaView className="h-full bg-primary">
      <View
        className="flex flex-1 items-center justify-center bg-primary"
        {...panResponder.panHandlers}
      >
        <Text className="text-6xl font-pbold opacity-30 text-slate-100">
          Touch Pad
        </Text>
      </View>
      <View className="w-full h-[12%] flex flex-row gap-1 px-2 py-1">
        <TouchableOpacity
          onPress={() => handleMouseClick("left")}
          activeOpacity={0.7}
          className="flex-1 bg-[#252634]/80 rounded-lg flex items-center justify-center"
        >
          <Text className="text-3xl text-slate-100 opacity-20 font-pbold">
            Left
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => handleMouseClick("right")}
          activeOpacity={0.7}
          className="flex-1 bg-[#252634]/80 rounded-lg flex items-center justify-center"
        >
          <Text className="text-3xl text-slate-100 opacity-20 font-pbold">
            Right
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default Mouse;
