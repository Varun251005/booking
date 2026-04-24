import { useState } from "react";
import { Alert, Button, Container, Form, ListGroup } from "react-bootstrap";
import { useCart } from "../../context/CartContext";
import API from "../../services/api";

const Cart = () => {
  const { cart, removeFromCart, increaseQty, decreaseQty } = useCart();
  const [tableNumber, setTableNumber] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const getItemId = (item) => item._id ?? item.id;

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const placeOrder = async () => {
    if (!tableNumber.trim()) {
      setErrorMessage("Table number is required");
      setSuccessMessage("");
      return;
    }

    try {
      setErrorMessage("");
      await API.post("/orders", {
        items: cart.map(item => ({
          foodId: getItemId(item),
          foodName: item.name,
          price: item.price,
          quantity: item.quantity
        })),
        totalPrice: total,
        tableNumber: Number(tableNumber)
      });

      setSuccessMessage("Order placed successfully");
      setTableNumber("");
    } catch (err) {
      setSuccessMessage("");
      setErrorMessage("Error placing order");
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

          <Form.Group className="mb-3">
            <Form.Label>Table Number</Form.Label>
            <Form.Control
              type="number"
              min="1"
              value={tableNumber}
              onChange={(event) => setTableNumber(event.target.value)}
              placeholder="Enter table number"
            />
          </Form.Group>

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
          <Button className="mt-3 theme-btn" onClick={placeOrder}>
            Place Order
          </Button>
        </>
      )}
    </Container>
  );
};

export default Cart;