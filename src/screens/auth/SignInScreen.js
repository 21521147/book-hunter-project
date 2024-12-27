import React, { useState, useContext } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Alert,
  SafeAreaView,
} from "react-native";
import InputBox from "../../components/InputBox";
import { ThemeContext } from "../../contexts/ThemeContext";
import authService from "../../services/authService";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Loading from "../../components/Loading";

const SignInScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { colors, fontSizes } = useContext(ThemeContext);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignIn = async () => {
    setLoading(true);
    setError("");

    if (!email || !password) {
      setLoading(false);
      Alert.alert("Lỗi", "Vui lòng điền đầy đủ thông tin!");
      return;
    }

    try {
      const user = await authService.login(email, password);
      setLoading(false);
      Alert.alert("Thành công", "Đăng nhập thành công!");
    } catch (error) {
      setLoading(false);
      console.log("Đăng nhập thất bại:", error.code, error.message);

      let errorMessage = "Đã có lỗi xảy ra. Vui lòng thử lại!";
      switch (error.code) {
        case "auth/user-not-found":
          errorMessage = "Email này chưa được đăng ký.";
          break;
        case "auth/wrong-password":
          errorMessage = "Mật khẩu không chính xác.";
          break;
      }
      Alert.alert("Lỗi", errorMessage);

      setError(errorMessage);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Image
          source={require("../../../assets/icon.png")}
          style={{ marginTop: 30, width: 200, height: 200 }}
        />

        <Text
          style={[
            styles.title,
            { color: colors.primary, fontSize: fontSizes.xxLarge },
          ]}
        >
          Đăng nhập
        </Text>

        <InputBox
          icon={"person"}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          style={styles.input}
        />
        <InputBox
          icon={"lock-closed"}
          placeholder="Mật khẩu"
          value={password}
          onChangeText={setPassword}
          style={styles.input}
          secureTextEntry
        />

        <TouchableOpacity
          style={{ alignSelf: "flex-end", marginRight: 40, marginBottom: 20 }}
          onPress={() => navigation.navigate("ForgotPassword")}
        >
          <Text
            style={{
              color: colors.primary,
              fontWeight: "bold",
            }}
          >
            Quên mật khẩu?
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: colors.primary }]}
          onPress={handleSignIn}
        >
          <Text
            style={{
              fontSize: fontSizes.medium,
              color: "#fff",
              textAlign: "center",
            }}
          >
            Đăng nhập
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
            Bạn chưa có tài khoản?
          </Text>
          <TouchableOpacity onPress={() => navigation.navigate("SignUp")}>
            <Text
              style={{
                color: colors.primary,
                marginLeft: 10,
                fontWeight: "bold",
              }}
            >
              Đăng ký
            </Text>
          </TouchableOpacity>
        </View>
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

export default SignInScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
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
    width: "80%",
    marginVertical: 10,
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
