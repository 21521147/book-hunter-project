import React, { useState, useContext } from "react";
import {
  View,
  Text,
  Image,
  Alert,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import InputBox from "../../components/InputBox";
import Icon from "react-native-vector-icons/Ionicons";
import { ThemeContext } from "../../contexts/ThemeContext";
import authService from "../../services/authService";

const ForgotPasswordScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const { colors, fontSizes } = useContext(ThemeContext);

  const handleSendCode= () => {
    if (!email) {
      Alert.alert("Lỗi", "Vui lòng nhập email của bạn!");
      return;
    }

    authService
      .resetpassword(email)
      .then(() => {
        Alert.alert(
          "Thành công",
          "Chúng tôi đã gửi email khôi phục mật khẩu cho bạn. Vui lòng kiểm tra hộp thư của bạn!"
        );
        navigation.goBack();
      })
      .catch((error) => {
        console.log("Lỗi khôi phục mật khẩu: ", error);
        Alert.alert("Lỗi", "Đã có lỗi xảy ra. Vui lòng thử lại!");
      });
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <TouchableOpacity style={styles.icon} onPress={() => navigation.goBack()}>
        <Icon name="arrow-back" size={30} color={colors.primary} />
      </TouchableOpacity>

      <Image
        source={require("../../../assets/icon.png")}
        style={{ marginTop: 5, width: 200, height: 200 }}
      />

      <Text
        style={[
          styles.title,
          { color: colors.primary, fontSize: fontSizes.xxLarge },
        ]}
      >
        Khôi phục mật khẩu
      </Text>

      <InputBox
        icon={"person"}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
      />

      <TouchableOpacity
        style={[styles.button, { backgroundColor: colors.primary }]}
        onPress={handleSendCode}
      >
        <Text
          style={{
            fontSize: fontSizes.medium,
            color: "#fff",
            textAlign: "center",
          }}
        >
          Xác nhận
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default ForgotPasswordScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
  },
  icon: {
    width: "95%",
    marginTop: 25,
  },
  title: {
    fontWeight: "bold",
    marginBottom: 20,
  },
  button: {
    paddingVertical: 15,
    width: "50%",
    marginVertical: 10,
    borderRadius: 5,
  },
});
