import { DrawerNavigationProp } from "@react-navigation/drawer";
import { useIsFocused } from "@react-navigation/native";
import axios from "axios";
import { Image as ExpoImage } from "expo-image";
import { useEffect, useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { Container } from "../../components/Container";
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

  useEffect(() => {
    const initialSetup = async () => {
      try {
        setLoading(true);
        setPage(() => 0);
        //Buscar os boletins na API
        const bulletimObj = {
          numero: null,
          boletim_tipo_id: [3],
          data: null,
          limite: 10,
          pagina: page,
        };
        const classificators = await axios.post(
          `${BASE_API_BULLETINS_NOT_LOGGED}`,
          bulletimObj
        );
        if (classificators.data.success) {
          setClassificatorsList(() => [...classificators.data.data.list]);
        }
        setLoading(false);
      } catch (error: any) {
        setLoading(false);
        console.warn(error.message);
      }
    };

    initialSetup();

    if (isFocused) {
      initialSetup();
    }
  }, []);

  const loadMoreBulletins = async () => {
    const newPage = page + 1;

    const bulletimObj = {
      numero: null,
      boletim_tipo_id: [3],
      data: null,
      limite: 10,
      pagina: newPage,
    };
    const boletins = await axios.post(
      `${BASE_API_BULLETINS_NOT_LOGGED}`,
      bulletimObj
    );
    if (boletins.data.success) {
      const newBulletins = boletins.data.data.list;

      const filteredBulletins = newBulletins.filter(
        (novo: any) => !classificatorsList.some((item) => item.id === novo.id)
      );

      setClassificatorsList((prev) => [...prev, ...filteredBulletins]);

      setPage(newPage);
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
        <Text style={style.title}>Últimas Publicações</Text>
        {classificatorsList.map((item: any, index: number) => (
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
          onPress={loadMoreBulletins}
        >
          <Text style={style.buttonText}>Clique Aqui para ver mais</Text>
        </TouchableOpacity>
      </ScrollView>
    </Container>
  );
};

export default BulletinsScreen;
