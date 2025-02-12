import { ReactNode } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Colors from "../../constants/Colors";

type buttomProps = {
  title: string;
  buttomStyle?: {};
  icon?: ReactNode;
  onPress: () => void;
};

const CustomIconButton = (props: buttomProps) => {
  return (
    <TouchableOpacity onPress={props.onPress}>
      <View
        style={[styles.container, { backgroundColor: Colors.primary.dark }]}
      >
        <Text
          style={[
            styles.title,
            props.buttomStyle,
            {
              color: Colors.primary.light,
            },
          ]}
        >
          {props.title}
        </Text>
        {props.icon}
      </View>
    </TouchableOpacity>
  );
};

export default CustomIconButton;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 5,
    paddingHorizontal: 15,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    padding: 15,
    borderRadius: 5,
  },
});
