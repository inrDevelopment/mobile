import { FontAwesome, Ionicons, Octicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { DrawerScreenProps } from "@react-navigation/drawer";
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import * as Animatable from "react-native-animatable";
import { Container } from "../../components/Container";
import CustomIconButton from "../../components/CustomIconButton";
import { BASE_API_USER } from "../../constants/api";
import Colors from "../../constants/Colors";
import { AuthContext } from "../../contexts/AuthenticationContext";
import { asyncUser } from "../../lib/types";
import { RootListType } from "../../navigation/root";
import styles from "./styles";

type Props = DrawerScreenProps<RootListType, "LogIn">;

const LoginScreen = ({ navigation }: Props) => {
  const authContext = useContext(AuthContext);
  const [loading, setLoading] = useState<boolean>(false);

  const [user, setUser] = useState<string>("");

  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => {
        return (
          <Image
            source={require("../../../assets/icon.png")}
            style={{ width: 40, height: 40, marginRight: 10 }}
          />
        );
      },
    });

    if (authContext.isLoggedIn) {
      console.log(authContext.isLoggedIn);
      navigation.navigate("Home");
    }
  }, [authContext.isLoggedIn]);

  const authenticateUser = async () => {
    try {
      setLoading(true);
      if (user === "") {
        Alert.alert("Erro!", "Por favor, preencha o campo Usuário.");
        setLoading(false);
        return;
      }
      if (password === "") {
        Alert.alert("Erro!", "Por favor, preencha o campo Senha.");
        setLoading(false);
        return;
      }

      //Pegar o deviceKey no AsyncStorage
      const storedValues = await AsyncStorage.getItem("user");
      const parsedValue: asyncUser = storedValues
        ? JSON.parse(storedValues)
        : null;
      console.log("parsedValue", parsedValue);

      const updatedValue: asyncUser = {
        ...(parsedValue ?? {}),
      };

      const authenticationResponse = await axios.post(BASE_API_USER, {
        uuid: parsedValue.deviceKey,
        login: user,
        senha: password,
      });
      console.log("authenticationResponse", authenticationResponse.data);

      if (authenticationResponse.data.success) {
        //Salvar o token no Async Storage
        updatedValue.userToken = authenticationResponse.data.credential;
        const jsonValue = JSON.stringify(updatedValue);
        await AsyncStorage.setItem("user", jsonValue);

        //Fazer o login no contexto
        authContext.login();
        navigation.navigate("Home");
      } else {
        Alert.alert(
          "Erro!",
          "Usuário ou senha incorretos. Por favor, tente novamente."
        );
        setLoading(false);
        return;
      }

      setLoading(false);
    } catch (error: any) {
      setLoading(false);
      console.warn(error.message);
    }
  };

  return (
    <Container>
      {loading ? (
        <View style={styles.gifContainer}>
          <Image
            source={require("../../../assets/images/Loading.gif")}
            style={styles.gif}
          />
        </View>
      ) : (
        <KeyboardAvoidingView>
          <Animatable.View
            animation="fadeInRight"
            style={styles.titleView}
            duration={3000}
          >
            <Image source={require("../../../assets/images/Logo.jpg")} />
          </Animatable.View>
          <Animatable.View
            animation="fadeInLeft"
            duration={3000}
            style={[
              styles.inputView,
              { borderBottomColor: Colors.primary.dark },
            ]}
          >
            <Octicons
              name="number"
              size={24}
              color={Colors.primary.dark}
              style={[styles.icon]}
            />
            <TextInput
              placeholder="Usuário"
              placeholderTextColor={Colors.primary.light}
              style={[styles.input, { color: Colors.primary.light }]}
              keyboardType="default"
              value={user}
              onChangeText={(text) => {
                setUser(text);
              }}
            />
          </Animatable.View>
          <Animatable.View
            animation="fadeInRight"
            duration={3000}
            style={[
              styles.inputView,
              { borderBottomColor: Colors.primary.dark },
            ]}
          >
            <FontAwesome
              name="key"
              size={24}
              color={Colors.primary.dark}
              style={[styles.icon]}
            />
            <TextInput
              editable={!loading}
              placeholder="Senha"
              placeholderTextColor={Colors.primary.light}
              style={[styles.input, { color: Colors.primary.light }]}
              underlineColorAndroid="transparent"
              secureTextEntry={showPassword ? false : true}
              autoCorrect={false}
              textContentType={"password"}
              multiline={false}
              value={password}
              onChangeText={(text) => setPassword(text)}
            />
            <TouchableOpacity
              onPress={() => setShowPassword(!showPassword)}
              disabled={loading}
            >
              <Ionicons
                name={showPassword ? "eye" : "eye-off"}
                size={30}
                color={Colors.primary.dark}
              />
            </TouchableOpacity>
          </Animatable.View>
          <Animatable.View
            animation="fadeInLeft"
            style={styles.buttonView}
            duration={3000}
          >
            <CustomIconButton
              title="Entrar"
              icon={
                <Ionicons name="send" size={30} color={Colors.primary.light} />
              }
              onPress={async () => {
                authenticateUser();
              }}
            />
          </Animatable.View>
          <Animatable.View
            animation="fadeInRight"
            style={styles.forgotView}
            duration={3000}
          >
            <Text style={styles.forgotText}>Esqueceu a senha? </Text>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate("RetrievePassword");
              }}
            >
              <Text
                style={[
                  styles.forgotText,
                  { color: Colors.primary.light, fontWeight: "bold" },
                ]}
              >
                Clique Aqui
              </Text>
            </TouchableOpacity>
          </Animatable.View>
        </KeyboardAvoidingView>
      )}
    </Container>
  );
};

export default LoginScreen;
