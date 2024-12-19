import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import StackNav from "./src/navigations/StackNav";
import { ThemeProvider } from "./src/contexts/ThemeContext";
import AuthContextProvider from "./src/contexts/AuthContext";
const App = () => {
  return (
    <AuthContextProvider>
      <ThemeProvider>
        <NavigationContainer>
          <StackNav />
        </NavigationContainer>
      </ThemeProvider>
    </AuthContextProvider>
  );
};

export default App;
