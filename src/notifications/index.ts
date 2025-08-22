import AsyncStorage from "@react-native-async-storage/async-storage";
import NetInfo from "@react-native-community/netinfo";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";
import { getUser } from "../lib/storage/userStorage";
import { asyncUser } from "../lib/types";

// Função auxiliar para tentar pegar o token com retry
async function getExpoPushTokenWithRetry(
  retries = 3,
  delay = 3000 // 3s
): Promise<string | null> {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const tokenData = await Notifications.getExpoPushTokenAsync({
        projectId: "70fe34f9-0ea5-4aae-9c0f-f5857e2683d5",
      });

      if (tokenData?.data) {
        return tokenData.data;
      }
    } catch (error) {
      console.warn(
        `Tentativa ${attempt} falhou ao obter token:`,
        (error as Error).message
      );
    }

    if (attempt < retries) {
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  return null;
}

// Função auxiliar para salvar token
async function saveToken(newToken: string) {
  const parsedValue = await getUser();

  const updatedValue: asyncUser = {
    ...(parsedValue ?? {}),
    expoPushToken: newToken,
  };

  if (!parsedValue || parsedValue.expoPushToken !== newToken) {
    await AsyncStorage.setItem("user", JSON.stringify(updatedValue));
  }
}

export async function registerForPushNotificationsAsync(): Promise<
  { success: boolean; data?: string; error?: string } | undefined
> {
  try {
    if (!Device.isDevice) {
      return {
        success: false,
        error: "Notificações push funcionam apenas em dispositivos físicos",
      };
    }

    const { status } = await Notifications.getPermissionsAsync();
    let finalStatus = status;

    if (status !== "granted") {
      const { status: newStatus } =
        await Notifications.requestPermissionsAsync();
      finalStatus = newStatus;
    }

    if (finalStatus !== "granted") {
      return {
        success: false,
        error: "Permissão para notificações foi negada",
      };
    }

    if (Platform.OS === "android") {
      await Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FF231F7C",
      });
    }

    // 🚀 tenta pegar o token com retry
    let newToken = await getExpoPushTokenWithRetry(3, 3000);

    if (!newToken) {
      // 📡 aguarda reconexão de rede para tentar de novo
      const unsubscribe = NetInfo.addEventListener(async (state: any) => {
        if (state.isConnected) {
          newToken = await getExpoPushTokenWithRetry(3, 3000);
          if (newToken) {
            await saveToken(newToken);
            unsubscribe();
          }
        }
      });

      return {
        success: false,
        error:
          "Não foi possível obter token agora. Tentará novamente ao reconectar.",
      };
    }

    await saveToken(newToken);
    return { success: true, data: newToken };
  } catch (error: any) {
    // 🔥 Agora o erro real é retornado
    return { success: false, error: error?.message ?? "Erro desconhecido" };
  }
}
