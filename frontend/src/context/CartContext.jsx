import { createContext, useContext, useState } from "react";

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const getItemId = (item) => item._id ?? item.id;

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