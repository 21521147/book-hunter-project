// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA2oZ7KcNa7Be9agiyDfaCOtglBD7XwDQA",
  authDomain: "book-hunter-bh2152.firebaseapp.com",
  projectId: "book-hunter-bh2152",
  storageBucket: "book-hunter-bh2152.firebasestorage.app",
  messagingSenderId: "1030001998948",
  appId: "1:1030001998948:web:1395733f7728159fdbf371",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };
