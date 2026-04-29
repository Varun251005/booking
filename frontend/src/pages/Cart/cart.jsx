import { useState, useEffect } from "react";
import { Alert, Button, Container, Form, ListGroup } from "react-bootstrap";
import { useCart } from "../../context/CartContext";
import API from "../../services/api";
import getDeviceId from "../../utils/device";

const Cart = () => {
  const { cart, removeFromCart, increaseQty, decreaseQty } = useCart();
  const [user, setUser] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isPlacing, setIsPlacing] = useState(false);
  const getItemId = (item) => item._id ?? item.id;

  useEffect(() => {
    // Get user data from localStorage
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const placeOrder = async () => {
    if (!user) {
      setErrorMessage("User information not found. Please login again.");
      setSuccessMessage("");
      return;
    }

    try {
      setErrorMessage("");
      setIsPlacing(true);
      const deviceId = getDeviceId();

      await API.post("/orders", {
        items: cart.map((item) => ({
          foodId: getItemId(item),
          foodName: item.name,
          price: item.price,
          quantity: item.quantity,
        })),
        totalPrice: total,
        tableNumber: Number(user.table),
        name: user.name,
        deviceId,
      });

      setSuccessMessage("Order placed successfully!");
      setTimeout(() => {
        window.location.href = "/orders";
      }, 1500);
    } catch (err) {
      setSuccessMessage("");
      setErrorMessage(err.response?.data?.message || "Error placing order");
    } finally {
      setIsPlacing(false);
    }
  };

  return (
    <Container className="mt-4 page-shell">
      <h2 className="page-title">Your Cart</h2>

      {cart.length === 0 ? (
        <p>No items in cart</p>
      ) : (
        <>
          {successMessage && <Alert variant="success">{successMessage}</Alert>}
          {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}

          {user && (
            <div style={{ marginBottom: "20px", padding: "10px", backgroundColor: "#f8f9fa", borderRadius: "8px" }}>
              <p><strong>Name:</strong> {user.name}</p>
              <p><strong>Table:</strong> {user.table}</p>
            </div>
          )}

          <ListGroup>
            {cart.map(item => (
              <ListGroup.Item key={getItemId(item)} className="cart-item">
                <h5>{item.name}</h5>
                <p>₹{item.price}</p>

                <Button className="theme-btn-sm" onClick={() => decreaseQty(getItemId(item))}>-</Button>
                <span className="mx-2">{item.quantity}</span>
                <Button className="theme-btn-sm" onClick={() => increaseQty(getItemId(item))}>+</Button>

                <Button
                  className="float-end theme-btn-sm"
                  onClick={() => removeFromCart(getItemId(item))}
                >
                  Remove
                </Button>
              </ListGroup.Item>
            ))}
          </ListGroup>

          <h4 className="mt-3 total-text">Total: ₹{total}</h4>
          <Button className="mt-3 theme-btn" onClick={placeOrder} disabled={isPlacing}>
            {isPlacing ? "Placing Order..." : "Place Order"}
          </Button>
        </>
      )}
    </Container>
  );
};

export default Cart;