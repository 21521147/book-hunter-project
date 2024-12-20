import React from "react";
import { View, Text, StyleSheet } from "react-native";

const Canceled = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Your payment has been canceled!</Text>
    </View>
  );
}

export default Canceled;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 20,
  },
});

