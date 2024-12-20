import React, { useContext } from "react";
import { View, Switch, StyleSheet } from "react-native";
import { ThemeContext } from "../contexts/ThemeContext";

const ToggleMode = () => {
  const { theme, toggleTheme, colors } = useContext(ThemeContext);

  return (
    <View style={styles.container}>
      <Switch
        value={theme === "dark"}
        onValueChange={toggleTheme}
        thumbColor={colors.primary}
        trackColor={{ false: colors.secondary, true: colors.primary }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderColor: "#000",
    borderWidth: 0,
  }
});

export default ToggleMode;
