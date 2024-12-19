import React, { useContext, useEffect, useState } from "react";
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

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const userInfo = await authService.getUserInfo(user.id);
        if (userInfo && userInfo.cart) {
          const items = await cartService.getCartItems(userInfo.cart);
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

    fetchCartItems();
  }, [user]);
  
  const removeFromCart = async (itemId) => {
    try {
      const userId = user.id;
      const result = await cartService.removeFromCart(itemId, userId);
      if (result.success) {
        setCartItems((prevItems) =>
          prevItems.filter((item) => item.id !== itemId)
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

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <Text style={[styles.itemText, { color: colors.text }]}>{item.name}</Text>
      <Text style={[styles.itemText, { color: colors.primary }]}>
        {item.price.toLocaleString()} VND
      </Text>
      <Text style={[styles.itemText, { color: colors.primary }]}>
        Quantity: {item.quantity}
      </Text>
      <TouchableOpacity onPress={() => removeFromCart(item.id)}>
        <Icon name="trash" size={24} color={colors.primary} />
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.navigate("Home")}>
            <Icon name="arrow-back" size={24} color={colors.primary} />
          </TouchableOpacity>
          <Text
            style={[
              styles.headerText,
              { color: colors.text, fontSize: fontSizes.large },
            ]}
          >
            Giỏ hàng
          </Text>
          <View style={styles.headerIcons} />
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
              <Text style={[styles.shopButtonText, { color: colors.textSrd }]}>
                Mua sắm ngay
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <FlatList
            data={cartItems}
            renderItem={renderItem}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.list}
          />
        )}
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
    padding: 20,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  headerText: {
    fontWeight: "bold",
  },
  headerIcons: {
    width: 24, // Placeholder width to keep the title centered
  },
  list: {
    paddingBottom: 20,
  },
  itemContainer: {
    flexDirection: "column",
    justifyContent: "space-between",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  itemText: {
    fontSize: 16,
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

export default CartScreen;
