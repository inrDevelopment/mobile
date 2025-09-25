import { DrawerNavigationProp } from "@react-navigation/drawer";
import { useIsFocused } from "@react-navigation/native";
import axios from "axios";
import { useEffect, useState } from "react";
import { Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";
import * as Animatable from "react-native-animatable";
import { Container } from "../../components/Container";
import SkeletonItem from "../../components/SkeletonView";
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
  const [favoritos, setFavoritos] = useState<any[]>([]);
  const [lastItems, setLastItems] = useState<any[]>([]);
  const [loadingLastItems, setLoadingLastItems] = useState(true);
  const [loadingFavoritos, setLoadingFavoritos] = useState(true);

  const isFocused = useIsFocused();

  const fetchLastItems = async () => {
    try {
      setLoadingLastItems(true);

      const requests = [1, 2, 3].map((tipo) =>
        axios
          .post(
            BASE_API_BULLETINS_NOT_LOGGED,
            {
              numero: null,
              boletim_tipo_id: [tipo],
              data: null,
              limite: 1,
              pagina: 0,
            },
            { timeout: 20000 }
          )
          .then((res) =>
            res.data.success ? { ...res.data.data.list[0], tipo } : null
          )
      );

      const results = await Promise.all(requests);

      setLastItems(results.filter(Boolean) as any[]);
    } catch (error: any) {
      console.warn("Erro ao buscar últimos boletins:", error.message);
      Alert.alert("Erro", "Não foi possível carregar os boletins.");
    } finally {
      setLoadingLastItems(false);
    }
  };

  const fetchFavoritos = async () => {
    if (!authContext.isLoggedIn) {
      setFavoritos([]);
      setLoadingFavoritos(false);
      return;
    }

    try {
      setLoadingFavoritos(true);
      const parsedValue = await getUser();

      if (parsedValue?.userToken) {
        const response = await axios.post(
          BASE_API_GET_FAVORITES,
          {
            numero: null,
            boletim_tipo_id: [1, 2, 3],
            data: null,
            limite: 10,
            pagina: 0,
          },
          {
            timeout: 20000,
            headers: {
              credential: parsedValue.userToken,
            },
          }
        );

        if (response.data.success) {
          setFavoritos(response.data.data.list);
        }
      }
    } catch (error: any) {
      console.warn("Erro ao buscar favoritos:", error.message);
      Alert.alert("Erro", "Não foi possível carregar seus favoritos.");
    } finally {
      setLoadingFavoritos(false);
    }
  };

  useEffect(() => {
    if (isFocused) {
      Promise.all([fetchLastItems(), fetchFavoritos()]);
    }
  }, [isFocused, authContext.isLoggedIn]);

  return (
    <Container>
      <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
        <Text style={style.title}>Últimos Boletins</Text>
        {loadingLastItems ? (
          <View>
            <SkeletonItem width="90%" />
            <SkeletonItem width="70%" />
            <SkeletonItem width="85%" />
          </View>
        ) : (
          lastItems.map((item, index) => (
            <Animatable.View
              key={index}
              animation="fadeInRight"
              duration={3000}
            >
              <TouchableOpacity
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
            </Animatable.View>
          ))
        )}

        <Text style={style.title}>Favoritos</Text>
        {loadingFavoritos ? (
          <View>
            <SkeletonItem width="90%" />
            <SkeletonItem width="70%" />
            <SkeletonItem width="85%" />
          </View>
        ) : favoritos.length > 0 ? (
          favoritos.map((item: any) => (
            <Animatable.View
              key={item.id}
              style={style.itemContainer}
              animation="fadeInLeft"
              duration={3000}
            >
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
            </Animatable.View>
          ))
        ) : (
          <Text
            style={{
              fontWeight: 500,
              fontSize: 18,
              textAlign: "center",
            }}
          >
            Nenhum favorito encontrado
          </Text>
        )}
      </ScrollView>
    </Container>
  );
};

export default HomeScreen;
