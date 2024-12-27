import { db } from "../api/firebase";
import {
  collection,
  addDoc,
  getDoc,
  doc,
  updateDoc,
  deleteDoc,
  query,
  where,
  getDocs,
} from "firebase/firestore";

const CART_COLLECTION = "carts";

const getCartItems = async (userId) => {
  try {
    const userRef = doc(db, "users", userId);
    const cartCollectionRef = collection(userRef, CART_COLLECTION);
    const cartSnapshot = await getDocs(cartCollectionRef);
    const cartItems = cartSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return cartItems;
  } catch (error) {
    console.error("Error getting cart items:", error);
    return [];
  }
};

const addToCart = async (item, userId) => {
  try {
    const userRef = doc(db, "users", userId);
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists()) {
      throw new Error("User not found");
    }

    const cartCollectionRef = collection(userRef, CART_COLLECTION);
    const cartItemRef = await addDoc(cartCollectionRef, item);

    return {
      success: true,
      message: "Item added to cart!",
      cartId: cartItemRef.id,
    };
  } catch (error) {
    console.error("Error adding item to cart:", error);
    return { success: false, message: "Failed to add item to cart." };
  }
};

const removeFromCart = async (itemId, userId) => {
  try {
    console.log("Removing item from cart:", itemId, "User:", userId);
    const userRef = doc(db, "users", userId);
    const cartCollectionRef = collection(userRef, CART_COLLECTION);
    const q = query(cartCollectionRef, where("id", "==", itemId));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const cartItemDoc = querySnapshot.docs[0];
      await deleteDoc(cartItemDoc.ref);
      console.log("Item removed from cart:", itemId);
      return { success: true, message: "Item removed from cart!" };
    } else {
      return { success: false, message: "Item not found in cart." };
    }
  } catch (error) {
    console.error("Error removing item from cart:", error);
    return { success: false, message: "Failed to remove item from cart." };
  }
};

const updateCartItemQuantity = async (itemId, userId, change) => {
  try {
    console.log(
      "Updating quantity for item:",
      itemId,
      "User:",
      userId,
      "Change:",
      change
    );
    const userRef = doc(db, "users", userId);
    const cartCollectionRef = collection(userRef, CART_COLLECTION);
    const q = query(cartCollectionRef, where("id", "==", itemId));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const cartItemDoc = querySnapshot.docs[0];
      const cartItemData = cartItemDoc.data();
      console.log("Current cart item data:", cartItemData);

      if (typeof cartItemData.quantity !== "number") {
        throw new Error("Invalid quantity value");
      }

      const newQuantity = Math.max(1, cartItemData.quantity + change);
      await updateDoc(cartItemDoc.ref, { quantity: newQuantity });
      console.log("Updated quantity to:", newQuantity);
      return { success: true, message: "Quantity updated!" };
    } else {
      return { success: false, message: "Item not found in cart." };
    }
  } catch (error) {
    console.error("Error updating cart item quantity:", error);
    return { success: false, message: "Failed to update quantity." };
  }
};

const clearCart = async (userId) => {
  try {
    const userRef = doc(db, "users", userId);
    const cartCollectionRef = collection(userRef, CART_COLLECTION);
    const cartSnapshot = await getDocs(cartCollectionRef);

    const deletePromises = cartSnapshot.docs.map((doc) => deleteDoc(doc.ref));
    await Promise.all(deletePromises);

    return { success: true, message: "Cart cleared successfully!" };
  } catch (error) {
    console.error("Error clearing cart:", error);
    return { success: false, message: "Failed to clear cart." };
  }
};

const cartService = {
  getCartItems,
  addToCart,
  removeFromCart,
  updateCartItemQuantity,
  clearCart,
};

export default cartService;
