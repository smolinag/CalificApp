import React, { useState } from "react";
import { View, Text, StyleSheet, Modal, Image } from "react-native";
import { TextInput, Button, Icon } from "react-native-paper";
import * as SecureStore from "expo-secure-store";
import { ParamListBase, RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import gstyles from "../styles/GeneralStyle";
import { RatingInfo } from "../models/RatingInfo";
import { Colors } from "../styles/Theme";
import LoadingAnimation from "../components/LoadingAnimation";
import { getIconFromRating } from "../utils/Utils";
import { postRating } from "../queries/RatingQueries";

type ParamList = {
  CommentsScreen: {
    ratingInfo: RatingInfo;
  };
};

const CommentsScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();
  const route = useRoute<RouteProp<ParamList, "CommentsScreen">>();
  const { ratingInfo } = route.params;

  const [raterName, setRaterName] = useState("");
  const [comments, setComments] = useState("");
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [ratingPostStatus, setRatingPostStatus] = useState("");

  const handleSubmit = async () => {
    setLoading(true);
    ratingInfo.comments = comments;
    const companyName = await SecureStore.getItemAsync("companyName");
    const deviceId = await SecureStore.getItemAsync("deviceId");

    const response = await postRating({
      id: companyName,
      rating: ratingInfo.rating,
      comment: comments,
      employeeName: ratingInfo.employeeName,
      deviceId: deviceId,
      date: new Date().toISOString(),
      raterName: raterName,
      ratingTimeMs: new Date().getTime() - ratingInfo.ratingStartedAt!,
    });
    if (response.status !== 201) {
      console.error("Error posting rating:", response.statusText);
      setRatingPostStatus("Error");
    } else {
      console.log("Rating posted successfully:", response.data);
      setRatingPostStatus("Success");
    }

    setLoading(false);
    setModalVisible(true);
    setTimeout(() => {
      setModalVisible(false);
      navigation.navigate("Home");
    }, 4000); // 4 seconds to automatically close the modal
  };

  const handleFinish = () => {
    setModalVisible(false);
    navigation.navigate("Home");
  };

  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <View style={gstyles.container}>
      {loading ? (
        <LoadingAnimation message="Enviando calificación..." />
      ) : (
        <View style={styles.mainContainer}>
          <View
            style={{ flexDirection: "column", justifyContent: "space-between", alignItems: "center", width: "100%" }}
          >
            <Text style={gstyles.title}>{"¿Deseas dejar algún comentario?"}</Text>
            <View style={{ flexDirection: "row", alignItems: "center", width: "100%" }}>
              <View style={{ flex: 1 }} />
              {getIconFromRating(ratingInfo.rating)}
              <View style={{ flex: 1, alignItems: "flex-end" }}>
                <Button
                  mode="contained"
                  onPress={handleBack}
                  style={{
                    marginRight: 20,
                    backgroundColor: Colors.background,
                    borderColor: "black",
                    borderWidth: 1,
                  }}
                  icon="arrow-left"
                  labelStyle={{ color: "black" }}
                >
                  {"Atrás"}
                </Button>
              </View>
            </View>
          </View>
          <TextInput
            mode="outlined"
            label="Escribe tu nombre"
            style={{ width: "90%", marginVertical: 5 }}
            value={raterName}
            onChangeText={setRaterName}
          />
          <TextInput
            mode="outlined"
            label="Escribe tu comentario aquí..."
            multiline
            numberOfLines={4}
            style={{ width: "90%", marginVertical: 5, height: 120 }}
            value={comments}
            onChangeText={setComments}
          />
          <Button
            mode="contained"
            onPress={() => {
              handleSubmit();
            }}
            style={{ marginTop: 10 }}
          >
            {"Finalizar"}
          </Button>
        </View>
      )}

      <Modal visible={modalVisible} transparent={true} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={[styles.alertContainer, { backgroundColor: Colors.background }]}>
            <Icon
              source={ratingPostStatus === "Success" ? "check-circle-outline" : "close-circle-outline"}
              size={34}
              color={ratingPostStatus === "Success" ? "green" : "red"}
            />
            <Text style={{ fontSize: 20, textAlign: "center" }}>{"Gracias por calificar nuestro servicio!"}</Text>
            <Button
              mode="contained"
              onPress={() => {
                handleFinish();
              }}
              style={{ marginTop: 10 }}
            >
              {"Ok"}
            </Button>
          </View>
        </View>
      </Modal>
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
  mainContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  alertContainer: {
    width: 300,
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    textAlign: "center",
  },
});

export default CommentsScreen;
