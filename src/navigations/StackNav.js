import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import BottomMain from "./BottomMain";
import ProfileScreen from "../screens/ProfileScreen";
import ChangeInfoScreen from "../screens/another/ChangeInfoScreen";

const Stack = createStackNavigator();

const StackNav = () => {
  return (
    <Stack.Navigator
      initialRouteName="BottomMain"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="BottomMain" component={BottomMain} />
      <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
      <Stack.Screen name="ChangeInfoScreen" component={ChangeInfoScreen} />
    </Stack.Navigator>
  );
}

export default StackNav;
