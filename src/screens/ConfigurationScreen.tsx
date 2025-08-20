import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { TextInput, Button, Icon } from "react-native-paper";
import gstyles from "../styles/GeneralStyle";
import { ParamListBase, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import * as SecureStore from "expo-secure-store";

const ConfigurationScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();

  const [companyName, setCompanyName] = useState("");
  const [deviceId, setDeviceId] = useState("");

  const handleSubmit = async () => {
    if(companyName !== "" && deviceId !== "") {
      await saveConfiguration(companyName, deviceId);
      navigation.navigate("Home");
    }
  };

  const saveConfiguration = async (companyName: string, deviceId: string) => {
    await SecureStore.setItemAsync("companyName", companyName);
    await SecureStore.setItemAsync("deviceId", deviceId);
  };

  return (
    <View style={gstyles.container}>
      <View style={styles.mainContainer}>
        <View style={{ flexDirection: "column", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
          <Text style={gstyles.title}>{"Configuración Inicial"}</Text>
          <Icon source="cog" size={40} color="#000" />
        </View>
        <TextInput
          mode="outlined"
          label="Ingresa el nombre de la empresa"
          style={{ width: "90%", marginVertical: 5 }}
          value={companyName}
          onChangeText={setCompanyName}
        />
        <TextInput
          mode="outlined"
          label="Ingresa el ID del dispositivo"
          style={{ width: "90%", marginVertical: 5 }}
          value={deviceId}
          onChangeText={setDeviceId}
        />
        <Button
          mode="contained"
          onPress={() => {
            handleSubmit();
          }}
          style={{ marginTop: 10 }}
          disabled={!companyName || !deviceId}
        >
          {"Continuar"}
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  }
});

export default ConfigurationScreen;
