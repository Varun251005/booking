import { useEffect, useState } from "react";
import { Container, ListGroup } from "react-bootstrap";
import API from "../services/api";

const Orders = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetch = async () => {
      const res = await API.get("/orders");
      setOrders(res.data);
    };
    fetch();
  }, []);

  return (
    <Container className="mt-4 page-shell">
      <h2 className="page-title">Your Orders</h2>

      <ListGroup>
        {orders.map(order => (
          <ListGroup.Item key={order._id} className="cart-item">
            ₹{order.totalPrice} - {order.status}
          </ListGroup.Item>
        ))}
      </ListGroup>
    </Container>
  );
};

export default Orders;
