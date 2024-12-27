import React, { useContext } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";

const DeliveredOrderBox = ({ order}) => {

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Order ID: {order.id}</Text>
      <Text style={styles.text}>
        Date: {new Date(order.date).toLocaleDateString()}
      </Text>
      <Text style={styles.text}>Status: {order.status}</Text>
      <Text style={styles.text}>Total: {order.price.toLocaleString()} VND</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    marginVertical: 5,
    backgroundColor: "#fff",
    borderRadius: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  text: {
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  button: {
    backgroundColor: "#0A51B0",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default DeliveredOrderBox;
