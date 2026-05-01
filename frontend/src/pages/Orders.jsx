import { useEffect, useState } from "react";
import { Container, ListGroup, Alert, Badge, Spinner } from "react-bootstrap";
import API from "../services/api";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUserOrders = async () => {
      try {
        const res = await API.get("/orders/my");
        setOrders(res.data);
        setError("");
      } catch (err) {
        console.error("Error fetching orders:", err);
        setError(err.response?.data?.message || "Error fetching orders");
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchUserOrders();
  }, []);

  const getStatusColor = (status) => {
    const colors = {
      pending: "warning",
      preparing: "info",
      ready: "success",
      completed: "success",
      cancelled: "danger",
    };
    return colors[status] || "secondary";
  };

  return (
    <Container className="mt-4 page-shell">
      <h2 className="page-title">My Orders</h2>

      {error && <Alert variant="danger">{error}</Alert>}

      {loading ? (
        <div style={{ textAlign: "center", padding: "40px" }}>
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      ) : orders.length === 0 ? (
        <Alert variant="info">No orders found for your account</Alert>
      ) : (
        <ListGroup>
          {orders.map((order) => (
            <ListGroup.Item key={order._id} className="cart-item">
              <div style={{ marginBottom: "10px" }}>
                <h5>Order #{order._id.slice(-6).toUpperCase()}</h5>
                <Badge bg={getStatusColor(order.status)}>{order.status}</Badge>
                <Badge bg={getStatusColor(order.paymentStatus)} style={{ marginLeft: "8px" }}>
                  {order.paymentStatus}
                </Badge>
              </div>

              <div style={{ marginBottom: "10px" }}>
                {order.items?.map((item, idx) => (
                  <p key={idx} style={{ margin: "5px 0", fontSize: "14px" }}>
                    {item.foodName} (x{item.quantity}) - ₹{item.price * item.quantity}
                  </p>
                ))}
              </div>

              <h5>Total: ₹{order.totalPrice}</h5>
              <small style={{ color: "#666" }}>
                {new Date(order.createdAt).toLocaleString()}
              </small>
            </ListGroup.Item>
          ))}
        </ListGroup>
      )}
    </Container>
  );
};

export default Orders;
