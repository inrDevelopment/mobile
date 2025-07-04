import {
  Alert,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
// import { contentType } from "../../types";
// import ClickableItem from "../ClickableItem";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { DrawerScreenProps } from "@react-navigation/drawer";
import { RouteProp, useIsFocused, useRoute } from "@react-navigation/native";
import axios from "axios";
import { Image as ExpoImage } from "expo-image";
import { useContext, useEffect, useState } from "react";
import ClickableItem from "../../components/ClickableItem";
import { Container } from "../../components/Container";
import Colors from "../../constants/Colors";
import { AuthContext } from "../../contexts/AuthenticationContext";
import { getUser } from "../../lib/storage/userStorage";
import { contentType } from "../../lib/types";
import { RootListType } from "../../navigation/root";
import { styles } from "./styles";

type ClassificatorItemRouteProp = RouteProp<
  { ClassificatorItem: { classificadorId: number } },
  "ClassificatorItem"
>;
type Props = DrawerScreenProps<RootListType, "ClassificatorItem">;

export default function ClassificatorItem({ navigation }: Props) {
  const route = useRoute<ClassificatorItemRouteProp>();
  const { classificadorId } = route.params;
  const [sections, setSections] = useState<Record<string, contentType[]>>({});
  const [user, setUser] = useState<any>({});
  const [classificador, setClassificador] = useState<any>({});
  const isFocused = useIsFocused();
  const authContext = useContext(AuthContext);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const initialSetup = async () => {
      try {
        setLoading(true);
        if (!authContext.isLoggedIn) {
          const apiResponse = await axios.get(
            `https://api.publicacoesinr.com.br/leitor/ler/publico?id=${classificadorId}`
          );

          setClassificador(() => apiResponse.data.data);
        } else {
          const storedUser = await getUser();
          setUser(storedUser);
          const apiResponse = await axios.get(
            `https://api.publicacoesinr.com.br/leitor/ler/privado?id=${classificadorId}`,
            {
              headers: {
                credential: storedUser.userToken,
              },
            }
          );
          if (apiResponse.data.success) {
            setClassificador(() => ({
              ...apiResponse.data.data,
              lido: true,
              favorito: apiResponse.data.data.favorito,
            }));

            const readResponse = await axios.get(
              `https://api.publicacoesinr.com.br/leitor/leitura/${apiResponse.data.data.id}/adicionar`,
              {
                headers: {
                  credential: storedUser.userToken,
                },
              }
            );

            // setBoletim((prev: any) => ({ ...prev, lido: true }));
          } else {
            navigation.navigate("Home");
          }
        }
        setLoading(false);
      } catch (error: any) {
        setLoading(false);
        console.warn(error.message);
      }
    };
    initialSetup();

    if (isFocused) {
      //Buscar Favoritos
      initialSetup();
    }
  }, []);

  const toggleRead = async () => {
    if (!authContext.isLoggedIn) {
      Alert.alert("Erro", "Você precisa estar logado para usar esta opção.");
      return;
    }

    try {
      if (classificador.lido) {
        const readResponse = await axios.delete(
          `https://api.publicacoesinr.com.br/leitor/leitura/${classificador.id}/remover`,
          {
            headers: {
              credential: user.userToken,
            },
          }
        );
        setClassificador((prev: any) => ({ ...prev, lido: false }));
        Alert.alert("Atenção", "Classificador marcado como não lido");
      } else {
        const readResponse = await axios.get(
          `https://api.publicacoesinr.com.br/leitor/leitura/${classificador.id}/adicionar`,
          {
            headers: {
              credential: user.userToken,
            },
          }
        );
        setClassificador((prev: any) => ({ ...prev, lido: true }));
        Alert.alert("Atenção", "Classificador marcado como lido");
      }
    } catch (error) {
      console.warn("Erro ao registrar leitura:", error);
    }
  };

  const toggleFavorite = async () => {
    if (!authContext.isLoggedIn) {
      Alert.alert("Erro", "Você precisa estar logado para usar esta opção.");
      return;
    }

    try {
      if (!classificador.favorito) {
        const readResponse = await axios.get(
          `https://api.publicacoesinr.com.br/leitor/favorito/${classificador.id}/adicionar`,
          {
            headers: {
              credential: user.userToken,
            },
          }
        );
        if (readResponse.data.success) {
          setClassificador((prev: any) => ({ ...prev, favorito: true }));
          Alert.alert("Atenção", "Classificador adicionado aos favoritos.");
        }
      } else {
        const readResponse = await axios.delete(
          `https://api.publicacoesinr.com.br/leitor/favorito/${classificador.id}/remover`,
          {
            headers: {
              credential: user.userToken,
            },
          }
        );
        if (readResponse.data.success) {
          setClassificador((prev: any) => ({ ...prev, favorito: false }));
          Alert.alert("Atenção", "Classificador removido dos favoritos.");
        }
      }
    } catch (error) {
      console.warn("Erro ao registrar leitura:", error);
      Alert.alert("Erro ao favoritar conteúdo. Por favor, tente novamente.");
    }
  };

  useEffect(() => {
    navigation.setOptions({
      headerTitle: `Classificadores INR`,
      headerRight: () => (
        <View style={{ flexDirection: "row" }}>
          <TouchableOpacity style={{ marginRight: 15 }} onPress={toggleRead}>
            <MaterialCommunityIcons
              name={classificador.lido ? "bookmark" : "bookmark-outline"}
              size={30}
              color={Colors.primary.title}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={{ marginRight: 15 }}
            onPress={toggleFavorite}
          >
            <MaterialCommunityIcons
              name={
                classificador.favorito ? "cards-heart" : "cards-heart-outline"
              }
              size={30}
              color={classificador.favorito ? "red" : Colors.primary.title}
            />
          </TouchableOpacity>
        </View>
      ),
    });
  }, [classificador.lido, classificador.favorito]);

  useEffect(() => {
    if (!classificador?.conteudo) return;

    const categorizedItems: Record<string, any[]> = {};

    classificador.conteudo
      .filter((item: any) => item.tipo !== null)
      .forEach((item: any) => {
        if (!categorizedItems[item.tipo]) {
          categorizedItems[item.tipo] = [];
        }
        categorizedItems[item.tipo].push(item);
      });

    setSections(categorizedItems);
  }, [classificador]);

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
      <View style={styles.manTitleContainer}>
        <Text style={styles.mainTitle}>{classificador.titulo}</Text>
        <Text style={styles.mainTitle}>ISSN 1983-1228</Text>
      </View>
      <ScrollView style={{ marginBottom: 30 }}>
        {Object.entries(sections).map(([tipo, items]) => (
          <Section key={tipo} tipo={tipo} items={items} />
        ))}
      </ScrollView>
    </Container>
  );
}
//Teste

const Section = ({ tipo, items }: { tipo: string; items: contentType[] }) => {
  const imageMap: Record<string, any> = {
    "Classificadores INR SP": require("../../../assets/images/SP.png"),
    "Classificadores INR SP - Não houve publicação": require("../../../assets/images/SP.png"),
    "Classificadores INR SP - Não há atos de interesse": require("../../../assets/images/SP.png"),
    "Classificadores INR PR": require("../../../assets/images/PR.png"),
    "Classificadores INR PR - Não houve publicação": require("../../../assets/images/PR.png"),
    "Classificadores INR PR -  Não há atos de interesse": require("../../../assets/images/PR.png"),
    "Classificadores INR RS": require("../../../assets/images/RS.png"),
    "Classificadores INR RS - Não houve publicação": require("../../../assets/images/RS.png"),
    "Classificadores INR RS -  Não há atos de interesse": require("../../../assets/images/RS.png"),
    "Arquivos acumulados classificadores INR SP": require("../../../assets/images/SP.png"),
  };

  if (!imageMap[tipo]) return null;

  return (
    <View style={styles.bannerContainer}>
      <Image
        source={imageMap[tipo]}
        style={{ width: "100%", resizeMode: "contain" }}
      />
      <View
        style={{
          alignItems: "flex-start",
          width: "100%",
          marginTop: -20,
          marginHorizontal: 5,
        }}
      >
        {items.map((item: any, index: number) => (
          <ClickableItem
            key={index}
            title={item.titulo ?? ""}
            link={item.url ?? ""}
          />
        ))}
      </View>
    </View>
  );
};
