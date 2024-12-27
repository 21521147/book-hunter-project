import React, { useState, useEffect, useContext } from "react";
import { View, FlatList, StyleSheet, Text, SafeAreaView, TouchableOpacity, TextInput } from "react-native";
import BookBox from "../components/BookBox";
import bookService from "../services/bookService";
import Loading from "../components/Loading";
import { ThemeContext } from "../contexts/ThemeContext";
import Icon from "react-native-vector-icons/Ionicons";

const SearchScreen = ({ navigation }) => {
  const { colors } = useContext(ThemeContext);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [showSortOptions, setShowSortOptions] = useState(false);
  const [sortOption, setSortOption] = useState("nameAZ");

  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);
      try {
        const fetchedBooks = await bookService.getAllBooks();
        setBooks(fetchedBooks);
      } catch (error) {
        console.error("Error fetching books: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  const renderItem = ({ item }) => (
    <BookBox item={item} navigation={navigation} />
  );

  const filteredBooks = books.filter(book =>
    book.name.toLowerCase().includes(searchText.toLowerCase())
  );

  const sortedBooks = [...filteredBooks].sort((a, b) => {
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
        <View style={[styles.searchContainer, { borderColor: colors.primary }]}>
          <Icon name="search" size={24} color={colors.primary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Tìm kiếm sách, tác giả ..."
            value={searchText}
            onChangeText={setSearchText}
          />
        </View>
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
        <Text style={[styles.listHeader, { color: colors.primary }]}>
          Được tìm kiếm nhiều nhất
        </Text>
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
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    flex: 1,
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
  },
  container: {
    flex: 1,
    padding: 10,
  },
  listHeader: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  list: {
    justifyContent: "center",
    alignItems: "center",
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

export default SearchScreen;