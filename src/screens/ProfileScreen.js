import React, { useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { AuthContext } from "../contexts/AuthContext";
import Icon from "react-native-vector-icons/Ionicons";
import Icon1 from "react-native-vector-icons/FontAwesome5";
import { ThemeContext } from "../contexts/ThemeContext";
import ToggleMode from "../components/ToggleMode";
import IconBox from "../components/IconBox";

const ProfileScreen = ({ navigation }) => {
  const { user, logout } = useContext(AuthContext);
  const { colors, fontSizes } = useContext(ThemeContext);

  const handleSignOut = async () => {
    await logout();
  };

  if (!user) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  const createdAt = user.created_at.toDate().toLocaleDateString();
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <View style={[styles.headerLeft]}>
          <Icon1
            style={[styles.icon, { borderColor: colors.icon }]}
            name="user-alt"
            size={40}
            color={colors.icon}
          />
          <View>
            <Text style={{ color: colors.text, fontSize: fontSizes.medium }}>
              {user.name}
            </Text>
            <Text style={{ color: colors.text, fontSize: fontSizes.small }}>
              Ngày lập tài khoản: {createdAt}
            </Text>
          </View>
        </View>
        <TouchableOpacity
          onPress={() => navigation.navigate("ChangeInfoScreen")}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Icon
              name="create-outline"
              size={40}
              style={{ color: colors.icon }}
            />
          </View>
        </TouchableOpacity>
      </View>

      <View style={[styles.line, {borderColor: colors.text}]}/>

      <View style={styles.section}>
        <Text
          style={{
            color: colors.primary,
            fontSize: fontSizes.medium,
            fontWeight: "bold",
          }}
        >
          Email:
        </Text>
        <Text style={{ color: colors.text, fontSize: fontSizes.medium }}>
          {user.email}
        </Text>
      </View>

      <View style={styles.section}>
        <Text
          style={{
            color: colors.primary,
            fontSize: fontSizes.medium,
            fontWeight: "bold",
          }}
        >
          Số điện thoại:
        </Text>
        <Text style={{ color: colors.text, fontSize: fontSizes.medium }}>
          {user.phoneNumber}
        </Text>
      </View>

      <View style={styles.section}>
        <Text
          style={{
            color: colors.primary,
            fontSize: fontSizes.medium,
            fontWeight: "bold",
          }}
        >
          Địa chỉ:
        </Text>
        <Text style={{ color: colors.text, fontSize: fontSizes.medium }}>
          {user.address}
        </Text>
      </View>

      <View style={[styles.line, {borderColor: colors.text}]}/>

      <View
        style={{
          justifyContent: "flex-start",
          alignItems: "center",
          width: "95%",
          flexDirection: "row",
          flexWrap: "wrap",
        }}
      >
        <IconBox
          icon="heart-outline"
          text="Sản phẩm yêu thích"
          targetScreen="ChangeInfoScreen"
        />
        <IconBox
          icon="cart-outline"
          text="Thông tin giỏ hàng"
          targetScreen="ChangeInfoScreen"
        />
      </View>

      <View style={[styles.line, {borderColor: colors.text}]}/>

      <View style={styles.section2}>
        <Text
          style={{
            color: colors.primary,
            fontSize: fontSizes.medium,
            fontWeight: "bold",
          }}
        >
          Chế độ ban đêm:
        </Text>
        <ToggleMode />
      </View>

      <TouchableOpacity
        style={[styles.signOutButton, { backgroundColor: colors.primary }]}
        onPress={handleSignOut}
      >
        <Text style={{ color: "#fff", fontSize: fontSizes.medium }}>
          Sign out
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
  header: {
    marginTop: 30,
    width: "95%",
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "row",
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",

    justifyContent: "space-between",
  },
  icon: {
    padding: 10,
    margin: 10,
    borderWidth: 1,
    borderRadius: 50,
  },
  line: {
    width: "80%",
    borderBottomWidth: 1,
    margin: 10,
  },
  section: {
    width: "95%",
    padding: 5,
    margin: 10,
  },
  section2: {
    width: "95%",
    padding: 5,
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "row",
  },
  signOutButton: {
    width: "50%",
    padding: 10,
    margin: 10,
    alignItems: "center",
    borderRadius: 5,
  },
});

export default ProfileScreen;
