// contexts/ThemeContext.js
import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { lightTheme, darkTheme, fontSizes } from "../constants/colors";

const ThemeContext = createContext();

const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState("light"); // 'light' or 'dark'
  const [colors, setColors] = useState(lightTheme);
  const [fontSize, setFontSize] = useState("medium"); // default font size

  useEffect(() => {
    loadTheme();
    loadFontSize();
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    saveTheme(newTheme);
    setColors(newTheme === "light" ? lightTheme : darkTheme);
  };

  const changeFontSize = (size) => {
    setFontSize(size);
    saveFontSize(size);
  };

  const loadTheme = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem("appTheme");
      if (savedTheme) {
        setTheme(savedTheme);
        setColors(savedTheme === "light" ? lightTheme : darkTheme);
      }
    } catch (error) {
      console.log("Error loading theme:", error);
    }
  };

  const loadFontSize = async () => {
    try {
      const savedFontSize = await AsyncStorage.getItem("appFontSize");
      if (savedFontSize) {
        setFontSize(savedFontSize);
      }
    } catch (error) {
      console.log("Error loading font size:", error);
    }
  };

  const saveTheme = async (theme) => {
    try {
      await AsyncStorage.setItem("appTheme", theme);
    } catch (error) {
      console.log("Error saving theme:", error);
    }
  };

  const saveFontSize = async (size) => {
    try {
      await AsyncStorage.setItem("appFontSize", size);
    } catch (error) {
      console.log("Error saving font size:", error);
    }
  };

  const contextValue = {
    theme,
    colors,
    toggleTheme,
    changeFontSize,
    fontSizes,
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};

export { ThemeContext, ThemeProvider };
