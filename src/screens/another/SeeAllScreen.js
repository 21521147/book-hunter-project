import React, { useState, useEffect, useContext } from "react";
import { View, FlatList, StyleSheet, Text, SafeAreaView, TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import BookBox from "../../components/BookBox";
import bookService from "../../services/bookService";
import Loading from "../../components/Loading";
import { ThemeContext } from "../../contexts/ThemeContext";
import Icon from "react-native-vector-icons/Ionicons";

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
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color={colors.primary} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.primary }]}>
          {selectedGenre ? `Thể loại: ${selectedGenre}` : "Sách"}
        </Text>
      </View>
      <View style={styles.container}>
        <FlatList
          data={books}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          contentContainerStyle={styles.list}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFF",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
  },
  container: {
    flex: 1,
    padding: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 10,
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