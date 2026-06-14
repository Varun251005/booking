import { useEffect, useState } from "react";
import CartContext from "./cartContext";

const CART_STORAGE_KEY = "booking_cart_items";

const readCartFromStorage = () => {
  try {
    const rawCart = localStorage.getItem(CART_STORAGE_KEY);
    if (!rawCart) return [];

    const parsed = JSON.parse(rawCart);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(readCartFromStorage);
  const getItemId = (item) => item._id ?? item.id;

  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  }, [cart]);

  const addToCart = (food) => {
    const foodId = getItemId(food);
    const exist = cart.find(item => getItemId(item) === foodId);

    if (exist) {
      setCart(cart.map(item =>
        getItemId(item) === foodId
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, { ...food, quantity: 1 }]);
    }
  };

  const removeFromCart = (itemId) => {
    setCart(cart.filter(item => getItemId(item) !== itemId));
  };

  const increaseQty = (itemId) => {
    setCart(cart.map(item =>
      getItemId(item) === itemId
        ? { ...item, quantity: item.quantity + 1 }
        : item
    ));
  };

  const decreaseQty = (itemId) => {
    setCart(cart.map(item =>
      getItemId(item) === itemId && item.quantity > 1
        ? { ...item, quantity: item.quantity - 1 }
        : item
    ));
  };

  return (
    <CartContext.Provider value={{
      cart,
      addToCart,
      removeFromCart,
      increaseQty,
      decreaseQty
    }}>
      {children}
    </CartContext.Provider>
  );
};