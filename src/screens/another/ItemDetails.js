import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
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
  const { colors, fontSizes } = useContext(ThemeContext);

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
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.navigate("Home")}>
            <Icon name="arrow-back" size={24} color={colors.primary} />
          </TouchableOpacity>
          <View style={styles.headerIcons}>
            <TouchableOpacity onPress={() => navigation.navigate("Search")}>
              <Icon name="search" size={24} color={colors.primary} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate("Home")}>
              <Icon name="home" size={24} color={colors.primary} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate("Cart")}>
              <Icon name="cart" size={24} color={colors.primary} />
            </TouchableOpacity>
          </View>
        </View>
        <Image source={{ uri: book.images[0] }} style={styles.image} />
        <Text style={[styles.title, { color: colors.text, fontSize: fontSizes.xxLarge }]}>
          {book.name}
        </Text>
        <View style={styles.infoContainer}>
          <Text style={[styles.label, { color: colors.secondary, fontSize: fontSizes.medium }]}>
            Tác giả:
          </Text>
          <Text style={[styles.author, { color: colors.text, fontSize: fontSizes.large }]}>
            {book.authors.join(", ")}
          </Text>
        </View>
        <View style={styles.infoContainer}>
          <Text style={[styles.label, { color: colors.secondary, fontSize: fontSizes.medium }]}>
            Giá bán:
          </Text>
          <Text style={[styles.price, { color: colors.error, fontSize: fontSizes.large }]}>
            {book.price.toLocaleString()} VND
          </Text>
        </View>
        <Text style={[styles.description, { color: colors.text, fontSize: fontSizes.medium }]}>
          {book.description}
        </Text>
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
    padding: 20,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  headerIcons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: 100,
  },
  image: {
    width: "100%",
    height: 300,
    resizeMode: "cover",
    borderRadius: 10,
    marginBottom: 20,
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
    textAlign: "center",
  },
  price: {
    textAlign: "center",
  },
  description: {
    textAlign: "justify",
  },
});

export default ItemDetails;
