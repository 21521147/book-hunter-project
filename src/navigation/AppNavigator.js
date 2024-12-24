import React, { useContext, useEffect, useState } from "react";
import { View, Text, Image, ScrollView, StyleSheet, SafeAreaView, TouchableOpacity } from "react-native";
import { useRoute } from "@react-navigation/native";
import { ThemeContext } from "../contexts/ThemeContext";
import bookService from "../services/bookService";
import Loading from "../components/Loading";
import ItemDetailsScreen from "../screens/ItemDetailsScreen";
import { createStackNavigator } from "@react-navigation/stack";
import CartScreen from "../screens/CartScreen";
import ShippingInfoScreen from "../screens/ShippingInfoScreen";
import CheckoutScreen from "../screens/CheckoutScreen";

const BookDetailsScreen = ({ navigation }) => {
  const { colors, fontSizes } = useContext(ThemeContext);
  const route = useRoute();
  const { bookId } = route.params;
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookDetails = async () => {
      try {
        const bookDetails = await bookService.getBookById(bookId);
        setBook(bookDetails);
      } catch (error) {
        console.error("Error fetching book details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookDetails();
  }, [bookId]);

  if (loading) {
    return <Loading />;
  }

  if (!book) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <Text style={[styles.errorText, { color: colors.error }]}>
            Không tìm thấy thông tin sách.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container}>
        <Image source={{ uri: book.images[0] }} style={styles.bookImage} />
        <View style={styles.detailsContainer}>
          <Text style={[styles.bookTitle, { color: colors.text }]}>
            {book.name}
          </Text>
          <Text style={[styles.bookAuthor, { color: colors.secondary }]}>
            Tác giả: {book.author}
          </Text>
          <Text style={[styles.bookPrice, { color: colors.primary }]}>
            {book.price.toLocaleString()} VND
          </Text>
          <Text style={[styles.bookDescription, { color: colors.text }]}>
            {book.description}
          </Text>
        </View>
        <TouchableOpacity
          style={[styles.addToCartButton, { backgroundColor: colors.primary }]}
          onPress={() => navigation.navigate("CartScreen")}
        >
          <Text style={styles.addToCartButtonText}>Thêm vào giỏ hàng</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    flex: 1,
    padding: 16,
  },
  bookImage: {
    width: "100%",
    height: 300,
    resizeMode: "contain",
    marginBottom: 16,
  },
  detailsContainer: {
    flex: 1,
  },
  bookTitle: {
    fontSize: fontSizes.large,
    fontWeight: "bold",
    marginBottom: 8,
  },
  bookAuthor: {
    fontSize: fontSizes.medium,
    marginBottom: 8,
  },
  bookPrice: {
    fontSize: fontSizes.medium,
    fontWeight: "bold",
    marginBottom: 16,
  },
  bookDescription: {
    fontSize: fontSizes.small,
    lineHeight: 24,
  },
  addToCartButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 16,
  },
  addToCartButtonText: {
    color: "#fff",
    fontSize: fontSizes.medium,
    fontWeight: "bold",
  },
  errorText: {
    fontSize: fontSizes.medium,
    textAlign: "center",
    marginTop: 20,
  },
});

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <Stack.Navigator>
      {/* ...existing screens... */}
      <Stack.Screen name="CartScreen" component={CartScreen} />
      <Stack.Screen name="ShippingInfoScreen" component={ShippingInfoScreen} />
      <Stack.Screen name="ItemDetailsScreen" component={ItemDetailsScreen} />
      <Stack.Screen name="CheckoutScreen" component={CheckoutScreen} />
      {/* ...existing screens... */}
    </Stack.Navigator>
  );
};

export default AppNavigator;