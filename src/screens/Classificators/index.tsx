import { DrawerNavigationProp } from "@react-navigation/drawer";
import { useIsFocused } from "@react-navigation/native";
import axios from "axios";
import { useEffect, useState } from "react";
import { Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";
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
  const [classificatorsList, setClassificatorsList] = useState<any[]>([]);
  const [page, setPage] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchBulletins = async (reset = true, customPage = 0) => {
    try {
      if (reset) setLoading(true);

      const bulletimObj = {
        numero: null,
        boletim_tipo_id: [3],
        data: null,
        limite: 10,
        pagina: customPage,
      };

      const { data } = await axios.post(
        BASE_API_BULLETINS_NOT_LOGGED,
        bulletimObj,
        { timeout: 20000 }
      );

      if (data.success) {
        if (reset) {
          setClassificatorsList(data.data.list);
          setPage(0);
        } else {
          const newBulletins = data.data.list;
          const filteredBulletins = newBulletins.filter(
            (novo: any) =>
              !classificatorsList.some((item) => item.id === novo.id)
          );
          setClassificatorsList((prev) => [...prev, ...filteredBulletins]);
          setPage(customPage);
        }
      }
    } catch (error: any) {
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
      console.warn("Erro ao buscar boletins:", error.message);
    } finally {
      if (reset) setLoading(false);
    }
  };

  // 🔹 Chama só uma vez + quando voltar para a tela
  useEffect(() => {
    if (isFocused) {
      fetchBulletins(true, 0);
    }
  }, [isFocused]);

  const loadMoreBulletins = () => {
    fetchBulletins(false, page + 1);
  };

  return (
    <Container>
      <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
        <Text style={style.title}>Últimas Publicações</Text>

        {loading ? (
          <View>
            <SkeletonItem />
            <SkeletonItem />
            <SkeletonItem />
            <SkeletonItem />
            <SkeletonItem />
          </View>
        ) : (
          classificatorsList.map((item: any) => (
            <Animatable.View
              key={item.id}
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
          ))
        )}

        {!loading && (
          <TouchableOpacity
            style={style.buttonContainer}
            onPress={loadMoreBulletins}
          >
            <Text style={style.buttonText}>Clique Aqui para ver mais</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </Container>
  );
};

export default BulletinsScreen;
