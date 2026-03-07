import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { Button } from "react-native-paper";

const emojiMuyMalo = require("../../assets/MuyMalo.png");
const emojiMalo = require("../../assets/Malo.png");
const emojiRegular = require("../../assets/Regular.png");
const emojiBueno = require("../../assets/Bueno.png");
const emojiExcelente = require("../../assets/Excelente.png");
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
        <View style={styles.ratingItem}>
          <TouchableOpacity
            onPress={() => handleRating(1)}
            style={[styles.ratingButton, { backgroundColor: theme.background, borderColor: rgbToRgba(theme.text, 0.3) }]}
          >
            <Image source={emojiMuyMalo} style={styles.emojiImage} resizeMode="contain" />
          </TouchableOpacity>
          <Text style={[styles.ratingLabel, { color: Colors.rating1 }]}>Muy Malo</Text>
        </View>
        <View style={styles.ratingItem}>
          <TouchableOpacity
            onPress={() => handleRating(2)}
            style={[styles.ratingButton, { backgroundColor: theme.background, borderColor: rgbToRgba(theme.text, 0.3) }]}
          >
            <Image source={emojiMalo} style={styles.emojiImage} resizeMode="contain" />
          </TouchableOpacity>
          <Text style={[styles.ratingLabel, { color: Colors.rating2 }]}>Malo</Text>
        </View>
        <View style={styles.ratingItem}>
          <TouchableOpacity
            onPress={() => handleRating(3)}
            style={[styles.ratingButton, { backgroundColor: theme.background, borderColor: rgbToRgba(theme.text, 0.3) }]}
          >
            <Image source={emojiRegular} style={styles.emojiImage} resizeMode="contain" />
          </TouchableOpacity>
          <Text style={[styles.ratingLabel, { color: Colors.rating3 }]}>Regular</Text>
        </View>
        <View style={styles.ratingItem}>
          <TouchableOpacity
            onPress={() => handleRating(4)}
            style={[styles.ratingButton, { backgroundColor: theme.background, borderColor: rgbToRgba(theme.text, 0.3) }]}
          >
            <Image source={emojiBueno} style={styles.emojiImage} resizeMode="contain" />
          </TouchableOpacity>
          <Text style={[styles.ratingLabel, { color: Colors.rating4 }]}>Bueno</Text>
        </View>
        <View style={styles.ratingItem}>
          <TouchableOpacity
            onPress={() => handleRating(5)}
            style={[styles.ratingButton, { backgroundColor: theme.background, borderColor: rgbToRgba(theme.text, 0.3) }]}
          >
            <Image source={emojiExcelente} style={styles.emojiImage} resizeMode="contain" />
          </TouchableOpacity>
          <Text style={[styles.ratingLabel, { color: Colors.rating5 }]}>Excelente</Text>
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
  ratingItem: {
    alignItems: "center",
    marginHorizontal: width * 0.01,
  },
  ratingButton: {
    borderRadius: 200,
    shadowOpacity: 0.3,
    elevation: 15,
    borderWidth: 1,
  },
  emojiImage: {
    width: width * 0.085,
    height: width * 0.085,
  },
  ratingLabel: {
    fontSize: width * 0.018,
    fontWeight: "bold",
    marginTop: 2,
  },
});

export default RatingScreen;
