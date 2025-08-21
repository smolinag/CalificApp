import React from "react";
import { Text, ActivityIndicator } from "react-native-paper";
import { View} from "react-native";
import gstyles, { width } from "../styles/GeneralStyle";

interface LoadingAnimationProps {
  message: string;
}

const LoadingAnimation: React.FC<LoadingAnimationProps> = ({ message }) => {
  return (
    <View style={{ height: "100%", top: "30%" }}>
      <Text style={gstyles.subtitle}>{message}</Text>
      <ActivityIndicator animating={true} size={width * 0.17} />
    </View>
  );
};

export default LoadingAnimation;
