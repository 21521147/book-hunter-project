import { db } from "../api/firebase";
import {
  collection,
  addDoc,
  getDoc,
  doc,
  deleteDoc,
  getDocs,
  setDoc,
  updateDoc,
} from "firebase/firestore";

const ORDERS_COLLECTION = "orders";
const CARTS_COLLECTION = "carts";

const placeOneOrder = async (userId, order) => {
  try {
    const userRef = doc(db, "users", userId);
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists()) {
      throw new Error("User not found");
    }

    const ordersCollectionRef = collection(userRef, ORDERS_COLLECTION);
    const orderDocRef = await addDoc(ordersCollectionRef, order);

    return {
      success: true,
      message: "Order placed successfully!",
      orderId: orderDocRef.id,
    };
  } catch (error) {
    console.error("Error placing order:", error);
    return { success: false, message: "Failed to place order." };
  }
};

const placeOrder = async (userId, order) => {
  try {
    const userRef = doc(db, "users", userId);
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists()) {
      throw new Error("User not found");
    }

    // Get cart items
    const cartCollectionRef = collection(userRef, CARTS_COLLECTION);
    const cartSnapshot = await getDocs(cartCollectionRef);
    const cartItems = cartSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    // Add cart items to the order
    const orderWithCartItems = {
      ...order,
      carts: cartItems,
    };

    // Create the order
    const ordersCollectionRef = collection(userRef, ORDERS_COLLECTION);
    const orderDocRef = await addDoc(ordersCollectionRef, orderWithCartItems);

    return {
      success: true,
      message: "Order placed successfully!",
      orderId: orderDocRef.id,
    };
  } catch (error) {
    console.error("Error placing order:", error);
    return { success: false, message: "Failed to place order." };
  }
};

const getOrdersByStatus = async (userId, status) => {
  try {
    const userRef = doc(db, "users", userId);
    const ordersCollectionRef = collection(userRef, ORDERS_COLLECTION);
    const querySnapshot = await getDocs(ordersCollectionRef);
    const orders = querySnapshot.docs
      .map((doc) => ({ id: doc.id, ...doc.data() }))
      .filter((order) => order.status === status);
    return orders;

  } catch (error) {
    console.error("Error fetching orders:", error);
    throw new Error("Failed to fetch orders.");
  }
};

const updateOrderStatus = async (userId, orderId, status) => {
  try {
    const userRef = doc(db, "users", userId);
    const orderRef = doc(userRef, ORDERS_COLLECTION, orderId);
    await updateDoc(orderRef, { status });
    return { success: true, message: "Order status updated successfully!" };
  } catch (error) {
    console.error("Error updating order status:", error);
    return { success: false, message: "Failed to update order status." };
  }
};

const countOrdersByStatus = async (userId, status) => {
  try {
    const userRef = doc(db, "users", userId);
    const ordersCollectionRef = collection(userRef, ORDERS_COLLECTION);
    const querySnapshot = await getDocs(ordersCollectionRef);
    const orders = querySnapshot.docs.map((doc) => doc.data());
    return orders.filter((order) => order.status === status).length;
  } catch (error) {
    console.error("Error counting orders:", error);
    throw new Error("Failed to count orders.");
  }
}

const orderService = {
  placeOrder,
  placeOneOrder,
  getOrdersByStatus,
  updateOrderStatus,
  countOrdersByStatus,
};

export default orderService;
