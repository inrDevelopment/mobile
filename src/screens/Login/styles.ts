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
  openButton: {
    backgroundColor: "#007AFF",
    padding: 12,
    borderRadius: 8,
  },
  closeButton: {
    backgroundColor: "#FF3B30",
    padding: 12,
    borderRadius: 8,
    marginTop: 20,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 30,
    borderRadius: 10,
    alignItems: "center",
    width: "80%",
  },
  modalText: {
    fontSize: 20,
    textAlign: "center",
    marginVertical: 5,
  },
});

export default styles;
