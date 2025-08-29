import React, { useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";
import * as ImagePicker from "expo-image-picker";
import { View, Text, Image, TouchableOpacity } from "react-native";
import gstyles, { height, width } from "../../styles/GeneralStyle";
import LoadingAnimation from "../../components/LoadingAnimation";
import { Button, TextInput } from "react-native-paper";
import { ParamListBase, RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { EmployeeDto } from "../../models/EmployeeDto";
import { ConfigProperties } from "../../utils/ConfigProperties";
import { createEmployee, deleteEmployee } from "../../queries/EmployeeQueries";
import GeneralStatusModal from "../../components/GeneralStatusModal";

type ParamList = {
  EmployeeScreen: {
    employee: EmployeeDto;
  };
};

const EmployeeScreen: React.FC = () => {
  const route = useRoute<RouteProp<ParamList, "EmployeeScreen">>();
  const { employee } = route.params;

  const [loading, setLoading] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [employeeName, setEmployeeName] = useState<string | null>(employee.employeeName);
  const [imageUrl, setImageUrl] = useState<string | null>(
    employee.photoUrl !== ""
      ? `${ConfigProperties.s3BucketUrl.replace(/\/$/, "")}/${employee.photoUrl.replace(/^\//, "")}`
      : null
  );
  const [selectedImage, setSelectedImage] = useState<ImagePicker.ImagePickerAsset | null>(null);
  const [actionStatus, setActionStatus] = useState<string | null>(null);

  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();

  useEffect(() => {}, []);

  const handlePickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: "images",
      quality: 1,
      allowsEditing: true,
      base64: true, 
    });
    if (!result.canceled && result.assets && result.assets.length > 0) {
      setImageUrl(result.assets[0].uri);
      setSelectedImage(result.assets[0]);
    }
  };

  const handleBack = () => {
    navigation.goBack();
  };

  const extractFileExtension = (uri: string): string => {
    const match = uri.match(/\.([0-9a-z]+)$/i);
    console.log("Extracted file extension:", match ? match[1] : "none");
    return match ? match[1] : "";
  };

  const handleAccept = async () => {
    if (employee.employeeName) {
      // Update existing employee
    } else {
      // Create new employee
      setLoading(true);
      console.log(selectedImage)
      try {
        const companyName = await SecureStore.getItemAsync("companyName");
        const newEmployee: EmployeeDto = {
          id: companyName,
          rangeId: "", // Backend should set this
          employeeName: employeeName,
          fileContent: selectedImage?.base64,
          contentType: extractFileExtension(selectedImage?.uri || ""),
          photoUrl: "", // Backend should set this
          createdAt: new Date().toISOString(),
        };
        const response = await createEmployee(newEmployee);
        if (response && response.status === 201) {
          setActionStatus("createSuccess");
        } else {
          setActionStatus("createError");
        }
      } catch (error) {
        console.error("Error creating employee:", error);
        setActionStatus("createError");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleDelete = () => {
    setActionStatus("deleteWarning");
  }

  const handleDeleteAccept = async () => {
    if (employee.id && employee.rangeId) {
      setLoading
      try {
        const response = await deleteEmployee(employee.id, employee.rangeId);
        if (response && response.status === 200) {
          setActionStatus("deleteSuccess");
        } else {
          setActionStatus("deleteError");
        }
      } catch (error) {
        console.error("Error deleting employee:", error);
        setActionStatus("deleteError");
      } finally {
        setLoading(false);
      }
    }
  };

  const getStatusMessage = () => {
    switch (actionStatus) {
      case "createSuccess":
        return "Empleado creado exitosamente.";
      case "createError":
        return "Error al crear el empleado.";
      case "deleteSuccess":
        return "Empleado eliminado exitosamente.";
      case "deleteError":
        return "Error al eliminar el empleado.";
      case "deleteWarning":
        return "¿Está seguro de que desea eliminar este empleado?. Las calificaciones asociadas NO se eliminarán.";
      default:
        return null;
    }
  };

  return (
    <View style={gstyles.container}>
      <Text style={gstyles.title}>{employee.employeeName ? "Editar Empleado" : "Crear Empleado"}</Text>
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
      {loading ? (
        <LoadingAnimation message="Cargando empleado..." />
      ) : (
        <View style={{ alignItems: "center", width: "100%", height: "80%" }}>
          <TextInput
            mode="outlined"
            label="Nombre"
            style={{ width: "80%", fontSize: gstyles.textInput.fontSize }}
            value={employeeName}
            onChangeText={setEmployeeName}
          />
          {employee.createdAt && (
            <Text style={[gstyles.subtitle2, { marginTop: 10, alignSelf: "flex-start", marginLeft: "10%" }]}>
              {"Fecha de creación: " +
                new Date(employee.createdAt).toLocaleDateString("es-ES", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
            </Text>
          )}
          <View style={{ alignItems: "center" }}>
            <Text style={[gstyles.subtitle, { marginVertical: "0.5%" }]}>Foto</Text>
            <View style={gstyles.shadowWrapper}>
              <TouchableOpacity onPress={handlePickImage}>
                <Image
                  source={imageUrl === null || imageError ? require("../../../assets/Unknown.jpg") : { uri: imageUrl }}
                  style={{ width: height * 0.35, height: height * 0.35, borderRadius: 10 }}
                  resizeMode="cover"
                  onError={() => setImageError(true)}
                />
              </TouchableOpacity>
            </View>
            <View style={{ flexDirection: "row", justifyContent: "space-between", width: "40%", marginTop: "1%" }}>
              {employee.employeeName && (
                <View style={gstyles.shadowWrapper}>
                  <Button
                    mode="contained"
                    onPress={() => {
                      handleDelete();
                    }}
                    style={[gstyles.generalButton]}
                    labelStyle={{ fontSize: width * 0.0175 }}
                    icon="delete"
                  >
                    {"Eliminar"}
                  </Button>
                </View>
              )}
              <View style={gstyles.shadowWrapper}>
                <Button
                  mode="contained"
                  onPress={() => {
                    handleAccept();
                  }}
                  style={[gstyles.generalButton]}
                  labelStyle={{ fontSize: width * 0.0175 }}
                  disabled={employeeName === null || employeeName.trim() === ""}
                >
                  {employee.employeeName ? "Editar" : "Crear"}
                </Button>
              </View>
            </View>
          </View>
        </View>
      )}
      <GeneralStatusModal
        isVisible={actionStatus !== null}
        message={getStatusMessage() || ""}
        button1Text="Aceptar"
        onPress1={() => {
          if (actionStatus === "createSuccess" || actionStatus === "deleteSuccess") {
            navigation.goBack();
          } else if(actionStatus === "deleteWarning"){
            handleDeleteAccept();
          }else {
            setActionStatus(null);
          }
        }}
        status={actionStatus === "deleteWarning" ? "warning" : actionStatus?.includes("Error") ? "error" : "success"}
      />
    </View>
  );
};

export default EmployeeScreen;
