import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
// import { contentType } from "../../types";
// import ClickableItem from "../ClickableItem";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { DrawerScreenProps } from "@react-navigation/drawer";
import { RouteProp, useIsFocused, useRoute } from "@react-navigation/native";
import axios from "axios";
import { useEffect, useState } from "react";
import ClickableItem from "../../components/ClickableItem";
import { Container } from "../../components/Container";
import Colors from "../../constants/Colors";
import { contentType } from "../../lib/types";
import { RootListType } from "../../navigation/root";
import { styles } from "./styles";

// interface classificatorProps {
//   content: {
//     title: string;
//     contents: contentType[];
//   };
//   data: {
//     title: string;
//     data: string;
//     spAcumulado?: string;
//     spTitle: string;
//     prTitle: string;
//     rsTitle: string;
//     contents: contentType[];
//   };
// }

type ClassificatorItemRouteProp = RouteProp<
  { ClassificatorItem: { classificadorId: number } },
  "ClassificatorItem"
>;
type Props = DrawerScreenProps<RootListType, "ClassificatorItem">;

export default function ClassificatorItem({ navigation }: Props) {
  const route = useRoute<ClassificatorItemRouteProp>();
  const { classificadorId } = route.params;
  const [sections, setSections] = useState<Record<string, contentType[]>>({});
  const [classificador, setClassificador] = useState<any>({});
  const isFocused = useIsFocused();

  useEffect(() => {
    const initialSetup = async () => {
      const apiResponse = await axios.get(
        `https://api.publicacoesinr.com.br/leitor/ler?id=${classificadorId}`
      );
      console.log(apiResponse.data.data.conteudo);

      setClassificador(() => apiResponse.data.data);
    };
    initialSetup();
    navigation.setOptions({
      headerTitle: `Classificadores INR`,
      headerRight: () => (
        <View style={{ flexDirection: "row" }}>
          <TouchableOpacity style={{ marginRight: 15 }}>
            <MaterialCommunityIcons
              name="bookmark-outline"
              size={30}
              color={Colors.primary.dark}
            />
          </TouchableOpacity>
          <TouchableOpacity style={{ marginRight: 15 }}>
            <MaterialCommunityIcons
              name="cards-heart-outline"
              size={30}
              color={Colors.primary.dark}
            />
          </TouchableOpacity>
        </View>
      ),
    });
    if (isFocused) {
      //Buscar Favoritos
      initialSetup();
    }
  }, []);

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

  return (
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
