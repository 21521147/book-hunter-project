import { db } from "../api/firebase";
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  doc,
} from "firebase/firestore";

const CART_COLLECTION = "carts";

const getCart = async (userId) => {
  try {
    const q = query(
      collection(db, CART_COLLECTION),
      where("userId", "==", userId)
    );
    const querySnapshot = await getDocs(q);
    const cartItems = [];
    querySnapshot.forEach((doc) => {
      cartItems.push({ id: doc.id, ...doc.data() });
    });
    return cartItems;
  } catch (error) {
    console.error("Error getting cart:", error);
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

const cartService = {
  getCart,
  addToCart,
};

export default cartService;
