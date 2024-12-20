import { db } from "../api/firebase";
import {
  collection,
  addDoc,
  getDoc,
  doc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  deleteDoc,
} from "firebase/firestore";

const CART_COLLECTION = "carts";

const getCartItems = async (cartIds) => {
  try {
    const cartItems = [];
    for (const cartId of cartIds) {
      const cartItemRef = doc(db, CART_COLLECTION, cartId);
      const cartItemDoc = await getDoc(cartItemRef);
      if (cartItemDoc.exists()) {
        cartItems.push({ id: cartId, ...cartItemDoc.data() });
      }
    }
    return cartItems;
  } catch (error) {
    console.error("Error getting cart items:", error);
    return [];
  }
};

const addToCart = async (item, userId) => {
  try {
    const docRef = await addDoc(collection(db, CART_COLLECTION), item);
    const cartId = docRef.id;
    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, {
      cart: arrayUnion(cartId),
    });

    return { success: true, message: "Item added to cart!", cartId: cartId };
  } catch (error) {
    console.error("Error adding item to cart:", error);
    return { success: false, message: "Failed to add item to cart." };
  }
};

const removeFromCart = async (itemId, userId) => {
  try {
    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, {
      cart: arrayRemove(itemId),
    });
    const cartItemRef = doc(db, CART_COLLECTION, itemId);
    await deleteDoc(cartItemRef);
    return { success: true, message: "Item removed from cart!" };
  } catch (error) {
    console.error("Error removing item from cart:", error);
    return { success: false, message: "Failed to remove item from cart." };
  }
};

const updateCartItemQuantity = async (itemId, change) => {
  try {
    const cartItemRef = doc(db, CART_COLLECTION, itemId);
    const cartItemDoc = await getDoc(cartItemRef);
    if (cartItemDoc.exists()) {
      const newQuantity = Math.max(1, cartItemDoc.data().quantity + change);
      await updateDoc(cartItemRef, { quantity: newQuantity });
      return { success: true, message: "Quantity updated!" };
    } else {
      return { success: false, message: "Item not found in cart." };
    }
  } catch (error) {
    console.error("Error updating cart item quantity:", error);
    return { success: false, message: "Failed to update quantity." };
  }
};

const cartService = {
  getCartItems,
  addToCart,
  removeFromCart,
  updateCartItemQuantity,
};

export default cartService;
