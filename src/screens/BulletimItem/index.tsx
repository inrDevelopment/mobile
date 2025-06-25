import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { DrawerScreenProps } from "@react-navigation/drawer";
import { RouteProp, useIsFocused, useRoute } from "@react-navigation/native";
import axios from "axios";
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

  const isFocused = useIsFocused();
  const authContext = useContext(AuthContext);

  useEffect(() => {
    const initialSetup = async () => {
      if (!authContext.isLoggedIn) {
        const apiResponse = await axios.get(
          `https://api.publicacoesinr.com.br/leitor/ler?id=${boletimId}`
        );

        setBoletim(() => apiResponse.data.data);
      } else {
        const storedUser = await getUser();
        setUser(storedUser);
        const apiResponse = await axios.get(
          `https://api.publicacoesinr.com.br/leitor/ler?id=${boletimId}`,
          {
            headers: {
              Authorization: storedUser.userToken,
            },
          }
        );

        setBoletim(() => ({
          ...apiResponse.data.data,
          lido: false,
          favorito: false,
        }));
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
      const readResponse = await axios.get(
        `https://api.publicacoesinr.com.br/leitor/leitura/${boletim.id}/adicionar`,
        {
          headers: {
            Authorization: user.userToken,
          },
        }
      );
      if (readResponse.data.success) {
        console.log("Sucesso");
        setBoletim((prev: any) => ({ ...prev, lido: !prev.lido }));
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
      const readResponse = await axios.get(
        `https://api.publicacoesinr.com.br/leitor/favorito/${boletim.id}/adicionar`,
        {
          headers: {
            Authorization: user.userToken,
          },
        }
      );
      if (readResponse.data.success) {
        console.log("Sucesso");
        // Somente usuários logados chegam aqui
        setBoletim((prev: any) => ({ ...prev, favorito: !prev.favorito }));
      }
    } catch (error) {
      console.warn("Erro ao registrar leitura:", error);
      Alert.alert("Erro ao favoritar conteúdo. Por favor, tente novamente.");
    }
  };

  return (
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
  //Trying to Push

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
