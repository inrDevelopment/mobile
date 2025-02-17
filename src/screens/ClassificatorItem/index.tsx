import { Image, ScrollView, Text, View } from "react-native";
import { dateExtractor } from "../../lib/dateExtractor";
import { contentType } from "../../types";
import ClickableItem from "../ClickableItem";
import { styles } from "./styles";

interface classificatorProps {
  data: {
    title: string;
    data: string;
    spAcumulado?: string;
    spTitle: string;
    prTitle: string;
    rsTitle: string;
    contents: contentType[];
    content: {
      title: string;
      contents: contentType[];
    };
  };
}

export default function ClassificatorItem(classificador: classificatorProps) {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.manTitleContainer}>
        <Text style={styles.mainTitle}>{classificador.data.content.title}</Text>
        <Text style={styles.mainTitle}>ISSN 1983-1228</Text>
        <Text style={styles.mainTitle}>
          {dateExtractor(classificador.data.content.title)}
        </Text>
      </View>

      {classificador.data.content.contents.map((item, index) => {
        if (item.tipo === "SP") {
          return (
            <View style={styles.bannerContainer} key={index}>
              <Image
                source={require("../../../assets/images/SP.png")}
                style={{ width: "100%", resizeMode: "contain" }}
              />

              <ClickableItem
                link={item.url ? item.url : ""}
                title={item.text ? item.text : ""}
              />
            </View>
          );
        }
        {
          if (item.tipo?.includes("SP-ACU")) {
            return (
              <View style={{ width: "90%", alignSelf: "center" }} key={index}>
                <ClickableItem
                  link={item.url ? item.url : ""}
                  title={item.text ? item.text : ""}
                />
              </View>
            );
          }
        }
        if (item.tipo?.includes("PR")) {
          return (
            <View style={styles.bannerContainer} key={index}>
              <Image
                source={require("../../../assets/images/PR.png")}
                style={{ width: "100%", resizeMode: "contain" }}
              />

              <ClickableItem
                link={item.url ? item.url : ""}
                title={item.text ? item.text : ""}
              />
            </View>
          );
        }
        if (item.tipo?.includes("RS")) {
          return (
            <View style={styles.bannerContainer} key={index}>
              <Image
                source={require("../../../assets/images/RS.png")}
                style={{ width: "100%", resizeMode: "contain" }}
              />

              <ClickableItem
                link={item.url ? item.url : ""}
                title={item.text ? item.text : ""}
              />
            </View>
          );
        }
      })}
    </ScrollView>
  );
}
