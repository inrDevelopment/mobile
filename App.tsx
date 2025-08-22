import AsyncStorage from "@react-native-async-storage/async-storage";
import NetInfo from "@react-native-community/netinfo";
import {
  NavigationContainer,
  useNavigationContainerRef,
} from "@react-navigation/native";
import axios from "axios";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { useEffect } from "react";
import { Alert, Platform } from "react-native";
import "react-native-gesture-handler";

import Constants from "expo-constants";
import { BASE_API_REGISTER_DEVICE } from "./src/constants/api";
import { AuthProvider, useAuth } from "./src/contexts/AuthenticationContext";
import randomDeviceKey from "./src/lib/randomDeviceKey";
import { getUser } from "./src/lib/storage/userStorage";
import { asyncUser } from "./src/lib/types";
import MainNavigator from "./src/navigation/MainNavigator";

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
    const notificationPermissions = async () => {
      if (!Device.isDevice) {
        Alert.alert(
          "Erro",
          "Notificações push só funcionam em dispositivo físico"
        );
        return;
      }

      const { status } = await Notifications.getPermissionsAsync();
      let finalStatus = status;

      if (status !== "granted") {
        const { status: newStatus } =
          await Notifications.requestPermissionsAsync();
        finalStatus = newStatus;
      }

      if (finalStatus !== "granted") {
        Alert.alert(
          "Permissão negada",
          "Você não concedeu permissão para notificações."
        );
      }

      if (Platform.OS === "android") {
        await Notifications.setNotificationChannelAsync("default", {
          name: "default",
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: "#FF231F7C",
        });
      }
    };

    notificationPermissions();
  }, []);

  async function getExpoPushTokenWithDebug(): Promise<string | null> {
    try {
      const projectId =
        Constants.expoConfig?.extra?.eas?.projectId ??
        "70fe34f9-0ea5-4aae-9c0f-f5857e2683d5";

      const tokenData = await Notifications.getExpoPushTokenAsync({
        projectId,
      });

      if (!tokenData?.data) {
        Alert.alert(
          "Token vazio",
          "Nenhum token foi retornado do Expo (possível permissão negada ou falha de rede)."
        );
        return null;
      }

      Alert.alert("Expo Token obtido", tokenData.data);
      return tokenData.data;
    } catch (error: any) {
      Alert.alert(
        "Erro ao obter token",
        `Mensagem: ${error.message}\nDetalhes: ${JSON.stringify(error)}`
      );
      return null;
    }
  }

  async function saveToken(newToken: string) {
    const parsedValue = await getUser();
    const updatedValue: asyncUser = {
      ...(parsedValue ?? {}),
      expoPushToken: newToken,
    };
    await AsyncStorage.setItem("user", JSON.stringify(updatedValue));
  }

  useEffect(() => {
    const getExpoToken = async () => {
      try {
        let newToken = await getExpoPushTokenWithDebug();

        if (!newToken) {
          // Aguarda reconexão de rede para tentar de novo
          const unsubscribe = NetInfo.addEventListener(async (state: any) => {
            if (state.isConnected) {
              newToken = await getExpoPushTokenWithDebug();
              if (newToken) {
                await saveToken(newToken);
                unsubscribe();
              }
            }
          });
        }
        if (newToken) await saveToken(newToken);
      } catch (error: any) {
        Alert.alert("Erro inesperado", error.message);
      }
    };

    getExpoToken();
  }, []);

  useEffect(() => {
    const initialSetUp = async () => {
      try {
        let parsedValue = await getUser();

        if (!parsedValue?.deviceKey) {
          const newDeviceKey = randomDeviceKey(15);
          parsedValue = { ...parsedValue, deviceKey: newDeviceKey };
          await AsyncStorage.setItem("user", JSON.stringify(parsedValue));
        }

        // Registra device no backend
        const deviceObj = {
          uuid: parsedValue.deviceKey,
          token: parsedValue.expoPushToken,
        };

        if (parsedValue.deviceKey && parsedValue.expoPushToken) {
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
        }

        // Se o usuário já tinha login salvo, revalida
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

  // Navegação para Home quando usuário clica em qualquer notificação
  useEffect(() => {
    const handleNotificationResponse = () => {
      if (navigationRef.isReady()) {
        navigationRef.navigate("Home" as never);
      }
    };

    const subscription = Notifications.addNotificationResponseReceivedListener(
      handleNotificationResponse
    );

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
