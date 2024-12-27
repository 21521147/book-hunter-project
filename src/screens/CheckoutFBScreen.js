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
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import orderService from "../services/orderService";
import cartService from "../services/cartService";

const CheckoutFBScreen = ({ navigation, route }) => {
  const { colors, fontSizes } = useContext(ThemeContext);
  const { user } = useContext(UserContext);
  const { bookId, quantity, totalCost } = route.params;

  const [address, setAddress] = useState(user.address || "");
  const [shippingMethod, setShippingMethod] = useState("Tiêu chuẩn");
  const [paymentMethod, setPaymentMethod] = useState("Thẻ tín dụng");
  const [book, setBook] = useState({});
  const [shippingCost, setShippingCost] = useState(30000);

  useEffect(() => {
    const fetchBookDetails = async () => {
      try {
        const fetchedBook = await bookService.getBookById(bookId);
        setBook(fetchedBook);
      } catch (error) {
        console.error("Error fetching book details:", error);
      }
    };

    fetchBookDetails();
  }, [bookId]);

  useEffect(() => {
    if (shippingMethod === "Tiêu chuẩn") {
      setShippingCost(30000);
    } else if (shippingMethod === "Nhanh") {
      setShippingCost(50000);
    }
  }, [shippingMethod]);

  const handlePlaceOrder = async () => {
    if (!address) {
      Alert.alert("Lỗi", "Vui lòng nhập địa chỉ của bạn.");
      return;
    }

    try {
      const order = {
        date: new Date().toISOString(),
        status: "Đang giao hàng",
        price: totalCost + shippingCost,
        address: address,
        shippingMethod: shippingMethod,
        paymentMethod: paymentMethod,
        carts: [{ id: bookId, quantity }],
      };

      await orderService.placeOneOrder(user.id, order);

      Alert.alert("Thành Công", "Đặt hàng thành công!");
      navigation.goBack();
    } catch (error) {
      console.error("Error placing order:", error);
      Alert.alert("Lỗi", "Đặt hàng thất bại!");
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={[styles.container, { backgroundColor: colors.background }]}
      >
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
            Thanh Toán
          </Text>
        </View>
        <View style={styles.infoContainer}>
          <View style={styles.infoRow}>
            <Icon name="location" size={20} color={colors.primary} />
            <Text style={[styles.infoText, { color: colors.text }]}>
              {user.name}
            </Text>
            <Text style={[styles.medium, { color: colors.text }]}>
              {" "}
              (+84) {user.phoneNumber}
            </Text>
          </View>
          <TextInput
            style={[
              styles.input,
              { color: colors.text, borderColor: colors.border },
            ]}
            placeholder="Nhập địa chỉ của bạn"
            placeholderTextColor={colors.secondary}
            value={address}
            onChangeText={setAddress}
            multiline
          />
        </View>
        <View style={styles.booksContainer}>
          <Image
            source={{ uri: book.images ? book.images[0] : "" }}
            style={styles.bookImage}
          />
          <View style={styles.bookInfo}>
            <Text style={[styles.bookTitle, { color: colors.text }]}>
              {book.name}
            </Text>
            <Text style={[styles.bookAuthor, { color: colors.text }]}>
              Tác giả: {book.authors ? book.authors.join(", ") : ""}
            </Text>
            <Text style={[styles.bookPrice, { color: colors.primary }]}>
              Giá: {book.price ? book.price.toLocaleString() : "N/A"} VND
            </Text>
            <Text style={[styles.bookPrice, { color: colors.primary }]}>
              Số lượng: {quantity}
            </Text>
          </View>
        </View>
        <View style={styles.stepContainer}>
          <Text
            style={[styles.label, { color: colors.text, textAlign: "left" }]}
          >
            Phương thức vận chuyển:
          </Text>
          <TouchableOpacity
            style={[
              styles.option,
              shippingMethod === "Tiêu chuẩn" && styles.selectedOption,
              { borderColor: "green" },
            ]}
            onPress={() => setShippingMethod("Tiêu chuẩn")}
          >
            <MaterialCommunityIcons name="motorbike" size={24} color="green" />
            <Text
              style={[styles.optionText, { color: "green", textAlign: "left" }]}
            >
              Tiêu chuẩn (30,000 VND)
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.option,
              shippingMethod === "Nhanh" && styles.selectedOption,
              { borderColor: "orange" },
            ]}
            onPress={() => setShippingMethod("Nhanh")}
          >
            <Icon name="rocket" size={20} color="orange" />
            <Text
              style={[
                styles.optionText,
                { color: "orange", textAlign: "left" },
              ]}
            >
              Nhanh (50,000 VND)
            </Text>
          </TouchableOpacity>
          <Text
            style={[styles.label, { color: colors.text, textAlign: "left" }]}
          >
            Phương thức thanh toán:
          </Text>
          <TouchableOpacity
            style={[
              styles.option,
              paymentMethod === "Thẻ tín dụng" && styles.selectedOption,
            ]}
            onPress={() => setPaymentMethod("Thẻ tín dụng")}
          >
            <Icon name="card" size={20} color={colors.primary} />
            <Text
              style={{ color: colors.text, marginLeft: 10, textAlign: "left" }}
            >
              Thẻ tín dụng
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.option,
              paymentMethod === "PayPal" && styles.selectedOption,
            ]}
            onPress={() => setPaymentMethod("PayPal")}
          >
            <Icon name="logo-paypal" size={20} color={colors.primary} />
            <Text
              style={{ color: colors.text, marginLeft: 10, textAlign: "left" }}
            >
              PayPal
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.option,
              paymentMethod === "Thanh toán khi nhận hàng" &&
                styles.selectedOption,
            ]}
            onPress={() => setPaymentMethod("Thanh toán khi nhận hàng")}
          >
            <Icon name="cash" size={20} color={colors.primary} />
            <Text
              style={{ color: colors.text, marginLeft: 10, textAlign: "left" }}
            >
              Thanh toán khi nhận hàng
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.stepContainer}>
          <Text style={[styles.label, { color: colors.text }]}>
            Chi tiết thanh toán:
          </Text>
          <View style={styles.detailRow}>
            <Text style={[styles.detailText, { color: colors.text }]}>
              Tổng tiền hàng:
            </Text>
            <Text style={[styles.detailAmount, { color: colors.text }]}>
              {totalCost ? totalCost.toLocaleString() : "N/A"} VND
            </Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={[styles.detailText, { color: colors.text }]}>
              Tổng tiền phí vận chuyển:
            </Text>
            <Text style={[styles.detailAmount, { color: colors.text }]}>
              {shippingCost.toLocaleString()} VND
            </Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={[styles.detailText, { color: colors.text }]}>
              Tổng thanh toán:
            </Text>
            <Text
              style={[
                styles.detailAmount,
                { color: colors.text, fontWeight: "bold" },
              ]}
            >
              {(totalCost + shippingCost).toLocaleString()} VND
            </Text>
          </View>
        </View>
      </ScrollView>
      <View
        style={[styles.totalContainer, { backgroundColor: colors.background }]}
      >
        <Text style={[styles.totalLabel, { color: colors.text }]}>
          Tổng số tiền:
        </Text>
        <Text style={[styles.totalAmount, { color: colors.primary }]}>
          {totalCost ? (totalCost + shippingCost).toLocaleString() : "N/A"} VND
        </Text>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: colors.primary }]}
          onPress={handlePlaceOrder}
        >
          <Text style={[styles.buttonText, { color: colors.textSrd }]}>
            Đặt hàng
          </Text>
        </TouchableOpacity>
      </View>
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
    fontSize: 16,
    marginBottom: 10,
    textAlign: "left",
    fontWeight: "bold",
    width: "100%",
  },
  input: {
    width: "100%",
    padding: 10,
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 20,
  },
  booksContainer: {
    flexDirection: "row",
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
    alignItems: "center",
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: "#ccc",
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: "bold",
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: "bold",
  },
  stepContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 20,
  },
  button: {
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    marginLeft: 10,
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
    flexDirection: "row",
    justifyContent: "flex-start",
  },
  selectedOption: {
    borderColor: "#0A51B0",
    backgroundColor: "#e0f7fa",
  },
  optionText: {
    marginLeft: 10,
    textAlign: "left",
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    padding: 5,
  },
  detailText: {
    textAlign: "left",
    width: "50%",
  },
  detailAmount: {
    textAlign: "right",
    width: "50%",
  },
});

export default CheckoutFBScreen;
