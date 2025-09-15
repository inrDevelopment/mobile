import { StyleSheet } from "react-native";
import * as Animatable from "react-native-animatable";
import Colors from "../../constants/Colors";

const SkeletonItem = ({ width = "80%" }: { width?: string | number }) => {
  return (
    <Animatable.View
      animation="pulse"
      easing="ease-in-out"
      iterationCount="infinite"
      style={styles.view}
    />
  );
};

export default SkeletonItem;

const styles = StyleSheet.create({
  view: {
    height: 20,
    width: "80%",
    backgroundColor: Colors.primary.title,
    borderRadius: 8,
    marginVertical: 6,
    marginLeft: 20,
  },
});
