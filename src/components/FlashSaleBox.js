import React, { useContext, useEffect, useState } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { ThemeContext } from "../contexts/ThemeContext";
import Icon from "react-native-vector-icons/Ionicons";
import bookService from "../services/bookService";

const FlashSaleBox = ({ item, navigation }) => {
  const { colors } = useContext(ThemeContext);
  const [ratingAverage, setRatingAverage] = useState(0);
  const [discount, setDiscount] = useState(0);

  useEffect(() => {
    const fetchRatingAverage = async () => {
      const bookDetails = await bookService.getBookById(item.id);
      setRatingAverage(bookDetails.rating_average);
    };

    const fetchDiscount = async () => {
      const discountRandom = Math.floor(Math.random() * (50 - 20 + 1) + 20);
      setDiscount(discountRandom);
    };

    fetchDiscount();
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
        <View style={styles.flashSaleContainer}>
          <Icon name="flash" size={16} color="red" />
          <Text style={[styles.flashSaleText, { color: "red" }]}>Flash Sale</Text>
        </View>
        <Text style={[styles.title, { color: colors.text }]} numberOfLines={2}>
          {item.name}
        </Text>
        <View style={styles.priceContainer}>
          <Text style={[styles.discountedPrice, { color: colors.primary }]}>
            {((item.price * (100 - discount)) / 100).toLocaleString()} VND
          </Text>
          <Text style={[styles.discount, { color: colors.primary }]}>
            {discount}% OFF
          </Text>
          <Text style={[styles.originalPrice, { color: colors.secondary }]}>
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
    width: 200,
    height: 300,
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
    lineHeight: 24,
  },
  flashSaleContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  flashSaleText: {
    marginLeft: 5,
    fontSize: 14,
    fontWeight: "bold",
  },
  title: {
    fontSize: 15,
    fontWeight: "bold",
    marginBottom: 10,
    lineHeight: 20,
  },
  priceContainer: {
    marginBottom: 10,
  },
  discountedPrice: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
    lineHeight: 20,
  },
  discount: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 5,
    lineHeight: 20,
  },
  originalPrice: {
    fontSize: 14,
    textDecorationLine: "line-through",
    lineHeight: 20,
  },
});

export default FlashSaleBox;
