import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { DrawerNavigationProp } from "@react-navigation/drawer";
import { useIsFocused } from "@react-navigation/native";
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import {
  Button,
  Modal,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Container } from "../../components/Container";
import { BASE_API_HOME } from "../../constants/api";
import Colors from "../../constants/Colors";
import { AuthContext } from "../../contexts/AuthenticationContext";
import { RootListType } from "../../navigation/root";
import { style } from "./style";

const mockData = [
  {
    id: 1,
    title: "Boletim Eletrônico INR nº 12566, de 07/02/2025",
    type: "boletim",
  },
  {
    id: 2,
    title:
      "Classificadores - SP/PR/RS - Boletim Eletrônico INR nº 12554, de 31/01/2025",
    type: "classificador",
  },
  {
    id: 3,
    title:
      "Classificadores - SP/PR/RS - Boletim Eletrônico INR nº 12554, de 31/01/2025",
    type: "classificador",
  },
  {
    id: 4,
    title:
      "Classificadores - SP/PR/RS - Boletim Eletrônico INR nº 12554, de 31/01/2025",
    type: "classificador",
  },
  {
    id: 5,
    title:
      "Classificadores - SP/PR/RS - Boletim Eletrônico INR nº 12554, de 31/01/2025",
    type: "classificador",
  },
  {
    id: 6,
    title:
      "Classificadores - SP/PR/RS - Boletim Eletrônico INR nº 12554, de 31/01/2025",
    type: "classificador",
  },
];

type homeScreenNavigationProp = DrawerNavigationProp<RootListType, "Home">;

interface homeScreenProps {
  navigation: homeScreenNavigationProp;
}

const HomeScreen = ({ navigation }: homeScreenProps) => {
  const authContext = useContext(AuthContext);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(true);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [favoritos, setFavoritos] = useState<any[]>([]);
  const [items, setItems] = useState<any>(
    mockData.map((item: any) => ({
      ...item,
      isRead: false,
      isFavorite: false,
    }))
  );
  const [banners, setBanners] = useState<any[]>([]);

  const [lastItems, setLastItems] = useState<any[]>([]);

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

  const isFocused = useIsFocused();
  let tempObj: any[] = [];

  useEffect(() => {
    const initialSetUp = async () => {
      //Limpar Async Storage
      // const allKeys = await AsyncStorage.getAllKeys(); // Get all keys from AsyncStorage
      // await AsyncStorage.multiRemove(allKeys); // Remove all keys

      const apiFetch = await axios.get(BASE_API_HOME);

      if (apiFetch.data.success) {
        const response = apiFetch.data.data;

        if (response.banners.length > 0) {
          setBanners(() => response.banners);
        }
      }

      //Buscar os últimos boletins na API
      const ultimosBoletins = await axios.get(
        "https://production.publicacoesinr.com.br/api/last-publishes"
      );

      if (ultimosBoletins.data) {
        setLastItems([]);
        //Separar os boletins entre boletim e classificador
        if (ultimosBoletins.data.boletim.length > 0) {
          for (let i = 0; i < ultimosBoletins?.data?.boletim?.length; i++) {
            tempObj.push(ultimosBoletins.data.boletim[i]);
            setLastItems((prevState) => [
              ...prevState,
              {
                content: ultimosBoletins.data.boletim[i],
                type: "boletim",
                id: `boletim${ultimosBoletins.data.lastBeId}`,
              },
            ]);
          }
        }
        if (ultimosBoletins.data.classificador.length > 0) {
          for (let i = 0; i < ultimosBoletins.data.classificador.length; i++) {
            tempObj.push(ultimosBoletins.data.classificador[i]);
            setLastItems((prevState) => [
              ...prevState,
              {
                content: ultimosBoletins.data.classificador[i],
                type: "classificador",
                id: `classificador${ultimosBoletins.data.lastClassId}`,
              },
            ]);
          }
        }
      }

      //Buscar Favoritos
      const favoritosResponse = await AsyncStorage.getItem("Favoritos");

      if (favoritosResponse !== null) {
        const parsed = JSON.parse(favoritosResponse);
        //Buscar cada item dos Favoritos
        let favoritosArray = [];

        for (let i = 0; i < parsed.length; i++) {
          const foundItemValue: string | null = await AsyncStorage.getItem(
            parsed[i]
          );
          if (foundItemValue !== null) {
            const parsedItem = JSON.parse(foundItemValue);
            favoritosArray.push(parsedItem);
          }
        }

        setFavoritos(favoritosArray);
      }
    };

    initialSetUp();

    if (isFocused) {
      //Buscar Favoritos
      initialSetUp();
    }
  }, [isFocused]);

  return (
    <Container>
      {/* {banners.length > 0 && <CustomCarousel data={banners} />} */}
      <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
        <Text style={style.title}>Últimos Boletins</Text>
        {lastItems.map((item: any, index: number) => (
          <View key={item.id} style={style.itemContainer}>
            <TouchableOpacity
              style={style.itemTouchable}
              onPress={() => {
                if (item.type === "boletim") {
                  navigation.navigate("BulletimItem", { boletim: item });
                } else {
                  navigation.navigate("ClassificatorItem", {
                    classificador: item,
                  });
                }
              }}
            >
              <Text style={style.itemTitle}>{item.content.title}</Text>
            </TouchableOpacity>
            <View style={style.iconContainer}>
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
                  name={item.isFavorite ? "cards-heart" : "cards-heart-outline"}
                  size={30}
                  color={item.isFavorite ? "red" : "black"}
                />
              </TouchableOpacity>
            </View>
          </View>
        ))}

        <Text style={style.title}>Favoritos</Text>

        {items.map((item: any, index: number) => (
          <View key={item.id} style={style.itemContainer}>
            <TouchableOpacity
              style={style.itemTouchable}
              onPress={() => {
                if (item.type === "boletim") {
                  navigation.navigate("BulletimItem", { boletim: item });
                } else {
                  navigation.navigate("ClassificatorItem", {
                    classificador: item,
                  });
                }
              }}
            >
              <Text style={style.itemTitle}>{item.title}</Text>
            </TouchableOpacity>
            <View style={style.iconContainer}>
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
                  name={item.isFavorite ? "cards-heart" : "cards-heart-outline"}
                  size={30}
                  color={item.isFavorite ? "red" : "black"}
                />
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>

      <Modal
        visible={isModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={style.modalContainer}>
          <View style={style.modalContent}>
            <Text style={style.modalText}>
              Você precisa estar logado fazer esta ação. Por favor, clique no
              canto superior direito para entrar.
            </Text>
            <Button title="Fechar" onPress={() => setIsModalVisible(false)} />
          </View>
        </View>
      </Modal>
    </Container>
  );
};

export default HomeScreen;
