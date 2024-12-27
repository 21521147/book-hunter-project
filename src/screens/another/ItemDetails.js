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
import { CartContext } from "../../contexts/CartContext";
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
  const [buttonText, setButtonText] = useState("Thêm vào giỏ hàng");
  const { colors, fontSizes } = useContext(ThemeContext);
  const { user } = useContext(UserContext);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const { cartItemCount, fetchCartItemsCount } = useContext(CartContext);

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

        if (userInfo) {
          const cartItems = await cartService.getCartItems(user.id);
          if (cartItems.length > 0) {
            const bookIdsInCart = cartItems.map((item) => item.id);
            if (bookIdsInCart.includes(bookId)) {
              setButtonText("Đã thêm vào giỏ hàng");
            }
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
        fetchCartItemsCount();
        setButtonText("Đã thêm vào giỏ hàng");
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

  const handleBuyNow = () => {
    if (!user) {
      Alert.alert(
        "Bạn chưa đăng nhập",
        "Bạn cần đăng nhập để mua sách.",
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
    // Navigate to checkout screen with the current book
    navigation.navigate("CheckoutFBScreen", { bookId: book.id, quantity: quantity, price: book.price, totalCost: book.price * quantity });
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
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: colors.background }]}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }} // Add padding to avoid footer overlap
      >
        <View style={[styles.header, {backgroundColor: colors.background}]}>
          <View style={styles.headerLeft}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Icon name="arrow-back" size={24} color={colors.primary} />
            </TouchableOpacity>
            <TouchableOpacity onPress={toggleFavorite} style={styles.saveButton}>
              <Icon
                name="bookmark"
                size={35}
                color={isFavorite ? colors.primary : colors.secondary}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.headerIcons}>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("BottomMain", { screen: "SearchScreen" })
              }
            >
              <Icon name="search" size={24} color={colors.primary} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("BottomMain", { screen: "HomeScreen" })
              }
            >
              <Icon name="home" size={24} color={colors.primary} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("BottomMain", { screen: "CartScreen" })
              }
            >
              <Icon name="cart" size={24} color={colors.primary} />
              {cartItemCount > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{cartItemCount}</Text>
                </View>
              )}
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
              { fontSize: fontSizes.medium, color: 'black' },
            ]}
          >
            Tác giả: {book.authors.join(", ")}
          </Text>
          <Text
            style={[
              styles.price,
              { fontSize: fontSizes.medium, color: 'red' },
            ]}
          >
            Giá: {book.price.toLocaleString()} VND
          </Text>
          <Text style={{ fontSize: fontSizes.medium, color: colors.text }}>
            Mô tả:{" "}
          </Text>
          <Text
            style={{
              fontSize: fontSizes.medium,
              color: colors.text,
              textAlign: "justify",
            }}
          >
            {showFullDescription
              ? book.description
              : `${book.description.substring(0, 500)}...`}
          </Text>
          {book.description.length > 100 && (
            <TouchableOpacity onPress={() => setShowFullDescription(!showFullDescription)}>
              <Text style={{ color: colors.primary, marginTop: 5, textAlign: "left" }}>
                {showFullDescription ? "Thu gọn" : "Xem thêm"}
                <Icon
                  name={showFullDescription ? "chevron-up" : "chevron-down"}
                  size={14}
                  color={colors.primary}
                />
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>

      <View style={[styles.footer, {backgroundColor: colors.background, position: 'absolute', bottom: 0, width: '100%'}]}>
        <View style={[styles.quantityContainer, {backgroundColor: colors.background}]}>
          <TouchableOpacity
            onPress={decrementQuantity}
            style={[
              styles.quantityButton,
              { backgroundColor: colors.background },
            ]}
          >
            <Icon name="remove" size={20} color={colors.primary} />
          </TouchableOpacity>
          <Text style={[styles.quantityText, { color: colors.text }]}>
            {quantity}
          </Text>
          <TouchableOpacity
            onPress={incrementQuantity}
            style={[
              styles.quantityButton,
              { backgroundColor: colors.background },
            ]}
          >
            <Icon name="add" size={20} color={colors.primary} />
          </TouchableOpacity>
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[
              styles.addToCartButton,
              {
                backgroundColor:
                  buttonText === "Đã thêm vào giỏ hàng"
                    ? colors.secondary
                    : colors.primary,
                height: 50,
              },
            ]}
            onPress={addToCart}
            disabled={buttonText === "Đã thêm vào giỏ hàng"}
          >
            <Icon name="cart" size={20} color={colors.textSrd} />
            <Text
              style={[styles.addToCartButtonText, { color: colors.textSrd }]}
              numberOfLines={2}
            >
              {buttonText}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.buyNowButton, { backgroundColor: 'red', height: 50 }]}
            onPress={handleBuyNow}
          >
            <Text style={[styles.buyNowButtonText, { color: colors.textSrd }]}>
              Mua ngay
            </Text>
          </TouchableOpacity>
        </View>
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
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerIcons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: 100,
  },
  badge: {
    position: "absolute",
    right: -6,
    top: -3,
    backgroundColor: "red",
    borderRadius: 6,
    width: 14,
    height: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  badgeText: {
    color: "white",
    fontSize: 10,
    fontWeight: "bold",
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
    width: 100,
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
  buttonContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  addToCartButton: {
    marginLeft: 10,
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    width: 120,
    flexDirection: "column",
    justifyContent: "center",
  },
  addToCartButtonText: {
    fontSize: 10,
    textAlign: "center",
    marginTop: 5,
  },
  buyNowButton: {
    marginLeft: 5,
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    width: 120,
    height: 50,
    justifyContent: "center",
  },
  buyNowButtonText: {
    fontSize: 16,
    textAlign:"center",
    fontWeight: "bold",
    textAlignVertical: "center",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: "#ccc",
    marginBottom: 5
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
  saveButton: {
    marginLeft: 10,
    padding: 5,
  },
});

export default ItemDetails;
