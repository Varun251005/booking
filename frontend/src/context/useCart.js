import { useContext } from "react";
import CartContext from "./cartContext";

const useCart = () => useContext(CartContext);

export default useCart;