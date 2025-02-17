import Entypo from "@expo/vector-icons/Entypo";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { useNavigation } from "@react-navigation/native";
import { useContext } from "react";
import { Image, StyleSheet, Text, TouchableOpacity } from "react-native";
import Colors from "../constants/Colors";
import { constant } from "../constants/constants";
import { AuthContext } from "../contexts/AuthenticationContext";
import BulletimItem from "../screens/BulletimItem";
import BulletinsScreen from "../screens/Bulletins";
import ClassificatorItem from "../screens/ClassificatorItem";
import ClassificatorsScreen from "../screens/Classificators";
import FaqScreen from "../screens/FAQ";
import FavoritesScreen from "../screens/Favorites";
import HomeScreen from "../screens/Home";
import LoginScreen from "../screens/Login";

const Drawer = createDrawerNavigator();

const MainNavigator = () => {
  const authContext = useContext(AuthContext);
  const navigation = useNavigation();

  return (
    <Drawer.Navigator
      backBehavior="history"
      screenOptions={{
        drawerType: "slide",
        overlayColor: "transparent",
        drawerStyle: styles.drawerStyle,
        drawerActiveBackgroundColor: Colors.primary.dark,
        drawerItemStyle: styles.drawerItemStyles,
        drawerActiveTintColor: Colors.primary.light,
        drawerInactiveTintColor: Colors.primary.dark,
        drawerLabelStyle: styles.drawerLabelStyles,
        headerStyle: {
          backgroundColor: Colors.primary.background,
          elevation: 0,
          shadowOpacity: 0,
          borderBottomWidth: 0,
        },
        headerRight: () => {
          if (authContext.isLoggedIn) {
            return (
              <Image
                source={require("../../assets/icon.png")}
                style={{ width: 40, height: 40, marginRight: 10 }}
              />
            );
          } else {
            return (
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate("LogIn" as never);
                }}
              >
                <Text style={styles.loginButton}>Entrar</Text>
              </TouchableOpacity>
            );
          }
        },
      }}
    >
      <Drawer.Screen
        name="Home"
        component={HomeScreen}
        options={{
          headerTitle: "Início",
          drawerLabel: "Início",
          drawerIcon: ({ color, size }) => (
            <FontAwesome5 name="home" size={20} color={Colors.primary.dark} />
          ),
          drawerActiveBackgroundColor: Colors.primary.background,
          drawerActiveTintColor: Colors.primary.dark,
          drawerLabelStyle: {
            fontSize: 20,
          },
        }}
      />
      <Drawer.Screen
        name="LogIn"
        component={LoginScreen}
        options={{
          headerTitle: "Entrar",
          drawerLabel: "Entrar",
          drawerIcon: ({ color, size }) => (
            <Entypo name="login" size={24} color={Colors.primary.dark} />
          ),
          drawerActiveBackgroundColor: Colors.primary.background,
          drawerActiveTintColor: Colors.primary.dark,
          drawerLabelStyle: {
            fontSize: 20,
          },
        }}
      />
      <Drawer.Screen
        name="Classificadores"
        component={ClassificatorsScreen}
        options={{
          headerTitle: "Classificadores",
          drawerLabel: "Classificadores",
          drawerIcon: ({ color, size }) => (
            <Ionicons name="newspaper" size={24} color={Colors.primary.dark} />
          ),
          drawerActiveBackgroundColor: Colors.primary.background,
          drawerActiveTintColor: Colors.primary.dark,
          drawerLabelStyle: {
            fontSize: 20,
          },
        }}
      />
      <Drawer.Screen
        name="Boletins"
        component={BulletinsScreen}
        options={{
          headerTitle: "Boletins",
          drawerLabel: "Boletins",
          drawerIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="bulletin-board"
              size={24}
              color={Colors.primary.dark}
            />
          ),
          drawerActiveBackgroundColor: Colors.primary.background,
          drawerActiveTintColor: Colors.primary.dark,
          drawerLabelStyle: {
            fontSize: 20,
          },
        }}
      />
      <Drawer.Screen
        name="Favoritos"
        component={FavoritesScreen}
        options={{
          headerTitle: "Favoritos",
          drawerLabel: "Favoritos",
          drawerIcon: ({ color, size }) => (
            <MaterialIcons
              name="favorite"
              size={24}
              color={Colors.primary.dark}
            />
          ),
          drawerActiveBackgroundColor: Colors.primary.background,
          drawerActiveTintColor: Colors.primary.dark,
          drawerLabelStyle: {
            fontSize: 20,
          },
        }}
      />
      <Drawer.Screen
        name="Ajuda"
        component={FaqScreen}
        options={{
          headerTitle: "Ajuda",
          drawerLabel: "Ajuda",
          drawerIcon: ({ color, size }) => (
            <FontAwesome5
              name="question"
              size={24}
              color={Colors.primary.dark}
            />
          ),
          drawerActiveBackgroundColor: Colors.primary.background,
          drawerActiveTintColor: Colors.primary.dark,
          drawerLabelStyle: {
            fontSize: 20,
          },
        }}
      />
      <Drawer.Screen
        name="BulletimItem"
        component={BulletimItem}
        options={{
          headerTitle: "Boletim INR",
          drawerLabel: "Boletim INR",
          drawerItemStyle: { display: "none" },
          drawerIcon: ({ color, size }) => (
            <FontAwesome5
              name="question"
              size={24}
              color={Colors.primary.dark}
            />
          ),
          drawerActiveBackgroundColor: Colors.primary.background,
          drawerActiveTintColor: Colors.primary.dark,
          drawerLabelStyle: {
            fontSize: 20,
          },
        }}
      />
      <Drawer.Screen
        name="ClassificatorItem"
        component={ClassificatorItem}
        options={{
          headerTitle: "Classificadores INR",
          drawerLabel: "Classificadores INR",
          drawerItemStyle: { display: "none" },
          drawerIcon: ({ color, size }) => (
            <FontAwesome5
              name="question"
              size={24}
              color={Colors.primary.dark}
            />
          ),
          drawerActiveBackgroundColor: Colors.primary.background,
          drawerActiveTintColor: Colors.primary.dark,
          drawerLabelStyle: {
            fontSize: 20,
          },
        }}
      />
    </Drawer.Navigator>
  );
};

export default MainNavigator;

const styles = StyleSheet.create({
  drawerStyle: {
    width: 300,
    backgroundColor: Colors.primary.background,
    borderRightWidth: 1,
    borderRightColor: "#ccc",
  },
  drawerItemStyles: {
    borderRadius: constant.borderRadius,
  },
  drawerLabelStyles: {
    fontSize: constant.drawer.textFontSize,
  },
  loginButton: {
    color: Colors.primary.dark,
    fontWeight: "500",
    marginHorizontal: 20,
    fontSize: 17,
  },
});
