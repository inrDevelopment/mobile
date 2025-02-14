import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { Container } from "../../components/Container";
import Colors from "../../constants/Colors";
import { styles } from "./styles";

const ClassificatorsScreen = () => {
  const itemsArray = [
    {
      id: 1,
      title:
        "Classificadores - SP/PR/RS - Boletim Eletrônico INR nº 12574, de 10/02/2025",
    },
    {
      id: 2,
      title:
        "Classificadores - SP/PR/RS - Boletim Eletrônico INR nº 12575, de 11/02/2025",
    },
    {
      id: 3,
      title:
        "Classificadores - SP/PR/RS - Boletim Eletrônico INR nº 12576, de 12/02/2025",
    },
    {
      id: 4,
      title:
        "Classificadores - SP/PR/RS - Boletim Eletrônico INR nº 12577, de 13/02/2025",
    },
    {
      id: 5,
      title:
        "Classificadores - SP/PR/RS - Boletim Eletrônico INR nº 12578, de 14/02/2025",
    },
    {
      id: 6,
      title:
        "Classificadores - SP/PR/RS - Boletim Eletrônico INR nº 12574, de 10/02/2025",
    },
    {
      id: 7,
      title:
        "Classificadores - SP/PR/RS - Boletim Eletrônico INR nº 12575, de 11/02/2025",
    },
    {
      id: 8,
      title:
        "Classificadores - SP/PR/RS - Boletim Eletrônico INR nº 12576, de 12/02/2025",
    },
    {
      id: 9,
      title:
        "Classificadores - SP/PR/RS - Boletim Eletrônico INR nº 12577, de 13/02/2025",
    },
    {
      id: 10,
      title:
        "Classificadores - SP/PR/RS - Boletim Eletrônico INR nº 12578, de 14/02/2025",
    },
    {
      id: 11,
      title:
        "Classificadores - SP/PR/RS - Boletim Eletrônico INR nº 12574, de 10/02/2025",
    },
    {
      id: 12,
      title:
        "Classificadores - SP/PR/RS - Boletim Eletrônico INR nº 12575, de 11/02/2025",
    },
    {
      id: 13,
      title:
        "Classificadores - SP/PR/RS - Boletim Eletrônico INR nº 12576, de 12/02/2025",
    },
    {
      id: 14,
      title:
        "Classificadores - SP/PR/RS - Boletim Eletrônico INR nº 12577, de 13/02/2025",
    },
    {
      id: 15,
      title:
        "Classificadores - SP/PR/RS - Boletim Eletrônico INR nº 12578, de 14/02/2025",
    },
  ];
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(true);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);

  const [items, setItems] = useState<any>(
    itemsArray.map((item: any) => ({
      ...item,
      isRead: false,
      isFavorite: false,
    }))
  );

  const toggleRead = (id: number) => {
    if (!isLoggedIn) {
      setIsModalVisible(true);
      return;
    }
    setItems((prevItems: any) =>
      prevItems.map((item: any) =>
        item.id === id ? { ...item, isRead: !item.isRead } : item
      )
    );
  };

  const toggleFavorite = (id: number) => {
    if (!isLoggedIn) {
      setIsModalVisible(true);
      return;
    }
    setItems((prevItems: any) =>
      prevItems.map((item: any) =>
        item.id === id ? { ...item, isFavorite: !item.isFavorite } : item
      )
    );
  };

  return (
    <Container>
      <ScrollView style={{ marginBottom: 20 }}>
        {items.map((item: any, index: number) => {
          return (
            <View
              key={`${Math.floor(Math.random() * 999) + 1}-${index}`}
              style={styles.itemContainer}
            >
              <TouchableOpacity
                style={styles.itemTouchable}
                // onPress={() => {
                //   if (item.type === "boletim") {
                //     navigation.navigate("BoletimItem", { boletim: item });
                //   } else {
                //     navigation.navigate("ClassificadorItem", {
                //       classificador: item,
                //     });
                //   }
                // }}
              >
                <Text style={styles.itemTitle}>{item.title}</Text>
              </TouchableOpacity>
              <View style={styles.iconContainer}>
                <TouchableOpacity onPress={() => toggleRead(item.id)}>
                  <MaterialCommunityIcons
                    name={item.isRead ? "bookmark" : "bookmark-outline"}
                    size={30}
                    color={
                      item.isRead ? Colors.primary.light : Colors.primary.dark
                    }
                  />
                </TouchableOpacity>

                <TouchableOpacity onPress={() => toggleFavorite(item.id)}>
                  <MaterialCommunityIcons
                    name={
                      item.isFavorite ? "cards-heart" : "cards-heart-outline"
                    }
                    size={30}
                    color={item.isFavorite ? "red" : "black"}
                  />
                </TouchableOpacity>
              </View>
            </View>
          );
        })}
      </ScrollView>
    </Container>
  );
};

export default ClassificatorsScreen;
