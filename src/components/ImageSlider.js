import React, { useState, useEffect, useRef, useContext } from "react";
import {
  View,
  Image,
  StyleSheet,
  Dimensions,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { ThemeContext } from "../contexts/ThemeContext";

const { width: viewportWidth } = Dimensions.get("window");

const ImageSlider = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollViewRef = useRef(null);
  const { colors } = useContext(ThemeContext);

  useEffect(() => {
    if (scrollViewRef.current && images.length > 0) {
      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) => {
          const nextIndex = (prevIndex + 1) % images.length;
          scrollViewRef.current.scrollTo({
            x: nextIndex * viewportWidth,
            animated: true,
          });
          return nextIndex;
        });
      }, 3000); // Change slide every 3 seconds

      return () => clearInterval(interval);
    }
  }, [images]);

  const handleMomentumScrollEnd = (event) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / viewportWidth);

    // If swiped to the duplicated first or last image, reset to the real first or last
    if (index === 0) {
      scrollViewRef.current.scrollTo({
        x: images.length * viewportWidth,
        animated: false,
      });
      setCurrentIndex(images.length);
    } else if (index === images.length + 1) {
      scrollViewRef.current.scrollTo({ x: viewportWidth, animated: false });
      setCurrentIndex(1);
    } else {
      setCurrentIndex(index);
    }
  };

  if (images.length === 0) {
    return null;
  }

  // Create a "looped" list with cloned first and last images
  const loopedImages = [
    { uri: images[images.length - 1] }, // Clone of the last image
    ...images.map((image) => ({ uri: image })),
    { uri: images[0] },
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
        {loopedImages.map((image, index) => (
          <View key={index} style={styles.slide}>
            <Image source={{ uri: image.uri }} style={styles.image} />
          </View>
        ))}
      </ScrollView>

      {/* Pagination dots */}
      <View style={styles.pagination}>
        {images.map((_, index) => {
          const isActive = currentIndex === index + 1; // Adjust index for the "real" slides
          return (
            <View
              key={index}
              style={[
                styles.dot,
                isActive
                  ? { backgroundColor: colors.primary }
                  : styles.inactiveDot,
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
    marginTop: 10,
  },
  image: {
    width: "80%",
    aspectRatio: 16 / 9,
    resizeMode: "contain",
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

export default ImageSlider;
