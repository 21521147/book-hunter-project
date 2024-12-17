import React from "react";
import { View, Text, Button } from "react-native";

const ProfileScreen = ({ navigation }) => {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text>Settings Screen</Text>
      <Button title="Go to Home" onPress={() => navigation.navigate("Home")} />

      <Text>Sign In</Text>
      <Button
        title="Go to Sign In"
        onPress={() => navigation.navigate("SignIn")}
      />
    </View>
  );
};

export default ProfileScreen;
