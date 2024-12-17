// services/bookService.js
import { db } from "../api/firebase";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";

const booksCollection = collection(db, "books");

const bookService = {
  async getAllBooks() {
    try {
      const querySnapshot = await getDocs(booksCollection);
      const books = querySnapshot.docs.map((doc) => {
        return {
          id: doc.id,
          ...doc.data(),
        };
      });
      return books;
    } catch (error) {
      console.error("Error getting books: ", error);
      throw error;
    }
  },
  async getBookById(bookId) {
    try {
      const bookRef = doc(db, "books", bookId);
      const docSnap = await getDoc(bookRef);

      if (docSnap.exists()) {
        return {
          id: docSnap.id,
          ...docSnap.data(),
        };
      } else {
        console.log("No such document");
        return null;
      }
    } catch (error) {
      console.error("Error getting book:", error);
      throw error;
    }
  },
};

export default bookService;
