import React, { useEffect, useState } from "react";
import { FlatList, View, StyleSheet, Text, TouchableOpacity, Image } from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ParamListBase, useNavigation } from "@react-navigation/native";
import { Icon } from "react-native-paper";
import * as SecureStore from "expo-secure-store";

import { getEmployees } from "../queries/EmployeeQueries";
import EmployeeCard from "../components/EmployeeCard";
import gstyles, { width } from "../styles/GeneralStyle";
import { RatingInfo } from "../models/RatingInfo";
import { ConfigProperties } from "../utils/ConfigProperties";
import { Colors } from "../styles/Theme";

const NUM_ROWS = 2;
const NUM_COLS = 4;

const PhotoSelectionScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();
  const [employees, setEmployees] = useState<RatingInfo[]>([]);
  const [page, setPage] = useState(0);
  const [logoUrl, setLogoUrl] = useState<string>("");

  const fetchEmployees = async () => {
    const companyName = await SecureStore.getItemAsync("companyName");
    const logoUrl = `${ConfigProperties.s3BucketUrl.replace(/\/$/, "")}/${companyName}/logo.png`;
    setLogoUrl(logoUrl);
    const response = await getEmployees(companyName);
    if (response && response.data) {
      const employeeData: RatingInfo[] = response.data.map((employee: any) => ({
        employeeName: employee.employeeName,
        photoSource: employee.photoUrl,
        ratingStartedAt: undefined,
        companyLogoUrl: logoUrl,
      }));
      setEmployees(employeeData);
    } else {
      console.error("Failed to fetch employees");
    }
  };

  useEffect(() => {
    const checkConfiguration = async () => {
      const companyName = await SecureStore.getItemAsync("companyName");
      const deviceId = await SecureStore.getItemAsync("deviceId");
      if (!companyName || !deviceId) {
        navigation.navigate("Configuration");
      } else {
        await fetchEmployees();
      }
    };
    checkConfiguration();
  }, []);

  const displayEmployees = () => {
    return (
      <FlatList
        data={employees.slice(page * NUM_ROWS * NUM_COLS, (page + 1) * NUM_ROWS * NUM_COLS)}
        keyExtractor={(_, index) => index.toString()}
        key={NUM_COLS}
        numColumns={NUM_COLS}
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

  return (
    <View style={gstyles.container}>
      <Text style={gstyles.title}>{"Califica nuestro servicio"}</Text>
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
          {page < Math.ceil(employees.length / (NUM_ROWS * NUM_COLS)) - 1 && (
            <View style={styles.navigationIconShadow}>
              <TouchableOpacity onPress={() => setPage(page + 1)}>
                <Icon source="chevron-right" size={60} />
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
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
    borderRadius: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 8, // Android shadow
  },
});

export default PhotoSelectionScreen;
