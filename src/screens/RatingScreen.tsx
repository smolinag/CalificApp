import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { Button, Icon } from "react-native-paper";
import gstyles, { height, width } from "../styles/GeneralStyle";
import { RatingInfo } from "../models/RatingInfo";
import { ParamListBase, RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Colors } from "../styles/Theme";
import { ConfigProperties } from "../utils/ConfigProperties";
import EmployeeCard from "../components/EmployeeCard";

type ParamList = {
  RatingScreen: {
    ratingInfo: RatingInfo;
  };
};

const RatingScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();
  const route = useRoute<RouteProp<ParamList, "RatingScreen">>();
  const { ratingInfo } = route.params;

  const handleRating = (value: number) => {
    ratingInfo.rating = value;
    navigation.navigate("Comments", { ratingInfo });
  };

  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <View style={gstyles.container}>
      <View style={styles.employeeContainer}>
        <Text style={gstyles.title}>{"Califica el servicio prestado por:"}</Text>
        <View style={{ flexDirection: "row", alignItems: "center", width: "100%", position: "relative" }}>
          <View style={{ flex: 1, alignItems: "center" }}>
            <EmployeeCard ratingInfo={ratingInfo} imageSizeProportion={0.2} />
          </View>
          <Button
            mode="contained"
            onPress={handleBack}
            icon="arrow-left"
            style={{
              position: "absolute",
              top: 0,
              right: 0,
              marginRight: 20,
              backgroundColor: Colors.background,
              borderColor: "black",
              borderWidth: 1,
            }}
            labelStyle={{ color: "black" }}
          >
            {"Atrás"}
          </Button>
        </View>
      </View>
      <View style={styles.ratingScaleContainer}>
        <TouchableOpacity onPress={() => handleRating(1)} style={{ marginHorizontal: 5 }}>
          <Icon source="emoticon-angry" size={width * 0.075} color={Colors.rating1} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleRating(2)} style={{ marginHorizontal: 5 }}>
          <Icon source="emoticon-sad" size={width * 0.075} color={Colors.rating2} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleRating(3)} style={{ marginHorizontal: 5 }}>
          <Icon source="emoticon-neutral" size={width * 0.075} color={Colors.rating3} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleRating(4)} style={{ marginHorizontal: 5 }}>
          <Icon source="emoticon-happy" size={width * 0.075} color={Colors.rating4} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleRating(5)} style={{ marginHorizontal: 5 }}>
          <Icon source="emoticon-excited" size={width * 0.075} color={Colors.rating5} />
        </TouchableOpacity>
      </View>
      <View style={gstyles.fixedLogoContainer}>
        {ratingInfo.companyLogoUrl && (
          <Image
            source={{ uri: encodeURI(ratingInfo.companyLogoUrl) }} // update path as needed
            style={{ width: 80, height: 80 }}
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
});

export default RatingScreen;
