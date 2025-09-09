import React from "react";
import { Text, ActivityIndicator } from "react-native-paper";
import { View } from "react-native";
import { getGeneralStyles, width } from "../styles/GeneralStyle";
import { useTheme } from "../context/ThemeContext";

interface LoadingAnimationProps {
  message: string;
}

const LoadingAnimation: React.FC<LoadingAnimationProps> = ({ message }) => {
  const { theme } = useTheme();
  const gstyles = getGeneralStyles(theme);

  return (
    <View style={{ height: "100%", top: "30%" }}>
      <Text style={gstyles.subtitle}>{message}</Text>
      <ActivityIndicator animating={true} size={width * 0.17} color={theme.primary} style={{marginTop:"3%"}}/>
    </View>
  );
};

export default LoadingAnimation;
