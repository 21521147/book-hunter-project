import React from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { View, Text, StyleSheet } from "react-native";
import Delivering from "../screens/checkout/Delivering";
import Delivered from "../screens/checkout/Delivered";
import Canceled from "../screens/checkout/Canceled";

const Tab = createMaterialTopTabNavigator();

const TopTab = () => {
  return (
    <Tab.Navigator
      tabBarOptions={{
        activeTintColor: "#000",
        inactiveTintColor: "#666",
        labelStyle: { fontWeight: "bold" },
        indicatorStyle: { backgroundColor: "#000" },
      }}
    >
      <Tab.Screen name="Delivering" component={Delivering} />
      <Tab.Screen name="Delivered" component={Delivered} />
      <Tab.Screen name="Canceled" component={Canceled} />
    </Tab.Navigator>
  );
};

export default TopTab;