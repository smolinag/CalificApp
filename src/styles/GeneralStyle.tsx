import { StyleSheet, Dimensions } from "react-native";
import { Colors } from "./Theme";

export const { width, height } = Dimensions.get('window');

const gstyles = StyleSheet.create({
  title:{
    fontSize: 0.023 * width,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 5,
  },
  subtitle:{
    fontSize: 0.02 * width,
    fontWeight: "normal",
    textAlign: "center",
    marginVertical: 5,
  },
  text: {
    fontSize: 0.015 * width,
  },
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    backgroundColor: Colors.background,
  },  
  fixedLogoContainer: {
    position: "absolute",
    bottom: 10,
    right: 20,
    zIndex: 10,
  },
})

export default gstyles;