import React, { useState } from "react";
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, Image, BackHandler } from "react-native";
import { Button, Icon } from "react-native-paper";
import * as SecureStore from "expo-secure-store";
import { ParamListBase, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import Constants from "expo-constants";
import GeneralStatusModal from "../../components/GeneralStatusModal";
import { useTheme } from "../../context/ThemeContext";
import { getGeneralStyles } from "../../styles/GeneralStyle";

const ConfigurationScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();

  const [showResetModal, setShowResetModal] = useState(false);

  const { theme, logoUrl } = useTheme();
  const gstyles = getGeneralStyles(theme);

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

  const handleTheme = () => {
    navigation.navigate("Theme");
  };

  const handleExit = () => {
    BackHandler.exitApp();
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
            <View style={gstyles.fixedReturnButtonContainer}>
              <Button
                mode="contained"
                onPress={handleBack}
                icon="arrow-left"
                style={gstyles.returnButton}
                labelStyle={gstyles.returnButtonLabel}
              >
                {"Atrás"}
              </Button>
            </View>
            <View
              style={{
                flexDirection: "column",
                justifyContent: "space-between",
                alignItems: "center",
                width: "100%",
              }}
            >
              <Text style={gstyles.title}>{"Configuración"}</Text>
              <Icon source="cog" size={40} color={theme.text} />
              <Button
                mode="contained"
                onPress={() => {
                  handleShowRatings();
                }}
                style={[gstyles.generalButton, styles.fixedWidthButton, { marginTop: 10 }]}
                labelStyle={gstyles.generalButtonLabel}
              >
                {"Calificaciones"}
              </Button>
              <Button
                mode="contained"
                onPress={() => {
                  handleShowEmployees();
                }}
                style={[gstyles.generalButton, styles.fixedWidthButton, { marginTop: 10 }]}
                labelStyle={gstyles.generalButtonLabel}
              >
                {"Empleados"}
              </Button>
              <Button
                mode="contained"
                onPress={() => {
                  handleTheme();
                }}
                style={[gstyles.generalButton, styles.fixedWidthButton, { marginTop: 10 }]}
                labelStyle={gstyles.generalButtonLabel}
              >
                {"Apariencia"}
              </Button>
              <Button
                mode="contained"
                onPress={() => {
                  handleResetApp();
                }}
                style={[gstyles.generalButton, styles.fixedWidthButton, { marginTop: 10 }]}
                labelStyle={gstyles.generalButtonLabel}
              >
                {"Reset App"}
              </Button>
              <Button
                mode="contained"
                onPress={handleExit}
                icon="exit-to-app"
                style={[gstyles.generalButton, styles.fixedWidthButton, { marginTop: 10 }]}
                labelStyle={gstyles.generalButtonLabel}
              >
                {"Salir"}
              </Button>
              <Text style={gstyles.text}>{"Versión: " + appVersion}</Text>
            </View>
          </View>
          <View style={gstyles.fixedLogoContainer}>
            {logoUrl && (
              <Image
                source={{ uri: encodeURI(logoUrl) }} // update path as needed
                style={gstyles.logoImage}
                resizeMode="contain"
              />
            )}
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
  fixedWidthButton: {
    width: 250,
    alignSelf: "center",
  },
});

export default ConfigurationScreen;
