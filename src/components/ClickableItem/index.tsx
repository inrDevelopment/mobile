import {
  Alert,
  Linking,
  StyleSheet,
  Text,
  TouchableOpacity,
} from "react-native";

type clickableItemProps = {
  title: string;
  link: string;
};

export default function ClickableItem({ title, link }: clickableItemProps) {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={async () => {
        if (link === "") {
          Alert.alert(`Não foi possível abrir a url.`);
          return;
        }
        const supported = await Linking.canOpenURL(link);
        if (supported) {
          await Linking.openURL(link);
        } else {
          Alert.alert(`Não foi possível abrir a url.`);
        }
      }}
    >
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 10,
  },
  text: {
    color: "blue",
    fontSize: 15,
  },
});
