import React, { useState } from "react";
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { TextInput, Button, Icon } from "react-native-paper";
import { getGeneralStyles, width } from "../styles/GeneralStyle";
import { ParamListBase, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import * as SecureStore from "expo-secure-store";
import { useTheme } from "../context/ThemeContext";
import GeneralTextInput from "../components/GeneralTextInput";

const InitialConfigurationScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();

  const [companyName, setCompanyName] = useState("");
  const [deviceId, setDeviceId] = useState("");
  const [pin, setPin] = useState("");

  const { theme } = useTheme();
  const gstyles = getGeneralStyles(theme);

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
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={0} // adjust as needed for your header
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={gstyles.container}>
          <View style={styles.mainContainer}>
            <View
              style={{ flexDirection: "column", justifyContent: "space-between", alignItems: "center", width: "100%" }}
            >
              <Text style={gstyles.title}>{"Configuración Inicial"}</Text>
              <Icon source="cog" size={40} color={theme.text} />
            </View>
            <GeneralTextInput
              onValueChange={(val) => setCompanyName(val)}
              label="Ingresa el nombre de la empresa"
              value={companyName}
              styleProps={{ width: "90%", marginVertical: 5 }}
            />
            <GeneralTextInput
              onValueChange={(val) => setDeviceId(val)}
              label="Ingresa el ID del dispositivo"
              value={deviceId}
              styleProps={{ width: "90%", marginVertical: 5 }}
            />
            <GeneralTextInput
              onValueChange={(val) => {
                // Only allow up to 4 digits and numeric input
                const filtered = val.replace(/[^0-9]/g, "").slice(0, 4);
                setPin(filtered);
              }}
              label="Ingresa un PIN"
              value={pin}
              styleProps={{ width: "90%", marginVertical: 5 }}
              keyboardType="numeric"
            />
            <Button
              mode="contained"
              onPress={() => {
                handleSubmit();
              }}
              style={[gstyles.generalButton, { marginTop: 10, alignSelf: "center" }]}
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
