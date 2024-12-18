import React, { useEffect, useState, useContext } from "react";
import {
  FlatList,
  TouchableOpacity,
  Text,
  StyleSheet,
  View,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import bookService from "../services/bookService";
import Loading from "./Loading";
import { ThemeContext } from "../contexts/ThemeContext";

const GenreSlider = ({ selectedGenre, setSelectedGenre }) => {
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);
  const { colors, fontSizes } = useContext(ThemeContext);

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const cachedGenres = await AsyncStorage.getItem("genres");
        if (cachedGenres) {
          setGenres(["Tất cả", ...JSON.parse(cachedGenres)]);
          setLoading(false);
        } else {
          const genres = await bookService.getAllGenre();
          setGenres(["Tất cả", ...genres]);
          await AsyncStorage.setItem("genres", JSON.stringify(genres));
          setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching genres: ", error);
        setLoading(false);
      }
    };

    fetchGenres();
  }, []);

  if (loading) {
    return <Loading />;
  }

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.genreItem,
        {
          backgroundColor:
            item === selectedGenre ? colors.primary : colors.background,
          shadowColor: colors.shadow,
        },
      ]}
      onPress={() => setSelectedGenre(item)}
    >
      <Text style={{ color: item === selectedGenre ? colors.textSrd : colors.text, fontSize: fontSizes.medium }}>
        {item}
      </Text>
    </TouchableOpacity>
  );

  return (
    <FlatList
      data={genres}
      renderItem={renderItem}
      keyExtractor={(item) => item}
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.genreList}
    />
  );
};

const styles = StyleSheet.create({
  genreList: {
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  genreItem: {
    marginRight: 10,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 20,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
});

export default GenreSlider;
