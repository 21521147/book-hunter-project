import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Alert,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import bookService from "../../services/bookService";
import Loading from "../../components/Loading";
import BackButton from "../../components/BackButton";
import ImageSlider from "../../components/ImageSlider";
import { ThemeContext } from "../../contexts/ThemeContext";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ItemDetails = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { bookId } = route.params;
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const { colors, fontSizes } = useContext(ThemeContext);

  useEffect(() => {
    const fetchBookDetails = async () => {
      try {
        const bookDetails = await bookService.getBookById(bookId);
        setBook(bookDetails);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching book details:", error);
        setLoading(false);
      }
    };

    fetchBookDetails();
  }, [bookId]);

  const addToCart = async () => {
    try {
      const userToken = await AsyncStorage.getItem("userToken");
      if (!userToken) {
        Alert.alert(
          "Sign In Required",
          "You must be signed in to add items to the cart.",
          [
            {
              text: "Sign In",
              onPress: () => navigation.navigate("SignIn"),
            },
            {
              text: "Cancel",
              style: "cancel",
            },
          ],
          { cancelable: false }
        );
        return;
      }

      const cart = await AsyncStorage.getItem("cart");
      let cartItems = cart ? JSON.parse(cart) : [];
      cartItems.push(book);
      await AsyncStorage.setItem("cart", JSON.stringify(cartItems));
      Alert.alert("Success", "Book added to cart!");
    } catch (error) {
      console.error("Error adding book to cart:", error);
      Alert.alert("Error", "Failed to add book to cart.");
    }
  };

  if (loading) {
    return <Loading />;
  }

  if (!book) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Book not found</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
      >
        <ImageSlider images={book.images} />
        <View style={styles.content}>
          <Text
            style={[
              styles.title,
              { fontSize: fontSizes.xLarge, color: colors.primary },
            ]}
          >
            {book.name}
          </Text>
          <Text
            style={[
              styles.author,
              { fontSize: fontSizes.medium, color: colors.secondary },
            ]}
          >
            Tác giả: {book.authors.join(", ")}
          </Text>
          <Text
            style={[
              styles.price,
              { fontSize: fontSizes.medium, color: colors.secondary },
            ]}
          >
            Giá: {book.price.toLocaleString()} VND
          </Text>
          <Text style={{ fontSize: fontSizes.medium, color: colors.text }}>
            Mô tả:{" "}
          </Text>
          <Text style={{ fontSize: fontSizes.medium, color: colors.text }}>
            {book.description}
          </Text>
        </View>
      </ScrollView>
      <BackButton style={styles.backButton} />
      <TouchableOpacity
        style={[styles.addToCartButton, { backgroundColor: colors.primary }]}
        onPress={addToCart}
      >
        <Text style={[styles.addToCartButtonText, { color: colors.textSrd }]}>
          Add to Cart
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    flex: 1,
    width: "100%",
  },
  content: {
    padding: 20,
  },
  icon: {
    width: "100%",
    marginTop: 10,
  },
  image: {
    width: "100%",
    height: 300,
    resizeMode: "cover",
    borderRadius: 10,
    marginBottom: 20,
  },
  backButton: {
    top: 20,
    left: 10,
  },
  title: {
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },
  infoContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  label: {
    fontWeight: "bold",
    marginRight: 5,
  },
  author: {
    marginBottom: 10,
  },
  price: {
    marginBottom: 20,
  },
  addToCartButton: {
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
  },
  addToCartButtonText: {
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default ItemDetails;
