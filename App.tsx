import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  NavigationContainer,
  useNavigationContainerRef,
} from "@react-navigation/native";
import axios from "axios";
import * as Notifications from "expo-notifications";
import { useEffect } from "react";
import "react-native-gesture-handler";

import { Linking, Platform } from "react-native";
import { BASE_API_REGISTER_DEVICE } from "./src/constants/api";
import { AuthProvider, useAuth } from "./src/contexts/AuthenticationContext";
import randomDeviceKey from "./src/lib/randomDeviceKey";
import { getUser } from "./src/lib/storage/userStorage";
import MainNavigator from "./src/navigation/MainNavigator";
import { registerForPushNotificationsAsync } from "./src/notifications";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

function AppContent() {
  const { login, finishLoading, isLoading, token } = useAuth();
  const navigationRef = useNavigationContainerRef();

  useEffect(() => {
    const initialSetUp = async () => {
      try {
        const parsedValue = await getUser();

        if (parsedValue?.userToken) {
          login(parsedValue.userToken);
        }

        // Verifica e cria deviceKey se não existir
        if (parsedValue && !parsedValue.deviceKey) {
          const newDeviceKey = randomDeviceKey(15);
          parsedValue.deviceKey = newDeviceKey;
          await AsyncStorage.setItem("user", JSON.stringify(parsedValue));
        }

        // Registra push token
        const expoPushTokenResponse = await registerForPushNotificationsAsync();

        if (parsedValue?.deviceKey && expoPushTokenResponse?.data) {
          const deviceObj = {
            uuid: parsedValue.deviceKey,
            token: expoPushTokenResponse.data,
          };

          await axios.post(BASE_API_REGISTER_DEVICE, deviceObj);
        }
      } catch (error: any) {
        console.warn("Erro na inicialização:", error.message);
      } finally {
        finishLoading();
      }
    };

    initialSetUp();
  }, []);

  useEffect(() => {
    const handleNotificationResponse = (
      response: Notifications.NotificationResponse
    ) => {
      if (!navigationRef.isReady()) return;

      const type = response.notification.request.content.data?.type;

      if (type === "novobe") {
        navigationRef.navigate("Home" as never);
      } else if (type === "atualizacao") {
        const playStoreUrl =
          "https://play.google.com/store/apps/details?id=com.inrdev.leitorinr";
        const appStoreUrl = "https://apps.apple.com/app/6745224256";

        const url = Platform.OS === "ios" ? appStoreUrl : playStoreUrl;

        Linking.openURL(url).catch((err) =>
          console.warn("Erro ao abrir loja de apps:", err)
        );
      }
    };

    const subscription = Notifications.addNotificationResponseReceivedListener(
      handleNotificationResponse
    );

    Notifications.getLastNotificationResponseAsync().then((response) => {
      if (response) {
        handleNotificationResponse(response);
      }
    });

    return () => subscription.remove();
  }, []);

  if (isLoading) return null;

  return (
    <NavigationContainer ref={navigationRef}>
      <MainNavigator />
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
