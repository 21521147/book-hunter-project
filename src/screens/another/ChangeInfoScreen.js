import React, { useState, useContext, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { AuthContext } from "../../contexts/AuthContext";

const ChangeInfoScreen = ({ navigation }) => {
  const { user } = useContext(AuthContext);

  return (
    <ScrollView style={styles.container}>
      <Text>Change Info Screen</Text>
      <Text>{user.name}</Text>
      <Text>{user.email}</Text>
    </ScrollView>
  );
};

export default ChangeInfoScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

