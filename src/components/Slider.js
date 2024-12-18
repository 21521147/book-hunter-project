import React, { useState, useEffect, useRef, useContext } from "react";
import {
  View,
  Image,
  StyleSheet,
  Dimensions,
  Text,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFetchEvents } from "../services/eventService";
import { ThemeContext } from "../contexts/ThemeContext";
import Loading from "./Loading";

const { width: viewportWidth } = Dimensions.get("window");

const Slider = ({ navigation }) => {
  const { events: fetchedEvents, loading } = useFetchEvents();
  const [events, setEvents] = useState([]);
  const scrollViewRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const { colors } = useContext(ThemeContext);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const cachedEvents = await AsyncStorage.getItem("events");
        if (cachedEvents) {
          setEvents(JSON.parse(cachedEvents));
        } else if (fetchedEvents.length > 0) {
          setEvents(fetchedEvents);
          await AsyncStorage.setItem("events", JSON.stringify(fetchedEvents));
        }
      } catch (error) {
        console.error("Error fetching events: ", error);
      }
    };

    fetchEvents();
  }, [fetchedEvents]);

  useEffect(() => {
    if (scrollViewRef.current && events.length > 0) {
      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) => {
          const nextIndex = (prevIndex + 1) % events.length;
          scrollViewRef.current.scrollTo({
            x: nextIndex * viewportWidth,
            animated: true,
          });
          return nextIndex;
        });
      }, 3000); // Change slide every 3 seconds

      return () => clearInterval(interval);
    }
  }, [events]);

  const handleMomentumScrollEnd = (event) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / viewportWidth);

    // If swiped to the duplicated first or last image, reset to the real first or last
    if (index === 0) {
      scrollViewRef.current.scrollTo({
        x: events.length * viewportWidth,
        animated: false,
      });
      setCurrentIndex(events.length);
    } else if (index === events.length + 1) {
      scrollViewRef.current.scrollTo({ x: viewportWidth, animated: false });
      setCurrentIndex(1);
    } else {
      setCurrentIndex(index);
    }
  };

  if (loading || events.length === 0) {
    return (
      <Loading />
    );
  }

  // Create a "looped" list with cloned first and last images
  const loopedEvents = [
    { ...events[events.length - 1] }, // Clone of the last image
    ...events,
    { ...events[0] }, 
  ];

  return (
    <View>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleMomentumScrollEnd}
        contentOffset={{ x: viewportWidth, y: 0 }} // Start at the first real slide
      >
        {loopedEvents.map((event, index) => (
          <TouchableOpacity
            key={index}
            style={styles.slide}
            onPress={() =>
              navigation.navigate("EventScreen", { eventId: event.id })
            }
          >
            <Image source={{ uri: event.banner }} style={styles.image} />
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Pagination dots */}
      <View style={styles.pagination}>
        {events.map((_, index) => {
          const isActive = currentIndex === index + 1; // Adjust index for the "real" slides
          return (
            <View
              key={index}
              style={[
                styles.dot,
                isActive ? { backgroundColor: colors.primary } : styles.inactiveDot,
              ]}
            />
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  slide: {
    width: viewportWidth,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: "90%",
    aspectRatio: 16 / 9,
    resizeMode: "cover",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#222",
  },
  pagination: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 10,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  inactiveDot: {
    backgroundColor: "#ccc",
  },
});

export default Slider;