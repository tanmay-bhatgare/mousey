// TODO: Had to impelment websocket

import {
  View,
  FlatList,
  Image,
  StatusBar,
  TouchableOpacity,
  Alert,
} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

import { icons } from "../constants";
import ShortcutButton from "../components/ShortcutButton";
import CustomModal from "../components/CustomModal";
import { getButtonData, saveButtonData } from "../utils/ButtonStorage";

const BUTTONS_KEY = "user_buttons";
const TOKEN = process.env.EXPO_PUBLIC_API_TOKEN;
const IP = process.env.EXPO_PUBLIC_IP;

const Icon = ({ icon, color }) => {
  return (
    <View>
      <Image
        source={icon}
        resizeMode="contain"
        className="w-8 h-8"
        tintColor={color}
      />
    </View>
  );
};

const Index = () => {
  const [buttonData, setButtonData] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [createButtonData, setCreateButtonData] = useState({
    name: "",
    keys: "",
  });
  const [alerting, setAlerting] = useState(false);
  const [websocket, setWebsocket] = useState(null);

  const handleDeleteButton = (index) => {
    Alert.alert(
      "Delete Button",
      "Are you sure you want to delete this button?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            setButtonData((prevData) => prevData.filter((_, i) => i !== index));
          },
        },
      ]
    );
  };

  const connectWebSocket = () => {
    const ws = new WebSocket(
      `ws://${IP}/ws/keyboard?token=${TOKEN}`
    );

    ws.onopen = () => {
      console.log(" Keyboard: Connected to the server");
    };

    ws.onmessage = (e) => {
      console.log(e.data);
    };

    ws.onerror = (e) => {
      setAlerting(true);
      if (!alerting) {
        Alert.alert("Keyboard: Connection Forbidden", `${e.message}`, [
          {
            text: "Reconnect",
            onPress: () => {
              connectWebSocket();
              setAlerting(false);
            },
          },
          {
            text: "Abort",
            onPress: () => setAlerting(false),
          },
        ]);
      }
    };

    ws.onclose = () => {
      setAlerting(true);
      setWebsocket(null);
      console.log("Keyboard: Disconnected from the server");
      if (!alerting) {
        Alert.alert(
          "Server Disconnected",
          "Unable to establish connection with server.",
          [
            {
              text: "Reconnect",
              onPress: () => {
                connectWebSocket();
                setAlerting(false);
              },
            },
            {
              text: "Ok",
              onPress: () => setAlerting(false),
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
      if (websocket) {
        websocket.close();
      }
    };
  }, []);

  useEffect(() => {
    const loadButtons = async () => {
      const storedButtons = await getButtonData(BUTTONS_KEY);
      if (storedButtons && Array.isArray(storedButtons)) {
        setButtonData(storedButtons);
      }
    };
    loadButtons();
  }, []);

  useEffect(() => {
    saveButtonData(BUTTONS_KEY, buttonData);
  }, [buttonData]);

  const handlePress = (item) => {
    if (!websocket) return;
    const message = item.keys;
    try {
      websocket.send(message);
    } catch (error) {
      Alert.alert(
        "Initilising Error",
        "Websocket hasn't initialised yet. Wait for few moments."
      );
    }
  };

  const renderItem = ({ item, index }) => (
    <ShortcutButton
      item={item}
      onPress={() => handlePress(item)}
      onDelete={() => handleDeleteButton(index)}
      onPressInFunc={() => {
        handlePress(item);
      }}
    />
  );

  return (
    <SafeAreaView className="h-full bg-primary">
      <FlatList
        data={buttonData}
        keyExtractor={(item, index) => item.name + index}
        renderItem={renderItem}
        numColumns={2}
        contentContainerStyle={{ padding: 16 }}
        columnWrapperStyle={{ justifyContent: "space-between" }}
      />

      {/* //* FloatingAction Button */}
      <TouchableOpacity
        className="absolute right-4 bottom-4 w-16 h-16 bg-[#4a78e4] rounded-full items-center justify-center"
        onPress={() => setModalVisible(true)}
        activeOpacity={0.8}
      >
        <Icon icon={icons.add} color="white" />
      </TouchableOpacity>

      <CustomModal
        visible={modalVisible}
        onCreate={() => {
          if (createButtonData.name.trim() && createButtonData.keys.trim()) {
            setButtonData((prevData) => [...prevData, createButtonData]);
            setCreateButtonData({ name: "", keys: "" });
            setModalVisible(false);
          } else {
            Alert.alert(
              "Invalid Input",
              "Both name and keys fields must be filled.",
              [{ text: "OK" }]
            );
          }
        }}
        onClose={() => {
          setModalVisible(false);
        }}
        onNameTextChange={(e) =>
          setCreateButtonData((prevData) => ({ ...prevData, name: e }))
        }
        onKeysTextChange={(e) =>
          setCreateButtonData((prevData) => ({ ...prevData, keys: e }))
        }
      />
      <StatusBar backgroundColor="#161622" barStyle="light-content" />
    </SafeAreaView>
  );
};

export default Index;
