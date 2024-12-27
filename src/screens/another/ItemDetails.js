import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  Modal,
  Image,
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
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [showFullDescription, setShowFullDescription] = useState(false);

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

  const handleImagePress = (image) => {
    setSelectedImage(image);
    setModalVisible(true);
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
    <SafeAreaView style={[styles.safeArea, {backgroundColor: colors.background}]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
      >
        <View style={[styles.header, {backgroundColor: colors.background}]}>
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
        <TouchableOpacity onPress={() => handleImagePress(book.images[0])}>
          <ImageSlider images={book.images} />
        </TouchableOpacity>
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
          <Text style={{ fontSize: fontSizes.medium, color: colors.text, textAlign: "justify" }}>
            {showFullDescription ? book.description : `${book.description.substring(0, 500)}...`}
          </Text>
          {book.description.length > 100 && (
            <TouchableOpacity onPress={() => setShowFullDescription(!showFullDescription)}>
              <Text style={{ color: colors.primary, marginTop: 5 }}>
                {showFullDescription ? "Thu gọn" : "Xem thêm"}
              </Text>
              {!showFullDescription && (
                <View style={styles.fadeEffect}>
                  <Text style={{ color: colors.text, opacity: 0.5 }}>
                    {book.description.substring(500, 520)}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
      <View style={[styles.footer, {backgroundColor: colors.background}]}>
        <TouchableOpacity onPress={toggleFavorite} style={styles.heartButton}>
          <Icon
            name="heart"
            size={35}
            color={isFavorite ? "red" : colors.secondary}
          />
        </TouchableOpacity>
        <View style={[styles.quantityContainer, {backgroundColor: colors.background}]}>
          <TouchableOpacity
            onPress={decrementQuantity}
            style={[styles.quantityButton, {backgroundColor: colors.background}]}
          >
            <Icon name="remove" size={20} color={colors.primary} />
          </TouchableOpacity>
          <Text style={[styles.quantityText, {color: colors.text}]}>{quantity}</Text>
          <TouchableOpacity
            onPress={incrementQuantity}
            style={[styles.quantityButton, {backgroundColor: colors.background}]}
          >
            <Icon name="add" size={20} color={colors.primary} />
          </TouchableOpacity>
        </View>
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
      {selectedImage && (
        <Modal
          visible={modalVisible}
          transparent={true}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <Image source={{ uri: selectedImage }} style={styles.modalImage} />
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </Modal>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
  },
  headerIcons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: 100,
  },
  content: {
    padding: 20,
  },
  title: {
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
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
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    overflow: "hidden",
    width: 150,
  },
  quantityButton: {
    padding: 10,

  },
  quantityText: {
    fontSize: 16,
    fontWeight: "bold",
    paddingHorizontal: 10,
    textAlign: "center",
    flex: 1,
  },
  addToCartButton: {
    marginLeft: 10,
    padding: 10,
    borderRadius: 5,
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
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: "#ccc",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.8)",
  },
  modalImage: {
    width: "90%",
    aspectRatio: 1,
    resizeMode: "contain",
  },
  closeButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "#fff",
    borderRadius: 5,
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
  },
  heartButton: {
    padding: 5,
  },
  fadeEffect: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 20,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
  },
});

export default ItemDetails;
