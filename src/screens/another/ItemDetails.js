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
          const items = await cartService.getCartItems(userInfo.cart);
          const item = items.find((item) => item.id === bookId);
          if (item) {
            setButtonText("Added to Cart");
          }
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
    <SafeAreaView style={styles.safeArea}>
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
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
      <View style={styles.footer}>
        <View style={styles.quantityContainer}>
          <TouchableOpacity
            onPress={decrementQuantity}
            style={styles.quantityButton}
          >
            <Icon name="remove" size={20} color={colors.primary} />
          </TouchableOpacity>
          <Text style={styles.quantityText}>{quantity}</Text>
          <TouchableOpacity
            onPress={incrementQuantity}
            style={styles.quantityButton}
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
          <Text style={[styles.addToCartButtonText, { color: colors.textSrd }]}>
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
    backgroundColor: "#fff",
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
    backgroundColor: "#f8f9fa",
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
    marginTop: 5,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    overflow: "hidden",
    width: 120,
  },
  quantityButton: {
    padding: 10,
    backgroundColor: "#f0f0f0",
  },
  quantityText: {
    fontSize: 16,
    fontWeight: "bold",
    paddingHorizontal: 10,
    backgroundColor: "#fff",
    textAlign: "center",
    flex: 1,
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
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: "#ccc",
    backgroundColor: "#fff",
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
});

export default ItemDetails;
