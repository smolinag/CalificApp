import React, { useEffect, useState } from "react";
import { FlatList, View, StyleSheet, Text, TouchableOpacity, Image, Modal } from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ParamListBase, useNavigation } from "@react-navigation/native";
import { Button, Icon, TextInput } from "react-native-paper";
import * as SecureStore from "expo-secure-store";

import { getEmployees } from "../queries/EmployeeQueries";
import EmployeeCard from "../components/EmployeeCard";
import gstyles, { width } from "../styles/GeneralStyle";
import { RatingInfo } from "../models/RatingInfo";
import { ConfigProperties } from "../utils/ConfigProperties";
import { Colors } from "../styles/Theme";
import LoadingAnimation from "../components/LoadingAnimation";

const PhotoSelectionScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();
  const [employees, setEmployees] = useState<RatingInfo[]>([]);
  const [page, setPage] = useState(0);
  const [logoUrl, setLogoUrl] = useState<string>("");
  const [numCols, setNumCols] = useState(0);
  const [numRows, setNumRows] = useState(0);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [inputPassword, setInputPassword] = useState("");

  const fetchEmployees = async () => {
    const companyName = await SecureStore.getItemAsync("companyName");
    const logoUrl = `${ConfigProperties.s3BucketUrl.replace(/\/$/, "")}/${companyName}/logo.png`;
    setLogoUrl(logoUrl);
    setLoading(true);
    const response = await getEmployees(companyName);
    if (response && response.data) {
      const employeeData: RatingInfo[] = response.data.map((employee: any) => ({
        employeeName: employee.employeeName,
        photoSource: employee.photoUrl,
        ratingStartedAt: undefined,
        companyLogoUrl: logoUrl,
      }));
      console.log("Fetched employees: " + employeeData.length);
      setEmployees(employeeData);
      calculateRowsAndColumns(employeeData.length);
      setLoading(false);
    } else {
      console.error("Failed to fetch employees");
    }
  };

  useEffect(() => {
    const checkConfiguration = async () => {
      const companyName = await SecureStore.getItemAsync("companyName");
      const deviceId = await SecureStore.getItemAsync("deviceId");
      const pin = await SecureStore.getItemAsync("pin");
      if (!companyName || !deviceId || !pin) {
        navigation.navigate("Configuration");
      } else {
        await fetchEmployees();
      }
    };
    checkConfiguration();
  }, []);

  const calculateRowsAndColumns = (numElements: number) => {
    if (numElements === 0) {
      setNumRows(0);
      setNumCols(0);
    } else if (numElements <= 4) {
      setNumRows(1);
      setNumCols(numElements);
    } else if (numElements <= 6) {
      setNumRows(2);
      setNumCols(3);
    } else {
      setNumRows(2);
      setNumCols(4);
    }
  };

  const displayEmployees = () => {
    return (
      <FlatList
        data={employees.slice(page * numRows * numCols, (page + 1) * numRows * numCols)}
        keyExtractor={(_, index) => index.toString()}
        key={numCols}
        numColumns={numCols}
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: "center", // vertical center inside gridContainer
          alignItems: "center", // horizontal center
        }}
        renderItem={({ item }) => (
          <EmployeeCard
            ratingInfo={item}
            onPress={() => {
              item.ratingStartedAt = new Date().getTime();
              navigation.navigate("Rating", { ratingInfo: item });
            }}
            isTouchable={true}
          />
        )}
      />
    );
  };

  const handlePasswordSubmit = async () => {
    setModalVisible(false);
    const pin = await SecureStore.getItemAsync("pin");
    if (pin === inputPassword) {
      navigation.navigate("Configuration");
    } else {
      console.log("Wrong password: " + inputPassword);
    }
    setInputPassword("");
  };

  return (
    <View style={gstyles.container}>
      <View style={styles.fixedSettingsContainer}>
        <View style={styles.navigationIconShadow}>
          <TouchableOpacity onPress={() => setModalVisible(true)}>
            <Icon source="cog-outline" size={30} />
          </TouchableOpacity>
        </View>
      </View>
      <Text style={gstyles.title}>{"Califica nuestro servicio"}</Text>
      {loading ? (
        <LoadingAnimation message="Cargando empleados..." />
      ) : (
        <View style={styles.carouselContainer}>
          <View style={styles.navigationIcon}>
            {page > 0 && (
              <View style={styles.navigationIconShadow}>
                <TouchableOpacity onPress={() => setPage(page - 1)}>
                  <Icon source="chevron-left" size={60} />
                </TouchableOpacity>
              </View>
            )}
          </View>
          <View style={styles.gridContainer}>
            <Text style={gstyles.subtitle}>{"Selecciona a la persona que te atendió:"}</Text>
            {displayEmployees()}
          </View>
          <View style={styles.navigationIcon}>
            {page < Math.ceil(employees.length / (numRows * numCols)) - 1 && (
              <View style={styles.navigationIconShadow}>
                <TouchableOpacity onPress={() => setPage(page + 1)}>
                  <Icon source="chevron-right" size={60} />
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      )}
      <View style={gstyles.fixedLogoContainer}>
        {logoUrl && (
          <Image
            source={{ uri: encodeURI(logoUrl) }} // update path as needed
            style={gstyles.logoImage}
            resizeMode="contain"
            onError={() => setLogoUrl("")}
          />
        )}
      </View>
      <Modal visible={modalVisible} transparent={true} animationType="fade">
        <View style={gstyles.modalOverlay}>
          <View style={[styles.alertContainer, { backgroundColor: Colors.background }]}>
            <Text style={gstyles.subtitle}>{"Ingresa la contraseña:"}</Text>
            <TextInput
              mode="outlined"
              keyboardType="numeric"
              style={{ width: "90%", marginVertical: 5, fontSize: 25 }}
              value={inputPassword}
              onChangeText={(text) => {
                // Only allow up to 4 digits and numeric input
                const filtered = text.replace(/[^0-9]/g, "").slice(0, 4);
                setInputPassword(filtered);
              }}
            />
            <View style={{ flexDirection: "row" }}>
              <Button
                mode="contained"
                onPress={() => {
                  setModalVisible(false);
                }}
                style={[gstyles.generalButton, { marginTop: 10 }]}
                labelStyle={{ fontSize: width * 0.0175 }}
              >
                {"Cancelar"}
              </Button>
              <Button
                mode="contained"
                onPress={() => {
                  handlePasswordSubmit();
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
  );
};

const styles = StyleSheet.create({
  carouselContainer: {
    flex: 1, // take all available vertical space
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  gridContainer: {
    width: "85%",
    height: "90%",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    alignContent: "center",
    borderRadius: 15,
  },
  navigationIcon: {
    width: 60,
    height: 60,
    marginHorizontal: 10,
  },
  navigationIconShadow: {
    width: 60,
    height: 60, // Make it square for better shadow
    backgroundColor: Colors.background, // Visible background for shadow
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 8, // Android shadow
  },
  fixedSettingsContainer: {
    position: "absolute",
    top: 30,
    right: 30,
    zIndex: 10,
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
