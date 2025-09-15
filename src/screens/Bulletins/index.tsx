import { DrawerNavigationProp } from "@react-navigation/drawer";
import { useIsFocused } from "@react-navigation/native";
import axios from "axios";
import { useEffect, useState } from "react";
import { Alert, FlatList, Text, TouchableOpacity, View } from "react-native";
import * as Animatable from "react-native-animatable";
import { Container } from "../../components/Container";
import SkeletonItem from "../../components/SkeletonView";
import { BASE_API_BULLETINS_NOT_LOGGED } from "../../constants/api";
import { RootListType } from "../../navigation/root";
import { style } from "./style";

type bulletimScreenNavigationProp = DrawerNavigationProp<
  RootListType,
  "Boletins"
>;

interface bulletimScreenProps {
  navigation: bulletimScreenNavigationProp;
}

const BulletinsScreen = ({ navigation }: bulletimScreenProps) => {
  const isFocused = useIsFocused();
  const [boletimList, setBoletimList] = useState<any[]>([]);
  const [page, setPage] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    let cancelTokenSource = axios.CancelToken.source();

    const initialSetup = async () => {
      try {
        setLoading(true);
        setPage(0);

        const bulletimObj = {
          numero: null,
          boletim_tipo_id: [1, 2],
          data: null,
          limite: 10,
          pagina: 0,
        };

        const boletins = await axios.post(
          BASE_API_BULLETINS_NOT_LOGGED,
          bulletimObj,
          { timeout: 20000, cancelToken: cancelTokenSource.token }
        );

        if (boletins.data.success) {
          setBoletimList(boletins.data.data.list);
        }
      } catch (error: any) {
        if (axios.isCancel(error)) {
          console.log("Requisição cancelada:", error.message);
        } else {
          Alert.alert(
            "Erro",
            "Ocorreu um erro ao carregar os dados. Por favor, tente novamente."
          );
          console.warn("Erro no initialSetup:", error.message);
        }
      } finally {
        setLoading(false);
      }
    };

    initialSetup();

    return () => {
      cancelTokenSource.cancel("Componente desmontado");
    };
  }, [isFocused]);

  const loadMoreBulletins = async () => {
    try {
      const newPage = page + 1;

      const bulletimObj = {
        numero: null,
        boletim_tipo_id: [1, 2],
        data: null,
        limite: 10,
        pagina: newPage,
      };

      const boletins = await axios.post(
        BASE_API_BULLETINS_NOT_LOGGED,
        bulletimObj,
        { timeout: 20000 }
      );

      if (boletins.data.success) {
        const newBulletins = boletins.data.data.list;

        // Evita duplicados
        const filtered = newBulletins.filter(
          (novo: any) => !boletimList.some((item) => item.id === novo.id)
        );

        setBoletimList((prev) => [...prev, ...filtered]);
        setPage(newPage);
      }
    } catch (error: any) {
      Alert.alert(
        "Erro",
        "Ocorreu um erro ao carregar mais boletins. Por favor, tente novamente."
      );
      console.warn("Erro no loadMoreBulletins:", error.message);
    }
  };

  return (
    <Container>
      {loading && boletimList.length === 0 ? (
        // Skeleton inicial
        <View style={{ marginTop: 40 }}>
          <SkeletonItem />
          <SkeletonItem />
          <SkeletonItem />
        </View>
      ) : (
        <FlatList
          data={boletimList}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <Animatable.View
              style={style.itemContainer}
              animation="fadeInLeft"
              duration={4000}
            >
              <TouchableOpacity
                style={style.itemTouchable}
                onPress={() =>
                  navigation.navigate("BulletimItem", { boletimId: item.id })
                }
              >
                <Text style={style.itemTitle}>{item.titulo}</Text>
              </TouchableOpacity>
            </Animatable.View>
          )}
          ListHeaderComponent={
            <Text style={style.title}>Últimas Publicações</Text>
          }
          ListFooterComponent={
            <TouchableOpacity
              style={style.buttonContainer}
              onPress={loadMoreBulletins}
            >
              <Text style={style.buttonText}>Clique Aqui para ver mais</Text>
            </TouchableOpacity>
          }
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}
    </Container>
  );
};

export default BulletinsScreen;
