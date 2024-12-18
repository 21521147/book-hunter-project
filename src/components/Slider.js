import React, { useState, useEffect, useRef } from "react";
import { View, Image, StyleSheet, Dimensions, Text, ScrollView } from "react-native";
import { useFetchEvents } from "../services/eventService";

const { width: viewportWidth } = Dimensions.get("window");

const Slider = () => {
  const { events, loading } = useFetchEvents();
  const scrollViewRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(1); // Start from the first "real" slide

  useEffect(() => {
    if (events.length > 0) {
      const autoScroll = setInterval(() => {
        handleAutoScroll();
      }, 3000); // Change slide every 3 seconds

      return () => clearInterval(autoScroll);
    }
  }, [events]);

  const handleAutoScroll = () => {
    if (scrollViewRef.current) {
      setCurrentIndex((prevIndex) => {
        const nextIndex = prevIndex + 1;
        scrollViewRef.current.scrollTo({ x: nextIndex * viewportWidth, animated: true });
        return nextIndex;
      });
    }
  };

  const handleMomentumScrollEnd = (event) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / viewportWidth);

    // If swiped to the duplicated first or last image, reset to the real first or last
    if (index === 0) {
      scrollViewRef.current.scrollTo({ x: events.length * viewportWidth, animated: false });
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
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  // Create a "looped" list with cloned first and last images
  const loopedEvents = [
    { ...events[events.length - 1] }, // Clone of the last image
    ...events,
    { ...events[0] }, // Clone of the first image
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
          <View key={index} style={styles.slide}>
            <Image source={{ uri: event.banner }} style={styles.image} />
          </View>
        ))}
      </ScrollView>

      {/* Pagination dots */}
      <View style={styles.pagination}>
        {events.map((_, index) => {
          const isActive = currentIndex === index + 1; // Adjust index for the "real" slides
          return (
            <View
              key={index}
              style={[styles.dot, isActive ? styles.activeDot : styles.inactiveDot]}
            />
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
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
    alignItems: "center",
    marginTop: 10,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  activeDot: {
    backgroundColor: "#007bff",
  },
  inactiveDot: {
    backgroundColor: "#d3d3d3",
  },
});

export default Slider;
