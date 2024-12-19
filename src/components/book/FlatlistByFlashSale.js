import React, { useState, useEffect } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from "react-native";
import bookService from "../../services/bookService";
import BookBox from "../BookBox";

const FlatlistByFlashSale = ({ navigation }) => {
  const [flashSaleBooks, setFlashSaleBooks] = useState([]);

  useEffect(() => {
    const fetchFlashSaleBooks = async () => {
      try {
        const books = await bookService.getFlashSaleBooks();
        setFlashSaleBooks(books);
      } catch (error) {
        console.error("Error fetching flash sale books: ", error);
      }
    };

    fetchFlashSaleBooks();
  }, []);

  const renderFlashSaleBook = ({ item }) => (
    <View style={styles.flashSaleBookContainer}>
      <BookBox item={item} navigation={navigation} />
      <Text style={styles.discountText}>
        {item.discount}% OFF
      </Text>
      <TouchableOpacity
        style={styles.buyNowButton}
        onPress={() => navigation.navigate("BookDetail", { bookId: item.id })}
      >
        <Text style={styles.buyNowButtonText}>Mua ngay</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <FlatList
      data={flashSaleBooks}
      keyExtractor={(item) => item.id.toString()}
      renderItem={renderFlashSaleBook}
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.list}
    />
  );
};

const styles = StyleSheet.create({
  flashSaleBookContainer: {
    marginRight: 16,
    alignItems: "center",
  },
  discountText: {
    marginTop: 5,
    fontWeight: "bold",
    color: "red",
  },
  buyNowButton: {
    marginTop: 5,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    backgroundColor: "red",
  },
  buyNowButtonText: {
    color: "#fff",
  },
  list: {
    paddingBottom: 10,
  },
});

export default FlatlistByFlashSale;
