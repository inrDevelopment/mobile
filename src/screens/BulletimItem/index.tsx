import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { DrawerScreenProps } from "@react-navigation/drawer";
import { RouteProp, useRoute } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import ClickableItem from "../../components/ClickableItem";
import { Container } from "../../components/Container";
import Colors from "../../constants/Colors";
import { dateExtractor } from "../../lib/dateExtractor";
import { contentType } from "../../lib/types";
import { RootListType } from "../../navigation/root";
import styles from "./styles";

interface ClassificatorProps {
  content: {
    title: string;
    contents: contentType[];
  };
}

type Props = DrawerScreenProps<RootListType, "BulletimItem">;
type BulletimItemRouteProp = RouteProp<
  { BulletimItem: { boletim: ClassificatorProps } },
  "BulletimItem"
>;

const BulletimItem = ({ navigation }: Props) => {
  const route = useRoute<BulletimItemRouteProp>();
  const { boletim } = route.params;

  const [sections, setSections] = useState<Record<string, contentType[]>>({});

  useEffect(() => {
    navigation.setOptions({
      headerTitle: `Boletim INR - ${dateExtractor(boletim.content.title)}`,
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

    const categorizedItems: Record<string, contentType[]> = {};

    boletim.content.contents
      .filter((item) => item.tipo !== null)
      .forEach((item) => {
        if (!categorizedItems[item.tipo!]) {
          categorizedItems[item.tipo!] = [];
        }
        categorizedItems[item.tipo!].push(item);
      });

    setSections(categorizedItems);
  }, [boletim.content.contents]);

  return (
    <Container>
      <View style={styles.manTitleContainer}>
        <Text style={styles.mainTitle}>{boletim.content.title}</Text>
        <Text style={styles.mainTitle}>ISSN 1983-1228</Text>
        <Text style={styles.mainTitle}>
          {dateExtractor(boletim.content.title)}
        </Text>
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

const Section = ({ tipo, items }: { tipo: string; items: contentType[] }) => {
  const imagesMap: Record<string, any> = {
    OPNIAO: require("../../../assets/images/Opiniao.png"),
    NOTICIAS: require("../../../assets/images/Noticias.png"),
    JURISPRUDENCIA: require("../../../assets/images/juris.png"),
    LEGISLACAO: require("../../../assets/images/Legislacao.png"),
    PERGUNTAS: require("../../../assets/images/Perguntas.png"),
    SUPLEMENTOS: require("../../../assets/images/Suplementos.png"),
    TVINR: require("../../../assets/images/tv.png"),
    MENSAGENSDOSEDITORES: require("../../../assets/images/msgEditores.png"),
    PARECERESNAOPUBLICADOSPELACGJSP: require("../../../assets/images/Pareceres.png"),
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
        {items.map((item, index) => (
          <ClickableItem
            key={index}
            title={item.text ?? ""}
            link={item.url ?? ""}
          />
        ))}
      </View>
    </View>
  );
};
