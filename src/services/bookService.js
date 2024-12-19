import { db } from "../api/firebase";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  limit,
  orderBy,
} from "firebase/firestore";

const booksCollection = collection(db, "books");

const bookService = {
  getAllGenre: async () => {
    try {
      const querySnapshot = await getDocs(booksCollection);
      const genres = new Set();
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.genre) {
          genres.add(data.genre);
        }
      });
      return Array.from(genres);
    } catch (error) {
      console.error("Error fetching genres: ", error);
      throw error;
    }
  },

  getBooksByGenre: async (genre) => {
    try {
      let q;
      if (genre === "Tất cả") {
        q = booksCollection;
      } else {
        q = query(booksCollection, where("genre", "==", genre));
      }
      const querySnapshot = await getDocs(q);
      const books = [];
      querySnapshot.forEach((doc) => {
        books.push({ id: doc.id, ...doc.data() });
      });
      return books;
    } catch (error) {
      console.error("Error fetching books by genre: ", error);
      throw error;
    }
  },

  getTop10BooksByGenre: async (genre) => {
    try {
      let q;
      if (genre === "Tất cả") {
        q = query(booksCollection, limit(10));
      } else {
        q = query(booksCollection, where("genre", "==", genre), limit(10));
      }
      const querySnapshot = await getDocs(q);
      const books = [];
      querySnapshot.forEach((doc) => {
        books.push({ id: doc.id, ...doc.data() });
      });
      return books;
    } catch (error) {
      console.error("Error fetching top 10 books by genre: ", error);
      throw error;
    }
  },

  getTop10BooksByRatingAvg: async () => {
    try {
      const q = query(
        booksCollection,
        orderBy("rating_average", "desc"),
        limit(10)
      );
      const querySnapshot = await getDocs(q);
      const books = [];
      querySnapshot.forEach((doc) => {
        books.push({ id: doc.id, ...doc.data() });
      });
      return books;
    } catch (error) {
      console.error("Error fetching top 10 books by rating average: ", error);
      throw error;
    }
  },

  getBookById: async (id) => {
    try {
      const bookDoc = await getDoc(doc(db, "books", id.toString()));
      if (bookDoc.exists()) {
        return { id: bookDoc.id, ...bookDoc.data() };
      } else {
        throw new Error("Book not found");
      }
    } catch (error) {
      console.error("Error fetching book by ID: ", error);
      throw error;
    }
  },

  getAllBooks: async () => {
    try {
      const querySnapshot = await getDocs(booksCollection);
      const books = [];
      querySnapshot.forEach((doc) => {
        books.push({ id: doc.id, ...doc.data() });
      });
      return books;
    } catch (error) {
      console.error("Error fetching all books: ", error);
      throw error;
    }
  },
};

export default bookService;
