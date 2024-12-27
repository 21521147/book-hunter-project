import React, { useContext, useEffect, useState } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { ThemeContext } from "../contexts/ThemeContext";
import Icon from "react-native-vector-icons/Ionicons";
import bookService from "../services/bookService";

const BookBox = ({ item, navigation }) => {
  const { colors } = useContext(ThemeContext);
  const [ratingAverage, setRatingAverage] = useState(0);

  useEffect(() => {
    const fetchRatingAverage = async () => {
      const bookDetails = await bookService.getBookById(item.id);
      const randomRating = (Math.random() * (4.9 - 3.5) + 3.5).toFixed(1);
      setRatingAverage(randomRating);
    };

    fetchRatingAverage();
  }, [item.id]);

  return (
    <TouchableOpacity
      style={[styles.container, { backgroundColor: colors.card }]}
      onPress={() => {
        navigation.navigate("ItemDetails", { bookId: item.id });
      }}
    >
      <View style={styles.ratingContainer}>
        <Icon name="star" size={14} color="#FFD700" />
        <Text style={[styles.ratingText, { color: colors.primary }]}>
          {ratingAverage}
          <Text style={styles.ratingSubText}>/5</Text>
        </Text>
      </View>
      <Image source={{ uri: item.images[0] }} style={styles.image} />

      <View style={styles.contentContainer}>
        <Text style={[styles.title, { color: colors.text }]} numberOfLines={2}>
          {item.name}
        </Text>
        <View style={styles.priceContainer}>
          <Text style={[styles.price, { color: colors.primary }]}>
            {item.price.toLocaleString()} VND
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    alignItems: "center",
    width: 170,
    height: 230,
    padding: 10,
    marginHorizontal: 5,
    marginBottom: 10,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  ratingContainer: {
    position: "absolute",
    top: 5,
    left: 5,
    backgroundColor: "#fff",
    borderRadius: 5,
    padding: 2,
    flexDirection: "row",
    alignItems: "center",
    zIndex: 1,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: "bold",
    marginLeft: 2,
  },
  ratingSubText: {
    fontSize: 10,
    color: "#999",
  },
  image: {
    width: 100,
    height: 120,
    borderRadius: 5,
  },
  contentContainer: {
    flex: 1,
    marginLeft: 10,
    justifyContent: "center",
  },
  title: {
    fontSize: 15,
    fontWeight: "bold",
    marginBottom: 5,
  },
  priceContainer: {
    position: "absolute",
    bottom: 5,
  },
  price: {
    fontSize: 14,
  },
});

export default BookBox;
