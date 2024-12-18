import React, { useContext } from "react";
import { View, Text, Button, ScrollView, StyleSheet } from "react-native";
import Slider from "../components/Slider";
import { ThemeContext } from "../contexts/ThemeContext";

const HomeScreen = ({ navigation }) => {
  const { colors, fontSizes } = useContext(ThemeContext);

  return (
    <View style={styles.container}>
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <Text
          style={[
            styles.headerText,
            { fontSize: fontSizes.xxxLarge, color: colors.primary },
          ]}
        >
          BOOK HUNTER
        </Text>
      </View>

      <Slider navigation={navigation}/>

      <ScrollView contentContainerStyle={styles.content}></ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    marginVertical: 20,
    padding: 10,
    alignItems: "center",
    borderBottomWidth: 1,
  },
  headerText: {
    fontWeight: "900",
  },
  content: {
    flexGrow: 1,
    alignItems: "center",
    paddingVertical: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
});

export default HomeScreen;
