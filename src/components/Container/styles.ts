import { StyleSheet } from "react-native";
import Styles from "../../common/Styles";
import Colors from "../../constants/Colors";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary.background,
  },
  row: {
    ...Styles.rowView,
  },
});
