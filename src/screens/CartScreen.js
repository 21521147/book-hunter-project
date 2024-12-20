import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  Image,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import Icon from "react-native-vector-icons/Ionicons";
import { ThemeContext } from "../contexts/ThemeContext";
import { UserContext } from "../contexts/UserContext";
import Loading from "../components/Loading";
import cartService from "../services/cartService";
import authService from "../services/authService";
import bookService from "../services/bookService";

const CartScreen = ({ navigation }) => {
  const { colors, fontSizes } = useContext(ThemeContext);
  const { user } = useContext(UserContext);
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCartItems = async () => {
    setLoading(true);
    try {
      const userInfo = await authService.getUserInfo(user.id);
      if (userInfo && userInfo.cart) {
        const items = await cartService.getCartItems(userInfo.cart);
        const itemsWithDetails = await Promise.all(
          items.map(async (item, index) => {
            const bookDetails = await bookService.getBookById(item.id);
            return { ...item, ...bookDetails, cartId: userInfo.cart[index] };
          })
        );
        setCartItems(itemsWithDetails);
      }
    } catch (error) {
      console.error("Error fetching cart items:", error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      if (user) {
        fetchCartItems();
      }
    }, [user])
  );

  const updateQuantity = async (itemId, change) => {
    try {
      const updatedItems = cartItems.map((item) => {
        if (item.cartId === itemId) {
          const newQuantity = Math.max(1, item.quantity + change);
          return { ...item, quantity: newQuantity };
        }
        return item;
      });
      setCartItems(updatedItems);

      // Cập nhật số lượng trong cơ sở dữ liệu (nếu cần)
      await cartService.updateCartItemQuantity(itemId, change);
    } catch (error) {
      console.error("Error updating quantity:", error);
    }
  };

  const removeFromCart = async (itemId) => {
    try {
      const userId = user.id;
      const result = await cartService.removeFromCart(itemId, userId);
      if (result.success) {
        setCartItems((prevItems) =>
          prevItems.filter((item) => item.cartId !== itemId)
        );
        Alert.alert("Success", result.message);
      } else {
        Alert.alert("Error", result.message);
      }
    } catch (error) {
      console.error("Error removing item from cart:", error);
      Alert.alert("Error", "Failed to remove item from cart.");
    }
  };

  const totalCost = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      {user ? (
        <>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.navigate("Home")}>
              <Icon name="arrow-back" size={24} color={colors.primary} />
            </TouchableOpacity>
            <Text style={[styles.headerText, { color: colors.text }]}>
              Giỏ hàng
            </Text>
            <TouchableOpacity onPress={() => fetchCartItems()}>
              <Icon name="reload" size={24} color={colors.primary} />
            </TouchableOpacity>
          </View>
          {loading ? (
            <Loading />
          ) : cartItems.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={[styles.emptyText, { color: colors.secondary }]}>
                Giỏ hàng của bạn đang trống
              </Text>
              <TouchableOpacity
                style={styles.shopButton}
                onPress={() => navigation.navigate("Home")}
              >
                <Text style={[styles.shopButtonText, { color: "#fff" }]}>
                  Mua sắm ngay
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            <>
              <ScrollView style={styles.cartContainer}>
                {cartItems.map((item) => (
                  <View style={styles.itemContainer} key={item.cartId}>
                    <Image
                      source={{ uri: item.images[0] }}
                      style={styles.bookImage}
                    />
                    <View style={styles.itemDetails}>
                      <Text style={[styles.itemText, { color: colors.text }]}>
                        {item.name}
                      </Text>
                      <Text
                        style={[styles.itemText, { color: colors.primary }]}
                      >
                        {item.price.toLocaleString()} VND
                      </Text>
                      <View style={styles.quantityContainer}>
                        <TouchableOpacity
                          onPress={() => updateQuantity(item.cartId, -1)}
                        >
                          <Icon
                            name="remove-circle-outline"
                            size={24}
                            color={colors.primary}
                          />
                        </TouchableOpacity>
                        <Text style={styles.quantityText}>{item.quantity}</Text>
                        <TouchableOpacity
                          onPress={() => updateQuantity(item.cartId, 1)}
                        >
                          <Icon
                            name="add-circle-outline"
                            size={24}
                            color={colors.primary}
                          />
                        </TouchableOpacity>
                      </View>
                    </View>
                    <TouchableOpacity
                      onPress={() => removeFromCart(item.cartId)}
                    >
                      <Icon name="trash" size={24} color={colors.primary} />
                    </TouchableOpacity>
                  </View>
                ))}
              </ScrollView>
              <View style={styles.totalContainer}>
                <Text style={styles.totalText}>
                  Tổng cộng: {totalCost.toLocaleString()} VND
                </Text>
                <TouchableOpacity
                  style={styles.buttonContainer}
                  onPress={() =>
                    Alert.alert("Checkout", "Thanh toán thành công!")
                  }
                >
                  <Text style={styles.buttonText}>Thanh Toán</Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </>
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={[styles.emptyText, { color: colors.secondary }]}>
            Bạn cần đăng nhập để xem giỏ hàng
          </Text>
          <TouchableOpacity
            style={styles.shopButton}
            onPress={() => navigation.navigate("BottomMain", { screen: "Profile" })}
          >
            <Text style={[styles.shopButtonText, { color: "#fff" }]}>
              Đăng nhập
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#f8f9fa",
  },
  headerText: {
    fontSize: 20,
    fontWeight: "bold",
  },
  cartContainer: {
    flex: 1,
    backgroundColor: "#fff",
  },
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  bookImage: {
    width: 60,
    height: 90,
    marginRight: 10,
  },
  itemDetails: {
    flex: 1,
  },
  itemText: {
    fontSize: 16,
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
  },
  quantityText: {
    marginHorizontal: 10,
    fontSize: 16,
    fontWeight: "bold",
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
  totalContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    margin: 10,
  },
  totalText: {
    fontSize: 20,
    fontWeight: "bold",
  },
  buttonContainer: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    backgroundColor: "#3399FF",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    lineHeight: 20,
    textAlignVertical: "center",
  },
});

export default CartScreen;
