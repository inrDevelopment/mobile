import { StyleSheet } from "react-native";
import Colors from "../../constants/Colors";

const styles = StyleSheet.create({
  bannerContainer: {
    marginHorizontal: 5,
    marginBottom: -25,
  },
  manTitleContainer: {
    alignItems: "flex-end",
    marginHorizontal: 10,
  },
  mainTitle: {
    fontWeight: "bold",
    color: Colors.primary.dark,
    fontSize: 15,
  },
});

export default styles;
