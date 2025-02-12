import { SafeAreaView, ViewStyle } from "react-native";
import { styles } from "./styles";

interface ContainerProps {
  children?: React.ReactNode;
  backgroundColor?: string;
  style?: ViewStyle;
}
export const Container = ({ children, style }: ContainerProps) => {
  return (
    <SafeAreaView style={[styles.container, style]}>{children}</SafeAreaView>
  );
};
