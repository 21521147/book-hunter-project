import React, { useContext, useEffect, useState } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "../screens/HomeScreen";
import SearchScreen from "../screens/SearchScreen";
import CartScreen from "../screens/CartScreen";
import AuthStack from "./AuthStack";
import { ThemeContext } from "../contexts/ThemeContext";
import { UserContext } from "../contexts/UserContext";
import { CartContext } from "../contexts/CartContext";
import Icon from "react-native-vector-icons/FontAwesome5";
import { View, Text, StyleSheet } from "react-native";

const Tab = createBottomTabNavigator();

const BottomMain = ({ navigation }) => {
  const { colors, fontSizes } = useContext(ThemeContext);
  const { user } = useContext(UserContext);
  const { cartItemCount, fetchCartItemsCount } = useContext(CartContext);

  useEffect(() => {
    if (user) {
      fetchCartItemsCount();
    }
  }, [user, cartItemCount]);

  useEffect(() => {
    const updateCartItemCount = async () => {
      if (user) {
        const userInfo = await cartService.getCartItems(user.cart);
        setCartItemCount(userInfo.length);
      }
    };

    const unsubscribe = navigation.addListener('focus', updateCartItemCount);

    return unsubscribe;
  }, [navigation, user]);

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.secondary,
        tabBarLabelStyle: { fontSize: fontSizes.small },
        tabBarStyle: { backgroundColor: colors.background },
      }}
    >
      <Tab.Screen
        name="HomeScreen"
        component={HomeScreen}
        options={{
          tabBarLabel: "Trang chủ",
          tabBarIcon: ({ color, size }) => (
            <Icon name="home" color={color} size={size} />
          ),
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="SearchScreen"
        component={SearchScreen}
        options={{
          tabBarLabel: "Tìm kiếm",
          tabBarIcon: ({ color, size }) => (
            <Icon name="search" color={color} size={size} />
          ),
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="CartScreen"
        component={CartScreen}
        options={{
          tabBarLabel: "Giỏ hàng",
          tabBarIcon: ({ color, size }) => (
            <View>
              <Icon name="shopping-cart" color={color} size={size} />
              {cartItemCount > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{cartItemCount}</Text>
                </View>
              )}
            </View>
          ),
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="AuthStack"
        component={AuthStack}
        options={{
          tabBarLabel: "Tài khoản",
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Icon name="user" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  badge: {
    position: "absolute",
    right: -6,
    top: -3,
    backgroundColor: "red",
    borderRadius: 6,
    width: 14,
    height: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  badgeText: {
    color: "white",
    fontSize: 10,
    fontWeight: "bold",
  },
});

export default BottomMain;
