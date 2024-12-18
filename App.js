import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import StackNav from "./src/navigations/StackNav";
import { ThemeProvider } from "./src/contexts/ThemeContext";
import AuthContextProvider from "./src/contexts/AuthContext";
import UserContextProvider from "./src/contexts/UserContext";
const App = () => {
  return (
    <AuthContextProvider>
      <UserContextProvider>
        <ThemeProvider>
          <NavigationContainer>
            <StackNav />
          </NavigationContainer>
        </ThemeProvider>
      </UserContextProvider>
    </AuthContextProvider>
  );
};

export default App;
