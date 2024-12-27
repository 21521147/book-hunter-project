// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import {
  getAuth,
  initializeAuth,
  getReactNativePersistence,
} from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBD3gYWhadJ29JboD5WtbOzh2TrB3IALjA",
  authDomain: "book-hunter-bh1147.firebaseapp.com",
  projectId: "book-hunter-bh1147",
  storageBucket: "book-hunter-bh1147.firebasestorage.app",
  messagingSenderId: "787161137924",
  appId: "1:787161137924:web:774d86377d12225bb68651",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

const db = getFirestore(app);

export { db, auth };
