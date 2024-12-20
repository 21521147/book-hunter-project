import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Alert,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import bookService from "../../services/bookService";
import { ThemeContext } from "../../contexts/ThemeContext";
import { UserContext } from "../../contexts/UserContext";
import Loading from "../../components/Loading";
import BookBox from "../../components/BookBox";

const FavoriteScreen = ({ navigation }) => {
  const { colors, fontSizes } = useContext(ThemeContext);
  const { user } = useContext(UserContext);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const userId = user.id;
        const favoriteBookIds = await bookService.getAllFavorites(userId);
        const favoriteBooks = await Promise.all(
          favoriteBookIds.map(async (bookId) => {
            const bookDetails = await bookService.getBookById(bookId);

            return bookDetails;
          })
        );
        setFavorites(favoriteBooks);
        console.log("Favorite books:", favoriteBooks);
      } catch (error) {
        console.error("Error fetching favorite books:", error);
        Alert.alert("Error", "Failed to fetch favorite books.");
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchFavorites();
    }
  }, [user]);

  if (loading) {
    return <Loading />;
  }

  if (!user) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={[styles.emptyText, { color: colors.secondary }]}>
          Bạn cần đăng nhập để xem mục yêu thích
        </Text>
        <TouchableOpacity
          style={styles.shopButton}
          onPress={() => navigation.navigate("Login")}
        >
          <Text style={[styles.shopButtonText, { color: "#fff" }]}>
            Đăng nhập
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (favorites.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={[styles.emptyText, { color: colors.secondary }]}>
          Bạn chưa có sách yêu thích
        </Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon name="arrow-back" size={24} color={colors.primary} />
          </TouchableOpacity>
          <Text
            style={[
              styles.headerText,
              { color: colors.text, fontSize: fontSizes.large },
            ]}
          >
            Yêu thích
          </Text>
          <View style={{ width: 24 }} />
        </View>
        <FlatList
          data={favorites}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <BookBox item={item} navigation={navigation} />
          )}
          numColumns={2}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.list}
        />

      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  headerText: {
    fontWeight: "bold",
    textAlign: "center",
    flex: 1,
  },
  list: {
    paddingBottom: 20,
  },
  row: {
    justifyContent: "space-between",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    textAlign: "center",
    marginBottom: 20,
    fontSize: 18,
  },
  shopButton: {
    backgroundColor: "#0A51B0",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  shopButtonText: {
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default FavoriteScreen;
