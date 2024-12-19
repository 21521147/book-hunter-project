import React from "react";
import { View, Text, Button } from "react-native";

const SearchScreen = ({ navigation }) => {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text>Search Screen</Text>
      <Button
        title="Go to Home"
        onPress={() => navigation.navigate("Home")}
      />

      <Text>Search Screen</Text>
    </View>
  );
}

export default SearchScreen;