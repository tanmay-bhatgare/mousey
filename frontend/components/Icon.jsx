import { Image, Text, View } from "react-native";

const Icon = ({ icon, color, name, focused, iconStyle }) => {
  return (
    <View className="items-center justify-center gap-1 p-safe mt-2">
      <Image
        source={icon}
        resizeMode="contain"
        className={`w-6 h-6 ${iconStyle}`}
        tintColor={color}
      />
      <Text
        className={`${
          focused ? "font-pbold" : "font-pregular"
        } text-xs text-center w-20 h-5`}
        style={{ color: color }}
        numberOfLines={1}
        ellipsizeMode="tail"
      >
        {name}
      </Text>
    </View>
  );
};

export default Icon;
