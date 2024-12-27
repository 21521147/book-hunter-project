import React, { useState, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  Alert,
} from "react-native";
import { ThemeContext } from "../contexts/ThemeContext";
import { UserContext } from "../contexts/UserContext";
import { CartContext } from "../contexts/CartContext";
import Icon from "react-native-vector-icons/Ionicons";
import orderService from "../services/orderService";
import cartService from "../services/cartService";

const CheckoutScreen = ({ navigation, route }) => {
  const { colors, fontSizes } = useContext(ThemeContext);
  const { user } = useContext(UserContext);
  const { totalCost } = route.params;
  const { fetchCartItemsCount } = useContext(CartContext);

  const [step, setStep] = useState(1);
  const [address, setAddress] = useState(user.address || "");
  const [shippingMethod, setShippingMethod] = useState("Standard");
  const [paymentMethod, setPaymentMethod] = useState("Credit Card");


  const handleNextStep = () => {
    if (step === 1 && !address) {
      Alert.alert("Error", "Please enter your address.");
      return;
    }
    setStep(step + 1);
  };

  const handlePlaceOrder = async () => {
    try {
      const order = {
        date: new Date().toISOString(),
        status: "delivering",
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
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon name="arrow-back" size={24} color={colors.primary} />
          </TouchableOpacity>
          <Text style={[styles.headerText, { color: colors.text, fontSize: fontSizes.large }]}>
            Checkout
          </Text>
        </View>
        {step === 1 && (
          <View style={styles.stepContainer}>
            <Text style={[styles.label, { color: colors.text }]}>Shipping Address:</Text>
            <TextInput
              style={[styles.input, { color: colors.text, borderColor: colors.border }]}
              placeholder="Enter your address"
              placeholderTextColor={colors.secondary}
              value={address}
              onChangeText={setAddress}
            />
            <TouchableOpacity
              style={[styles.button, { backgroundColor: colors.primary }]}
              onPress={handleNextStep}
            >
              <Text style={[styles.buttonText, { color: colors.textSrd }]}>Next</Text>
            </TouchableOpacity>
          </View>
        )}
        {step === 2 && (
          <View style={styles.stepContainer}>
            <Text style={[styles.label, { color: colors.text }]}>Shipping Method:</Text>
            <TouchableOpacity
              style={[styles.option, shippingMethod === "Standard" && styles.selectedOption]}
              onPress={() => setShippingMethod("Standard")}
            >
              <Text style={{ color: colors.text }}>Standard</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.option, shippingMethod === "Express" && styles.selectedOption]}
              onPress={() => setShippingMethod("Express")}
            >
              <Text style={{ color: colors.text }}>Express</Text>
            </TouchableOpacity>
            <Text style={[styles.label, { color: colors.text }]}>Payment Method:</Text>
            <TouchableOpacity
              style={[styles.option, paymentMethod === "Credit Card" && styles.selectedOption]}
              onPress={() => setPaymentMethod("Credit Card")}
            >
              <Text style={{ color: colors.text }}>Credit Card</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.option, paymentMethod === "PayPal" && styles.selectedOption]}
              onPress={() => setPaymentMethod("PayPal")}
            >
              <Text style={{ color: colors.text }}>PayPal</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.option, paymentMethod === "Cash on Delivery" && styles.selectedOption]}
              onPress={() => setPaymentMethod("Cash on Delivery")}
            >
              <Text style={{ color: colors.text }}>Cash on Delivery</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, { backgroundColor: colors.primary }]}
              onPress={handleNextStep}
            >
              <Text style={[styles.buttonText, { color: colors.textSrd }]}>Next</Text>
            </TouchableOpacity>
          </View>
        )}
        {step === 3 && (
          <View style={styles.stepContainer}>
            <Text style={[styles.label, { color: colors.text }]}>Review Order:</Text>
            <Text style={{ color: colors.text }}>Address: {address}</Text>
            <Text style={{ color: colors.text }}>Shipping Method: {shippingMethod}</Text>
            <Text style={{ color: colors.text }}>Payment Method: {paymentMethod}</Text>
            <TouchableOpacity
              style={[styles.button, { backgroundColor: colors.primary }]}
              onPress={handlePlaceOrder}
            >
              <Text style={[styles.buttonText, { color: colors.textSrd }]}>Place Order</Text>
            </TouchableOpacity>
          </View>
        )}
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
  stepContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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
  button: {
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
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
