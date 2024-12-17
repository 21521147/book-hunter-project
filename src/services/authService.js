// services/authService.js
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendEmailVerification,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { db, auth } from "../api/firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";

const authService = {
  async register(email, password) {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      await sendEmailVerification(user);
      const userRef = doc(db, "users", user.uid);
      await setDoc(userRef, {
        name: "",
        email: user.email,
        cart: [],
        completedOrders: [],
        savedItems: [],
        phoneNumber: "",
        address: "",
        created_at: new Date(),
      });
      return user;
    } catch (error) {
      throw error;
    }
  },

  async login(email, password) {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      return userCredential.user;
    } catch (error) {
      console.error("Error login user: ", error);
      throw error;
    }
  },

  async logout() {
    try {
      await signOut(auth);
    } catch (error) {
      console.log("Error logging out user: ", error);
      throw error;
    }
  },

  async getUserInfo(userId) {
    try {
      const userRef = doc(db, "users", userId);
      const docSnap = await getDoc(userRef);

      if (docSnap.exists()) {
        return docSnap.data();
      } else {
        return null;
      }
    } catch (error) {
      console.log("Error getting user info: ", error);
      throw error;
    }
  },

  onAuthStateChange(callback) {
    return onAuthStateChanged(auth, (user) => {
      callback(user);
    });
  },
  // Thêm các hàm liên quan đến auth khác
  // - resetPassword
  // - socialLogin
};

export default authService;
