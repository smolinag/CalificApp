import React, { useState } from "react";
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, NativeModules } from "react-native";
import { Button, Icon } from "react-native-paper";
import gstyles, { width } from "../styles/GeneralStyle";
const { KioskMode } = NativeModules;

const ConfigurationScreen: React.FC = () => {

  const handleExitFullScreen = async () => {
    KioskMode.exit();
  };

  const handleEnterFullScreen = async () => {
    KioskMode.enter();
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={0} // adjust as needed for your header
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={gstyles.container}>
          <View style={styles.mainContainer}>
            <View
              style={{ flexDirection: "column", justifyContent: "space-between", alignItems: "center", width: "100%" }}
            >
              <Text style={gstyles.title}>{"Configuración"}</Text>
              <Icon source="cog" size={40} color="#000" />
            </View>          
            <Button
              mode="contained"
              onPress={() => {
                handleExitFullScreen();
              }}
              style={[gstyles.generalButton, { marginTop: 10 }]}
              labelStyle={{ fontSize: width * 0.0175 }}
            >
              {"Exit fullScreen"}
            </Button>
            <Button
              mode="contained"
              onPress={() => {
                handleEnterFullScreen();
              }}
              style={[gstyles.generalButton, { marginTop: 10 }]}
              labelStyle={{ fontSize: width * 0.0175 }}
            >
              {"Enter fullScreen"}
            </Button>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
});

export default ConfigurationScreen;
