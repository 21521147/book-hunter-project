import React from "react";
import { TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/Ionicons";
import { useContext } from "react";
import { ThemeContext } from "../contexts/ThemeContext";

const BackButton = ({ style }) => {
  const navigation = useNavigation();
  const { colors } = useContext(ThemeContext);

  return (
    <TouchableOpacity
      style={[styles.container, style]} // Semi-transparent background
      onPress={() => navigation.goBack()}
    >
      <Icon name="arrow-back" size={30} color={colors.primary} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
  },
});

export default BackButton;
