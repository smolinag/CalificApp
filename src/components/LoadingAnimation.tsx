import React from "react";
import { Text, ActivityIndicator } from "react-native-paper";
import { View, StyleSheet } from "react-native";

interface LoadingAnimationProps {
  message: string;
}

const LoadingAnimation: React.FC<LoadingAnimationProps> = ({ message }) => {
  return (
    <View style={{ height: "100%", top: "30%" }}>
      <Text style={styles.loadingText}>{message}</Text>
      <ActivityIndicator animating={true} size={72} />
    </View>
  );
};

const styles = StyleSheet.create({
  loadingText: {
    fontSize: 24,
    textAlign: "center",
    marginBottom: 15,
  },
});

export default LoadingAnimation;
