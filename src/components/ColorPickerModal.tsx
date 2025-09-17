import { View, StyleSheet, Modal, Text, Touchable, TouchableWithoutFeedback } from "react-native";
import { useSharedValue } from "react-native-reanimated";
import type { ColorFormatsObject } from "reanimated-color-picker";
import ColorPicker, { HueSlider, Panel1, PreviewText } from "reanimated-color-picker";

import { getGeneralStyles, height } from "../styles/GeneralStyle";
import { useTheme } from "../context/ThemeContext";
import { Button } from "react-native-paper";
import { useEffect, useState } from "react";

const ColorPickerModal: React.FC<{
  title: string;
  visible: boolean;
  value: string;
  onValueSelect: (color: string) => void;
  onClose?: () => void;
}> = ({ title, visible, value, onValueSelect, onClose }) => {
  const currentColor = useSharedValue(value);
  const { theme } = useTheme();
  const gstyles = getGeneralStyles(theme);
  const [selectedColor, setSelectedColor] = useState(value);

  useEffect(() => {
    setSelectedColor(value);
    currentColor.value = value;
  }, [value]);

  // runs on the ui thread on color change
  const onColorChange = (color: ColorFormatsObject) => {
    "worklet";
    currentColor.value = color.hex;
  };

  // runs on the js thread on color pick
  const onColorPick = (color: ColorFormatsObject) => {
    console.log("Color picked: ", color.hex);
    setSelectedColor(color.hex);
  };

  return (
    <Modal visible={visible} transparent={true} animationType="fade" onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={gstyles.modalOverlay}>
          <TouchableWithoutFeedback onPress={(e) => e.stopPropagation()}>
            <View
              style={[colorPickerStyle.pickerContainer, { backgroundColor: theme.background, shadowColor: theme.text }]}
            >
              <Text style={[gstyles.subtitle, { marginBottom: 10 }]}>{title}</Text>
              <ColorPicker
                value={value}
                sliderThickness={25}
                thumbSize={24}
                thumbShape="circle"
                onChange={onColorChange}
                onCompleteJS={onColorPick}
                style={colorPickerStyle.picker}
                boundedThumb
              >
                <Panel1 style={[colorPickerStyle.panelStyle, { shadowColor: theme.text }]} />
                <HueSlider style={[colorPickerStyle.sliderStyle, { shadowColor: theme.text }]} />
                <PreviewText style={[colorPickerStyle.previewTxt, { color: theme.text }]} colorFormat="hex" />
              </ColorPicker>
              <Button
                mode="contained"
                onPress={() => {
                  console.log("Selected color: ", selectedColor);
                  onValueSelect(selectedColor);
                }}
                style={gstyles.generalButton}
                labelStyle={gstyles.generalButtonLabel}
              >
                {"Aceptar"}
              </Button>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const colorPickerStyle = StyleSheet.create({
  picker: {
    gap: 20,
  },
  pickerContainer: {
    alignSelf: "center",
    width: 300,
    padding: 20,
    borderRadius: 20,
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.34,
    shadowRadius: 6.27,

    elevation: 10,
  },
  panelStyle: {
    borderRadius: 16,
    height: height * 0.35,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },
  previewTxt: {
    fontFamily: "Quicksand",
  },
  sliderStyle: {
    borderRadius: 20,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },
});

export default ColorPickerModal;
