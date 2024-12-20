import React, { useState, useEffect, useContext, use } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Alert,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import bookService from "../../services/bookService";
import Loading from "../../components/Loading";
import ImageSlider from "../../components/ImageSlider";
import { ThemeContext } from "../../contexts/ThemeContext";
import { UserContext } from "../../contexts/UserContext";
import cartService from "../../services/cartService";
import Icon from "react-native-vector-icons/Ionicons";
import authService from "../../services/authService";

const ItemDetails = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { bookId } = route.params;
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [buttonText, setButtonText] = useState("Add to Cart");
  const { colors, fontSizes } = useContext(ThemeContext);
  const { user } = useContext(UserContext);

  useEffect(() => {
    const fetchBookDetails = async () => {
      try {
        const bookDetails = await bookService.getBookById(bookId);
        setBook(bookDetails);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching book details:", error);
        setLoading(false);
      }
    };

    const checkIfInCart = async () => {
      try {
        const userInfo = await authService.getUserInfo(user.id);
        if (userInfo && userInfo.cart) {
          const cartItems = await cartService.getCartItems(userInfo.cart);
          const bookIdsInCart = cartItems.map((item) => item.id);
          if (bookIdsInCart.includes(bookId)) {
            setButtonText("Added to Cart");
          }
        }
        if (
          userInfo &&
          userInfo.savedItems &&
          userInfo.savedItems.includes(bookId)
        ) {
          setIsFavorite(true);
        }
      } catch (error) {
        console.error("Error checking if book is in cart:", error);
      }
    };

    fetchBookDetails();
    if (user) {
      checkIfInCart();
    }
  }, [bookId]);

  const addToCart = async () => {
    try {
      if (!user) {
        Alert.alert(
          "Bạn chưa đăng nhập",
          "Bạn cần đăng nhập để thêm sách vào giỏ hàng.",
          [
            {
              text: "Đăng nhập",
              onPress: () =>
                navigation.navigate("BottomMain", { screen: "Profile" }),
            },
            {
              text: "Cancel",
              style: "cancel",
            },
          ],
          { cancelable: false }
        );
        return;
      }

      const cartItem = {
        id: book.id,
        quantity: quantity,
      };

      const result = await cartService.addToCart(cartItem, user.id);
      if (result.success) {
        setButtonText("Added to Cart");
        Alert.alert("Success", result.message);
      } else {
        Alert.alert("Error", result.message);
      }
    } catch (error) {
      console.error("Error adding book to cart:", error);
      Alert.alert("Error", "Failed to add book to cart.");
    }
  };

  const toggleFavorite = async () => {
    try {
      if (!user) {
        Alert.alert(
          "Bạn chưa đăng nhập",
          "Bạn cần đăng nhập để thêm sách vào giỏ hàng.",
          [
            {
              text: "Đăng nhập",
              onPress: () =>
                navigation.navigate("BottomMain", { screen: "Profile" }),
            },
            {
              text: "Cancel",
              style: "cancel",
            },
          ],
          { cancelable: false }
        );
        return;
      }

      if (isFavorite) {
        const result = await bookService.removeFavorites(user.id, book.id);
        if (result.success) {
          setIsFavorite(false);
          Alert.alert("Thành công", "Đã xóa khỏi mục yêu thích!");
        } else {
          Alert.alert("Lỗi", result.message);
        }
      } else {
        const result = await bookService.saveFavorites(user.id, book.id);
        if (result.success) {
          setIsFavorite(true);
          Alert.alert("Thành công", "Đã thêm vào mục yêu thích!");
        } else {
          Alert.alert("Lỗi", result.message);
        }
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
      Alert.alert("Error", "Failed to toggle favorite.");
    }
  };

  const incrementQuantity = () => {
    setQuantity((prevQuantity) => prevQuantity + 1);
  };

  const decrementQuantity = () => {
    setQuantity((prevQuantity) => (prevQuantity > 1 ? prevQuantity - 1 : 1));
  };

  if (loading) {
    return <Loading />;
  }

  if (!book) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Book not found</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon name="arrow-back" size={24} color={colors.primary} />
          </TouchableOpacity>
          <View style={styles.headerIcons}>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("BottomMain", { screen: "Search" })
              }
            >
              <Icon name="search" size={24} color={colors.primary} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("BottomMain", { screen: "Home" })
              }
            >
              <Icon name="home" size={24} color={colors.primary} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("BottomMain", { screen: "Cart" })
              }
            >
              <Icon name="cart" size={24} color={colors.primary} />
            </TouchableOpacity>
          </View>
        </View>
        <ImageSlider images={book.images} />
        <View style={styles.content}>
          <Text
            style={[
              styles.title,
              { fontSize: fontSizes.xLarge, color: colors.primary },
            ]}
          >
            {book.name}
          </Text>
          <Text
            style={[
              styles.author,
              { fontSize: fontSizes.medium, color: colors.secondary },
            ]}
          >
            Tác giả: {book.authors.join(", ")}
          </Text>
          <Text
            style={[
              styles.price,
              { fontSize: fontSizes.medium, color: colors.secondary },
            ]}
          >
            Giá: {book.price.toLocaleString()} VND
          </Text>
          <Text style={{ fontSize: fontSizes.medium, color: colors.text }}>
            Mô tả:{" "}
          </Text>
          <Text style={{ fontSize: fontSizes.medium, color: colors.text }}>
            {book.description}
          </Text>
        </View>
      </ScrollView>
      <View style={styles.footer}>
        <TouchableOpacity onPress={toggleFavorite} style={styles.heartButton}>
          <Icon
            name="heart"
            size={35}
            color={isFavorite ? colors.primary : colors.secondary}
          />
        </TouchableOpacity>
        <View style={styles.quantityContainer}>
          <TouchableOpacity
            onPress={decrementQuantity}
            style={styles.quantityButton}
          >
            <Text style={styles.quantityButtonText}>-</Text>
          </TouchableOpacity>
          <Text style={styles.quantityText}>{quantity}</Text>
          <TouchableOpacity
            onPress={incrementQuantity}
            style={styles.quantityButton}
          >
            <Text style={styles.quantityButtonText}>+</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.addToCartButton,
              {
                backgroundColor:
                  buttonText === "Added to Cart"
                    ? colors.secondary
                    : colors.primary,
              },
            ]}
            onPress={addToCart}
            disabled={buttonText === "Added to Cart"}
          >
            <Text
              style={[styles.addToCartButtonText, { color: colors.textSrd }]}
            >
              {buttonText}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    flex: 1,
    width: "100%",
  },
  content: {
    padding: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 20,
  },
  headerIcons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: 100,
  },
  image: {
    width: "100%",
    height: 300,
    resizeMode: "cover",
    borderRadius: 10,
    marginBottom: 20,
  },
  title: {
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },
  infoContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  label: {
    fontWeight: "bold",
    marginRight: 5,
  },
  author: {
    marginBottom: 10,
  },
  price: {
    marginBottom: 20,
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  quantityButton: {
    backgroundColor: "#ddd",
    padding: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    marginHorizontal: 10,
  },
  quantityButtonText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  quantityText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  addToCartButton: {
    marginVertical: 5,
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
  },
  addToCartButtonText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 1,
  },
  heartButton: {
    padding: 5,
  },
});

export default ItemDetails;
