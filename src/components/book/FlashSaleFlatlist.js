import React, { useEffect, useState, useContext } from "react";
import { View, FlatList, StyleSheet, Text } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import bookService from "../../services/bookService";
import FlashSaleBox from "../FlashSaleBox";
import Loading from "../Loading";
import { ThemeContext } from "@react-navigation/native";

const FlashSaleFlatlist = ({ navigation }) => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const { colors } = useContext(ThemeContext);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const cachedBooks = await AsyncStorage.getItem("flashSaleBooks");
        if (cachedBooks) {
          setBooks(JSON.parse(cachedBooks));
        } else {
          const allBooks = await bookService.getAllBooks();
          const randomBooks = allBooks
            .sort(() => 0.5 - Math.random())
            .slice(0, 50);
          setBooks(randomBooks);
          await AsyncStorage.setItem(
            "flashSaleBooks",
            JSON.stringify(randomBooks)
          );
        }
      } catch (error) {
        console.error("Error fetching books:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <View style={styles.container}>
      <View style={[styles.header, { backgroundColor: colors.card }]}>
        <Text style={[styles.title, { color: colors.flashsale }]}>
          Flash Sale
        </Text>
      </View>
      <FlatList
        data={books.slice(0, 10)}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <FlashSaleBox item={item} navigation={navigation} />
        )}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    marginVertical: 10,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    margin: 10,
    padding: 10,
    borderRadius: 10,
  },
  title: {
    fontSize: 30,
    fontWeight: "900",
    marginLeft: 10,
  },
  listContainer: {
    paddingHorizontal: 10,
  },
});

export default FlashSaleFlatlist;
