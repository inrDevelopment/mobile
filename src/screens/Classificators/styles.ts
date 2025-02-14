import { StyleSheet } from "react-native";
import Colors from "../../constants/Colors";

export const styles = StyleSheet.create({
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginVertical: 5,
  },
  itemTouchable: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 18,
    maxWidth: "90%",
    flexShrink: 1,
    alignSelf: "flex-start",
    color: Colors.primary.title,
  },
  iconContainer: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
  },
});
