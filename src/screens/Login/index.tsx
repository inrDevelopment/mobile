import { FontAwesome, Ionicons, Octicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import React, { useContext, useState } from "react";
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
import { NativeStackNavigationProp } from "react-native-screens/lib/typescript/native-stack/types";
import { Container } from "../../components/Container";
import CustomIconButton from "../../components/CustomIconButton";
import { BASE_API_USER } from "../../constants/api";
import Colors from "../../constants/Colors";
import { AuthContext } from "../../contexts/AuthenticationContext";
import { RootListType } from "../../naviagation/root";
import styles from "./styles";

type loginScreenNavigationProp = NativeStackNavigationProp<
  RootListType,
  "LogIn"
>;

interface loginScreenProps {
  navigation: loginScreenNavigationProp;
}

const LoginScreen = ({ navigation }: loginScreenProps) => {
  const authContext = useContext(AuthContext);
  const [loading, setLoading] = useState<boolean>(false);

  const [user, setUser] = useState<string>("");

  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);

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

      const authenticationResponse = await axios.post(BASE_API_USER, {
        login: user,
        senha: password,
      });

      if (authenticationResponse.data.data) {
        //Salvar o token no Async Storage
        const user = {
          userToken: authenticationResponse.data.data.credential,
        };
        const jsonValue = JSON.stringify(user);
        await AsyncStorage.setItem("user", jsonValue);

        //Fazer o login no contexto
        authContext.login();
        navigation.navigate("Início" as never);
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
