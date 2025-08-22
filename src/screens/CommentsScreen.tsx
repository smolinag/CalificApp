import React, { useState } from "react";
import { View, Text, StyleSheet, Modal, Image, ScrollView, KeyboardAvoidingView, Platform } from "react-native";
import { TextInput, Button, Icon } from "react-native-paper";
import * as SecureStore from "expo-secure-store";
import { ParamListBase, RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import gstyles, { width } from "../styles/GeneralStyle";
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
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={0} // adjust as needed for your header
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={gstyles.container}>
          {loading ? (
            <LoadingAnimation message="Enviando calificación..." />
          ) : (
            <View style={styles.mainContainer}>
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
              <View
                style={{
                  flexDirection: "column",
                  justifyContent: "space-between",
                  alignItems: "center",
                  width: "100%",
                }}
              >
                <Text style={gstyles.title}>{"¿Deseas dejar algún comentario?"}</Text>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  {getIconFromRating(ratingInfo.rating)}
                </View>
              </View>
              <TextInput
                mode="outlined"
                label="Escribe tu nombre"
                style={{ width: "90%", marginVertical: 5, fontSize: 25 }}
                value={raterName}
                onChangeText={setRaterName}
              />
              <TextInput
                mode="outlined"
                label="Escribe tu comentario aquí..."
                multiline
                numberOfLines={4}
                style={{ width: "90%", marginVertical: 5, height: 120, fontSize: 25 }}
                value={comments}
                onChangeText={setComments}
              />
              <Button
                mode="contained"
                onPress={() => {
                  handleSubmit();
                }}
                style={[gstyles.generalButton, { marginTop: 10 }]}
                labelStyle={{ fontSize: width * 0.0175 }}
              >
                {"Finalizar"}
              </Button>
            </View>
          )}

          <Modal visible={modalVisible} transparent={true} animationType="fade">
            <View style={gstyles.modalOverlay}>
              <View style={[styles.alertContainer, { backgroundColor: Colors.background }]}>
                <Icon
                  source={ratingPostStatus === "Success" ? "check-circle-outline" : "close-circle-outline"}
                  size={width * 0.055}
                  color={ratingPostStatus === "Success" ? "green" : "red"}
                />
                <Text style={gstyles.subtitle}>{"Gracias por calificar nuestro servicio!"}</Text>
                <Button
                  mode="contained"
                  onPress={() => {
                    handleFinish();
                  }}
                  style={[gstyles.generalButton, { marginTop: 10 }]}
                  labelStyle={{ fontSize: width * 0.0175 }}
                >
                  {"Continuar"}
                </Button>
              </View>
            </View>
          </Modal>
          <View style={gstyles.fixedLogoContainer}>
            {ratingInfo.companyLogoUrl && (
              <Image
                source={{ uri: encodeURI(ratingInfo.companyLogoUrl) }} // update path as needed
                style={gstyles.logoImage}
                resizeMode="contain"
              />
            )}
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
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
