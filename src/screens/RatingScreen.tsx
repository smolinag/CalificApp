import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { Button, Icon } from "react-native-paper";
import { getGeneralStyles, width } from "../styles/GeneralStyle";
import { RatingInfo } from "../models/RatingInfo";
import { ParamListBase, RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Colors } from "../styles/Theme";
import EmployeeCard from "../components/EmployeeCard";
import { useTheme } from "../context/ThemeContext";
import { rgbToRgba } from "../utils/Utils";

type ParamList = {
  RatingScreen: {
    ratingInfo: RatingInfo;
  };
};

const RatingScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();
  const route = useRoute<RouteProp<ParamList, "RatingScreen">>();
  const { ratingInfo } = route.params;

  const { theme, logoUrl } = useTheme();
  const gstyles = getGeneralStyles(theme);

  const handleRating = (value: number) => {
    ratingInfo.rating = value;
    navigation.navigate("Comments", { ratingInfo });
  };

  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <View style={gstyles.container}>
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
      <View style={styles.employeeContainer}>
        <Text style={gstyles.title}>{"Califica el servicio prestado por:"}</Text>
        <View style={{ flexDirection: "row", alignItems: "center", width: "100%" }}>
          <View style={{ flex: 1, alignItems: "center" }}>
            <EmployeeCard ratingInfo={ratingInfo} imageSizeProportion={0.3} />
          </View>
        </View>
      </View>
      <View style={styles.ratingScaleContainer}>
        <TouchableOpacity
          onPress={() => handleRating(1)}
          style={[styles.ratingButton, { backgroundColor: theme.background, borderColor: rgbToRgba(theme.text, 0.3) }]}
        >
          <Icon source="emoticon-angry" size={width * 0.085} color={Colors.rating1} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => handleRating(2)}
          style={[styles.ratingButton, { backgroundColor: theme.background, borderColor: rgbToRgba(theme.text, 0.3) }]}
        >
          <Icon source="emoticon-sad" size={width * 0.085} color={Colors.rating2} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => handleRating(3)}
          style={[styles.ratingButton, { backgroundColor: theme.background, borderColor: rgbToRgba(theme.text, 0.3) }]}
        >
          <Icon source="emoticon-neutral" size={width * 0.085} color={Colors.rating3} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => handleRating(4)}
          style={[styles.ratingButton, { backgroundColor: theme.background, borderColor: rgbToRgba(theme.text, 0.3) }]}
        >
          <Icon source="emoticon-happy" size={width * 0.085} color={Colors.rating4} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => handleRating(5)}
          style={[styles.ratingButton, { backgroundColor: theme.background, borderColor: rgbToRgba(theme.text, 0.3) }]}
        >
          <Icon source="emoticon-excited" size={width * 0.085} color={Colors.rating5} />
        </TouchableOpacity>
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
    </View>
  );
};

const styles = StyleSheet.create({
  employeeContainer: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  ratingScaleContainer: {
    flexDirection: "row",
    marginTop: 10,
  },
  ratingButton: {
    marginHorizontal: width * 0.01,
    borderRadius: 200, // Optional: make it round
    shadowOpacity: 0.3,
    elevation: 15, // Increase elevation for Android
    borderWidth: 1,
  },
});

export default RatingScreen;
