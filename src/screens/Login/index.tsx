import { FontAwesome, Ionicons, Octicons } from "@expo/vector-icons";
import { DrawerScreenProps } from "@react-navigation/drawer";
import axios from "axios";
import { Image as ExpoImage } from "expo-image";
import React, { useEffect, useState } from "react";
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
import { useAuth } from "../../contexts/AuthenticationContext";
import { getUser, updateUser } from "../../lib/storage/userStorage";
import { RootListType } from "../../navigation/root";
import styles from "./styles";

type Props = DrawerScreenProps<RootListType, "LogIn">;

const LoginScreen = ({ navigation }: Props) => {
  const authContext = useAuth();
  const [loading, setLoading] = useState<boolean>(false);

  const [user, setUser] = useState<string>("");

  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);

  useEffect(() => {
    if (authContext.isLoggedIn) {
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
      const parsedValue = await getUser();

      const authenticationResponse = await axios.post(
        BASE_API_USER,
        {
          uuid: parsedValue.deviceKey,
          login: user,
          senha: password,
        },
        { timeout: 20000 }
      );

      if (authenticationResponse.data.success) {
        await updateUser({
          userToken: authenticationResponse.data.data.credential,
        });

        //Fazer o login no contexto
        authContext.login(authenticationResponse.data.data.credential);
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

      if (error.code === "ECONNABORTED") {
        Alert.alert(
          "Erro de conexão",
          "Ocorreu um erro ao carregar os dados. Por favor, tente novamente."
        );
      } else {
        Alert.alert(
          "Erro",
          "Ocorreu um erro ao carregar os dados. Por favor, tente novamente."
        );
      }

      console.warn("Erro no initialSetUp:", error.message);
      return;
    }
  };

  return (
    <Container>
      {loading ? (
        <View style={styles.gifContainer}>
          <ExpoImage
            source={require("../../../assets/loading.gif")}
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
