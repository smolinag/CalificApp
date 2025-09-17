import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { Button, Icon } from "react-native-paper";
import { ParamListBase, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import * as SecureStore from "expo-secure-store";

import { getGeneralStyles } from "../styles/GeneralStyle";
import { useTheme } from "../context/ThemeContext";
import GeneralTextInput from "../components/GeneralTextInput";
import { getCompany } from "../queries/CompanyQueries";
import { getDevice, updateDevice } from "../queries/DeviceQueries";
import GeneralStatusModal from "../components/GeneralStatusModal";
import LoadingAnimation from "../components/LoadingAnimation";
import { DeviceDto } from "../models/DeviceDto";

const CONFIG_CONSTANTS = {
  PIN_LENGTH: 4,
  PIN_REGEX: /[^0-9]/g,
} as const;

const InitialConfigurationScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();

  const [companyName, setCompanyName] = useState("");
  const [deviceId, setDeviceId] = useState("");
  const [pin, setPin] = useState("");
  const [deviceAlias, setDeviceAlias] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const { theme, reloadTheme } = useTheme();
  const gstyles = getGeneralStyles(theme);

  useEffect(() => {
    reloadTheme();
  }, []);

  const saveConfiguration = async (companyName: string, deviceId: string, pin: string, deviceAlias: string) => {
    try {
      await Promise.all([
        SecureStore.setItemAsync("companyName", companyName),
        SecureStore.setItemAsync("deviceId", deviceId),
        SecureStore.setItemAsync("pin", pin),
        SecureStore.setItemAsync("deviceAlias", deviceAlias),
      ]);
    } catch (error) {
      console.error("Failed to save configuration:", error);
      setErrorMessage("Error al guardar la configuración. Por favor, inténtalo de nuevo.");
    }
  };

  const handleSubmit = async () => {
    if (companyName !== "" && deviceId !== "" && pin !== "") {
      setIsLoading(true);
      //Check if company exists
      try {
        const existingCompany = await getCompany(companyName);
        console.log("Existing company:", existingCompany.data);
        if (existingCompany.data) {
          //Check if device exists
          const deviceResponse = await getDevice(deviceId);
          if (!deviceResponse.data) {
            setErrorMessage("El dispositivo ingresado no existe. Por favor, verifica el ID e inténtalo de nuevo.");
          } else {
            const existingDevice: DeviceDto = deviceResponse.data;
            if(existingDevice.status === "active") {
              setErrorMessage("El dispositivo ya está activo. Por favor, utiliza otro ID de dispositivo.");
              setIsLoading(false);
              return;
            }
            await saveConfiguration(companyName, deviceId, pin, deviceAlias);
            await updateDevice({ ...existingDevice, status: "active", deviceAlias: deviceAlias });
            reloadTheme();
            navigation.navigate("Home");
          }
        } else {
          setErrorMessage("La empresa ingresada no existe. Por favor, verifica el nombre e inténtalo de nuevo.");
        }
      } catch (error) {
        console.error("Error during configuration:", error);
        setErrorMessage("Ocurrió un error durante la configuración. Por favor, inténtalo de nuevo.");
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={0} // adjust as needed for your header
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={gstyles.container}>
          {isLoading ? (
            <LoadingAnimation message="Cargando..." />
          ) : (
            <View style={styles.mainContainer}>
              <View
                style={{
                  flexDirection: "column",
                  justifyContent: "space-between",
                  alignItems: "center",
                  width: "100%",
                }}
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
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  width: "90%",
                  marginVertical: 5,
                  justifyContent: "space-between",
                }}
              >
                <GeneralTextInput
                  onValueChange={(val) => setDeviceAlias(val)}
                  label="Ingresa un alias para el dispositivo"
                  value={deviceAlias}
                  styleProps={{ width: "60%", marginVertical: 5 }}
                />
                <GeneralTextInput
                  onValueChange={(val) => {
                    // Only allow up to 4 digits and numeric input
                    const filtered = val.replace(CONFIG_CONSTANTS.PIN_REGEX, "").slice(0, CONFIG_CONSTANTS.PIN_LENGTH);
                    setPin(filtered);
                  }}
                  label="Ingresa un PIN"
                  value={pin}
                  styleProps={{ width: "38%", marginVertical: 5 }}
                  keyboardType="numeric"
                />
              </View>

              <Button
                mode="contained"
                onPress={() => {
                  handleSubmit();
                }}
                style={[gstyles.generalButton, { marginTop: 10, alignSelf: "center" }]}
                labelStyle={gstyles.generalButtonLabel}
                disabled={!companyName || !deviceId || !pin || !deviceAlias}
              >
                {"Continuar"}
              </Button>
            </View>
          )}

          <GeneralStatusModal
            isVisible={errorMessage !== ""}
            message={errorMessage}
            button1Text="Aceptar"
            onPress1={() => setErrorMessage("")}
            status="warning"
            widthProportion={0.4}
          />
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
