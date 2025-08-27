import { StyleSheet, Dimensions } from "react-native";
import { Colors } from "./Theme";

export const { width, height } = Dimensions.get("window");

const gstyles = StyleSheet.create({
  title: {
    fontSize: 0.05 * height,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 0.01 * height,
  },
  subtitle: {
    fontSize: 0.035 * height,
    fontWeight: "normal",
    textAlign: "center",
  },
  subtitle2: {
    fontSize: 0.028 * height,
    fontWeight: "normal",
    textAlign: "center",
  },
  text: {
    fontSize: 0.025 * height,
  },
  textInput:{
    fontSize: 0.03 * height,
  },
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    padding: 0.025 * width,
    backgroundColor: Colors.background,
  },
  fixedLogoContainer: {
    position: "absolute",
    bottom: height * 0.05,
    right: 10,
    zIndex: 10,
  },
  logoImage: {
    width: width * 0.1,
    height: width * 0.1,
  },
  shadowWrapper: {
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10, // Android
    borderRadius: 20, // Optional: match button radius
  },
  fixedReturnButtonContainer: {
    position: "absolute",
    top: height * 0.075,
    right: width * 0.02,
    zIndex: 10,
  },
  returnButton: {
    backgroundColor: Colors.background,
    borderColor: "black",
    borderWidth: 1,
    alignSelf: "flex-start",
    justifyContent: "center",
  },
  generalButton: {
    alignSelf: "flex-start",
    justifyContent: "center",
    margin: 5,
    paddingHorizontal: "1%",
    paddingVertical: "1%",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  }
});

export default gstyles;