import AsyncStorage from "@react-native-async-storage/async-storage";
import { NavigationContainer } from "@react-navigation/native";
import { useContext, useEffect } from "react";
import {
  AuthContext,
  AuthProvider,
} from "./src/contexts/AuthenticationContext";
import { asyncUser } from "./src/lib/types";
import MainNavigator from "./src/navigation/MainNavigator";

function AppContent() {
  const authContext = useContext(AuthContext);

  useEffect(() => {
    const initialSetUp = async () => {
      try {
        const storedValue = await AsyncStorage.getItem("user");
        const parsedValue: asyncUser = storedValue
          ? JSON.parse(storedValue)
          : null;

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
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
