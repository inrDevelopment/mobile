import { DrawerNavigationProp } from "@react-navigation/drawer";
import { useIsFocused } from "@react-navigation/native";
import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import * as Animatable from "react-native-animatable";
import { Container } from "../../components/Container";
import SkeletonItem from "../../components/SkeletonView";
import { BASE_API_GET_FAVORITES } from "../../constants/api";
import { useAuth } from "../../contexts/AuthenticationContext";
import { getUser } from "../../lib/storage/userStorage";
import { RootListType } from "../../navigation/root";
import { style } from "./style";

type FavoritesScreenNavigationProp = DrawerNavigationProp<
  RootListType,
  "Favorites"
>;

interface FavoritesScreenProps {
  navigation: FavoritesScreenNavigationProp;
}

const FavoritesScreen = ({ navigation }: FavoritesScreenProps) => {
  const authContext = useAuth();
  const isFocused = useIsFocused();
  const [favoritesList, setFavoritesList] = useState<any[]>([]);
  const [page, setPage] = useState<number>(0);
  const [loadingInitial, setLoadingInitial] = useState<boolean>(false);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);

  const fetchFavorites = useCallback(
    async (reset = false) => {
      try {
        if (!authContext.isLoggedIn) return;

        if (reset) {
          setLoadingInitial(true);
          setPage(0);
        }

        const user = await getUser();

        if (!user?.userToken) {
          Alert.alert("Erro!", "Por favor, clique em Entrar para continuar.");
          setLoadingInitial(false);
          return;
        }

        const favoritesObj = {
          numero: null,
          boletim_tipo_id: [1, 2, 3],
          data: null,
          limite: 10,
          pagina: reset ? 0 : page,
        };

        const response = await axios.post(
          `${BASE_API_GET_FAVORITES}`,
          favoritesObj,
          {
            timeout: 20000,
            headers: { credential: user.userToken },
          }
        );

        if (response.data.success) {
          const newList = response.data.data.list || [];
          setFavoritesList(
            reset
              ? newList
              : (prev) => [
                  ...prev,
                  ...newList.filter(
                    (item: any) => !prev.some((p) => p.id === item.id)
                  ),
                ]
          );
        }
      } catch (error: any) {
        console.warn("Erro ao buscar favoritos:", error.message);
        Alert.alert(
          "Erro",
          error.code === "ECONNABORTED"
            ? "Erro de conexão. Tente novamente."
            : "Ocorreu um erro ao carregar os dados."
        );
      } finally {
        setLoadingInitial(false);
        setLoadingMore(false);
      }
    },
    [authContext.isLoggedIn, page]
  );

  useEffect(() => {
    if (isFocused) fetchFavorites(true);
  }, [isFocused, fetchFavorites]);

  const loadMoreFavorites = async () => {
    if (loadingMore || loadingInitial) return;

    setLoadingMore(true);
    setPage((prev) => prev + 1);
    await fetchFavorites(false);
  };

  if (loadingInitial) {
    return (
      <View style={{ flex: 1, alignItems: "center", marginTop: 150 }}>
        <SkeletonItem />
        <SkeletonItem />
        <SkeletonItem />
      </View>
    );
  }

  return (
    <Container>
      {!authContext.isLoggedIn ? (
        <Text style={style.notLogged}>
          Atualmente você não está logado. Por favor, clique em Entrar acima
          para visualizar seus favoritos.
        </Text>
      ) : (
        <FlatList
          data={favoritesList}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={{ paddingBottom: 20 }}
          ListHeaderComponent={<Text style={style.title}>Seus Favoritos</Text>}
          renderItem={({ item }) => (
            <Animatable.View
              style={style.itemContainer}
              animation="fadeInLeft"
              duration={3000}
            >
              <TouchableOpacity
                style={style.itemTouchable}
                onPress={() =>
                  navigation.navigate("ClassificatorItem", {
                    classificadorId: item.id,
                  })
                }
              >
                <Text style={style.itemTitle}>{item.titulo}</Text>
              </TouchableOpacity>
            </Animatable.View>
          )}
          ListFooterComponent={
            loadingMore ? (
              <ActivityIndicator
                size="small"
                color="#000"
                style={{ margin: 10 }}
              />
            ) : (
              <TouchableOpacity
                style={style.buttonContainer}
                onPress={loadMoreFavorites}
              >
                <Text style={style.buttonText}>Clique Aqui para ver mais</Text>
              </TouchableOpacity>
            )
          }
        />
      )}
    </Container>
  );
};

export default FavoritesScreen;
