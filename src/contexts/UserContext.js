import React, { createContext, useState, useEffect } from "react";
import { db, auth } from "../api/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import authService from "../services/authService";

export const UserContext = createContext();

const UserContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = authService.onAuthStateChange(async (user) => {
      if (user) {
        const userInfo = await getUserInfo(user.uid);
        setUser({ id: user.uid, ...userInfo });
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const getUserInfo = async (userId) => {
    try {
      const userRef = doc(db, "users", userId);
      const docSnap = await getDoc(userRef);

      if (docSnap.exists()) {
        return docSnap.data();
      } else {
        console.log("No such document!");
        return null;
      }
    } catch (error) {
      console.log("Error getting user info: ", error);
      throw error;
    }
  };

  const updateUser = async (userId, data) => {
    try {
      const userRef = doc(db, "users", userId);
      await setDoc(userRef, data, { merge: true });
      const updatedUser = await getUserInfo(userId);
      setUser({ id: userId, ...updatedUser });
    } catch (error) {
      console.log("Error updating user info: ", error);
      throw error;
    }
  };

  return (
    <UserContext.Provider value={{ user, loading, updateUser }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserContextProvider;
