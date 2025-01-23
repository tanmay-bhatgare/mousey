import { StatusBar } from "expo-status-bar";
import { Tabs } from "expo-router";
import { SplashScreen } from "expo-router";
import { useFonts } from "expo-font";
import { icons } from "../constants";

import "../global.css";

import Icon from "../components/Icon";
import { useEffect } from "react";
const TabIcon = Icon;

const TabLayout = () => {
  const [fontsLoaded, error] = useFonts({
    "Poppins-Black": require("../assets/fonts/Poppins-Black.ttf"),
    "Poppins-Bold": require("../assets/fonts/Poppins-Bold.ttf"),
    "Poppins-ExtraBold": require("../assets/fonts/Poppins-ExtraBold.ttf"),
    "Poppins-ExtraLight": require("../assets/fonts/Poppins-ExtraLight.ttf"),
    "Poppins-Light": require("../assets/fonts/Poppins-Light.ttf"),
    "Poppins-Medium": require("../assets/fonts/Poppins-Medium.ttf"),
    "Poppins-Regular": require("../assets/fonts/Poppins-Regular.ttf"),
    "Poppins-SemiBold": require("../assets/fonts/Poppins-SemiBold.ttf"),
    "Poppins-Thin": require("../assets/fonts/Poppins-Thin.ttf"),
  });

  useEffect(() => {
    if (error) throw error;

    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, error]);

  if (!fontsLoaded && !error) return null;
  return (
    <>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: "#0080ff",
          tabBarInactiveTintColor: "#CDCDE0",
          tabBarShowLabel: false,
          tabBarStyle: {
            backgroundColor: "#161622",
            // borderTopColor: "red",
            height: "10%",
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Index",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icon={icons.keyboard}
                color={color}
                name="Keyboard"
                focused={focused}
                iconStyle="w-8 h-8"
              />
            ),
          }}
        />
        <Tabs.Screen
          name="mouse"
          options={{
            title: "Mouse",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icon={icons.mouse}
                color={color}
                name="Mouse"
                focused={focused}
              />
            ),
          }}
        />
      </Tabs>

      <StatusBar backgroundColor="#161622" style="light" />
    </>
  );
};

export default TabLayout;
