import React, { useContext } from "react";
import { Text, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/Ionicons";
import { ThemeContext } from "../contexts/ThemeContext";

const IconBox = ({ icon, text, targetScreen }) => {
  const navigation = useNavigation();
  const { colors, fontSizes } = useContext(ThemeContext);

  const handlePress = () => {
    navigation.navigate(targetScreen);
  };

  return (
    <TouchableOpacity style={[styles.container, {borderColor: colors.icon}]} onPress={handlePress}>
      <Icon name={icon} size={30} style={{color: colors.primary}} />
      <Text style={{ color: colors.text, fontSize: fontSizes.small, textAlign: 'center' }}>{text}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    alignItems: "center",
    padding: 10,
    margin: 5,
    borderWidth: 1,
    borderRadius: 5,
  },
});

export default IconBox;
