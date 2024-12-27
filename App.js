import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import StackNav from "./src/navigations/StackNav";
import { ThemeProvider } from "./src/contexts/ThemeContext";
import CartContextProvider from "./src/contexts/CartContext";
import AuthContextProvider from "./src/contexts/AuthContext";
import UserContextProvider from "./src/contexts/UserContext";

import { StatusBar } from "react-native";
const App = () => {
  return (
    <AuthContextProvider>
      <UserContextProvider>
        <CartContextProvider>
          <ThemeProvider>
            <NavigationContainer>
              <StatusBar barStyle="dark-content" />
              <StackNav />
            </NavigationContainer>
          </ThemeProvider>
        </CartContextProvider>
      </UserContextProvider>
    </AuthContextProvider>
  );
};

export default App;
