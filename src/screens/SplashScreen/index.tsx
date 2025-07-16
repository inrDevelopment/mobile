import { useEffect } from "react";
import { ImageBackground, StyleSheet } from "react-native";

interface Props {
  onFinish: () => void;
}

export default function SplashScreen({ onFinish }: Props) {
  useEffect(() => {
    const timeout = setTimeout(() => {
      onFinish();
    }, 2000); // 2 segundos

    return () => clearTimeout(timeout);
  }, []);

  return (
    <ImageBackground
      source={require("../../../assets/splash.png")}
      resizeMode="cover"
      style={styles.container}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
});
