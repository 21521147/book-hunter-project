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
  apiKey: "AIzaSyC71zZq5Ff11kEXrX4kqggQLBZvzqBS838",
  authDomain: "book-hunter-2.firebaseapp.com",
  projectId: "book-hunter-2",
  storageBucket: "book-hunter-2.firebasestorage.app",
  messagingSenderId: "1084183247375",
  appId: "1:1084183247375:web:4bb79a2ead39f1f64d017a",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

const db = getFirestore(app);

export { db, auth };
