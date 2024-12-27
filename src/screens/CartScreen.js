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
import { CartContext } from "../contexts/CartContext";
import Loading from "../components/Loading";
import cartService from "../services/cartService";
import bookService from "../services/bookService";

const CartScreen = ({ navigation }) => {
  const { colors, fontSizes } = useContext(ThemeContext);
  const { user } = useContext(UserContext);
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const { fetchCartItemsCount } = useContext(CartContext);

  const fetchCartItems = async () => {
    setLoading(true);
    fetchCartItemsCount();
    try {
      if (user) {
        const items = await cartService.getCartItems(user.id);
        const itemsWithDetails = await Promise.all(
          items.map(async (item) => {
            const bookDetails = await bookService.getBookById(item.id);
            return { ...item, ...bookDetails };
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
      const item = cartItems.find((item) => item.id === itemId);
      if (item.quantity === 1 && change === -1) {
        Alert.alert(
          "Xác nhận",
          "Bạn có chắc chắn muốn xóa sản phẩm này khỏi giỏ hàng?",
          [
            {
              text: "Không",
              style: "cancel",
            },
            {
              text: "Có",
              onPress: () => removeFromCart(itemId),
            },
          ],
          { cancelable: true }
        );
        return;
      }

      const updatedItems = cartItems.map((item) => {
        if (item.id === itemId) {
          const newQuantity = Math.max(1, item.quantity + change);
          return { ...item, quantity: newQuantity };
        }
        return item;
      });
      setCartItems(updatedItems);

      await cartService.updateCartItemQuantity(itemId, user.id, change);
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
        fetchCartItems()
      } else {
        Alert.alert("Error", result.message);
      }
    } catch (error) {
      console.error("Error removing item from cart:", error);
      Alert.alert("Error", "Failed to remove item from cart.");
    }
  };

  const confirmRemoveFromCart = (itemId) => {
    Alert.alert(
      "Xác nhận",
      "Bạn có chắc chắn muốn xóa sản phẩm này khỏi giỏ hàng?",
      [
        {
          text: "Không",
          style: "cancel",
        },
        {
          text: "Có",
          onPress: () => removeFromCart(itemId),
        },
      ],
      { cancelable: true }
    );
  };

  const totalCost = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: colors.background }]}
    >
      {user ? (
        <>
          <View style={[styles.header, { backgroundColor: colors.background }]}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
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
                onPress={() => navigation.navigate("HomeScreen")}
              >
                <Text style={[styles.shopButtonText, { color: "#fff" }]}>
                  Mua sắm ngay
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            <>
              <ScrollView
                style={[
                  styles.cartContainer,
                  { backgroundColor: colors.background },
                ]}
              >
                {cartItems.map((item) => (
                  <TouchableOpacity
                    style={[
                      styles.itemContainer,
                      { backgroundColor: colors.background },
                    ]}
                    key={item.id}
                    onPress={() => navigation.navigate("ItemDetails", { bookId: item.id })}
                  >
                    <Image
                      source={{ uri: item.images[0] }}
                      style={styles.bookImage}
                    />
                    <View style={styles.itemDetails}>
                      <Text
                        style={[
                          styles.itemText,
                          { color: colors.text, lineHeight: 24 },
                        ]}
                      >
                        {item.name}
                      </Text>
                      <Text
                        style={[
                          styles.itemText,
                          { color: colors.primary, lineHeight: 24 },
                        ]}
                      >
                        {item.price.toLocaleString()} VND
                      </Text>
                      <View style={styles.quantityContainer}>
                        <TouchableOpacity
                          style={styles.quantityButton}
                          onPress={() => updateQuantity(item.id, -1)}
                        >
                          <Icon
                            name="remove"
                            size={20}
                            color={colors.primary}
                          />
                        </TouchableOpacity>
                        <Text
                          style={[styles.quantityText, { color: colors.text }]}
                        >
                          {item.quantity}
                        </Text>
                        <TouchableOpacity
                          style={styles.quantityButton}
                          onPress={() => updateQuantity(item.id, 1)}
                        >
                          <Icon name="add" size={20} color={colors.primary} />
                        </TouchableOpacity>
                      </View>
                    </View>
                    <TouchableOpacity
                      onPress={() => confirmRemoveFromCart(item.id)}
                    >
                      <Icon name="trash" size={24} color={colors.primary} />
                    </TouchableOpacity>
                  </TouchableOpacity>
                ))}
              </ScrollView>
              <View
                style={[
                  styles.totalContainer,
                  { backgroundColor: colors.background },
                ]}
              >
                <View>
                  <Text style={[styles.totalLabel, { color: colors.text }]}>
                    Thành tiền:
                  </Text>
                  <Text style={[styles.totalAmount, { color: "#FF6600" }]}>
                    {totalCost.toLocaleString()} VND
                  </Text>
                </View>
                <TouchableOpacity
                  style={[
                    styles.buttonContainer,
                    { backgroundColor: colors.primary },
                  ]}
                  onPress={ () => navigation.navigate("CheckoutScreen", { totalCost })}
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
            onPress={() =>
              navigation.navigate("BottomMain", { screen: "AuthStack" })
            }
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
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
  },
  headerText: {
    fontSize: 20,
    fontWeight: "bold",
  },
  cartContainer: {
    flex: 1,
    padding: 10,
  },
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  bookImage: {
    width: 80,
    height: 110,
    marginRight: 10,
  },
  itemDetails: {
    flex: 1,
  },
  itemText: {
    fontSize: 16,
    lineHeight: 24,
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
  },
  quantityText: {
    fontSize: 16,
    fontWeight: "bold",
    paddingHorizontal: 10,
    textAlign: "center",
    flex: 1,
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
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: "#ccc",
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: "bold",
  },
  buttonContainer: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    textAlign: "center",
  },
});

export default CartScreen;
