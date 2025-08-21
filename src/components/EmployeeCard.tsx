import { useState } from "react";
import { RatingInfo } from "../models/RatingInfo";
import { ConfigProperties } from "../utils/ConfigProperties";
import { TouchableOpacity, View, Image, Text, StyleSheet } from "react-native";
import gstyles, { width } from "../styles/GeneralStyle";
import { Colors } from "../styles/Theme";

const NAME_LIMIT = 60;

const EmployeeCard: React.FC<{
  ratingInfo: RatingInfo;
  onPress?: () => void;
  imageSizeProportion?: number;
  isTouchable?: boolean;
}> = ({ ratingInfo, onPress, imageSizeProportion = 0.15, isTouchable = false }) => {
  const [imageError, setImageError] = useState(false);

  const finalUri = encodeURI(
    `${ConfigProperties.s3BucketUrl.replace(/\/$/, "")}/${ratingInfo.photoSource.replace(/^\//, "")}`
  );

  const displayEmployee = () => {
    return (
      <View style={[styles.employeeContainer, isTouchable && gstyles.shadowWrapper]}>
        <Image
          source={imageError ? require("../../assets/Unknown.jpg") : { uri: finalUri }}
          style={[styles.image, { width: width * imageSizeProportion, height: width * imageSizeProportion }]}
          onError={() => setImageError(true)}
        />
        <Text style={{ fontSize: imageSizeProportion * width * 0.1 }}>
          {ratingInfo.employeeName.slice(0, NAME_LIMIT)}
        </Text>
      </View>
    );
  };

  if (isTouchable) {
    return <TouchableOpacity onPress={onPress}>{displayEmployee()}</TouchableOpacity>;
  } else {
    return displayEmployee();
  }
};

const styles = StyleSheet.create({
  employeeContainer: {
    flexDirection: "column",
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: width * 0.012,
    backgroundColor: Colors.board,
    padding: width * 0.01,
    borderRadius: 10,
    marginVertical: width * 0.01,
  },
  image: {
    borderRadius: 8,
    marginBottom: 5,
  },
});

export default EmployeeCard;
