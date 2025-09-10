import React from "react";
import { TextInput } from "react-native-paper";
import { KeyboardTypeOptions, TextStyle } from "react-native";
import { getGeneralStyles } from "../styles/GeneralStyle";
import { useTheme } from "../context/ThemeContext";
import { rgbToRgba } from "../utils/Utils";

interface LoadingAnimationProps {
  label: string;
  value: string;
  onValueChange: (val: string) => void;
  styleProps?: TextStyle;
  keyboardType?: KeyboardTypeOptions;
  numberOfLines?: number;
}

const GeneralTextInput: React.FC<LoadingAnimationProps> = ({
  label,
  value,
  onValueChange,
  styleProps,
  keyboardType = "default",
  numberOfLines = 1
}) => {
  const { theme } = useTheme();
  const gstyles = getGeneralStyles(theme);

  return (
    <TextInput
      mode="outlined"
      label={label}
      multiline={numberOfLines !== 1}
      numberOfLines={numberOfLines}
      style={[gstyles.textInput, styleProps]}
      theme={{
        colors: {
          onSurfaceVariant: rgbToRgba(theme.text, 0.6),
        },
      }}
      activeOutlineColor={theme.primary}
      outlineColor={rgbToRgba(theme.text, 0.6)}
      textColor={theme.text}
      value={value}
      onChangeText={(val) => onValueChange(val)}
      keyboardType={keyboardType}
    />
  );
};

export default GeneralTextInput;
