import React, { useState, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  Image,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { UserContext } from "../../contexts/UserContext";
import { ThemeContext } from "../../contexts/ThemeContext";
import InputBox from "../../components/InputBox";
import * as ImagePicker from 'expo-image-picker';

const ChangeInfoScreen = ({ navigation }) => {
  const { user, updateUser } = useContext(UserContext);
  const { colors, fontSizes } = useContext(ThemeContext);
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [phoneNumber, setPhoneNumber] = useState(user.phoneNumber || "");
  const [address, setAddress] = useState(user.address || "");
  const [profilePicture, setProfilePicture] = useState(user.profilePicture || "");
  const [loading, setLoading] = useState(false);

  const handleUpdate = async () => {
    setLoading(true);
    try {
      await updateUser(user.id, { name, email, phoneNumber, address, profilePicture });
      Alert.alert("Thành công", "Thông tin của bạn đã được cập nhật.");
      navigation.navigate("ProfileScreen", { updated: true });
    } catch (error) {
      console.error("Error updating user information: ", error);
      Alert.alert("Lỗi", "Cập nhật thông tin thất bại. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  const handlePickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Sorry, we need camera roll permissions to make this work!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.cancelled) {
      setProfilePicture(result.uri);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.icon} onPress={() => navigation.goBack()}>
            <Icon name="arrow-back" size={25} color={colors.primary} />
          </TouchableOpacity>
          <Text
            style={[
              styles.headerText,
              { color: colors.Text, fontSize: fontSizes.large },
            ]}
          >
            Sửa thông tin
          </Text>
        </View>

        <TouchableOpacity onPress={handlePickImage} style={styles.imageContainer}>
          <Image
            source={profilePicture ? { uri: profilePicture } : require("../../../assets/default-profile.png")}
            style={styles.profileImage}
          />
          <Text style={[styles.title,{color: colors.primary, marginBottom: 10 }]}>Thay đổi ảnh đại diện</Text>
        </TouchableOpacity>

        <InputBox
          icon="person"
          placeholder="Tên người dùng"
          value={name}
          onChangeText={setName}
          style={styles.input}
        />
        <InputBox
          icon="mail"
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          style={styles.input}
        />
        <InputBox
          icon="call"
          placeholder="Số điện thoại"
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          style={styles.input}
        />
        <InputBox
          icon="home"
          placeholder="Địa chỉ"
          value={address}
          onChangeText={setAddress}
          style={styles.input}
        />

        <TouchableOpacity
          style={[styles.button, { backgroundColor: colors.primary }]}
          onPress={handleUpdate}
          disabled={loading}
        >
          <Text
            style={{
              fontSize: fontSizes.medium,
              color: "#fff",
              textAlign: "center",
            }}
          >
            Cập nhật
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default ChangeInfoScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    padding: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "center",
    width: "100%",
    marginBottom: 20,
  },
  headerText: {
    fontWeight: "bold",
  },
  icon: {
    marginRight: 10,
  },
  title: {
    fontWeight: "bold",
  },
  imageContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  input: {
    width: "90%",
    marginVertical: 10,
  },
  button: {
    width: "90%",
    marginVertical: 10,
    padding: 15,
    borderRadius: 5,
  },
});

