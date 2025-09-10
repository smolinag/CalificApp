import { View, Text, StyleSheet, Modal } from "react-native";
import { getGeneralStyles, width } from "../styles/GeneralStyle";
import { Button, Icon } from "react-native-paper";
import { useTheme } from "../context/ThemeContext";

const GeneralStatusModal: React.FC<{
  isVisible: boolean;
  status: string;
  message: string;
  onPress1: () => void;
  onPress2?: () => void;
  button1Text?: string;
  button2Text?: string;
  widthProportion?: number;
}> = ({
  isVisible,
  status,
  message,
  onPress1,
  onPress2,
  button1Text = "Aceptar",
  button2Text = "Cancelar",
  widthProportion = 0.225,
}) => {
  const { theme } = useTheme();
  const gstyles = getGeneralStyles(theme);

  const getStatusIcon = () => {
    switch (status) {
      case "success":
        return <Icon source={"check-circle-outline"} size={width * 0.05} color="green" />;
      case "error":
        return <Icon source={"close-circle-outline"} size={width * 0.05} color="red" />;
      case "warning":
        return <Icon source={"alert-circle-outline"} size={width * 0.05} color="orange" />;
      default:
        return null;
    }
  };

  return (
    <Modal visible={isVisible} transparent={true} animationType="fade">
      <View style={gstyles.modalOverlay}>
        <View style={[styles.alertContainer, { width: width * widthProportion, backgroundColor: theme.background }]}>
          {getStatusIcon()}
          <View style={{ marginVertical: 10, alignItems: "flex-start" }}>
            <Text style={gstyles.subtitle2}>{message}</Text>
          </View>

          <View style={{ flexDirection: "row", justifyContent: "center", width: "100%", alignContent: "center" }}>
            {onPress2 && (
              <Button
                mode="contained"
                onPress={() => {
                  onPress2();
                }}
                style={[gstyles.generalButton, { marginTop: 10, marginHorizontal: 5 }]}
                labelStyle={gstyles.generalButtonLabel}
              >
                {button2Text}
              </Button>
            )}
            <Button
              mode="contained"
              onPress={() => {
                onPress1();
              }}
              style={[gstyles.generalButton, { marginTop: 10, marginHorizontal: 5 }]}
              labelStyle={gstyles.generalButtonLabel}
            >
              {button1Text}
            </Button>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  alertContainer: {
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    textAlign: "center",
  },
});

export default GeneralStatusModal;
