import React, { useContext } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import orderService from "../../services/orderService";
import { UserContext } from "../../contexts/UserContext";
import { CartContext } from "../../contexts/CartContext";

const OrderBox = ({ order, onUpdate }) => {
  const { user } = useContext(UserContext);
  const { fetchStatusCount } = useContext(CartContext);

  const handleDelivered = async () => {
    try {
      await orderService.updateOrderStatus(user.id, order.id, "Đã nhận");
      Alert.alert("Thành công", "Đơn hàng đã xác nhận là đã nhận.");
      onUpdate();
      fetchStatusCount();
    } catch (error) {
      console.error("Error updating order status:", error);
      Alert.alert("Lỗi", "Cập nhật trạng thái đơn hàng thất bại.");
    }
  };

  const handleCancel = async () => {
    try {
      await orderService.updateOrderStatus(user.id, order.id, "Đã huỷ");
      Alert.alert("Thành công", "Đơn hàng đã xác nhận là đã huỷ.");
      onUpdate();
      fetchStatusCount();
    } catch (error) {
      console.error("Error updating order status:", error);
      Alert.alert("Lỗi", "Cập nhật trạng thái đơn hàng thất bại.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Order ID: {order.id}</Text>
      <Text style={styles.text}>
        Date: {new Date(order.date).toLocaleDateString()}
      </Text>
      <Text style={styles.text}>Status: {order.status}</Text>
      <Text style={styles.text}>Total: {order.price.toLocaleString()} VND</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={handleDelivered}>
          <Text style={styles.buttonText}>Đã nhận hàng</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleCancel}>
          <Text style={styles.buttonText}>Huỷ đơn hàng</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    marginVertical: 5,
    backgroundColor: "#fff",
    borderRadius: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  text: {
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  button: {
    backgroundColor: "#0A51B0",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default OrderBox;
