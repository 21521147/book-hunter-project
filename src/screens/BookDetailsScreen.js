import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  SafeAreaView,
} from "react-native";
import { ThemeContext } from "../contexts/ThemeContext";
import bookService from "../services/bookService";
import Loading from "../components/Loading";

const BookDetailsScreen = ({ route }) => {
  const { colors, fontSizes } = useContext(ThemeContext);
  const { bookId } = route.params;
  const [book, setBook] = useState(null);

  useEffect(() => {
    const fetchBookDetails = async () => {
      const bookDetails = await bookService.getBookById(bookId);
      setBook(bookDetails);
    };

    fetchBookDetails();
  }, [bookId]);

  if (!book) {
    return <Loading />;
  }

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: colors.background }]}
    >
      <ScrollView style={styles.container}>
        <Image source={{ uri: book.images[0] }} style={styles.bookImage} />
        <Text style={[styles.title, { color: colors.text }]}>{book.name}</Text>
        <Text style={[styles.author, { color: colors.text }]}>
          {book.author}
        </Text>
        <Text style={[styles.price, { color: colors.primary }]}>
          {book.price.toLocaleString()} VND
        </Text>
        <Text style={[styles.description, { color: colors.text }]}>
          {book.description}
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
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
  title: {
    fontSize: fontSizes.large,
    fontWeight: "bold",
    marginBottom: 8,
  },
  author: {
    fontSize: fontSizes.medium,
    marginBottom: 8,
  },
  price: {
    fontSize: fontSizes.medium,
    fontWeight: "bold",
    marginBottom: 16,
  },
  description: {
    fontSize: fontSizes.small,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default BookDetailsScreen;
