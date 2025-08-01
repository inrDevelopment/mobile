import { DrawerNavigationProp } from "@react-navigation/drawer";
import { useIsFocused } from "@react-navigation/native";
import axios from "axios";
import { Image } from "expo-image";
import { useEffect, useState } from "react";
import { Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { Container } from "../../components/Container";
import {
  BASE_API_BULLETINS_NOT_LOGGED,
  BASE_API_GET_FAVORITES,
} from "../../constants/api";
import { useAuth } from "../../contexts/AuthenticationContext";
import { getUser } from "../../lib/storage/userStorage";
import { RootListType } from "../../navigation/root";
import { style } from "./style";

type homeScreenNavigationProp = DrawerNavigationProp<RootListType, "Home">;

interface homeScreenProps {
  navigation: homeScreenNavigationProp;
}

const HomeScreen = ({ navigation }: homeScreenProps) => {
  const authContext = useAuth();
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(true);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [favoritos, setFavoritos] = useState<any[]>([]);

  const [lastItems, setLastItems] = useState<any[]>([]);

  const [loading, setLoading] = useState<boolean>(false);

  const isFocused = useIsFocused();

  useEffect(() => {
    setLoading(true);
    const initialSetUp = async () => {
      //Limpar Async Storage
      // const allKeys = await AsyncStorage.getAllKeys(); // Get all keys from AsyncStorage
      // await AsyncStorage.multiRemove(allKeys); // Remove all keys

      //Pegar Banners
      // const apiFetch = await axios.get(BASE_API_HOME);

      // if (apiFetch.data.success) {
      //   const response = apiFetch.data.data;

      //   if (response.banners.length > 0) {
      //     setBanners(() => response.banners);
      //   }
      // }

      try {
        let allItems = [];
        //Buscar os últimos boletins na API
        for (let i = 1; i <= 3; i++) {
          const lastObj = {
            numero: null,
            boletim_tipo_id: [i],
            data: null,
            limite: 1,
            pagina: 0,
          };
          const ultimosBoletins = await axios.post(
            `${BASE_API_BULLETINS_NOT_LOGGED}`,
            lastObj,
            { timeout: 20000 }
          );

          if (ultimosBoletins.data.success) {
            const parsedItem = {
              ...ultimosBoletins.data.data.list[0],
              tipo: i,
            };
            allItems.push(parsedItem);
          }
        }
        setLastItems(() => [...allItems]);

        //Se usuário logado, buscar Favoritos
        if (authContext.isLoggedIn) {
          const parsedValue = await getUser();

          const searchObj = {
            numero: null,
            boletim_tipo_id: [1, 2, 3],
            data: null,
            limite: 10,
            pagina: 0,
          };

          if (parsedValue && parsedValue.userToken) {
            const favoritosResponse = await axios.post(
              BASE_API_GET_FAVORITES,
              searchObj,
              {
                timeout: 20000,
                headers: {
                  credential: parsedValue.userToken,
                },
              }
            );

            if (favoritosResponse.data.success) {
              setFavoritos((prev) => [...favoritosResponse.data.data.list]);
            }
          }
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

    initialSetUp();

    if (isFocused) {
      //Buscar Favoritos
      initialSetUp();
    }
  }, [isFocused]);

  return (
    <Container>
      {/* {banners.length > 0 && <CustomCarousel data={banners} />} */}
      {loading ? (
        <View style={{ flex: 1, alignItems: "center", marginTop: 150 }}>
          {/* <ActivityIndicator size="large" color="#0000ff" /> */}
          <Image
            source={require("../../../assets/loading.gif")}
            style={{ height: 200, width: 200 }}
          />
        </View>
      ) : (
        <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
          <Text style={style.title}>Últimos Boletins</Text>
          {lastItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={style.lastItems}
              onPress={() => {
                if (item.tipo === 1 || item.tipo === 2) {
                  navigation.navigate("BulletimItem", { boletimId: item.id });
                } else {
                  navigation.navigate("ClassificatorItem", {
                    classificadorId: item.id,
                  });
                }
              }}
            >
              <Text style={style.itemTitle}>{item.titulo}</Text>
            </TouchableOpacity>
          ))}
          <Text style={style.title}>Favoritos</Text>

          {favoritos.length > 0 &&
            favoritos.map((item: any, index: number) => (
              <View key={item.id} style={style.itemContainer}>
                <TouchableOpacity
                  style={style.itemTouchable}
                  onPress={() => {
                    if (
                      item.boletim_tipo_id === 1 ||
                      item.boletim_tipo_id === 2
                    ) {
                      navigation.navigate("BulletimItem", {
                        boletimId: item.id,
                      });
                    } else {
                      navigation.navigate("ClassificatorItem", {
                        classificadorId: item.id,
                      });
                    }
                  }}
                >
                  <Text style={style.itemTitle}>{item.titulo}</Text>
                </TouchableOpacity>
              </View>
            ))}
        </ScrollView>
      )}

      {/* <Modal
        visible={isModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={style.modalContainer}>
          <View style={style.modalContent}>
            <Text style={style.modalText}>
              Você precisa estar logado fazer esta ação. Por favor, clique no
              canto superior direito para entrar.
            </Text>
            <Button title="Fechar" onPress={() => setIsModalVisible(false)} />
          </View>
        </View>
      </Modal> */}
    </Container>
  );
};

export default HomeScreen;
