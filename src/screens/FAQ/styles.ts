import { StyleSheet } from "react-native";
import Colors from "../../constants/Colors";

export default StyleSheet.create({
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: Colors.primary.dark,
    marginBottom: 10,
    marginLeft: 20,
  },
  itemContainer: {
    marginBottom: 10,
    paddingHorizontal: 20,
  },
  itemTouchable: {
    backgroundColor: Colors.primary.light,
    padding: 10,
    borderRadius: 5,
  },
  itemTitle: {
    fontSize: 18,
    fontWeight: "500",
    color: Colors.primary.dark,
  },
  itemContent: {
    marginTop: 5,
    fontSize: 16,
    color: Colors.primary.dark,
    paddingHorizontal: 10,
  },
});
