import React from "react";
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { Button, Icon } from "react-native-paper";
import gstyles, { width } from "../styles/GeneralStyle";
import * as SecureStore from "expo-secure-store";
import { ParamListBase, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

const ConfigurationScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();

  const handleResetApp = async () => {
    await SecureStore.deleteItemAsync("companyName");
    await SecureStore.deleteItemAsync("deviceId");
    await SecureStore.deleteItemAsync("pin");
    // Navigate to InitialConfigurationScreen
    navigation.navigate("InitConfiguration");
  };

  const handleBack = () => {
    navigation.goBack();
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
            <View style={gstyles.fixedReturnButtonContainer}>
              <View style={gstyles.shadowWrapper}>
                <Button
                  mode="contained"
                  onPress={handleBack}
                  icon="arrow-left"
                  style={gstyles.returnButton}
                  labelStyle={{ color: "black", fontSize: width * 0.0175 }}
                >
                  {"Atrás"}
                </Button>
              </View>
            </View>
            <View
              style={{ flexDirection: "column", justifyContent: "space-between", alignItems: "center", width: "100%" }}
            >
              <Text style={gstyles.title}>{"Configuración"}</Text>
              <Icon source="cog" size={40} color="#000" />
            </View>
            <Button
              mode="contained"
              onPress={() => {
                handleResetApp();
              }}
              style={[gstyles.generalButton, { marginTop: 10 }]}
              labelStyle={{ fontSize: width * 0.0175 }}
            >
              {"Reset App"}
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
