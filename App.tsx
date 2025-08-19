import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  NavigationContainer,
  useNavigationContainerRef,
} from "@react-navigation/native";
import axios from "axios";
import * as Notifications from "expo-notifications";
import { useEffect } from "react";
import { Alert } from "react-native";
import "react-native-gesture-handler";

import { BASE_API_REGISTER_DEVICE } from "./src/constants/api";
import { AuthProvider, useAuth } from "./src/contexts/AuthenticationContext";
import randomDeviceKey from "./src/lib/randomDeviceKey";
import { getUser } from "./src/lib/storage/userStorage";
import MainNavigator from "./src/navigation/MainNavigator";
import { registerForPushNotificationsAsync } from "./src/notifications";

// Configuração global de notificações
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
  const { login, finishLoading, isLoading } = useAuth();
  const navigationRef = useNavigationContainerRef();

  useEffect(() => {
    const initialSetUp = async () => {
      try {
        let parsedValue = await getUser();

        // 1️⃣ Garante que sempre exista um deviceKey
        if (!parsedValue?.deviceKey) {
          const newDeviceKey = randomDeviceKey(15);
          parsedValue = { ...parsedValue, deviceKey: newDeviceKey };
          await AsyncStorage.setItem("user", JSON.stringify(parsedValue));
        }

        // 2️⃣ Pede permissão e gera ExpoPushToken
        const expoPushTokenResponse = await registerForPushNotificationsAsync();

        if (expoPushTokenResponse?.success && expoPushTokenResponse.data) {
          parsedValue = {
            ...parsedValue,
            expoPushToken: expoPushTokenResponse.data,
          };
          await AsyncStorage.setItem("user", JSON.stringify(parsedValue));

          // 3️⃣ Registra device no backend
          const deviceObj = {
            uuid: parsedValue.deviceKey,
            token: expoPushTokenResponse.data,
          };

          try {
            const registerResponse = await axios.post(
              BASE_API_REGISTER_DEVICE,
              deviceObj
            );
            console.log("registerResponse", registerResponse.data);
          } catch (err: any) {
            console.warn(
              "Erro ao registrar device:",
              err.message,
              err.response?.data
            );
          }
        } else {
          Alert.alert(
            "Permissão negada",
            "Não foi possível obter o token de notificação."
          );
        }

        // 4️⃣ Se o usuário já tinha login salvo, revalida
        if (parsedValue?.userToken) {
          login(parsedValue.userToken);
        }
      } catch (error: any) {
        console.warn("Erro na inicialização:", error.message);
      } finally {
        finishLoading();
      }
    };

    initialSetUp();
  }, []);

  // 🔔 Navegação para Home quando usuário clica em qualquer notificação
  useEffect(() => {
    const handleNotificationResponse = () => {
      if (navigationRef.isReady()) {
        navigationRef.navigate("Home" as never);
      }
    };

    const subscription = Notifications.addNotificationResponseReceivedListener(
      handleNotificationResponse
    );

    // Caso o app seja aberto por uma notificação fechada
    Notifications.getLastNotificationResponseAsync().then((response) => {
      if (response) handleNotificationResponse();
    });

    return () => subscription.remove();
  }, [navigationRef]);

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
