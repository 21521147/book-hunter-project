import React, { useState, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  Alert,
  Image,
  Modal,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import authService from "../../services/authService";
import { ThemeContext } from "../../contexts/ThemeContext";
import InputBox from "../../components/InputBox";
import Loading from "../../components/Loading";

const SignUpScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [userName, setUserName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { fontSizes, colors } = useContext(ThemeContext);

  const handleSignUp = async () => {
    setError(""); // Xóa lỗi trước đó

    if (!email || !password || !confirmPassword || !userName || !phoneNumber) {
      Alert.alert("Lỗi", "Vui lòng điền đầy đủ thông tin!");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Lỗi", "Mật khẩu không khớp!");
      return;
    }

    setLoading(true); // Bắt đầu trạng thái loading

    try {
      await authService.register(email, password, userName, phoneNumber);
      console.log("Đăng ký thành công!");

      Alert.alert(
        "Thành công",
        "Đăng ký thành công! Hãy xác thực email của bạn để tiếp tục.",
        [
          {
            text: "OK",
            onPress: () => navigation.goBack(), // Điều hướng tới màn hình đăng nhập
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
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
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
        Đăng ký
      </Text>
      <InputBox
        icon="person"
        placeholder="Tên người dùng"
        onChangeText={(text) => setUserName(text)}
        value={userName}
      />
      <InputBox
        icon="mail"
        placeholder="Email"
        onChangeText={(text) => setEmail(text)}
        value={email}
      />
      <InputBox
        icon="call"
        placeholder="Số điện thoại"
        onChangeText={(text) => setPhoneNumber(text)}
        value={phoneNumber}
      />
      <InputBox
        icon="lock-closed"
        placeholder="Mật khẩu"
        secureTextEntry={true}
        onChangeText={(text) => setPassword(text)}
        value={password}
      />
      <InputBox
        icon="lock-closed"
        placeholder="Nhập lại mật khẩu"
        secureTextEntry={true}
        onChangeText={(text) => setConfirmPassword(text)}
        value={confirmPassword}
      />

      <TouchableOpacity
        style={[styles.button, { backgroundColor: colors.primary }]}
        onPress={handleSignUp}
        disabled={loading}
      >
        <Text
          style={{
            fontSize: fontSizes.medium,
            color: "#fff",
            textAlign: "center",
          }}
        >
          Đăng ký
        </Text>
      </TouchableOpacity>

      <Text style={{ color: colors.text, fontSize: fontSizes.small }}>
        Hoặc đăng nhập với
      </Text>
      <View style={styles.socialContainer}>
        <TouchableOpacity
          style={[styles.socialButton, { backgroundColor: "#3b5998" }]}
        >
          <FontAwesome name="facebook" size={20} color="#fff" />
          <Text style={styles.socialButtonText}>Facebook</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.socialButton, { backgroundColor: "#db4437" }]}
        >
          <FontAwesome name="google" size={20} color="#fff" />
          <Text style={styles.socialButtonText}>Google</Text>
        </TouchableOpacity>
      </View>

      <View style={{ flexDirection: "row" }}>
        <Text style={{ color: colors.text, fontSize: fontSizes.small }}>
          Bạn đã có tài khoản?
        </Text>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text
            style={{
              color: colors.primary,
              marginLeft: 10,
              fontWeight: "bold",
            }}
          >
            Đăng nhập
          </Text>
        </TouchableOpacity>
      </View>

      <Modal
        transparent={true}
        animationType="none"
        visible={loading}
        onRequestClose={() => {}}
      >
        <View style={styles.modalBackground}>
          <View style={styles.activityIndicatorWrapper}>
            <Loading />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
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
  button: {
    width: "80%",
    marginVertical: 10,
    padding: 15,
    borderRadius: 5,
  },
  socialContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "80%",
    marginTop: 10,
    marginBottom: 15,
  },
  socialButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    borderRadius: 5,
    width: "48%",
  },
  socialButtonText: {
    color: "#fff",
    marginLeft: 10,
    fontWeight: "bold",
  },
  modalBackground: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  activityIndicatorWrapper: {
    backgroundColor: "#FFFFFF",
    height: 100,
    width: 100,
    borderRadius: 10,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
});
