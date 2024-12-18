import React, { useContext } from "react";
import { View, TextInput } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { ThemeContext } from "../contexts/ThemeContext";

const InputBox = ({
  icon,
  placeholder,
  secureTextEntry,
  onChangeText,
  value,
}) => {
  const { colors, fontSizes } = useContext(ThemeContext);
  return (
    <View style={[styles.container, { backgroundColor: colors.card }]}>
      <Icon name={icon} size={20} color={colors.primary} />
      <TextInput
        placeholder={placeholder}
        style={[
          {
            marginLeft: 10,
            width: "100%",
            color: colors.text,
            fontSize: fontSizes.medium,
          },
        ]}
        placeholderTextColor={colors.secondary}
        secureTextEntry={secureTextEntry}
        onChangeText={onChangeText}
        value={value}
      />
    </View>
  );
};

const styles = {
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    width: "80%",
    paddingLeft: 10,
    paddingVertical: 3,
    marginBottom: 20,
    borderWidth: 0.5,
    borderRadius: 5,
  },
};

export default InputBox;
