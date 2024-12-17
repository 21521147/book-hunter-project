import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import BottomMain from "./src/navigations/BottomMain";
import { ThemeProvider } from "./src/contexts/ThemeContext";

const App = () => {
  return (
    <ThemeProvider>
      <NavigationContainer>
        <BottomMain />
      </NavigationContainer>
    </ThemeProvider>
  );
};

export default App;
