import React, { useState, useEffect, useContext } from "react";
import { View, FlatList, StyleSheet, Text } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import BookBox from "../BookBox";
import bookService from "../../services/bookService";
import Loading from "../Loading";
import { ThemeContext } from "../../contexts/ThemeContext";

const FlalistByReviewCount = ({ navigation }) => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const { colors, fontSizes } = useContext(ThemeContext);

  useEffect(() => {
    const fetchTopReviewedBooks = async () => {
      try {
        const cachedBooks = await AsyncStorage.getItem("top_reviewed_books");
        if (cachedBooks) {
          setBooks(JSON.parse(cachedBooks));
          setLoading(false);
        } else {
          const topReviewedBooks =
            await bookService.getTop10BooksByReviewCount();
          setBooks(topReviewedBooks);
          await AsyncStorage.setItem(
            "top_reviewed_books",
            JSON.stringify(topReviewedBooks)
          );
          setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching top reviewed books: ", error);
        setLoading(false);
      }
    };

    fetchTopReviewedBooks();
  }, []);

  const renderItem = ({ item }) => (
    <BookBox item={item} navigation={navigation} />
  );

  if (loading) {
    return <Loading />;
  }

  return (
    <View style={styles.container}>
      <View style={[styles.header]}>
        <Text
          style={[
            styles.title,
            { color: colors.primary, fontSize: fontSizes.large },
          ]}
        >
          Được đọc nhiều nhất
        </Text>
        <Text
          onPress={() =>
            navigation.navigate("SeeAllScreen", {
              type: 'rating_average',
            })
          }
          style={[
            styles.title,
            { color: colors.primary, fontSize: fontSizes.medium },
          ]}
        >
          Xem tất cả
        </Text>
      </View>
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
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 10,
  },
  title: {
    fontWeight: "bold",
    marginLeft: 10,
  },
  list: {
    padding: 10,
  },
});

export default FlalistByReviewCount;
