import { DrawerNavigationProp } from "@react-navigation/drawer";
import { useIsFocused } from "@react-navigation/native";
import axios from "axios";
import { Image as ExpoImage } from "expo-image";
import { useContext, useEffect, useState } from "react";
import { Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { Container } from "../../components/Container";
import { BASE_API_GET_FAVORITES } from "../../constants/api";
import { AuthContext } from "../../contexts/AuthenticationContext";
import { getUser } from "../../lib/storage/userStorage";
import { RootListType } from "../../navigation/root";
import { style } from "./style";

type favoritesScreenNavigationProp = DrawerNavigationProp<
  RootListType,
  "Favorites"
>;

interface favoritesScreenProps {
  navigation: favoritesScreenNavigationProp;
}

const BulletinsScreen = ({ navigation }: favoritesScreenProps) => {
  const authContext = useContext(AuthContext);
  const isFocused = useIsFocused();
  const [favoritesList, setFavoritesList] = useState<any[]>([]);
  const [page, setPage] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const initialSetup = async () => {
      try {
        setLoading(true);
        const user = await getUser();
        setPage(() => 0);
        //Buscar os boletins na API
        const bulletimObj = {
          numero: null,
          boletim_tipo_id: [1, 2, 3],
          data: null,
          limite: 10,
          pagina: page,
        };
        const favorites = await axios.post(
          `${BASE_API_GET_FAVORITES}`,
          bulletimObj,
          {
            timeout: 20000,
            headers: {
              credential: user.userToken,
            },
          }
        );

        if (favorites.data.success) {
          setFavoritesList(() => [...favorites.data.data.list]);
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

    initialSetup();

    if (isFocused) {
      //Buscar Favoritos
      initialSetup();
    }
  }, [isFocused]);

  const loadMoreFavorites = async () => {
    try {
      const newPage = page + 1;
      const user = await getUser();

      if (!user.userToken) {
        Alert.alert(
          "Erro!",
          "Por favor, clique no botão Entrar para continuar."
        );
        return;
      }

      const favoritesObj = {
        numero: null,
        boletim_tipo_id: [3],
        data: null,
        limite: 2,
        pagina: newPage,
      };
      const boletins = await axios.post(
        `${BASE_API_GET_FAVORITES}`,
        favoritesObj,
        {
          timeout: 20000,
          headers: {
            credential: user.userToken,
          },
        }
      );
      if (boletins.data.success) {
        const newBulletins = boletins.data.data.list;

        const filteredBulletins = newBulletins.filter(
          (novo: any) => !favoritesList.some((item) => item.id === novo.id)
        );

        setFavoritesList((prev) => [...prev, ...filteredBulletins]);

        setPage(newPage);
      }
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

  return loading ? (
    <View style={{ flex: 1, alignItems: "center", marginTop: 150 }}>
      {/* <ActivityIndicator size="large" color="#0000ff" /> */}
      <ExpoImage
        source={require("../../../assets/loading.gif")}
        style={{ height: 200, width: 200 }}
      />
    </View>
  ) : (
    <Container>
      <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
        {!authContext.isLoggedIn ? (
          <Text style={style.notLogged}>
            Atualmente você não está logado. Por favor, clique em Entrar acima
            para visualizar seus favoritos.
          </Text>
        ) : (
          <View>
            <Text style={style.title}>Seus Favoritos</Text>
            {favoritesList.map((item: any, index: number) => (
              <View key={item.id} style={style.itemContainer}>
                <TouchableOpacity
                  style={style.itemTouchable}
                  onPress={() => {
                    navigation.navigate("ClassificatorItem", {
                      classificadorId: item.id,
                    });
                  }}
                >
                  <Text style={style.itemTitle}>{item.titulo}</Text>
                </TouchableOpacity>
              </View>
            ))}
            <TouchableOpacity
              style={style.buttonContainer}
              onPress={loadMoreFavorites}
            >
              <Text style={style.buttonText}>Clique Aqui para ver mais</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </Container>
  );
};

export default BulletinsScreen;
