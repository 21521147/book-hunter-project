import React, { useState, useEffect, useContext } from "react";
import { View, Text, SafeAreaView, TextInput, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import * as ImagePicker from 'expo-image-picker';
import bookService from "../services/bookService";
import BookBox from "../components/BookBox";
import { ThemeContext } from "../contexts/ThemeContext";
import Loading from "../components/Loading";

const SearchScreen = ({ navigation }) => {
  const { colors, fontSizes } = useContext(ThemeContext);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [popularSearches, setPopularSearches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sortOption, setSortOption] = useState("priceHighToLow");
  const [filters, setFilters] = useState({
    publisher: "",
    brand: "",
    priceRange: [0, 1000000],
    genre: "",
  });
  const [showFilters, setShowFilters] = useState(false);
  const [showSortOptions, setShowSortOptions] = useState(false);

  useEffect(() => {
    const fetchBooks = async () => {
      if (query === "") {
        setResults([]);
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const allBooks = await bookService.getAllBooks();
        const filteredBooks = allBooks.filter(book =>
          book.name.toLowerCase().includes(query.toLowerCase()) ||
          book.genre.toLowerCase().includes(query.toLowerCase()) ||
          book.authors.some(author => author.toLowerCase().includes(query.toLowerCase()))
        );
        setResults(filteredBooks);
        setShowFilters(true);
      } catch (error) {
        console.error("Error searching books: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, [query]);

  useEffect(() => {
    const fetchPopularSearches = async () => {
      try {
        const popularBooks = await bookService.getTop10BooksByRatingAvg();
        setPopularSearches(popularBooks);
      } catch (error) {
        console.error("Error fetching popular searches: ", error);
      }
    };

    fetchPopularSearches();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [filters, sortOption]);

  const applyFilters = () => {
    let filtered = results.filter((book) => {
      const matchesPublisher = filters.publisher
        ? book.publisher.includes(filters.publisher)
        : true;
      const matchesBrand = filters.brand
        ? book.brand.includes(filters.brand)
        : true;
      const matchesPrice =
        book.price >= filters.priceRange[0] &&
        book.price <= filters.priceRange[1];
      const matchesGenre = filters.genre
        ? book.genre.includes(filters.genre)
        : true;

      return (
        matchesPublisher && matchesBrand && matchesPrice && matchesGenre
      );
    });

    if (sortOption === "priceHighToLow") {
      filtered.sort((a, b) => b.price - a.price);
    } else if (sortOption === "priceLowToHigh") {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sortOption === "nameAZ") {
      filtered.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortOption === "nameZA") {
      filtered.sort((a, b) => b.name.localeCompare(a.name));
    }

    setResults(filtered);
  };

  const handleImageSearch = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      alert('Sorry, we need camera permissions to make this work!');
      return;
    }

    const result = await ImagePicker.launchCameraAsync();
    if (!result.cancelled) {
      // Implement image search logic here
      console.log(result.uri);
    }
  };

  if (loading) {
    return (
      <Loading />
    );
  }

  return (
    <SafeAreaView style={[styles.safeArea, {backgroundColor: colors.background}]}>
      <View style={styles.container}>
        <View style={styles.searchContainer}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon name="arrow-back" size={24} color={colors.primary} />
          </TouchableOpacity>
          <View style={styles.searchInputContainer}>
            <TextInput
              style={[styles.searchInput, { color: colors.text }]}
              placeholder="Search by book name, genre, or author"
              placeholderTextColor={colors.secondary}
              value={query}
              onChangeText={setQuery}
            />
            <TouchableOpacity onPress={handleImageSearch}>
              <Icon name="camera" size={20} color={colors.primary} style={styles.cameraIcon} />
            </TouchableOpacity>
            <Icon name="search" size={20} color={colors.primary} style={styles.searchIcon} />
          </View>
        </View>
        {showFilters && (
          <View style={styles.filterContainer}>
            <TouchableOpacity
              style={styles.filterButton}
              onPress={() => setShowSortOptions(!showSortOptions)}
            >
              <Icon name="filter" size={20} color={colors.primary} />
              <Text style={{ color: colors.text, marginLeft: 5 }}>Sắp xếp</Text>
            </TouchableOpacity>
            {showSortOptions && (
              <View style={styles.sortOptions}>
                <TouchableOpacity
                  style={styles.sortOption}
                  onPress={() => setSortOption("nameAZ")}
                >
                  <Text style={{ color: colors.text }}>A-Z</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.sortOption}
                  onPress={() => setSortOption("nameZA")}
                >
                  <Text style={{ color: colors.text }}>Z-A</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.sortOption}
                  onPress={() => setSortOption("priceHighToLow")}
                >
                  <Text style={{ color: colors.text }}>Giá cao - thấp</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.sortOption}
                  onPress={() => setSortOption("priceLowToHigh")}
                >
                  <Text style={{ color: colors.text }}>Giá thấp - cao</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        ) : results.length === 0 && query === "" ? (
          <>
            <View style={styles.popularSearchesHeaderContainer}>
              <Icon name="flame" size={20} color={colors.primary} style={styles.popularSearchesIcon} />
              <Text style={[styles.popularSearchesHeader, { color: colors.text, fontSize: fontSizes.large }]}>
                Tìm kiếm phổ biến
              </Text>
            </View>
            <FlatList
              data={popularSearches}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <BookBox item={item} navigation={navigation} />
              )}
              showsVerticalScrollIndicator={false}
              numColumns={2}
              columnWrapperStyle={styles.row}
              contentContainerStyle={styles.list}
            />
          </>
        ) : results.length === 0 && query !== "" ? (
          <Text style={[styles.noResultsText, { color: colors.secondary, fontSize: fontSizes.medium }]}>
            Xin lỗi! Chúng tôi chưa có sách bạn đang cần
          </Text>
        ) : (
          <FlatList
            data={results}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <BookBox item={item} navigation={navigation} />
            )}
            numColumns={2}
            columnWrapperStyle={styles.row}
            contentContainerStyle={styles.list}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginLeft: 8,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 8,
    backgroundColor: "#fff",
    paddingHorizontal: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    paddingHorizontal: 8,
  },
  searchIcon: {
    marginLeft: 8,
  },
  cameraIcon: {
    marginLeft: 8,
  },
  list: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  noResultsText: {
    textAlign: 'center',
    marginTop: 20,
  },
  popularSearchesHeaderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  popularSearchesIcon: {
    marginRight: 8,
  },
  popularSearchesHeader: {
    fontWeight: 'bold',
    textAlign: 'left',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  filterContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginBottom: 10,
  },
  filterButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderRadius: 5,
  },
  sortOptions: {
    position: "absolute",
    top: 40,
    right: 0,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderRadius: 5,
    zIndex: 1,
  },
  sortOption: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
});

export default SearchScreen;