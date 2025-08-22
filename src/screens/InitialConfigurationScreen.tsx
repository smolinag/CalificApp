import React, { useState } from "react";
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { TextInput, Button, Icon } from "react-native-paper";
import gstyles, { width } from "../styles/GeneralStyle";
import { ParamListBase, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import * as SecureStore from "expo-secure-store";

const InitialConfigurationScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();

  const [companyName, setCompanyName] = useState("");
  const [deviceId, setDeviceId] = useState("");
  const [pin, setPin] = useState("");

  const handleSubmit = async () => {
    if (companyName !== "" && deviceId !== "" && pin !== "") {
      await saveConfiguration(companyName, deviceId, pin);
      navigation.navigate("Home");
    }
  };

  const saveConfiguration = async (companyName: string, deviceId: string, pin: string) => {
    await SecureStore.setItemAsync("companyName", companyName);
    await SecureStore.setItemAsync("deviceId", deviceId);
    await SecureStore.setItemAsync("pin", pin);
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
              <Text style={gstyles.title}>{"Configuración Inicial"}</Text>
              <Icon source="cog" size={40} color="#000" />
            </View>
            <TextInput
              mode="outlined"
              label="Ingresa el nombre de la empresa"
              style={[{ width: "90%", marginVertical: 5 }, gstyles.textInput]}
              value={companyName}
              onChangeText={setCompanyName}
            />
            <TextInput
              mode="outlined"
              label="Ingresa el ID del dispositivo"
              style={[{ width: "90%", marginVertical: 5 }, gstyles.textInput]}
              value={deviceId}
              onChangeText={setDeviceId}
            />
            <TextInput
              mode="outlined"
              label="Ingresa un pin"
              keyboardType="numeric"
              style={[{ width: "90%", marginVertical: 5 }, gstyles.textInput]}
              value={pin}
              onChangeText={(text) => {
                // Only allow up to 4 digits and numeric input
                const filtered = text.replace(/[^0-9]/g, "").slice(0, 4);
                setPin(filtered);
              }}
            />
            <Button
              mode="contained"
              onPress={() => {
                handleSubmit();
              }}
              style={[gstyles.generalButton, { marginTop: 10 }]}
              labelStyle={{ fontSize: width * 0.0175 }}
              disabled={!companyName || !deviceId || !pin}
            >
              {"Continuar"}
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

export default InitialConfigurationScreen;
