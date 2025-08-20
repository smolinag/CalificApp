import { useState } from "react";
import { RatingInfo } from "../models/RatingInfo";
import { ConfigProperties } from "../utils/ConfigProperties";
import { TouchableOpacity, View, Image, Text, StyleSheet } from "react-native";
import { width } from "../styles/GeneralStyle";
import { Colors } from "../styles/Theme";

const NAME_LIMIT = 60;

const EmployeeCard: React.FC<{ ratingInfo: RatingInfo; onPress?: () => void; imageSizeProportion?: number }> = ({
  ratingInfo,
  onPress,
  imageSizeProportion = 0.13,
}) => {
  const [imageError, setImageError] = useState(false);

  const finalUri = encodeURI(
    `${ConfigProperties.s3BucketUrl.replace(/\/$/, "")}/${ratingInfo.photoSource.replace(/^\//, "")}`
  );

  return (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.employeeContainer}>
        <Image
          source={imageError ? require("../../assets/Unknown.jpg") : { uri: finalUri }}
          style={[styles.image, { width: width * imageSizeProportion, height: width * imageSizeProportion }]}
          onError={() => setImageError(true)}
        />
        <Text style={{ fontSize: imageSizeProportion * width * 0.1 }}>
          {ratingInfo.employeeName.slice(0, NAME_LIMIT)}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  employeeContainer: {
    flexDirection: "column",
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 20,
    marginVertical: 2,
    backgroundColor: Colors.board,
    padding: 5,
    borderRadius: 10,
  },
  image: {
    margin: 4,
    borderRadius: 8,
  },
});

export default EmployeeCard;
