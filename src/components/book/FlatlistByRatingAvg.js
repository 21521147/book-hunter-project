import React, { useState, useEffect, useContext } from "react";
import { View, FlatList, StyleSheet, Text } from "react-native";
import BookBox from "../BookBox";
import bookService from "../../services/bookService";
import Loading from "../Loading";
import { ThemeContext } from "../../contexts/ThemeContext";

const FlatlistByRatingAvg = ({ navigation }) => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const { colors } = useContext(ThemeContext);

  useEffect(() => {
    const fetchTopRatedBooks = async () => {
      try {
        const topRatedBooks = await bookService.getTop10BooksByRatingAvg();
        setBooks(topRatedBooks);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching top rated books: ", error);
        setLoading(false);
      }
    };

    fetchTopRatedBooks();
  }, []);

  const renderItem = ({ item }) => (
    <BookBox item={item} navigation={navigation} />
  );

  if (loading) {
    return <Loading />;
  }

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: colors.primary }]}>
        Đánh giá cao
      </Text>
      <FlatList
        data={books}
        renderItem={renderItem}
        horizontal
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

export default FlatlistByRatingAvg;
