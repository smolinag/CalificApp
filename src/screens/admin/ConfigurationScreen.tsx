import React, { useState } from "react";
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { Button, Icon } from "react-native-paper";
import gstyles, { width } from "../../styles/GeneralStyle";
import * as SecureStore from "expo-secure-store";
import { ParamListBase, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import Constants from "expo-constants";
import GeneralStatusModal from "../../components/GeneralStatusModal";

const ConfigurationScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();

  const [showResetModal, setShowResetModal] = useState(false);

  const appVersion = Constants.expoConfig?.version;

  const handleResetAppAccept = async () => {
    await SecureStore.deleteItemAsync("companyName");
    await SecureStore.deleteItemAsync("deviceId");
    await SecureStore.deleteItemAsync("pin");
    // Navigate to InitialConfigurationScreen
    navigation.navigate("InitialConfiguration");
  };

  const handleResetApp = () => {
    setShowResetModal(true);
  };

  const handleShowRatings = () => {
    navigation.navigate("Ratings");
  };

  const handleShowEmployees = () => {
    navigation.navigate("Employees");
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
              <View style={gstyles.shadowWrapper}>
                <Button
                  mode="contained"
                  onPress={() => {
                    handleShowRatings();
                  }}
                  style={[gstyles.generalButton, { marginTop: 10 }]}
                  labelStyle={{ fontSize: width * 0.0175 }}
                >
                  {"Calificaciones"}
                </Button>
              </View>
              <View style={gstyles.shadowWrapper}>
                <Button
                  mode="contained"
                  onPress={() => {
                    handleShowEmployees();
                  }}
                  style={[gstyles.generalButton, { marginTop: 10 }]}
                  labelStyle={{ fontSize: width * 0.0175 }}
                >
                  {"Empleados"}
                </Button>
              </View>
              <View style={gstyles.shadowWrapper}>
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
              <Text style={gstyles.text}>{"Versión: " + appVersion}</Text>
            </View>
          </View>
          <GeneralStatusModal
            isVisible={showResetModal}
            message={
              "Estás a punto de reiniciar la configuración de la aplicación. Esto borrará todos los datos guardados localmente y te llevará a la pantalla de configuración inicial. ¿Deseas continuar?"
            }
            button1Text="Aceptar"
            button2Text="Cancelar"
            onPress1={handleResetAppAccept}
            onPress2={() => setShowResetModal(false)}
            status="warning"
            widthProportion={0.4}
          />          
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  alertContainer: {
    width: 400,
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    textAlign: "center",
  },
  mainContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
});

export default ConfigurationScreen;
