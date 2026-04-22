import { Container, ListGroup, Button } from "react-bootstrap";
import { useCart } from "../../context/CartContext";

const Cart = () => {
  const { cart, removeFromCart, increaseQty, decreaseQty } = useCart();

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <Container className="mt-4">
      <h2>Your Cart</h2>

      {cart.length === 0 ? (
        <p>No items in cart</p>
      ) : (
        <>
          <ListGroup>
            {cart.map(item => (
              <ListGroup.Item key={item.id}>
                <h5>{item.name}</h5>
                <p>₹{item.price}</p>

                <Button onClick={() => decreaseQty(item.id)}>-</Button>
                <span className="mx-2">{item.quantity}</span>
                <Button onClick={() => increaseQty(item.id)}>+</Button>

                <Button
                  variant="danger"
                  className="float-end"
                  onClick={() => removeFromCart(item.id)}
                >
                  Remove
                </Button>
              </ListGroup.Item>
            ))}
          </ListGroup>

          <h4 className="mt-3">Total: ₹{total}</h4>
        </>
      )}
    </Container>
  );
};

export default Cart;