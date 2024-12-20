import React, { useState, useEffect, useContext } from "react";
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
import orderService from "../../services/orderService";
import { ThemeContext } from "../../contexts/ThemeContext";
import { UserContext } from "../../contexts/UserContext";
import Loading from "../../components/Loading";
import OrderBox from "../../components/OrderBox";

const OrderInfoScreen = ({ navigation }) => {
  const { colors, fontSizes } = useContext(ThemeContext);
  const { user } = useContext(UserContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const userId = user.id;
        const userOrders = await orderService.getUserOrders(userId);
        setOrders(userOrders);
      } catch (error) {
        console.error("Error fetching orders:", error);
        Alert.alert("Error", "Failed to fetch orders.");
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchOrders();
    }
  }, [user]);

  if (loading) {
    return <Loading />;
  }

  if (!user) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={[styles.emptyText, { color: colors.secondary }]}>
          Bạn cần đăng nhập để xem thông tin đơn hàng
        </Text>
        <TouchableOpacity
          style={styles.shopButton}
          onPress={() => navigation.navigate("Login")}
        >
          <Text style={[styles.shopButtonText, { color: "#fff" }]}>
            Đăng nhập
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (orders.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={[styles.emptyText, { color: colors.secondary }]}>
          Bạn chưa có đơn hàng nào
        </Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
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
            Thông tin đơn hàng
          </Text>
          <View style={{ width: 24 }} /> {/* Placeholder for centering */}
        </View>
        <FlatList
          data={orders}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <OrderBox item={item} navigation={navigation} />
          )}
          contentContainerStyle={styles.list}
        />
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
    padding: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  headerText: {
    fontWeight: "bold",
    textAlign: "center",
    flex: 1,
  },
  list: {
    paddingBottom: 20,
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

export default OrderInfoScreen;
