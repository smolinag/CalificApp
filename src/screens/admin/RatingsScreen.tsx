import React, { useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import { getRatings } from "../../queries/RatingQueries";
import { RatingDto } from "../../models/RatingDto";
import gstyles, { height, width } from "../../styles/GeneralStyle";
import { View, Text, FlatList, TouchableOpacity, Modal, StyleSheet } from "react-native";
import LoadingAnimation from "../../components/LoadingAnimation";
import { getEmployees } from "../../queries/EmployeeQueries";
import { PickerDto } from "../../models/PickerDto";
import { Button, Icon } from "react-native-paper";
import {
  formatLocalDateTime,
  getColorFromRating,
  getIconFromRating,
  getMonthsForDropdown,
  getYearsForDropdown,
} from "../../utils/Utils";
import { Colors } from "../../styles/Theme";
import { Dropdown } from "react-native-element-dropdown";
import { RatingInfo } from "../../models/RatingInfo";
import { ParamListBase, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

type SortField = "createdAt" | "employeeName" | "rating";
type SortOrder = "asc" | "desc";

const RatingsScreen: React.FC = () => {
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [month, setMonth] = useState<number>(new Date().getMonth() + 1);
  const [selectedEmployee, setSelectedEmployee] = useState<string | number>("Todos");
  const [ratings, setRatings] = useState<RatingDto[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [employeePickerItems, setEmployeePickerItems] = useState<PickerDto[]>([]);
  const [sortField, setSortField] = useState<SortField>("createdAt");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [selectedComment, setSelectedComment] = useState<RatingDto | null>(null);
  const [filteredRatings, setFilteredRatings] = useState<RatingDto[]>([]);
  const [employees, setEmployees] = useState<RatingInfo[]>([]);
  const [bestEmployee, setBestEmployee] = useState<RatingInfo | null>(null);
  const [worstEmployee, setWorstEmployee] = useState<RatingInfo | null>(null);

  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();

  const fetchRatings = async () => {
    try {
      setLoading(true);
      console.log("Fetching ratings for:", { year, month });
      const companyName = await SecureStore.getItemAsync("companyName");
      const response = await getRatings(companyName, year, month);
      if (response) {
        setRatings(response.data);
        const filtRatings =
          selectedEmployee === "Todos"
            ? response.data
            : response.data.filter((r) => r.employeeName === selectedEmployee);
        setFilteredRatings(filtRatings);
        getBestAndWorstEmployee(filtRatings);
      }
    } catch (error) {
      console.error("Error fetching ratings:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchEmployees = async () => {
    try {
      const companyName = await SecureStore.getItemAsync("companyName");
      const response = await getEmployees(companyName);
      if (response && response.data) {
        console.log("Employees fetched:", response.data);
        let employeeList = [{ label: "Todos", value: "Todos" }];
        employeeList = employeeList.concat(
          response.data.map((emp: any) => ({ label: emp.employeeName, value: emp.employeeName }))
        );
        setEmployeePickerItems(employeeList);
        setEmployees(response.data);
      }
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      await fetchEmployees();
    };
    loadData();
  }, []);

  useEffect(() => {
    if (employees.length > 0) {
      fetchRatings();
    }
  }, [year, month, employees]);

  const sortRatings = (data: RatingDto[]) => {
    return [...data].sort((a, b) => {
      let valA = a[sortField];
      let valB = b[sortField];
      if (sortField === "createdAt") {
        valA = new Date(valA).getTime();
        valB = new Date(valB).getTime();
      }
      if (valA < valB) return sortOrder === "asc" ? -1 : 1;
      if (valA > valB) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const renderSortIcon = (field: SortField) => {
    if (sortField !== field) return <Icon source="swap-vertical" size={18} />;
    return <Icon source={sortOrder === "asc" ? "arrow-up" : "arrow-down"} size={18} />;
  };

  const handleEmployeeChange = (value: string | number) => {
    setSelectedEmployee(value);
    setFilteredRatings(value === "Todos" ? ratings : ratings.filter((r) => r.employeeName === value));
  };

  const handleCloseModal = () => {
    setSelectedComment(null);
  };

  const getAveraqeRating = (): string => {
    if (filteredRatings.length === 0) return "0";
    const total = filteredRatings.reduce((sum, r) => sum + r.rating, 0);
    return (total / filteredRatings.length).toFixed(2);
  };

  const getBestAndWorstEmployee = (ratings: RatingDto[]): RatingInfo => {
    if (ratings.length === 0) return null;
    const employeeRatings: { [key: string]: { total: number; count: number } } = {};
    ratings.forEach((r) => {
      if (!employeeRatings[r.employeeName]) {
        employeeRatings[r.employeeName] = { total: 0, count: 0 };
      }
      employeeRatings[r.employeeName].total += r.rating;
      employeeRatings[r.employeeName].count += 1;
    });
    let bestEmployee = null;
    let bestAverage = 0;
    let worstEmployee = null;
    let worstAverage = Infinity;
    for (const emp in employeeRatings) {
      const avg = employeeRatings[emp].total / employeeRatings[emp].count;
      if (avg > bestAverage) {
        bestAverage = avg;
        bestEmployee = emp;
      }
      if (avg < worstAverage) {
        worstAverage = avg;
        worstEmployee = emp;
      }
    }
    console.log("Best employee:", bestEmployee, "with average rating:", bestAverage);
    console.log("Worst employee:", worstEmployee, "with average rating:", worstAverage);
    let bestEmp = employees.find((e) => e.employeeName === bestEmployee);
    let worstEmp = employees.find((e) => e.employeeName === worstEmployee);
    bestEmp.rating = bestAverage;
    worstEmp.rating = worstAverage;
    setWorstEmployee(worstEmp);
    setBestEmployee(bestEmp);
  };

  const handleBack = () => {
    navigation.goBack();
  };

  const downloadRatingsCsv = async(ratings: RatingDto[], filename = "ratings.csv") => {
    const headers = [
      "ID",
      "Rating",
      "Comment",
      "Employee Name",
      "Device ID",
      "Date",
      "Rater Name",
      "Rating Time (ms)",
      "Created At",
    ];

    const rows = ratings.map((r) => [
      r.id,
      r.rating,
      r.comment,
      r.employeeName,
      r.deviceId,
      r.date,
      r.raterName,
      r.ratingTimeMs ?? "",
      r.createdAt ?? "",
    ]);

    const escape = (val: unknown) => {
      if (val === null || val === undefined) return "";
      const str = String(val);
      return /[",\r\n]/.test(str) ? `"${str.replace(/"/g, '""')}"` : str;
    };

    const csv = [headers, ...rows].map((row) => row.map(escape).join(",")).join("\r\n");

    // Write file to app's cache dir
    const fileUri = FileSystem.cacheDirectory + filename;
    await FileSystem.writeAsStringAsync(fileUri, "\uFEFF" + csv, {
      encoding: FileSystem.EncodingType.UTF8,
    });

    // Share using system share dialog
    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(fileUri);
    } else {
      alert("Sharing not available on this device");
    }
  };

  const handleDownload = () => {
    downloadRatingsCsv(filteredRatings, `ratings_${year}_${String(month).padStart(2, "0")}_.csv`);
  };

  const renderRatingsTable = () => {
    const sortedRatings = sortRatings(filteredRatings);

    return (
      <View style={{ flex: 1, width: "100%", padding: 10 }}>
        <View style={{ flexDirection: "row", borderBottomWidth: 1, borderColor: "#ccc", paddingBottom: 5 }}>
          <TouchableOpacity
            style={{ flex: 2, flexDirection: "row", alignItems: "center" }}
            onPress={() => handleSort("createdAt")}
          >
            <Text style={[gstyles.text, { fontWeight: "bold" }]}>Fecha</Text>
            {renderSortIcon("createdAt")}
          </TouchableOpacity>
          <TouchableOpacity
            style={{ flex: 2, flexDirection: "row", alignItems: "center" }}
            onPress={() => handleSort("employeeName")}
          >
            <Text style={[gstyles.text, { fontWeight: "bold" }]}>Empleado</Text>
            {renderSortIcon("employeeName")}
          </TouchableOpacity>
          <TouchableOpacity
            style={{ flex: 1, flexDirection: "row", alignItems: "center" }}
            onPress={() => handleSort("rating")}
          >
            <Text style={[gstyles.text, { fontWeight: "bold" }]}>Rating</Text>
            {renderSortIcon("rating")}
          </TouchableOpacity>
          <Text style={[gstyles.text, { flex: 1, fontWeight: "bold" }]}>Comentario</Text>
        </View>
        <FlatList
          data={sortedRatings}
          keyExtractor={(_, index) => index.toString()}
          style={{ flex: 1 }}
          contentContainerStyle={{ flexGrow: 1 }}
          renderItem={({ item }) => (
            <View
              style={{
                flexDirection: "row",
                borderBottomWidth: 1,
                borderColor: "#eee",
                paddingVertical: 5,
              }}
            >
              <Text style={[gstyles.text, { flex: 2 }]}>{formatLocalDateTime(item.createdAt)}</Text>
              <Text style={[gstyles.text, { flex: 2 }]}>{item.employeeName}</Text>
              <View style={{ flex: 1, alignItems: "center" }}>{getIconFromRating(item.rating, 0.04)}</View>
              {item.comment ? (
                <TouchableOpacity style={{ flex: 1, alignItems: "center" }} onPress={() => setSelectedComment(item)}>
                  <Icon source="comment" size={height * 0.04} />
                </TouchableOpacity>
              ) : (
                <Text style={[gstyles.text, { flex: 1, textAlign: "center" }]}>{item.comment || "-"}</Text>
              )}
            </View>
          )}
          ListEmptyComponent={
            <Text style={{ textAlign: "center", marginTop: 20 }}>No hay calificaciones para mostrar.</Text>
          }
        />
      </View>
    );
  };

  return (
    <View style={gstyles.container}>
      {loading ? (
        <LoadingAnimation message="Cargando calificaciones..." />
      ) : (
        <View style={{ flex: 1, width: "100%", flexDirection: "column", alignItems: "center" }}>
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
          <Text style={gstyles.title}>{"Calificaciones recibidas"}</Text>
          <View style={{ flexDirection: "row" }}>
            <View style={styles.navigationIcon}>
              <TouchableOpacity onPress={() => handleDownload()}>
                <Icon source="file-download-outline" size={30} />
              </TouchableOpacity>
            </View>
            <View style={{ width: "50%", flexDirection: "row", justifyContent: "space-between", marginBottom: "2%" }}>
              <View style={{ width: "20%", marginHorizontal: 20 }}>
                <Text style={gstyles.subtitle}>Año:</Text>
                <Dropdown
                  data={getYearsForDropdown().map((yr) => ({ label: yr.label, value: yr.value }))}
                  labelField="label"
                  valueField="value"
                  autoScroll={false}
                  value={getYearsForDropdown().find((item) => item.value === year)}
                  onChange={(item) => setYear(item.value)}
                  placeholder="Año"
                  selectedTextStyle={gstyles.text}
                  maxHeight={300}
                  itemTextStyle={gstyles.text}
                />
              </View>
              <View style={{ width: "28%", marginHorizontal: 20 }}>
                <Text style={gstyles.subtitle}>Mes:</Text>
                <Dropdown
                  data={getMonthsForDropdown().map((mn) => ({ label: mn.label, value: mn.value }))}
                  labelField="label"
                  valueField="value"
                  value={getMonthsForDropdown().find((item) => item.value === month)}
                  onChange={(item) => setMonth(item.value)}
                  placeholder="Mes"
                  selectedTextStyle={gstyles.text}
                  maxHeight={120}
                  containerStyle={{ height: height * 0.6 }}
                  itemTextStyle={gstyles.text}
                />
              </View>
              <View style={{ width: "35%", marginHorizontal: 20 }}>
                <Text style={gstyles.subtitle}>Empleado:</Text>
                <Dropdown
                  data={employeePickerItems.map((e) => ({ label: e.label, value: e.value }))}
                  labelField="label"
                  valueField="value"
                  value={employeePickerItems.find((item) => item.value === selectedEmployee)}
                  onChange={(item) => handleEmployeeChange(item.value)}
                  placeholder="Mes"
                  selectedTextStyle={gstyles.text}
                  maxHeight={200}
                  containerStyle={{ height: height * 0.6 }}
                  itemTextStyle={gstyles.text}
                />
              </View>
            </View>
          </View>
          <View
            style={{ flex: 1, width: "100%", flexDirection: "row", marginBottom: 20, justifyContent: "space-between" }}
          >
            <View
              style={{
                flexDirection: "column",
                width: "25%",
                alignContent: "center",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <View style={styles.cardContainer}>
                <Text style={gstyles.subtitle2}>Promedio</Text>
                <Text
                  style={[
                    gstyles.subtitle,
                    { fontWeight: "bold", color: getColorFromRating(Math.round(Number(getAveraqeRating()))) },
                  ]}
                >
                  {getAveraqeRating()}
                </Text>
              </View>
              <View style={styles.cardContainer}>
                <Text style={gstyles.subtitle2}>Calificaciones</Text>
                <Text style={gstyles.subtitle}>{filteredRatings.length}</Text>
              </View>
              <View style={styles.cardContainer}>
                <Text style={gstyles.subtitle2}>Mejor Promedio</Text>
                {bestEmployee == null ? (
                  <Text style={gstyles.subtitle}>-</Text>
                ) : (
                  <View style={{ alignItems: "center" }}>
                    <Text
                      style={[
                        gstyles.subtitle,
                        { fontWeight: "bold", color: getColorFromRating(Math.round(bestEmployee.rating)) },
                      ]}
                    >
                      {bestEmployee.rating.toFixed(2)}
                    </Text>
                    <Text style={gstyles.text}>{bestEmployee.employeeName}</Text>
                  </View>
                )}
              </View>
              <View style={styles.cardContainer}>
                <Text style={gstyles.subtitle2}>Peor Promedio</Text>
                {worstEmployee == null ? (
                  <Text style={gstyles.subtitle}>-</Text>
                ) : (
                  <View style={{ alignItems: "center" }}>
                    <Text
                      style={[
                        gstyles.subtitle,
                        { fontWeight: "bold", color: getColorFromRating(Math.round(worstEmployee.rating)) },
                      ]}
                    >
                      {worstEmployee.rating.toFixed(2)}
                    </Text>
                    <Text style={gstyles.text}>{worstEmployee.employeeName}</Text>
                  </View>
                )}
              </View>
            </View>
            <View style={{ flexDirection: "column", width: "75%" }}>{renderRatingsTable()}</View>
          </View>
        </View>
      )}
      <Modal visible={selectedComment !== null} transparent={true} animationType="fade">
        <View style={gstyles.modalOverlay}>
          <View style={[styles.alertContainer, { backgroundColor: Colors.background }]}>
            <Icon source={"comment-outline"} size={width * 0.035} />
            <View style={{ marginVertical: 10, alignItems: "flex-start", width: "100%" }}>
              <Text style={gstyles.text}>
                {"Fecha: " + (selectedComment != null && formatLocalDateTime(selectedComment.createdAt))}
              </Text>
              <Text style={gstyles.text}>
                {"Empleado: " + (selectedComment != null && selectedComment.employeeName)}
              </Text>
              <Text style={gstyles.text}>{"Comentario: " + (selectedComment != null && selectedComment.comment)}</Text>
              <Text style={gstyles.text}>{"Calificación: " + (selectedComment != null && selectedComment.rating)}</Text>
              <Text style={gstyles.text}>
                {"Calificador: " + (selectedComment != null && selectedComment.raterName)}
              </Text>
              <Text style={gstyles.text}>
                {"Tiempo de calificación (s): " + (selectedComment != null && selectedComment.ratingTimeMs / 1000)}
              </Text>
            </View>

            <Button
              mode="contained"
              onPress={() => {
                handleCloseModal();
              }}
              style={[gstyles.generalButton, { marginTop: 10, alignSelf: "center" }]}
              labelStyle={{ fontSize: width * 0.0175 }}
            >
              {"Aceptar"}
            </Button>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  alertContainer: {
    width: width * 0.4,
    padding: 25,
    borderRadius: 10,
    alignItems: "center",
  },
  cardContainer: {
    marginVertical: "2%",
    borderWidth: 1,
    borderColor: "#ccc",
    paddingVertical: height * 0.01,
    width: "80%",
    borderRadius: 10,
    alignItems: "center",
  },
  navigationIcon: {
    width: 40,
    height: 40,
    marginHorizontal: 10,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
    backgroundColor: Colors.background,
  },
});

export default RatingsScreen;
