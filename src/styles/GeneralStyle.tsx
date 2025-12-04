import { StyleSheet, Dimensions } from "react-native";
import { Theme } from "../context/ThemeContext";
import { rgbToRgba } from "../utils/Utils";

export const { width, height } = Dimensions.get("window");

export const getGeneralStyles = (theme: Theme) => {
  return StyleSheet.create({
    title: {
      fontSize: 0.05 * height,
      fontWeight: "bold",
      textAlign: "center",
      marginVertical: 0.01 * height,
      color: theme.primary,
      fontFamily: "Cambridge",
    },
    subtitle: {
      fontSize: 0.035 * height,
      fontWeight: "normal",
      textAlign: "center",
      color: theme.primary,
    },
    subtitle2: {
      fontSize: 0.028 * height,
      fontWeight: "normal",
      textAlign: "center",
      color: theme.text,
    },
    text: {
      fontSize: 0.025 * height,
      color: theme.text,
    },
    textInput: {
      fontSize: 0.03 * height,
      backgroundColor: theme.background,
    },
    container: {
      flex: 1,
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      padding: 0.035 * height,
      backgroundColor: theme.background,
    },
    fixedLogoContainer: {
      position: "absolute",
      bottom: height * 0.04,
      right: 10,
      zIndex: 10,
    },
    logoImage: {
      width: width * 0.1,
      height: width * 0.1,
    },
    fixedCalificappLogoContainer: {
      position: "absolute",
      bottom: height * 0.08,
      left: 10,
      zIndex: 10,
    },
    calificappLogoImage: {
      width: width * 0.075,
      height: width * 0.075,
    },
    fixedReturnButtonContainer: {
      position: "absolute",
      top: height * 0.075,
      right: width * 0.02,
      zIndex: 10,
    },
    returnButton: {
      backgroundColor: theme.background,
      borderColor: rgbToRgba(theme.text, 0.6),
      borderWidth: 1,
      justifyContent: "center",
    },
    returnButtonLabel: {
      color: theme.text,
      fontSize: width * 0.0175,
    },
    generalButton: {
      justifyContent: "center",
      margin: height * 0.01,
      paddingHorizontal: "1%",
      paddingVertical: "0.2%",
      backgroundColor: rgbToRgba(theme.primary, 0.75),
    },
    generalButtonLabel: {
      color: theme.text,
      fontSize: width * 0.0175,
    },
    modalOverlay: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "rgba(0, 0, 0, 0.6)",
    },
  });
};
