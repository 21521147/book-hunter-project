import React, { useEffect, useState, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { UserContext } from "../../contexts/UserContext";
import orderService from "../../services/orderService";
import DeliveredOrderBox from "../../components/order/DeliveredOrderBox";
import Loading from "../../components/Loading";

const Canceled = ({ navigation }) => {
  const { user } = useContext(UserContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    if (user) {
      try {
        const fetchedOrders = await orderService.getOrdersByStatus(
          user.id,
          "delivered"
        );
        setOrders(fetchedOrders);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [user]);

  if (loading) {
    return <Loading />;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={orders}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => navigation.navigate("OrderDetails", { order: item })}
          >
            <DeliveredOrderBox order={item} />
          </TouchableOpacity>
        )}
        ListEmptyComponent={<Text style={styles.text}>No orders found.</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "#f5f5f5",
  },
  text: {
    fontSize: 20,
    textAlign: "center",
  },
});

export default Canceled;
