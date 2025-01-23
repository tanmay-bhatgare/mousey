import { Text, TouchableOpacity, View } from "react-native";
import React, { useState } from "react";
import { Ionicons } from "@expo/vector-icons";

const ShortcutButton = ({ onPress, onDelete, item, onPressInFunc }) => {
  const [intervalId, setIntervalId] = useState(null);

  const handlePressIn = () => {
    // Start continuous execution with setInterval
    const id = setInterval(onPressInFunc, 400); // Adjust 100ms to control frequency of execution
    setIntervalId(id);
  };

  const handlePressOut = () => {
    // Stop the continuous execution when the press ends
    if (intervalId) {
      clearInterval(intervalId);
      setIntervalId(null);
    }
  };

  return (
    <View className="mb-4 bg-[#252634] p-3 rounded-xl h-[150px] w-[48%] relative">
      <TouchableOpacity
        onPress={onPress}
        onPressIn={handlePressIn} // Triggered when press starts
        onPressOut={handlePressOut} // Triggered when press ends
        className="w-full h-full flex items-center justify-center"
      >
        <Text className="w-full text-center text-slate-50 text-2xl font-psemibold">
          {item.name}
        </Text>
      </TouchableOpacity>
      {/* Trash Icon Positioned in Top-Right */}
      <TouchableOpacity className="absolute top-2 right-2" onPress={onDelete}>
        <Ionicons name="trash-bin" color="#f04d6d" size={24} />
      </TouchableOpacity>
    </View>
  );
};

export default ShortcutButton;
