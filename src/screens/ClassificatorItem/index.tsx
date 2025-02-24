import { Image, ScrollView, TouchableOpacity, View } from "react-native";
// import { contentType } from "../../types";
// import ClickableItem from "../ClickableItem";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { DrawerScreenProps } from "@react-navigation/drawer";
import { RouteProp, useRoute } from "@react-navigation/native";
import { useEffect, useState } from "react";
import ClickableItem from "../../components/ClickableItem";
import { Container } from "../../components/Container";
import Colors from "../../constants/Colors";
import { dateExtractor } from "../../lib/dateExtractor";
import { contentType } from "../../lib/types";
import { RootListType } from "../../navigation/root";
import { styles } from "./styles";

interface classificatorProps {
  content: {
    title: string;
    contents: contentType[];
  };
  data: {
    title: string;
    data: string;
    spAcumulado?: string;
    spTitle: string;
    prTitle: string;
    rsTitle: string;
    contents: contentType[];
  };
}

type ClassificatorItemRouteProp = RouteProp<
  { ClassificatorItem: { classificador: classificatorProps } },
  "ClassificatorItem"
>;
type Props = DrawerScreenProps<RootListType, "ClassificatorItem">;

export default function ClassificatorItem({ navigation }: Props) {
  const route = useRoute<ClassificatorItemRouteProp>();
  const { classificador } = route.params;
  const [sections, setSections] = useState<Record<string, contentType[]>>({});

  useEffect(() => {
    navigation.setOptions({
      headerTitle: `Classificador - ${dateExtractor(
        classificador.content.title
      )}`,
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

    classificador.content.contents
      .filter((item) => item.tipo !== null)
      .forEach((item) => {
        if (!categorizedItems[item.tipo!]) {
          categorizedItems[item.tipo!] = [];
        }
        categorizedItems[item.tipo!].push(item);
      });
    setSections(categorizedItems);
  }, []);

  return (
    <Container style={styles.container}>
      {/* <View style={styles.manTitleContainer}>
        <Text style={styles.mainTitle}>{classificador.content.title}</Text>
        <Text style={styles.mainTitle}>ISSN 1983-1228</Text>
        <Text style={styles.mainTitle}>
          {dateExtractor(classificador.content.title)}
        </Text>
      </View> */}
      <ScrollView style={{ marginBottom: 30 }}>
        {Object.entries(sections).map(([tipo, items]) => (
          <Section key={tipo} tipo={tipo} items={items} />
        ))}
      </ScrollView>
    </Container>
  );
}

const Section = ({ tipo, items }: { tipo: string; items: contentType[] }) => {
  const imageMap: Record<string, any> = {
    SP: require("../../../assets/images/SP.png"),
    PR: require("../../../assets/images/PR.png"),
    RS: require("../../../assets/images/RS.png"),
    "SP-ACU": require("../../../assets/images/RS.png"),
  };

  if (!imageMap[tipo]) return null;

  return (
    <View style={styles.bannerContainer}>
      <Image
        source={imageMap[tipo]}
        style={{ width: "100%", resizeMode: "contain" }}
      />
      <View style={{ alignItems: "flex-start", width: "95%", marginTop: -20 }}>
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
