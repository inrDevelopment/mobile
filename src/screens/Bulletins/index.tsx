import { DrawerNavigationProp } from "@react-navigation/drawer";
import { useIsFocused } from "@react-navigation/native";
import axios from "axios";
import { Image } from "expo-image";
import { useEffect, useState } from "react";
import { Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";
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
  const [boletimList, setBoletimList] = useState<any[]>([]);
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
          boletim_tipo_id: [1, 2],
          data: null,
          limite: 10,
          pagina: page,
        };
        const boletins = await axios.post(
          `${BASE_API_BULLETINS_NOT_LOGGED}`,
          bulletimObj,
          { timeout: 20000 }
        );
        if (boletins.data.success) {
          setBoletimList(() => [...boletins.data.data.list]);
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
  }, []);

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
        `${BASE_API_BULLETINS_NOT_LOGGED}`,
        bulletimObj,
        { timeout: 20000 }
      );
      if (boletins.data.success) {
        const newBulletins = boletins.data.data.list;

        const filteredBulletins = newBulletins.filter(
          (novo: any) => !boletimList.some((item) => item.id === novo.id)
        );

        setBoletimList((prev) => [...prev, ...filteredBulletins]);

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
      <Image
        source={require("../../../assets/loading.gif")}
        style={{ height: 200, width: 200 }}
      />
    </View>
  ) : (
    <Container>
      <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
        <Text style={style.title}>Últimas Publicações</Text>
        {boletimList.map((item: any, index: number) => (
          <View key={item.id} style={style.itemContainer}>
            <TouchableOpacity
              style={style.itemTouchable}
              onPress={() => {
                navigation.navigate("BulletimItem", { boletimId: item.id });
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
