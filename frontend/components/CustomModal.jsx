import React from "react";
import { Modal, View, Text, TouchableOpacity } from "react-native";
import InputField from "./InputField";

const CustomModal = ({
  visible,
  onCreate,
  onClose,
  onNameTextChange,
  onKeysTextChange,
  namePlaceholder = "eg. Paste",
  keysPlaceholder = `eg. "ctrl+v"`,
}) => {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-center items-center bg-[#161622cc]">
        <View className="w-[90%] p-6 rounded-2xl bg-[#1f2027] shadow-lg shadow-black">
          <Text className="text-[#f5f5f5] text-3xl text-center font-psemibold mb-4">
            Create Shortcut
          </Text>
          <InputField
            handleTextChange={onNameTextChange}
            placeholder={namePlaceholder}
            className="mb-3"
          />
          <InputField
            handleTextChange={onKeysTextChange}
            placeholder={keysPlaceholder}
            className="mb-4"
          />
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={onCreate}
            className="w-full h-12 bg-[#3a3f4b] rounded-lg items-center justify-center mb-3"
          >
            <Text className="text-lg text-[#e1e1e1] font-psemibold">Create</Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={onClose}
            className="w-full h-12 bg-[#292d36] rounded-lg items-center justify-center"
          >
            <Text className="text-lg text-[#e1e1e1] font-psemibold">Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default CustomModal;
