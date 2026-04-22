import { Container, ListGroup, Button } from "react-bootstrap";
import { useCart } from "../../context/CartContext";
import API from "../../services/api";

const Cart = () => {
  const { cart, removeFromCart, increaseQty, decreaseQty } = useCart();
  const getItemId = (item) => item._id ?? item.id;

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const placeOrder = async () => {
    try {
      await API.post("/orders", {
        items: cart.map(item => ({
          foodId: item._id,
          quantity: item.quantity
        })),
        totalPrice: total
      });

      alert("Order placed!");
    } catch (err) {
      alert("Error placing order");
    }
  };

  return (
    <Container className="mt-4 page-shell">
      <h2 className="page-title">Your Cart</h2>

      {cart.length === 0 ? (
        <p>No items in cart</p>
      ) : (
        <>
          <ListGroup>
            {cart.map(item => (
              <ListGroup.Item key={getItemId(item)} className="cart-item">
                <h5>{item.name}</h5>
                <p>₹{item.price}</p>

                <Button className="theme-btn-sm" onClick={() => decreaseQty(getItemId(item))}>-</Button>
                <span className="mx-2">{item.quantity}</span>
                <Button className="theme-btn-sm" onClick={() => increaseQty(getItemId(item))}>+</Button>

                <Button
                  variant="danger"
                  className="float-end"
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