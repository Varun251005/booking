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

  const markAsPaid = async (id) => {
    await API.put(`/orders/${id}`, { paymentStatus: "paid" });
    fetchOrders();
  };

  return (
    <Container className="mt-4 page-shell admin-shell">
      <h2 className="page-title">Admin Orders</h2>

      <div className="table-responsive mt-3">
        <Table bordered hover className="admin-table align-middle mb-0">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Table Number</th>
              <th>Total Price</th>
              <th>Status</th>
              <th>Payment Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {orders.map(order => (
              <tr key={order._id}>
                <td>{order._id}</td>
                <td>{order.tableNumber ?? "-"}</td>
                <td>₹{order.totalPrice}</td>
                <td className="text-capitalize">{order.status}</td>
                <td className="text-capitalize">{order.paymentStatus || "pending"}</td>
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

                  <Button
                    size="sm"
                    className="ms-2 theme-btn-sm"
                    onClick={() => markAsPaid(order._id)}
                    disabled={(order.paymentStatus || "pending") === "paid"}
                  >
                    Mark as Paid
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </Container>
  );
};

export default AdminOrders;
