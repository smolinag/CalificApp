import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { TextInput, Button } from "react-native-paper";
import * as SecureStore from "expo-secure-store";
import { ParamListBase, RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { getGeneralStyles, height, width } from "../styles/GeneralStyle";
import { RatingInfo } from "../models/RatingInfo";
import LoadingAnimation from "../components/LoadingAnimation";
import { getIconFromRating, rgbToRgba } from "../utils/Utils";
import { postRating } from "../queries/RatingQueries";
import GeneralStatusModal from "../components/GeneralStatusModal";
import { useTheme } from "../context/ThemeContext";
import GeneralTextInput from "../components/GeneralTextInput";

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
  const [raterPhone, setRaterPhone] = useState("");
  const [product, setProduct] = useState("");
  const [comments, setComments] = useState("");
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [ratingPostStatus, setRatingPostStatus] = useState("");

  const { theme } = useTheme();
  const gstyles = getGeneralStyles(theme);

  const handleSubmit = async () => {
    setLoading(true);
    ratingInfo.comments = comments;
    const companyName = await SecureStore.getItemAsync("companyName");
    const deviceId = await SecureStore.getItemAsync("deviceId");

    const response = await postRating({
      id: companyName,
      rating: ratingInfo.rating,
      comment: comments,
      product: product,
      employeeName: ratingInfo.employeeName,
      deviceId: deviceId,
      date: new Date().toISOString(),
      raterName: raterName,
      ratingTimeMs: new Date().getTime() - ratingInfo.ratingStartedAt!,
      raterPhone: raterPhone,
    });
    if (response.status !== 201) {
      console.error("Error posting rating:", response.statusText);
      setRatingPostStatus("error");
    } else {
      console.log("Rating posted successfully:", response.data);
      setRatingPostStatus("success");
    }

    setLoading(false);
    setModalVisible(true);
    setTimeout(() => {
      setModalVisible(false);
      navigation.navigate("Home");
    }, 5000); // 5 seconds to automatically close the modal
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
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={0} // adjust as needed for your header
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
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
            {loading ? (
              <LoadingAnimation message="Enviando calificación..." />
            ) : (
              <View style={styles.mainContainer}>
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
                <View style={{ flexDirection: "row", justifyContent: "space-between", width: "90%" }}>
                  <GeneralTextInput
                    onValueChange={(val) => setRaterName(val)}
                    label="Escribe tu nombre"
                    value={raterName}
                    styleProps={{ width: "47%", marginVertical: 3 }}
                  />
                  <GeneralTextInput
                    onValueChange={(val) => setRaterPhone(val)}
                    label="Escribe tu celular"
                    value={raterPhone}
                    styleProps={{ width: "47%", marginVertical: 3 }}
                    keyboardType="phone-pad"
                  />
                </View>
                <GeneralTextInput
                  onValueChange={(val) => setProduct(val)}
                  label="Escribe tu producto"
                  value={product}
                  styleProps={{ width: "90%", marginVertical: 3 }}
                />
                <GeneralTextInput
                  onValueChange={(val) => setComments(val)}
                  label="Escribe tu comentario aqui..."
                  value={comments}
                  styleProps={{ width: "90%", marginVertical: 3, height: height * 0.2 }}
                  numberOfLines={4}
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
            <GeneralStatusModal
              isVisible={modalVisible}
              status={ratingPostStatus === "success" ? "success" : "error"}
              message={
                ratingPostStatus === "success"
                  ? "Gracias por calificar nuestro servicio!"
                  : "Hubo un error al enviar tu calificación. Por favor, intenta de nuevo más tarde."
              }
              onPress1={handleFinish}
              button1Text="Continuar"
              widthProportion={0.4}
            />
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
      </TouchableWithoutFeedback>
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
