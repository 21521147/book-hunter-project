// services/eventService.js
import { useState, useEffect } from "react";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { db } from "../api/firebase";

const eventService = {
  getAll: async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "events"));
      const events = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      return events;
    } catch (error) {
      console.error("Error fetching events: ", error);
      throw error;
    }
  },

  getById: async (eventId) => {
    try {
      const eventRef = doc(db, "events", eventId);
      const eventDoc = await getDoc(eventRef);
      if (eventDoc.exists()) {
        return { id: eventDoc.id, ...eventDoc.data() };
      } else {
        console.error("No such document!");
        return null;
      }
    } catch (error) {
      console.error("Error fetching event: ", error);
      throw error;
    }
  },
};

export default eventService;
