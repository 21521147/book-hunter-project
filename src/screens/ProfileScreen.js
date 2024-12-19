import React, { useContext, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Image,
} from "react-native";
import { AuthContext } from "../contexts/AuthContext";
import Icon from "react-native-vector-icons/Ionicons";
import Icon1 from "react-native-vector-icons/FontAwesome5";
import { ThemeContext } from "../contexts/ThemeContext";
import ToggleMode from "../components/ToggleMode";
import IconBox from "../components/IconBox";
import Loading from "../components/Loading";
import { UserContext } from "../contexts/UserContext";

const ProfileScreen = ({ navigation, route }) => {
  const { user, updateUser } = useContext(UserContext);
  const { colors, fontSizes } = useContext(ThemeContext);
  const { logout } = useContext(AuthContext);

  useEffect(() => {
    if (route.params?.updated) {
      // Fetch updated user information if available
      updateUser(user.id, {});
    }
  }, [route.params?.updated]);

  const handleSignOut = async () => {
    await logout();
  };

  if (!user) {
    return <Loading />;
  }

  const createdAt = user.created_at.toDate().toLocaleDateString();
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.header}>
          <Text style={[styles.headerText, { color: colors.text, fontSize: fontSizes.large }]}>
            Hồ sơ cá nhân
          </Text>
        </View>
        <View style={styles.profileHeader}>
          <View style={[styles.headerLeft]}>
            <Image
              source={user.profilePicture ? { uri: user.profilePicture } : require("../../assets/default-profile.png")}
              style={styles.profileImage}
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
                size={30}
                style={{ color: colors.icon }}
              />
            </View>
          </TouchableOpacity>
        </View>

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

        {user.phoneNumber && (
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
        )}

        {user.address && (
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
        )}

        <View style={[styles.line, { borderColor: colors.text }]} />

        <View style={styles.iconBoxContainer}>
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

        <View style={[styles.line, { borderColor: colors.text }]} />

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
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
  },
  headerText: {
    marginLeft: 10,
    fontWeight: "bold",
  },
  profileHeader: {
    marginTop: 20,
    width: "100%",
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "row",
    paddingHorizontal: 16,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  profileImage: {
    width: 90,
    height: 90,
    borderRadius: 50,
    marginRight: 10,
  },
  icon: {
    padding: 10,
    margin: 10,
    borderWidth: 1,
    borderRadius: 50,
  },
  line: {
    width: "90%",
    borderBottomWidth: 1,
    marginVertical: 10,
    alignSelf: 'center',
  },
  section: {
    width: "100%",
    padding: 10,
    marginVertical: 5,
    paddingHorizontal: 16,
  },
  iconBoxContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    padding: 10,
  },
  section2: {
    width: "100%",
    padding: 10,
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "row",
    paddingHorizontal: 16,
  },
  signOutButton: {
    width: "50%",
    padding: 10,
    margin: 20,
    alignItems: "center",
    borderRadius: 5,
    alignSelf: 'center',
  },
});

export default ProfileScreen;
