import React, { useState, useContext } from "react";
import {
  View,
  Text,
  Button,
  TextInput,
  StyleSheet,
  Alert,
  Image,
  Modal,
  TouchableOpacity,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import authService from "../../services/authService";
import { ThemeContext } from "../../contexts/ThemeContext";

const SignUpScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { fontSizes, colors } = useContext(ThemeContext);

  const handleSignUp = async () => {
    setError(""); // Xóa lỗi trước đó

    if (!email || !password || !confirmPassword) {
      Alert.alert("Lỗi", "Vui lòng điền đầy đủ thông tin!");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Lỗi", "Mật khẩu không khớp!");
      return;
    }

    setLoading(true); // Bắt đầu trạng thái loading

    try {
      await authService.register(email, password);
      console.log("Đăng ký thành công!");

      Alert.alert(
        "Thành công",
        "Đăng ký thành công! Hãy xác thực email của bạn để tiếp tục.",
        [
          {
            text: "OK",
            onPress: () => navigation.navigate("SignIn"), // Điều hướng tới màn hình đăng nhập
          },
        ]
      );
    } catch (error) {
      console.log("Đăng ký thất bại:", error.code, error.message);

      let errorMessage = "Đã có lỗi xảy ra. Vui lòng thử lại!";
      switch (error.code) {
        case "auth/email-already-in-use":
          errorMessage = "Email này đã được sử dụng.";
          break;
        case "auth/invalid-email":
          errorMessage = "Email không hợp lệ.";
          break;
        case "auth/weak-password":
          errorMessage = "Mật khẩu quá yếu. Vui lòng chọn mật khẩu mạnh hơn.";
          break;
        default:
          errorMessage = "Đăng ký lỗi"; // Thông báo mặc định nếu lỗi không nằm trong switch
      }

      Alert.alert("Lỗi", errorMessage);
      setError(errorMessage);
    } finally {
      setLoading(false); 
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <TouchableOpacity 
        style={styles.icon}
        onPress={() => navigation.goBack()}
      >
        <Icon name="arrow-back" size={30} color={colors.primary}/>
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
        Đăng ký
      </Text>

      <TextInput
        placeholder="Email"
        style={[
          styles.textInput,
          {
            backgroundColor: colors.card,
            color: colors.text,
            fontSize: fontSizes.medium,
          },
        ]}
        placeholderTextColor={colors.secondary}
        onChangeText={(text) => setEmail(text)}
        value={email}
      />
      <TextInput
        placeholder="Mật khẩu"
        style={[
          styles.textInput,
          {
            backgroundColor: colors.card,
            color: colors.text,
            fontSize: fontSizes.medium,
          },
        ]}
        placeholderTextColor={colors.secondary}
        secureTextEntry={true}
        onChangeText={(text) => setPassword(text)}
        value={password}
      />
      <TextInput
        secureTextEntry={true}
        style={[
          styles.textInput,
          {
            backgroundColor: colors.card,
            color: colors.text,
            fontSize: fontSizes.medium,
          },
        ]}
        placeholderTextColor={colors.secondary}
        placeholder="Nhập lại mật khẩu"
        onChangeText={(text) => setConfirmPassword(text)}
        value={confirmPassword}
      />

      <TouchableOpacity
        style={[
          styles.button,
          { backgroundColor: "#0A51B0", padding: 10, borderRadius: 5 },
        ]}
        onPress={handleSignUp}
        disabled={loading}
      >
        <Text style={{ fontSize: fontSizes.medium, color: "#fff", textAlign: "center" }}>Đăng ký</Text>
      </TouchableOpacity>

      <View style={{flexDirection: 'row'}}>
        <Text style={{ color: colors.text, fontSize: fontSizes.small }}>
          Bạn đã có tài khoản?
        </Text>
        <TouchableOpacity onPress={() => navigation.navigate("SignIn")}>
          <Text style={{ color: colors.primary, marginLeft: 10 }}>Đăng nhập</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default SignUpScreen;

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
  textInput: {
    width: "80%",
    padding: 10,
    marginBottom: 20,
    borderWidth: 1,
    borderRadius: 5,
  },
  button: {
    width: "80%",
    marginVertical: 20,

  }
});
