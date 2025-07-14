import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { DrawerScreenProps } from "@react-navigation/drawer";
import { RouteProp, useIsFocused, useRoute } from "@react-navigation/native";
import axios from "axios";
import { Image as ExpoImage } from "expo-image";
import { useContext, useEffect, useState } from "react";
import {
  Alert,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import ClickableItem from "../../components/ClickableItem";
import { Container } from "../../components/Container";
import Colors from "../../constants/Colors";
import { AuthContext } from "../../contexts/AuthenticationContext";
import { getUser } from "../../lib/storage/userStorage";
import { RootListType } from "../../navigation/root";
import styles from "./styles";

type Props = DrawerScreenProps<RootListType, "BulletimItem">;
type BulletimItemRouteProp = RouteProp<
  { BulletimItem: { boletimId: number } },
  "BulletimItem"
>;

const BulletimItem = ({ navigation }: Props) => {
  const route = useRoute<BulletimItemRouteProp>();
  const { boletimId } = route.params;
  const [boletim, setBoletim] = useState<any>({});
  const [user, setUser] = useState<any>({});
  const [loading, setLoading] = useState<boolean>();

  const isFocused = useIsFocused();
  const authContext = useContext(AuthContext);

  useEffect(() => {
    const initialSetup = async () => {
      try {
        setLoading(true);
        if (!authContext.isLoggedIn) {
          const apiResponse = await axios.get(
            `https://api.publicacoesinr.com.br/leitor/ler/publico?id=${boletimId}`
          );

          setBoletim(() => apiResponse.data.data);
        } else {
          const storedUser = await getUser();
          setUser(storedUser);
          const apiResponse = await axios.get(
            `https://api.publicacoesinr.com.br/leitor/ler/privado?id=${boletimId}`,
            {
              headers: {
                credential: storedUser.userToken,
              },
            }
          );
          if (apiResponse.data.success) {
            setBoletim(() => ({
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

  const [sections, setSections] = useState<Record<string, any[]>>({});

  useEffect(() => {
    navigation.setOptions({
      headerTitle: `Boletins`,
      headerRight: () => (
        <View style={{ flexDirection: "row" }}>
          <TouchableOpacity style={{ marginRight: 15 }} onPress={toggleRead}>
            <MaterialCommunityIcons
              name={boletim.lido ? "bookmark" : "bookmark-outline"}
              size={30}
              color={Colors.primary.title}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={{ marginRight: 15 }}
            onPress={toggleFavorite}
          >
            <MaterialCommunityIcons
              name={boletim.favorito ? "cards-heart" : "cards-heart-outline"}
              size={30}
              color={boletim.favorito ? "red" : Colors.primary.title}
            />
          </TouchableOpacity>
        </View>
      ),
    });
  }, [boletim.lido, boletim.favorito]);

  useEffect(() => {
    if (!boletim?.conteudo) return;

    const categorizedItems: Record<string, any[]> = {};

    boletim.conteudo
      .filter((item: any) => item.tipo !== null)
      .forEach((item: any) => {
        if (!categorizedItems[item.tipo]) {
          categorizedItems[item.tipo] = [];
        }
        categorizedItems[item.tipo].push(item);
      });

    setSections(categorizedItems);
  }, [boletim]);

  const toggleRead = async () => {
    if (!authContext.isLoggedIn) {
      Alert.alert("Erro", "Você precisa estar logado para usar esta opção.");
      return;
    }

    try {
      if (boletim.lido) {
        const readResponse = await axios.delete(
          `https://api.publicacoesinr.com.br/leitor/leitura/${boletim.id}/remover`,
          {
            headers: {
              credential: user.userToken,
            },
          }
        );
        setBoletim((prev: any) => ({ ...prev, lido: false }));
        Alert.alert("Atenção", "Boletim marcado como não lido");
      } else {
        const readResponse = await axios.get(
          `https://api.publicacoesinr.com.br/leitor/leitura/${boletim.id}/adicionar`,
          {
            headers: {
              credential: user.userToken,
            },
          }
        );
        setBoletim((prev: any) => ({ ...prev, lido: true }));
        Alert.alert("Atenção", "Boletim marcado como lido");
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
      if (!boletim.favorito) {
        const readResponse = await axios.get(
          `https://api.publicacoesinr.com.br/leitor/favorito/${boletim.id}/adicionar`,
          {
            headers: {
              credential: user.userToken,
            },
          }
        );
        if (readResponse.data.success) {
          setBoletim((prev: any) => ({ ...prev, favorito: true }));
          Alert.alert("Atenção", "Boletim adicionado aos favoritos.");
        }
      } else {
        const readResponse = await axios.delete(
          `https://api.publicacoesinr.com.br/leitor/favorito/${boletim.id}/remover`,
          {
            headers: {
              credential: user.userToken,
            },
          }
        );
        if (readResponse.data.success) {
          setBoletim((prev: any) => ({ ...prev, favorito: false }));
          Alert.alert("Atenção", "Boletim removido dos favoritos.");
        }
      }
    } catch (error) {
      console.warn("Erro ao registrar leitura:", error);
      Alert.alert("Erro ao favoritar conteúdo. Por favor, tente novamente.");
    }
  };

  return loading ? (
    <View style={{ flex: 1, alignItems: "center", marginTop: 150 }}>
      <ExpoImage
        source={require("../../../assets/loading.gif")}
        style={{ height: 200, width: 200 }}
      />
    </View>
  ) : (
    <Container>
      <View style={styles.manTitleContainer}>
        <Text style={styles.mainTitle}>{boletim.titulo}</Text>
        <Text style={styles.mainTitle}>ISSN 1983-1228</Text>
      </View>

      <ScrollView style={{ marginBottom: 30 }}>
        {Object.entries(sections).map(([tipo, items]) => (
          <Section key={tipo} tipo={tipo} items={items} />
        ))}
      </ScrollView>
    </Container>
  );
};

export default BulletimItem;

const Section = ({ tipo, items }: { tipo: string; items: any }) => {
  const imagesMap: Record<string, any> = {
    Opnião: require("../../../assets/images/Opiniao.png"),
    Notícias: require("../../../assets/images/Noticias.png"),
    Jurisprudência: require("../../../assets/images/juris.png"),
    Legislação: require("../../../assets/images/Legislacao.png"),
    "Perguntas e Respostas": require("../../../assets/images/Perguntas.png"),
    "Suplementos da Consultoria INR": require("../../../assets/images/Suplementos.png"),
    TVINR: require("../../../assets/images/tv.png"),
    "Mensagens dos Editores": require("../../../assets/images/msgEditores.png"),
    "Pareceres CGJ SP": require("../../../assets/images/Pareceres.png"),
  };

  if (!imagesMap[tipo]) return null;

  return (
    <View style={styles.bannerContainer}>
      <Image
        source={imagesMap[tipo]}
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
