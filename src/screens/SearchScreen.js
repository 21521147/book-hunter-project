import React, { useState, useEffect, useContext } from "react";
import { View, Text, SafeAreaView, TextInput, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import * as ImagePicker from 'expo-image-picker';
import bookService from "../services/bookService";
import BookBox from "../components/BookBox";
import { ThemeContext } from "../contexts/ThemeContext";

const SearchScreen = ({ navigation }) => {
  const { colors, fontSizes } = useContext(ThemeContext);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [popularSearches, setPopularSearches] = useState([]);
  const [loading, setLoading] = useState(false);

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

  return (
    <SafeAreaView style={styles.safeArea}>
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
    backgroundColor: "#f8f8f8",
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
});

export default SearchScreen;