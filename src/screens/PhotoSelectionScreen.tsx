import React, { useCallback, useEffect, useState } from "react";
import { View, StyleSheet, Text, TouchableOpacity, Image, Modal } from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ParamListBase, useFocusEffect, useNavigation } from "@react-navigation/native";
import { Button, Icon } from "react-native-paper";
import * as SecureStore from "expo-secure-store";

import { getEmployees } from "../queries/EmployeeQueries";
import { getGeneralStyles } from "../styles/GeneralStyle";
import { RatingInfo } from "../models/RatingInfo";
import LoadingAnimation from "../components/LoadingAnimation";
import EmployeeCarousel from "../components/EmployeeCarousel";
import { useTheme } from "../context/ThemeContext";
import { rgbToRgba } from "../utils/Utils";
import GeneralTextInput from "../components/GeneralTextInput";

const PhotoSelectionScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();
  const [employees, setEmployees] = useState<RatingInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [inputPassword, setInputPassword] = useState("");
  const [pinError, setPinError] = useState(false);

  const { theme, logoUrl } = useTheme();
  const gstyles = getGeneralStyles(theme);

  const fetchEmployees = async () => {
    const companyName = await SecureStore.getItemAsync("companyName");
    console.log(theme)
    setLoading(true);
    const response = await getEmployees(companyName);
    if (response && response.data) {
      const employeeData: RatingInfo[] = response.data.map((employee: any) => ({
        employeeName: employee.employeeName,
        photoUrl: employee.photoUrl,
        ratingStartedAt: undefined,
        version: employee.version,
      }));
      console.log("Fetched employees: " + employeeData.length);
      setEmployees(employeeData);
      setLoading(false);
    } else {
      console.error("Failed to fetch employees", response);
    }
  };

  useEffect(() => {
    const checkConfiguration = async () => {
      const companyName = await SecureStore.getItemAsync("companyName");
      const deviceId = await SecureStore.getItemAsync("deviceId");
      const pin = await SecureStore.getItemAsync("pin");

      if (!companyName || !deviceId || !pin) {
        navigation.replace("InitialConfiguration"); // avoids navigation loops
      }
    };

    checkConfiguration();
  }, [navigation]);

  useFocusEffect(
    useCallback(() => {
      fetchEmployees();
    }, []) 
  );

  const handlePinSubmit = async () => {
    const pin = await SecureStore.getItemAsync("pin");
    if (pin === inputPassword) {
      setModalVisible(false);
      navigation.navigate("Configuration");
      setInputPassword("");
      setPinError(false);
    } else {
      console.log("Wrong PIN: " + inputPassword);
      setPinError(true);
    }
  };

  const handlePinCancel = () => {
    setInputPassword("");
    setPinError(false);
    setModalVisible(false);
  };

  const handleEmployeeSelect = (employee: RatingInfo) => {
    employee.ratingStartedAt = new Date().getTime();
    navigation.navigate("Rating", { ratingInfo: employee });
  };

  return (
    <View style={gstyles.container}>
      <View style={[styles.fixedSettingsContainer, { borderColor: rgbToRgba(theme.primary, 0.5) }]}>
        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <Icon source="cog-outline" size={30} color={theme.primary} />
        </TouchableOpacity>
      </View>
      <Text style={gstyles.title}>{"Califica nuestro servicio"}</Text>
      {loading ? (
        <LoadingAnimation message="Cargando empleados..." />
      ) : (
        <View style={{ alignItems: "center", width: "100%", flex: 1 }}>
          <Text style={gstyles.subtitle}>{"Selecciona a la persona que te atendió:"}</Text>
          <EmployeeCarousel employees={employees} onPress={(item) => handleEmployeeSelect(item)} />
        </View>
      )}
      <View style={gstyles.fixedLogoContainer}>
        {logoUrl && (
          <Image
            source={{ uri: encodeURI(logoUrl) }} // update path as needed
            style={gstyles.logoImage}
            resizeMode="contain"
          />
        )}
      </View>
      <Modal visible={modalVisible} transparent={true} animationType="fade">
        <View style={gstyles.modalOverlay}>
          <View style={[styles.alertContainer, { backgroundColor: theme.background }]}>
            <Text style={gstyles.subtitle}>{"Ingresa el PIN:"}</Text>
            {pinError && (
              <Text style={[gstyles.subtitle2, { color: "red" }]}>{"PIN incorrecto. Intenta nuevamente."}</Text>
            )}
            <GeneralTextInput
              onValueChange={(text) => {
                // Only allow up to 4 digits and numeric input
                const filtered = text.replace(/[^0-9]/g, "").slice(0, 4);
                setPinError(false);
                setInputPassword(filtered);
              }}
              label="PIN"
              value={inputPassword}
              styleProps={{ width: "90%", marginVertical: 5 }}
              keyboardType="numeric"
            />
            <View style={{ flexDirection: "row" }}>
              <Button
                mode="contained"
                onPress={() => {
                  handlePinCancel();
                }}
                style={[gstyles.generalButton, { marginTop: 10 }]}
                labelStyle={{ fontSize: gstyles.textInput.fontSize }}
              >
                {"Cancelar"}
              </Button>
              <Button
                mode="contained"
                onPress={() => {
                  handlePinSubmit();
                }}
                style={[gstyles.generalButton, { marginTop: 10 }]}
                labelStyle={{ fontSize: gstyles.textInput.fontSize }}
              >
                {"Aceptar"}
              </Button>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  navigationIcon: {
    width: 60,
    height: 60,
    marginHorizontal: 10,
  },
  fixedSettingsContainer: {
    position: "absolute",
    top: 30,
    right: 30,
    zIndex: 10,
    borderWidth: 1,
    borderRadius: 30,
    padding: 4,
  },
  alertContainer: {
    width: 400,
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    textAlign: "center",
  },
});

export default PhotoSelectionScreen;
