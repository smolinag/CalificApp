import { useEffect, useState, useRef } from "react";
import { TouchableOpacity, View, StyleSheet, FlatList, Animated } from "react-native";
import { Icon } from "react-native-paper";
import { Gesture, GestureDetector } from "react-native-gesture-handler";

import { RatingInfo } from "../models/RatingInfo";
import EmployeeCard from "./EmployeeCard";
import { useTheme } from "../context/ThemeContext";

const EmployeeCarousel: React.FC<{
  employees: RatingInfo[];
  onPress?: (arg: RatingInfo) => void;
}> = ({ employees, onPress }) => {
  const [page, setPage] = useState(0);
  const [numCols, setNumCols] = useState(0);
  const [numRows, setNumRows] = useState(0);

  const { theme } = useTheme();

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

  const slideAnim = useRef(new Animated.Value(0)).current;

  const animateSlide = (direction: "left" | "right") => {
    // Reset animation
    slideAnim.setValue(direction === "left" ? 1000 : -1000);

    // Animate to center
    Animated.spring(slideAnim, {
      toValue: 0,
      useNativeDriver: true,
      tension: 50,
      friction: 8,
    }).start();
  };

  const handlePageChange = (newPage: number) => {
    const direction = newPage > page ? "left" : "right";
    setPage(newPage);
    animateSlide(direction);
  };

  const totalPages = Math.ceil(employees.length / (numRows * numCols));
  const swipeGesture = Gesture.Pan()
    .runOnJS(true)
    .onEnd((event) => {
      if (event.translationX < -50 && page < totalPages - 1) {
        handlePageChange(page + 1);
      } else if (event.translationX > 50 && page > 0) {
        handlePageChange(page - 1);
      }
    });

  const displayEmployees = () => {
    return (
      <FlatList
        data={employees.slice(page * numRows * numCols, (page + 1) * numRows * numCols)}
        key={`grid-${numCols}`}
        keyExtractor={(item) => `${item.employeeName}`}
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
    <GestureDetector gesture={swipeGesture}>
      <View style={styles.carouselContainer}>
        <View style={styles.navigationIcon}>
          {page > 0 && (
            <TouchableOpacity onPress={() => handlePageChange(page - 1)}>
              <Icon source="chevron-left" size={60} color={theme.primary} />
            </TouchableOpacity>
          )}
        </View>
        <Animated.View style={[styles.gridContainer, { transform: [{ translateX: slideAnim }] }]}>
          {displayEmployees()}
        </Animated.View>
        <View style={styles.navigationIcon}>
          {page < Math.ceil(employees.length / (numRows * numCols)) - 1 && (
            <TouchableOpacity onPress={() => handlePageChange(page + 1)}>
              <Icon source="chevron-right" size={60} color={theme.primary} />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </GestureDetector>
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
