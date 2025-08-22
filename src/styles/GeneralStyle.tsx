import { StyleSheet, Dimensions } from "react-native";
import { Colors } from "./Theme";

export const { width, height } = Dimensions.get("window");

const gstyles = StyleSheet.create({
  title: {
    fontSize: 0.03 * width,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 0.015 * height,
  },
  subtitle: {
    fontSize: 0.0225 * width,
    fontWeight: "normal",
    textAlign: "center",
    marginVertical: 0.01 * height,
  },
  text: {
    fontSize: 0.015 * width,
  },
  textInput:{
    fontSize: 0.015 * width,
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
    bottom: 60,
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
    borderRadius: 10, // Optional: match button radius
  },
  fixedReturnButtonContainer: {
    position: "absolute",
    top: 80,
    right: 40,
    zIndex: 10,
  },
  returnButton: {
    backgroundColor: Colors.background,
    borderColor: "black",
    borderWidth: 1,
    height: height * 0.075,
    width: width * 0.1,
    justifyContent: "center",
  },
  generalButton: {
    height: height * 0.075,
    width: width * 0.145,
    justifyContent: "center",
    margin: 5
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  }
});

export default gstyles;
