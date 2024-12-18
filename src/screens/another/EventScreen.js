import React, { useEffect, useState } from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { useRoute } from "@react-navigation/native";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../api/firebase"; // Adjust the import according to your project structure

const EventScreen = () => {
  const route = useRoute();
  const { eventId } = route.params;
  const [event, setEvent] = useState(null);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const eventRef = doc(db, "event", eventId);
        const eventDoc = await getDoc(eventRef);
        if (eventDoc.exists()) {
          setEvent(eventDoc.data());
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.error("Error fetching event:", error);
      }
    };

    fetchEvent();
  }, [eventId]);

  if (!event) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.idText}>Event ID: {eventId}</Text>
      <Image source={{ uri: event.banner }} style={styles.image} />
    </View>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  idText: {
    fontSize: 18,
    marginBottom: 20,
  },
  image: {
    width: "90%",
    aspectRatio: 16 / 9,
    resizeMode: "cover",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#222",
  },
});

export default EventScreen;
