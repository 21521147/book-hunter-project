import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/Ionicons";
import bookService from "../../services/bookService";
import Loading from "../../components/Loading";
import { ThemeContext } from "../../contexts/ThemeContext";

const ItemDetails = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { bookId } = route.params;
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const { colors } = useContext(ThemeContext);

  useEffect(() => {
    const fetchBookDetails = async () => {
      try {
        const bookDetails = await bookService.getBookById(bookId);
        setBook(bookDetails);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching book details: ", error);
        setLoading(false);
      }
    };

    fetchBookDetails();
  }, [bookId]);

  if (loading) {
    return <Loading />;
  }

  if (!book) {
    return <Loading />;
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity style={styles.icon} onPress={() => navigation.goBack()}>
        <Icon name="arrow-back" size={30} color={colors.primary} />
      </TouchableOpacity>
      <Image source={{ uri: book.images[0] }} style={styles.image} />
      <Text style={styles.title}>{book.name}</Text>
      <Text style={styles.author}>{book.authors.join(", ")}</Text>
      <Text style={styles.price}>{book.price.toLocaleString()} VND</Text>
      <Text style={styles.description}>{book.description}</Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  author: {
    fontSize: 18,
    color: "#666",
    marginBottom: 10,
  },
  price: {
    fontSize: 18,
    color: "#333",
    marginBottom: 20,
  },
  description: {
    fontSize: 16,
    color: "#333",
  },
});

export default ItemDetails;
