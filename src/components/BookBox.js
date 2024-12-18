import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";

const BookBox = ({ item, navigation }) => {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => {
        navigation.navigate("ItemDetails", { bookId: item.id });
      }}
    >
      <Image source={{ uri: item.images[0] }} style={styles.image} />

      <View style={styles.contentContainer}>
        <Text style={styles.title}>
          {item.name.slice(0, 38)}
          {item.name.length > 38 ? <Text>...</Text> : null}
        </Text>

        <Text style={styles.price}>{item.price.toLocaleString()} VND</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    alignItems: "center",
    width: 170,
    height: 250,
    padding: 10,
    marginHorizontal: 10,
    backgroundColor: "#fff",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  image: {
    width: 80,
    height: 120,
    borderRadius: 5,
  },
  contentContainer: {
    flex: 1,
    marginLeft: 10,
    justifyContent: "center",
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  price: {
    fontSize: 14,
    color: "#333",
  },
});

export default BookBox;
