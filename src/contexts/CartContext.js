import React, { createContext, useState, useEffect, useContext } from "react";
import cartService from "../services/cartService";
import orderService from "../services/orderService";
import { UserContext } from "./UserContext";

export const CartContext = createContext();

const CartContextProvider = ({ children }) => {
  const { user } = useContext(UserContext);
  const [cartItems, setCartItems] = useState([]);
  const [cartItemCount, setCartItemCount] = useState(0);
  const [statusCount, setStatusCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchCartItemsCount = async () => {
    if (user) {
      setLoading(true);
      try {
        const items = await cartService.getCartItems(user.id);
        setCartItems(items);
        setCartItemCount(items.length);
      } catch (error) {
        console.error("Error fetching cart items: ", error);
      } finally {
        setLoading(false);
      }
    }
  };

  const fetchStatusCount = async () => {
    if (user) {
      try {
        const count = await orderService.countOrdersByStatus(user.id, "Đã nhận");
        setStatusCount(count);
      } catch (error) {
        console.error("Error fetching order status count: ", error);
      }
    }
  }

  useEffect(() => {
    fetchCartItemsCount();
    fetchCartItemsCount();
  }, [user]);

  const addToCart = async (item) => {
    if (user) {
      try {
        await cartService.addToCart(item, user.id);
        fetchCartItemsCount();
      } catch (error) {
        console.error("Error adding to cart: ", error);
      }
    }
  };

  const removeFromCart = async (itemId) => {
    if (user) {
      try {
        await cartService.removeFromCart(itemId, user.id);
        fetchCartItemsCount();
      } catch (error) {
        console.error("Error removing from cart: ", error);
      }
    }
  };

  const updateCartItemQuantity = async (itemId, change) => {
    if (user) {
      try {
        await cartService.updateCartItemQuantity(itemId, user.id, change);
        fetchCartItemsCount();
      } catch (error) {
        console.error("Error updating cart item quantity: ", error);
      }
    }
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartItemCount,
        addToCart,
        removeFromCart,
        updateCartItemQuantity,
        fetchCartItemsCount,
        fetchStatusCount,
        loading,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export default CartContextProvider;