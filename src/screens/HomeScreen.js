import React, { useState, useContext } from "react";
import { View, Text, Image, ScrollView, StyleSheet, SafeAreaView } from "react-native";
import Slider from "../components/Slider";
import GenreSlider from "../components/GenreSlider";
import FlatlistByGenre from "../components/book/FlatlistByGenre";
import FlatlistByRatingAvg from "../components/book/FlatlistByRatingAvg";
import { ThemeContext } from "../contexts/ThemeContext";

const HomeScreen = ({ navigation }) => {
  const { colors, fontSizes } = useContext(ThemeContext);
  const [selectedGenre, setSelectedGenre] = useState("Tất cả");

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={[styles.header, { borderBottomColor: colors.border }]}>
          <Image
            source={require("../../assets/playstore-icon.png")}
            style={{ width: 80, height: 80 }}
          />
          <Text
            style={[
              styles.headerText,
              { fontSize: fontSizes.xxxLarge, color: colors.primary },
            ]}
          >
            BOOK HUNTER
          </Text>
        </View>
        
        <ScrollView>
          <Slider navigation={navigation} />

          <View style={styles.section}>
            <GenreSlider
              selectedGenre={selectedGenre}
              setSelectedGenre={setSelectedGenre}
            />
            <FlatlistByGenre
              selectedGenre={selectedGenre}
              navigation={navigation}
            />
          </View>

          <View style={styles.section}>
            <FlatlistByRatingAvg navigation={navigation} />
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    marginTop: 5,
    alignItems: "center",
    justifyContent: "center",
    borderBottomWidth: 1,
    marginBottom: 10,
  },
  headerText: {
    fontWeight: "900",
  },
  section: {},
});

export default HomeScreen;
