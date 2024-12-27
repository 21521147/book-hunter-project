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
  const [showSortOptions, setShowSortOptions] = useState(false);
  const [sortOption, setSortOption] = useState("nameAZ");

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

  const sortedBooks = [...books].sort((a, b) => {
    if (sortOption === "nameAZ") {
      return a.name.localeCompare(b.name);
    } else if (sortOption === "nameZA") {
      return b.name.localeCompare(a.name);
    } else if (sortOption === "priceLowToHigh") {
      return a.price - b.price;
    } else if (sortOption === "priceHighToLow") {
      return b.price - a.price;
    } else if (sortOption === "ratingHighToLow") {
      return b.rating_average - a.rating_average;
    }
    return 0;
  });

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
        <TouchableOpacity onPress={() => setShowSortOptions(!showSortOptions)}>
          <Icon name="filter" size={24} color={colors.primary} />
        </TouchableOpacity>
      </View>
      {showSortOptions && (
        <View style={styles.sortOptions}>
          <TouchableOpacity
            style={styles.sortOption}
            onPress={() => { setSortOption("nameAZ"); setShowSortOptions(false); }}
          >
            <Text style={[styles.sortOptionText, { color: colors.text }]}>Tên: A-Z</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.sortOption}
            onPress={() => { setSortOption("nameZA"); setShowSortOptions(false); }}
          >
            <Text style={[styles.sortOptionText, { color: colors.text }]}>Tên: Z-A</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.sortOption}
            onPress={() => { setSortOption("priceHighToLow"); setShowSortOptions(false); }}
          >
            <Text style={[styles.sortOptionText, { color: colors.text }]}>Giá cao - thấp</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.sortOption}
            onPress={() => { setSortOption("priceLowToHigh"); setShowSortOptions(false); }}
          >
            <Text style={[styles.sortOptionText, { color: colors.text }]}>Giá thấp - cao</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.sortOption}
            onPress={() => { setSortOption("ratingHighToLow"); setShowSortOptions(false); }}
          >
            <Text style={[styles.sortOptionText, { color: colors.text }]}>Đánh giá cao - thấp</Text>
          </TouchableOpacity>
        </View>
      )}
      <View style={styles.container}>
        <FlatList
          data={sortedBooks}
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
    flex: 1,
  },
  list: {
    justifyContent: "center",
    alignItems: "center",
  },
  row: {
    justifyContent: "space-between",
    marginBottom: 10,
  },
  sortOptions: {
    backgroundColor: "#FFF",
    padding: 10,
    borderRadius: 5,
    marginTop: 100,
    elevation: 5,
    alignItems: "flex-end",
    position: "absolute",
    borderWidth: 1,
    right: 10,
    zIndex: 1,
  },
  sortOption: {
    paddingVertical: 5,
    alignItems: "flex-start",
    width: "100%",
  },
  sortOptionText: {
    textAlign: "left",
  },
});

export default SeeAllScreen;