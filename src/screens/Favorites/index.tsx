import { DrawerNavigationProp } from "@react-navigation/drawer";
import { useIsFocused } from "@react-navigation/native";
import axios from "axios";
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

  useEffect(() => {
    const initialSetup = async () => {
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
          headers: {
            credential: user.userToken ? user.userToken : "",
          },
        }
      );
      if (favorites.data.success) {
        setFavoritesList(() => [...favorites.data.data.list]);
      }
    };

    initialSetup();

    if (isFocused) {
      //Buscar Favoritos
      initialSetup();
    }
  }, []);

  const loadMoreFavorites = async () => {
    const newPage = page + 1;
    const user = await getUser();

    if (!user.userToken) {
      Alert.alert("Erro!", "Por favor, clique no botão Entrar para continuar.");
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
  };

  return (
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
