import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  titleView: {
    justifyContent: "center",
    alignItems: "center",
    marginVertical: "10%",
  },
  title: {
    fontSize: 25,
  },
  inputView: {
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: "10%",
    borderBottomWidth: 1,
    flexDirection: "row",
    paddingVertical: 10,
    marginVertical: "5%",
  },
  input: {
    flex: 1,
    fontSize: 20,
    textAlign: "center",
  },
  icon: {
    marginRight: 10,
  },
  buttonView: {
    justifyContent: "center",
    alignItems: "center",
  },
  forgotView: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: "5%",
  },
  forgotText: {
    fontSize: 20,
  },
  gifContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  gif: {
    top: -50,
    width: 200,
    height: 200,
  },
});

export default styles;
