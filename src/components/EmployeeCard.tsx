import { useState } from "react";
import { RatingInfo } from "../models/RatingInfo";
import { ConfigProperties } from "../utils/ConfigProperties";
import { TouchableOpacity, View, Image, Text, StyleSheet } from "react-native";
import { height, width } from "../styles/GeneralStyle";
import { useTheme } from "../context/ThemeContext";
import { rgbToRgba } from "../utils/Utils";

const NAME_LIMIT = 28;

const EmployeeCard: React.FC<{
  ratingInfo: RatingInfo;
  onPress?: () => void;
  imageSizeProportion?: number;
  isTouchable?: boolean;
}> = ({ ratingInfo, onPress, imageSizeProportion = 0.225, isTouchable = false }) => {
  const [imageError, setImageError] = useState(false);

  const { theme } = useTheme();

  const finalUri = encodeURI(
    `${ConfigProperties.s3BucketUrl.replace(/\/$/, "")}/${ratingInfo.photoUrl.replace(/^\//, "")}${
      ratingInfo.version ? "?v=" + ratingInfo.version : ""
    }`
  );

  const displayEmployee = () => {
    return (
      <View style={[styles.employeeContainer, { backgroundColor: rgbToRgba(theme.primary, 0.2) }]}>
        <Image
          source={imageError ? require("../../assets/Unknown.jpg") : { uri: finalUri }}
          style={[styles.image, { width: height * imageSizeProportion, height: height * imageSizeProportion }]}
          onError={() => setImageError(true)}
        />
        <Text style={{ fontSize: imageSizeProportion * height * 0.11, color: theme.text }}>
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
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: width * 0.012,
    padding: height * 0.02,
    borderRadius: 10,
    marginVertical: width * 0.01,
  },
  image: {
    borderRadius: 8,
    marginBottom: 5,
  },
});

export default EmployeeCard;
