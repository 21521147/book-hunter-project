import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import BottomMain from "./BottomMain";
import ProfileScreen from "../screens/ProfileScreen";
import ChangeInfoScreen from "../screens/another/ChangeInfoScreen";

import EventScreen from "../screens/another/EventScreen";
import ItemDetails from "../screens/another/ItemDetails";

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
    </Stack.Navigator>
  );
};

export default StackNav;
