import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import BottomMain from "./BottomMain";
import CheckoutScreen from "../screens/CheckoutScreen";

const Stack = createStackNavigator();

const RootNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="BottomMain" component={BottomMain} />
      <Stack.Screen name="CheckoutScreen" component={CheckoutScreen} />
    </Stack.Navigator>
  );
};

export default RootNavigator;
