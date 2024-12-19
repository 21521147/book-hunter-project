import React, { useEffect, useState, useContext } from "react";
import {
  FlatList,
  TouchableOpacity,
  Text,
  StyleSheet,
  View,
  Image,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import bookService from "../services/bookService";
import Loading from "./Loading";
import { ThemeContext } from "../contexts/ThemeContext";

const GenreSlider = ({ selectedGenre, setSelectedGenre }) => {
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);
  const { colors, fontSizes } = useContext(ThemeContext);

  // Thêm icon cho từng thể loại
  const genreIcons = {
    "Tất cả": require('../../assets/images/genres/tatca.png'), 
    "Thiếu nhi": require("../../assets/images/genres/thieunhi.png"),
    "Lịch sử": require("../../assets/images/genres/lichsu.png"),
    "Tiểu thuyết": require("../../assets/images/genres/tieuthuyet.png"),
    "Kinh tế": require("../../assets/images/genres/kinhte.png"),
    "Y học": require("../../assets/images/genres/yhoc.png"),
    "Tâm lý": require("../../assets/images/genres/tamly.png"),
    "Trinh thám": require("../../assets/images/genres/trinhtham.png"),
    "Văn hoá": require("../../assets/images/genres/vanhoa.png"),
    "Ngôn tình": require("../../assets/images/genres/ngontinh.png"),
    "Kinh dị": require("../../assets/images/genres/kinhdi.png"),
    "Khoa học": require("../../assets/images/genres/khoahoc.png"),
    "Chính trị": require("../../assets/images/genres/chinhtri.png"),
  };

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
      <View style={styles.iconAndText}>
        <Image
          source={genreIcons[item]}
          style={styles.icon}
        />
        <Text
          style={{
            color: item === selectedGenre ? colors.textSrd : colors.text,
            fontSize: fontSizes.medium,
            marginLeft: 10,
          }}
        >
          {item}
        </Text>
      </View>
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
  iconAndText: {
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    width: 20,
    height: 20,
    resizeMode: "contain",
  },
});

export default GenreSlider;