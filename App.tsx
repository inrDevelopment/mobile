import AsyncStorage from "@react-native-async-storage/async-storage";

import {
  NavigationContainer,
  useNavigationContainerRef,
} from "@react-navigation/native";
import axios from "axios";
import * as Notifications from "expo-notifications";
import { useContext, useEffect, useState } from "react";
import "react-native-gesture-handler";
import { BASE_API_REGISTER_DEVICE } from "./src/constants/api";
import {
  AuthContext,
  AuthProvider,
} from "./src/contexts/AuthenticationContext";
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
  const { login, finishLoading, isLoading } = useContext(AuthContext);
  const authContext = useContext(AuthContext);
  const navigationRef = useNavigationContainerRef();

  useEffect(() => {
    const initialSetUp = async () => {
      try {
        const parsedValue = await getUser();

        if (parsedValue?.userToken) {
          authContext.login();
        }

        //Verificar se já existe uma deviceKey salva. Se não, criar nova e salvar no AsyncStorage
        if (parsedValue && !parsedValue.deviceKey) {
          const newDeviceKey = randomDeviceKey(15);
          if (newDeviceKey !== "") {
            parsedValue.deviceKey = newDeviceKey;
            const jsonValue = JSON.stringify(parsedValue);
            await AsyncStorage.setItem("user", jsonValue);
          }
        }

        //Fazer registro do PushToken na Expo
        const expoPushTokenResponse = await registerForPushNotificationsAsync();

        //Registrar o deviceToken e o ExpoPushToken na API
        if (
          parsedValue &&
          parsedValue.deviceKey &&
          expoPushTokenResponse?.data
        ) {
          const deviceObj = {
            uuid: parsedValue.deviceKey,
            token: expoPushTokenResponse?.data,
          };

          await axios.post(BASE_API_REGISTER_DEVICE, deviceObj);
        }
      } catch (error: any) {
        console.warn(error.message);
      } finally {
        finishLoading();
      }
    };

    initialSetUp();
  }, []);

  useEffect(() => {
    const subscription = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        if (navigationRef.isReady()) {
          navigationRef.navigate("Home" as never);
        }
      }
    );

    return () => subscription.remove();
  }, []);

  if (isLoading) return null;

  return (
    <NavigationContainer>
      <MainNavigator />
    </NavigationContainer>
  );
}

export default function App() {
  const [notification, setNotification] =
    useState<Notifications.Notification | null>(null);
  const [showSplash, setShowSplash] = useState(true);

  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
