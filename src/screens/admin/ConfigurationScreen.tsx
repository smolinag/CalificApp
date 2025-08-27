import React, { useState } from "react";
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, Modal } from "react-native";
import { Button, Icon } from "react-native-paper";
import gstyles, { width } from "../../styles/GeneralStyle";
import * as SecureStore from "expo-secure-store";
import { ParamListBase, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import Constants from "expo-constants";
import { Colors } from "../../styles/Theme";

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
          <Modal visible={showResetModal} transparent={true} animationType="fade">
            <View style={gstyles.modalOverlay}>
              <View style={[styles.alertContainer, { backgroundColor: Colors.background }]}>
                <Icon source={"alert-outline"} size={width * 0.035} />
                <View style={{ marginVertical: 10, alignItems: "flex-start" }}>
                  <Text style={gstyles.text}>
                    {
                      "Estás a punto de reiniciar la configuración de la aplicación. Esto borrará todos los datos guardados localmente y te llevará a la pantalla de configuración inicial. ¿Deseas continuar?"
                    }
                  </Text>
                </View>

                <View style={{ flexDirection: "row" }}>
                  <Button
                    mode="contained"
                    onPress={() => {
                      setShowResetModal(false);
                    }}
                    style={[gstyles.generalButton, { marginTop: 10 }]}
                    labelStyle={{ fontSize: width * 0.0175 }}
                  >
                    {"Cancelar"}
                  </Button>
                  <Button
                    mode="contained"
                    onPress={() => {
                      handleResetAppAccept();
                    }}
                    style={[gstyles.generalButton, { marginTop: 10 }]}
                    labelStyle={{ fontSize: width * 0.0175 }}
                  >
                    {"Aceptar"}
                  </Button>
                </View>
              </View>
            </View>
          </Modal>
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
