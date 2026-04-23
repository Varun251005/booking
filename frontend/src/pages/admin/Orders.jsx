import { useEffect, useState } from "react";
import { Container, Table, Button } from "react-bootstrap";
import API from "../../services/api";

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
    const res = await API.get("/orders");
    setOrders(res.data);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateStatus = async (id, status) => {
    await API.put(`/orders/${id}`, { status });
    fetchOrders();
  };

  return (
    <Container className="mt-4 page-shell admin-shell">
      <h2 className="page-title">Orders</h2>

      <Table bordered className="admin-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Total</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {orders.map(order => (
            <tr key={order._id}>
              <td>{order._id}</td>
              <td>₹{order.totalPrice}</td>
              <td>{order.status}</td>
              <td>
                <Button
                  size="sm"
                  className="theme-btn-sm"
                  onClick={() => updateStatus(order._id, "preparing")}
                >
                  Preparing
                </Button>

                <Button
                  size="sm"
                  className="ms-2 theme-btn-sm"
                  onClick={() => updateStatus(order._id, "delivered")}
                >
                  Delivered
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default AdminOrders;
