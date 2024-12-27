import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, Image } from "react-native";
import bookService from "../../services/bookService";

const OrderDetails = ({ route }) => {
  const { order } = route.params;
  const [bookDetails, setBookDetails] = useState([]);

  useEffect(() => {
    const fetchBookDetails = async () => {
      try {
        const details = await Promise.all(
          order.carts.map(async (item) => {
            const book = await bookService.getBookById(item.id);
            return { ...item, ...book };
          })
        );
        setBookDetails(details);
      } catch (error) {
        console.error("Error fetching book details:", error);
      }
    };

    fetchBookDetails();
  }, [order.items]);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Order ID: {order.id}</Text>
      <Text style={styles.text}>
        Date: {new Date(order.date).toLocaleDateString()}
      </Text>
      <Text style={styles.text}>Status: {order.status}</Text>
      <Text style={styles.text}>
        Total: {order.price ? order.price.toLocaleString() : "N/A"} VND
      </Text>
      <FlatList
        data={bookDetails}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            <Image source={{ uri: item.images[0] }} style={styles.bookImage} />
            <View style={styles.itemDetails}>
              <Text style={styles.itemText}>Name: {item.name}</Text>
              <Text style={styles.itemText}>Quantity: {item.quantity}</Text>
              <Text style={styles.itemText}>
                Price: {item.price ? item.price.toLocaleString() : "N/A"} VND
              </Text>
            </View>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "#f5f5f5",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  text: {
    fontSize: 18,
    marginBottom: 10,
  },
  itemContainer: {
    flexDirection: "row",
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
  bookImage: {
    width: 80,
    height: 110,
    marginRight: 10,
  },
  itemDetails: {
    flex: 1,
  },
  itemText: {
    fontSize: 16,
  },
});

export default OrderDetails;
