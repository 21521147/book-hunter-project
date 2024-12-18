import React, {useContext} from "react";
import { View, Text, Button, ScrollView, StyleSheet } from "react-native";
import Slider from "../components/Slider";
import { ThemeConText } from "../contexts/ThemeContext";

const HomeScreen = ({ navigation }) => {
  const {colors, fontSizes} = useContext(ThemeConText);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={{fontSize: fontSizes.xxLarge}}>BOOK HUNTER</Text>
      </View>
      <Slider />
      {/* Main Content */}
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Home Screen</Text>
        <Button
          title="Go to Details"
          onPress={() => navigation.navigate("Details")}
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    padding: 10,
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
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
