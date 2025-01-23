import { View, TextInput, TouchableOpacity } from "react-native";
import React, { useState } from "react";

const InputField = ({
  value,
  placeholder,
  handleTextChange,
  otherStyles,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View className={`space-y-2 mb-1 ${otherStyles}`}>
      <View
        className={`flex-row border w-full h-12 px-4 rounded-2xl items-center 
            ${isFocused ? "border-gray-700" : "border-gray-500"}`}
      >
        <TextInput
          className="flex-1 text-white font-psemibold text-base"
          value={value}
          placeholder={placeholder}
          placeholderTextColor="#7b7b8b"
          onChangeText={handleTextChange}
          keyboardType="default"
          cursorColor="white"
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
      </View>
    </View>
  );
};
export default InputField;
