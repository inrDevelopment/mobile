import AsyncStorage from "@react-native-async-storage/async-storage";
import { NavigationContainer } from "@react-navigation/native";
import axios from "axios";
import * as Notifications from "expo-notifications";
import { useContext, useEffect, useState } from "react";
import "react-native-gesture-handler";
import { BASE_API } from "./src/constants/api";
import {
  AuthContext,
  AuthProvider,
} from "./src/contexts/AuthenticationContext";
import randomDeviceKey from "./src/lib/randomDeviceKey";
import { asyncUser } from "./src/lib/types";
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
  const authContext = useContext(AuthContext);

  useEffect(() => {
    const initialSetUp = async () => {
      try {
        //Pegar o objeto user no AsyncStorage pra ver se o usuário já está logado.
        const storedValue = await AsyncStorage.getItem("user");
        const parsedValue: asyncUser = storedValue
          ? JSON.parse(storedValue)
          : null;

        //Verificar se já existe uma deviceKey salva. Se não, criar nova e salvar no AsyncStorage
        if (parsedValue && !parsedValue.deviceKey) {
          const newDeviceKey = randomDeviceKey(15);
          if (newDeviceKey !== "") {
            parsedValue.deviceKey = newDeviceKey;
            const jsonValue = JSON.stringify(parsedValue);
            await AsyncStorage.setItem("user", jsonValue);
          }
          console.log(parsedValue);
        }

        //Fazer registro do PushToken na Expo
        await registerForPushNotificationsAsync();

        //Registrar o deviceToken e o ExpoPushToken na API
        if (parsedValue && parsedValue.deviceKey && parsedValue.expoPushToken) {
          const deviceObj = {
            uuid: parsedValue.deviceKey,
            token: parsedValue.expoPushToken,
          };

          await axios.post(`${BASE_API}/leitor/registrar`, deviceObj);
        }

        //Logar o usuário no sistema
        if (parsedValue?.userToken) {
          console.log("Token encontrado, logando...");
          authContext.login();
        }
      } catch (error: any) {
        console.warn(error.message);
      }
    };

    initialSetUp();
  }, []);

  return (
    <NavigationContainer>
      <MainNavigator />
    </NavigationContainer>
  );
}

export default function App() {
  const [notification, setNotification] =
    useState<Notifications.Notification | null>(null);

  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
