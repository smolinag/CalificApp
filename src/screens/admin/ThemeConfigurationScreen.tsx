import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";
import * as SecureStore from "expo-secure-store";
import * as ImagePicker from "expo-image-picker";
import { ParamListBase, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useTheme } from "../../context/ThemeContext";
import { getGeneralStyles, height } from "../../styles/GeneralStyle";
import GeneralTextInput from "../../components/GeneralTextInput";
import { rgbToRgba } from "../../utils/Utils";
import { Button } from "react-native-paper";
import { updateCompany } from "../../queries/CompanyQueries";
import GeneralStatusModal from "../../components/GeneralStatusModal";
import LoadingAnimation from "../../components/LoadingAnimation";

const ThemeConfigurationScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();
  const { theme, reloadTheme, logoUrl } = useTheme();
  const gstyles = getGeneralStyles(theme);

  const [loading, setLoading] = useState(false);
  const [backgroundColor, setBackgroundColor] = useState(theme.background);
  const [primaryColor, setPrimaryColor] = useState(theme.primary);
  const [textColor, setTextColor] = useState(theme.text);
  const [selectedLogoImage, setSelectedLogoImage] = useState<ImagePicker.ImagePickerAsset | null>(null);
  const [logoLoadError, setLogoLoadError] = useState(false);
  const [status, setStatus] = useState("");
  const [selectedLogoUrl, setSelectedLogoUrl] = useState<string>(logoUrl);

  const handleBack = () => {
    navigation.goBack();
  };

  const handlePickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: "images",
      quality: 1,
      allowsEditing: true,
      base64: true,
    });
    if (!result.canceled && result.assets && result.assets.length > 0) {
      setSelectedLogoImage(result.assets[0]);
      setSelectedLogoUrl(result.assets[0].uri);
    }
  };

  const handleAccept = async () => {
    setLoading(true);
    const companyName = await SecureStore.getItemAsync("companyName");
    const deviceId = await SecureStore.getItemAsync("deviceId");
    try {
      const companyToUpdate = {
        id: companyName,
        fileContent: selectedLogoImage?.base64,
        contentType: "png",
        updatedFromDeviceId: deviceId,
        theme: JSON.stringify({
          background: backgroundColor,
          primary: primaryColor,
          text: textColor,
        }),
      };
      const response = await updateCompany(companyToUpdate, selectedLogoImage !== null);
      if (response.status !== 200) {
        setStatus("Error");
      } else {
        setStatus("Success");
        reloadTheme();
      }
    } catch (e) {
      console.error("Error updating theme", e);
      setStatus("Error");
    } finally {
      setLoading(false);
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
          <Text style={gstyles.title}>{"Tema y Apariencia"}</Text>
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
          {loading ? (
            <LoadingAnimation message="Actualizando apariencia..." />
          ) : (
            <View style={styles.mainContainer}>
              <View style={styles.themeContainer}>
                <View style={styles.themeElement}>
                  <GeneralTextInput
                    label="Color del fondo"
                    value={backgroundColor}
                    onValueChange={(val) => setBackgroundColor(val)}
                    styleProps={{ width: "80%" }}
                  />
                  <View
                    style={[
                      styles.themeColor,
                      { backgroundColor: backgroundColor, borderColor: rgbToRgba(theme.text, 0.5) },
                    ]}
                  />
                </View>
                <View style={styles.themeElement}>
                  <GeneralTextInput
                    label="Color principal"
                    value={primaryColor}
                    onValueChange={(val) => setPrimaryColor(val)}
                    styleProps={{ width: "80%" }}
                  />
                  <View
                    style={[
                      styles.themeColor,
                      { backgroundColor: primaryColor, borderColor: rgbToRgba(theme.text, 0.5) },
                    ]}
                  />
                </View>
                <View style={styles.themeElement}>
                  <GeneralTextInput
                    label="Color del texto"
                    value={textColor}
                    onValueChange={(val) => setTextColor(val)}
                    styleProps={{ width: "80%" }}
                  />
                  <View
                    style={[styles.themeColor, { backgroundColor: textColor, borderColor: rgbToRgba(theme.text, 0.5) }]}
                  />
                </View>
              </View>
              <View style={styles.logoContainer}>
                <Text style={gstyles.subtitle2}>Logo:</Text>
                <TouchableOpacity onPress={handlePickImage}>
                  <Image
                    source={
                      selectedLogoUrl === null || logoLoadError ? require("../../../assets/Unknown.jpg") : { uri: selectedLogoUrl }
                    }
                    style={{ width: height * 0.5, height: height * 0.5, borderWidth: 1, borderColor: theme.text }}
                    resizeMode="contain"
                    onError={() => setLogoLoadError(true)}
                  />
                </TouchableOpacity>
              </View>
            </View>
          )}
          <Button
            mode="contained"
            onPress={() => {
              handleAccept();
            }}
            style={gstyles.generalButton}
            labelStyle={gstyles.generalButtonLabel}
          >
            {"Aceptar"}
          </Button>
        </View>
        <GeneralStatusModal
          isVisible={status !== ""}
          message={
            status === "Success"
              ? "Tema y Apariencia actualizados exitosamente"
              : "Error al actualizar el Tema y la Apariencia"
          }
          button1Text="Aceptar"
          onPress1={() => {            
            setStatus("");
            status === "Success" ? navigation.goBack() : null;
          }}
          status={status === "Success" ? "success" : "error"}
        />
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
    flexDirection: "row",
    padding: "3%",
  },
  themeContainer: {
    width: "50%",
    flexDirection: "column",
    justifyContent: "center",
    gap: "4%",
  },
  themeElement: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    gap: "10",
  },
  themeColor: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 1,
  },
  logoContainer: {
    width: "45%",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    gap: "4%",
  },
});

export default ThemeConfigurationScreen;
