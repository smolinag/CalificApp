import { useEffect, useState } from "react";
import { RatingInfo } from "../models/RatingInfo";
import { TouchableOpacity, View, Image, Text, StyleSheet, FlatList } from "react-native";
import gstyles from "../styles/GeneralStyle";
import { Colors } from "../styles/Theme";
import { Icon } from "react-native-paper";
import EmployeeCard from "./EmployeeCard";

const EmployeeCarousel: React.FC<{
  employees: RatingInfo[];
  onPress?: (arg: RatingInfo) => void;
}> = ({ employees, onPress }) => {
  const [page, setPage] = useState(0);
  const [numCols, setNumCols] = useState(0);
  const [numRows, setNumRows] = useState(0);

  useEffect(() => {
    calculateRowsAndColumns(employees.length);
  }, [employees]);

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
              onPress(item);
            }}
            isTouchable={true}
          />
        )}
      />
    );
  };

  return (
    <View style={styles.carouselContainer}>
      <View style={styles.navigationIcon}>
        {page > 0 && (
          <View style={gstyles.roundButtonShadow}>
            <TouchableOpacity onPress={() => setPage(page - 1)}>
              <Icon source="chevron-left" size={60} />
            </TouchableOpacity>
          </View>
        )}
      </View>
      <View style={styles.gridContainer}>
        {displayEmployees()}
      </View>
      <View style={styles.navigationIcon}>
        {page < Math.ceil(employees.length / (numRows * numCols)) - 1 && (
          <View style={gstyles.roundButtonShadow}>
            <TouchableOpacity onPress={() => setPage(page + 1)}>
              <Icon source="chevron-right" size={60} />
            </TouchableOpacity>
          </View>
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
    width: "100%",
  },
  gridContainer: {
    width: "80%",
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
});

export default EmployeeCarousel;
