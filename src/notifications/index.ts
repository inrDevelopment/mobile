import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";
import { getUser } from "../lib/storage/userStorage";
import { asyncUser } from "../lib/types";

export async function registerForPushNotificationsAsync(): Promise<
  { success: boolean; data?: string } | undefined
> {
  try {
    if (!Device.isDevice) {
      alert("Notificações push funcionam apenas em dispositivos físicos");
      return { success: false };
    }

    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== "granted") {
      alert("Permissão para notificações foi negada");
      return { success: false };
    }

    if (Platform.OS === "android") {
      await Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FF231F7C",
      });
    }

    //Pegar o Expo Push Token => Mostrar a lógica pro Douglas
    let tokenData = await Notifications.getExpoPushTokenAsync();

    const newToken = tokenData.data;

    //Pegar o token da Expo no AsyncStorage
    const parsedValue = await getUser();

    const updatedValue: asyncUser = {
      ...(parsedValue ?? {}),
      expoPushToken: newToken,
    };

    if (!parsedValue || parsedValue.expoPushToken !== newToken) {
      await AsyncStorage.setItem("user", JSON.stringify(updatedValue));
    }

    return { success: true };
  } catch (error: any) {
    console.warn(error.message);
  }
}
