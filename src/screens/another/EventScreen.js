import React, { useEffect, useState } from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { useRoute } from "@react-navigation/native";
import Loading from "../../components/Loading";
import eventService from "../../services/eventService";

const EventScreen = () => {
  const route = useRoute();
  const { eventId } = route.params;
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        console.log("Fetching event with ID:", eventId);
        const eventData = await eventService.getById(eventId);
        if (eventData) {
          setEvent(eventData);
        } else {
          console.log("Đang cập nhật");
        }
      } catch (error) {
        console.error("Error fetching event:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [eventId]);

  if (loading) {
    return <Loading />;
  }

  if (!event) {
    return (
      <View style={styles.container}>
        <Text>No event found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{event.title}</Text>
      <Image source={{ uri: event.image }} style={styles.image} />
      <Text style={styles.description}>{event.description}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  image: {
    width: "100%",
    height: 200,
    resizeMode: "cover",
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
  },
});

export default EventScreen;