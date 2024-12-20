import React from "react";

import { View, Text, StyleSheet } from "react-native";

const Delivered = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Your order has been delivered!</Text>
    </View>
  );
}

export default Delivered;

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
