import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import BottomMain from "./BottomMain";
import ProfileScreen from "../screens/ProfileScreen";
import ChangeInfoScreen from "../screens/another/ChangeInfoScreen";
import EventScreen from "../screens/another/EventScreen";
import ItemDetails from "../screens/another/ItemDetails";
import FavoriteScreen from "../screens/another/FavoriteScreen";
import TopTab from "./TopTab";
import CheckoutScreen from "../screens/CheckoutScreen";
import OrderDetails from "../screens/another/OrderDetails";

const Stack = createStackNavigator();

const StackNav = () => {
  return (
    <Stack.Navigator initialRouteName="BottomMain">
      <Stack.Screen
        name="BottomMain"
        component={BottomMain}
        options={{ headerShown: false }}
      />
      <Stack.Screen name="EventScreen" component={EventScreen} />
      <Stack.Screen
        name="ProfileScreen"
        component={ProfileScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ChangeInfoScreen"
        component={ChangeInfoScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ItemDetails"
        component={ItemDetails}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="FavoriteScreen"
        component={FavoriteScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="CheckoutScreens"
        component={TopTab}
        options={{ headerShown: true }}
      />
      <Stack.Screen
        name="CheckoutScreen"
        component={CheckoutScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="OrderDetails"
        component={OrderDetails}
        options={{ headerShown: true }}
      />
    </Stack.Navigator>
  );
};

export default StackNav;
