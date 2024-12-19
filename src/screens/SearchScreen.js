import React, { useState, useEffect } from "react";
import { View, Text, SafeAreaView, TextInput, FlatList, StyleSheet, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import * as ImagePicker from 'expo-image-picker';
import bookService from "../services/bookService";
import BookBox from "../components/BookBox";

const SearchScreen = ({ navigation }) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [popularSearches, setPopularSearches] = useState([]);

  useEffect(() => {
    const fetchBooks = async () => {
      if (query === "") {
        setResults([]);
        return;
      }
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
            <Icon name="arrow-back" size={24} color="#6200ee" />
          </TouchableOpacity>
          <View style={styles.searchInputContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder="Search by book name, genre, or author"
              value={query}
              onChangeText={setQuery}
            />
            <TouchableOpacity onPress={handleImageSearch}>
              <Icon name="camera" size={20} color="#6200ee" style={styles.cameraIcon} />
            </TouchableOpacity>
            <Icon name="search" size={20} color="#6200ee" style={styles.searchIcon} />
          </View>
        </View>
        {results.length === 0 && query === "" && (
          <View style={styles.popularSearchesHeaderContainer}>
            <Icon name="flame" size={20} color="#6200ee" style={styles.popularSearchesIcon} />
            <Text style={styles.popularSearchesHeader}>Tìm kiếm phổ biến</Text>
          </View>
        )}
        {results.length === 0 && query !== "" ? (
          <Text style={styles.noResultsText}>Xin lỗi! Chúng tôi chưa có sách bạn đang cần</Text>
        ) : (
          <FlatList
            data={results.length > 0 ? results : popularSearches}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <BookBox item={item} navigation={navigation} />
            )}
            numColumns={2}
            columnWrapperStyle={styles.row}
            contentContainerStyle={styles.list}
          />
        )}
        <TouchableOpacity style={styles.homeButton} onPress={() => navigation.navigate("Home")}>
          <Text style={styles.homeButtonText}>Go to Home</Text>
        </TouchableOpacity>
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
    justifyContent: 'space-around',
  },
  row: {
    justifyContent: 'space-between',
  },
  noResultsText: {
    textAlign: 'center',
    color: 'gray',
    fontSize: 16,
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
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'left',
  },
  homeButton: {
    backgroundColor: "#6200ee",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 16,
  },
  homeButtonText: {
    color: "#fff",
    fontSize: 16,
  },
});

export default SearchScreen;