import React, { useState, useEffect, useContext } from "react";
import { View, FlatList, StyleSheet, Text } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import BookBox from "../BookBox";
import Loading from "../Loading";
import bookService from "../../services/bookService";
import { ThemeContext } from "../../contexts/ThemeContext";

const FlatListByGenre = ({ selectedGenre, navigation }) => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const { colors } = useContext(ThemeContext);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const cachedBooks = await AsyncStorage.getItem(
          `top10_books_${selectedGenre}`
        );
        if (cachedBooks) {
          setBooks(JSON.parse(cachedBooks));
          setLoading(false);
        } else {
          const books = await bookService.getTop10BooksByGenre(selectedGenre);
          setBooks(books);
          await AsyncStorage.setItem(
            `top10_books_${selectedGenre}`,
            JSON.stringify(books)
          );
          setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching books: ", error);
        setLoading(false);
      }
    };

    fetchBooks();
  }, [selectedGenre]);

  const renderItem = ({ item }) => (
    <BookBox item={item} navigation={navigation} />
  );

  if (loading) {
    return <Loading />;
  }

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: colors.primary }]}>
        {selectedGenre}
      </Text>
      <FlatList
        data={books}
        renderItem={renderItem}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.list}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 10,
    marginBottom: 10,
  },
  list: {
    padding: 10,
  },
});

export default FlatListByGenre;
