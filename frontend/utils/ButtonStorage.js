import * as SecureStore from "expo-secure-store";

export async function saveButtonData(key, value) {
  // console.log("Save Button Data", value);
  try {
    await SecureStore.setItemAsync(key, JSON.stringify(value));
  } catch (error) {
    console.error("Error saving data:", error);
  }
}

export async function getButtonData(key) {
  try {
    const result = await SecureStore.getItemAsync(key);
    // console.log("Get Button Data", result);
    return result ? JSON.parse(result) : [];
  } catch (error) {
    console.error("Error retrieving data:", error);
    return [];
  }
}
