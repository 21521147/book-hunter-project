import React, { useState, useContext, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  Alert,
  Image,
  ScrollView,
} from "react-native";
import { ThemeContext } from "../contexts/ThemeContext";
import { UserContext } from "../contexts/UserContext";
import { CartContext } from "../contexts/CartContext";
import bookService from "../services/bookService";
import Icon from "react-native-vector-icons/Ionicons";
import orderService from "../services/orderService";
import cartService from "../services/cartService";

const CheckoutScreen = ({ navigation, route }) => {
  const { colors, fontSizes } = useContext(ThemeContext);
  const { user } = useContext(UserContext);
  const { totalCost, bookIds } = route.params;
  const { fetchCartItemsCount } = useContext(CartContext);

  const [address, setAddress] = useState(user.address || "");
  const [shippingMethod, setShippingMethod] = useState("Tiêu chuẩn");
  const [paymentMethod, setPaymentMethod] = useState("Thẻ tín dụng");
  const [books, setBooks] = useState([]);

  useEffect(() => {
    const fetchBookDetails = async () => {
      const bookDetails = await Promise.all(
        bookIds.map((bookId) => bookService.getBookById(bookId))
      );
      setBooks(bookDetails);
    };

    fetchBookDetails();
  }, [bookIds]);

  const handlePlaceOrder = async () => {
    if (!address) {
      Alert.alert("Lỗi", "Vui lòng nhập địa chỉ của bạn.");
      return;
    }

    try {
      const order = {
        date: new Date().toISOString(),
        status: "Đang giao hàng",
        price: totalCost,
        address: address,
        shippingMethod: shippingMethod,
        paymentMethod: paymentMethod,
      };

      await orderService.placeOrder(user.id, order);
      await cartService.clearCart(user.id);
      fetchCartItemsCount();

      Alert.alert("Thành Công", "Đặt hàng thành công!");
      navigation.goBack();
    } catch (error) {
      console.error("Error placing order:", error);
      Alert.alert("Lỗi", "Đặt hàng thất bại!");
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon name="arrow-back" size={24} color={colors.primary} />
          </TouchableOpacity>
          <Text style={[styles.headerText, { color: colors.text, fontSize: fontSizes.large }]}>
            Thanh Toán
          </Text>
        </View>
        <View style={styles.infoContainer}>
          <View style={styles.infoRow}>
            <Icon name="location-outline" size={20} color={colors.primary} />
            <Text style={[styles.infoText, { color: colors.text }]}>{user.name}</Text>
            <Text style={[styles.infoText, { color: colors.text }]}> - {user.phoneNumber}</Text>
          </View>
          <Text style={[styles.label, { color: colors.text }]}>Địa chỉ:</Text>
          <TextInput
            style={[styles.input, { color: colors.text, borderColor: colors.border }]}
            placeholder="Nhập địa chỉ của bạn"
            placeholderTextColor={colors.secondary}
            value={address}
            onChangeText={setAddress}
            multiline
          />
        </View>
        {books.length > 0 && (
          <View style={styles.booksContainer}>
            {books.map((book, index) => (
              <View key={index} style={styles.bookContainer}>
                <Image source={{ uri: book.images[0] }} style={styles.bookImage} />
                <View style={styles.bookInfo}>
                  <Text style={[styles.bookTitle, { color: colors.text }]}>{book.name}</Text>
                  <Text style={[styles.bookAuthor, { color: colors.text }]}>Tác giả: {book.authors.join(", ")}</Text>
                  <Text style={[styles.bookPrice, { color: colors.primary }]}>Giá: {book.price ? book.price.toLocaleString() : "N/A"} VND</Text>
                </View>
              </View>
            ))}
          </View>
        )}
        <View style={styles.totalContainer}>
          <Text style={[styles.totalLabel, { color: colors.text }]}>Tổng số tiền:</Text>
          <Text style={[styles.totalAmount, { color: colors.primary }]}>{totalCost ? totalCost.toLocaleString() : "N/A"} VND</Text>
        </View>
        <View style={styles.stepContainer}>
          <Text style={[styles.label, { color: colors.text }]}>Phương thức vận chuyển:</Text>
          <TouchableOpacity
            style={[styles.option, shippingMethod === "Tiêu chuẩn" && styles.selectedOption]}
            onPress={() => setShippingMethod("Tiêu chuẩn")}
          >
            <Text style={{ color: colors.text }}>Tiêu chuẩn</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.option, shippingMethod === "Nhanh" && styles.selectedOption]}
            onPress={() => setShippingMethod("Nhanh")}
          >
            <Text style={{ color: colors.text }}>Nhanh</Text>
          </TouchableOpacity>
          <Text style={[styles.label, { color: colors.text }]}>Phương thức thanh toán:</Text>
          <TouchableOpacity
            style={[styles.option, paymentMethod === "Thẻ tín dụng" && styles.selectedOption]}
            onPress={() => setPaymentMethod("Thẻ tín dụng")}
          >
            <Text style={{ color: colors.text }}>Thẻ tín dụng</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.option, paymentMethod === "PayPal" && styles.selectedOption]}
            onPress={() => setPaymentMethod("PayPal")}
          >
            <Text style={{ color: colors.text }}>PayPal</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.option, paymentMethod === "Thanh toán khi nhận hàng" && styles.selectedOption]}
            onPress={() => setPaymentMethod("Thanh toán khi nhận hàng")}
          >
            <Text style={{ color: colors.text }}>Thanh toán khi nhận hàng</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.stepContainer}>
          <Text style={[styles.label, { color: colors.text }]}>Xem lại đơn hàng:</Text>
          <Text style={{ color: colors.text }}>Tên tài khoản: {user.name}</Text>
          <Text style={{ color: colors.text }}>Số điện thoại: {user.phoneNumber}</Text>
          <Text style={{ color: colors.text }}>Địa chỉ: {address}</Text>
          <Text style={{ color: colors.text }}>Phương thức vận chuyển: {shippingMethod}</Text>
          <Text style={{ color: colors.text }}>Phương thức thanh toán: {paymentMethod}</Text>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: colors.primary }]}
            onPress={handlePlaceOrder}
          >
            <Text style={[styles.buttonText, { color: colors.textSrd }]}>Đặt hàng</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  headerText: {
    marginLeft: 10,
    fontWeight: "bold",
  },
  scrollView: {
    flex: 1,
  },
  infoContainer: {
    marginBottom: 20,
    padding: 10,
    backgroundColor: "#fff",
    borderRadius: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  infoText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  label: {
    fontSize: 18,
    marginBottom: 10,
  },
  input: {
    width: "100%",
    padding: 10,
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 20,
  },
  booksContainer: {
    marginBottom: 20,
  },
  bookContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    padding: 10,
    backgroundColor: "#fff",
    borderRadius: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  bookImage: {
    width: 100,
    height: 150,
    marginRight: 10,
  },
  bookInfo: {
    flex: 1,
  },
  bookTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  bookAuthor: {
    fontSize: 14,
    marginBottom: 5,
  },
  bookPrice: {
    fontSize: 14,
    marginBottom: 10,
  },
  totalContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
    padding: 10,
    backgroundColor: "#fff",
    borderRadius: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  totalLabel: {
    fontSize: 18,
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: "bold",
  },
  stepContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    width: "100%",
    marginBottom: 10,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  option: {
    padding: 15,
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    width: "100%",
    alignItems: "center",
  },
  selectedOption: {
    borderColor: "#0A51B0",
  },
});

export default CheckoutScreen;

