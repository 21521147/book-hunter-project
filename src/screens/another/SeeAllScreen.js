import React, { useState, useEffect, useContext } from "react";
import { View, FlatList, StyleSheet, Text } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import BookBox from "../../components/BookBox";
import bookService from "../../services/bookService";
import Loading from "../../components/Loading";
import { ThemeContext } from "../../contexts/ThemeContext";

const SeeAllScreen = ({ route, navigation }) => {
  const { selectedGenre, type } = route.params;
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const { colors } = useContext(ThemeContext);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        let fetchedBooks = [];
        if (selectedGenre) {
          fetchedBooks = await bookService.getBooksByGenre(selectedGenre);
        } else {
          fetchedBooks = await bookService.getAllDescBooks(type);
        }
        setBooks(fetchedBooks);
      } catch (error) {
        console.error("Error fetching books: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, [selectedGenre, type]);

  const renderItem = ({ item }) => (
    <BookBox item={item} navigation={navigation} />
  );

  if (loading) {
    return <Loading />;
  }

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: colors.primary }]}>
        {selectedGenre ? `Genre: ${selectedGenre}` : "Books"}
      </Text>
      <FlatList
        data={books}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        contentContainerStyle={styles.list}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  list: {
    justifyContent: "center",
    alignItems: "center",
  },
  row: {
    justifyContent: "space-between",
    marginBottom: 10,
  },
});

export default SeeAllScreen;
