import React, { useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";
import { View, Text } from "react-native";
import gstyles, { width } from "../../styles/GeneralStyle";
import LoadingAnimation from "../../components/LoadingAnimation";
import { getEmployees } from "../../queries/EmployeeQueries";
import { EmployeeDto } from "../../models/EmployeeDto";
import { Button } from "react-native-paper";
import { ParamListBase, useFocusEffect, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import EmployeeCarousel from "../../components/EmployeeCarousel";
import { RatingInfo } from "../../models/RatingInfo";

const EmployeesScreen: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [employees, setEmployees] = useState<EmployeeDto[]>([]);

  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();

  useFocusEffect(
    React.useCallback(() => {
      fetchEmployees();
    }, [])
  );

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const companyName = await SecureStore.getItemAsync("companyName");
      const response = await getEmployees(companyName);
      if (response && response.data) {
        console.log("Employees fetched: " + response.data.length);
        setEmployees(response.data);
      }
    } catch (error) {
      console.error("Error fetching employees:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigation.goBack();
  };

  const handleEmployeeSelect = (employee: RatingInfo) => {
    const selEmployee: EmployeeDto | undefined = employees.find(
      (e) => e.employeeName === employee.employeeName && e.photoUrl === employee.photoUrl
    );
    if (selEmployee)
      navigation.navigate("Employee", { employee: selEmployee });
  };

  const handleCreateEmployee = () => {
    navigation.navigate("Employee", { employee: { employeeId: 0, employeeName: "", photoUrl: "", createdAt: "" } });
  };

  return (
    <View style={gstyles.container}>
      <Text style={[gstyles.title]}>{"Empleados"}</Text>
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
      {loading ? (
        <LoadingAnimation message="Cargando empleados..." />
      ) : (
        <View style={{ flex: 1, width: "100%", alignItems: "center" }}>
          <View style={gstyles.shadowWrapper}>
            <Button
              mode="contained"
              onPress={() => {
                handleCreateEmployee();
              }}
              style={[gstyles.generalButton]}
              labelStyle={{ fontSize: width * 0.0175 }}
              icon="plus"
            >
              {"Crear Empleado"}
            </Button>
          </View>
          <View style={{ height: "85%", width: "100%", alignItems: "center" }}>
            <EmployeeCarousel
              employees={employees.map((emp) => ({
                employeeName: emp.employeeName,
                photoUrl: emp.photoUrl,
                ratingStartedAt: undefined,
                companyLogoUrl: "",
              }))}
              onPress={(employee) => handleEmployeeSelect(employee)}
            />
          </View>
        </View>
      )}
    </View>
  );
};

export default EmployeesScreen;
