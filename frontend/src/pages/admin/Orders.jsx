import { useEffect, useState } from "react";
import { Container, Table, Button, Form, Row, Col } from "react-bootstrap";
import API from "../../services/api";

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [filters, setFilters] = useState({
    status: "",
    paymentStatus: "",
    table: "",
    name: "",
  });

  const statusOptions = ["pending", "preparing", "delivered", "cancelled"];
  const paymentOptions = ["pending", "paid"];

  const fetchOrders = async (params = {}) => {
    const res = await API.get("/orders", { params });
    setOrders(res.data);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const applyFilters = () => {
    const params = {};
    if (filters.status) params.status = filters.status;
    if (filters.paymentStatus) params.paymentStatus = filters.paymentStatus;
    if (filters.table) params.table = filters.table;
    if (filters.name.trim()) params.name = filters.name.trim();
    fetchOrders(params);
  };

  const resetFilters = () => {
    setFilters({ status: "", paymentStatus: "", table: "", name: "" });
    fetchOrders();
  };

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

      <Form className="mt-3 mb-3">
        <Row className="g-2">
          <Col xs={12} md={3}>
            <Form.Select
              value={filters.status}
              onChange={(e) => setFilters((prev) => ({ ...prev, status: e.target.value }))}
            >
              <option value="">All Statuses</option>
              {statusOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </Form.Select>
          </Col>
          <Col xs={12} md={3}>
            <Form.Select
              value={filters.paymentStatus}
              onChange={(e) => setFilters((prev) => ({ ...prev, paymentStatus: e.target.value }))}
            >
              <option value="">All Payments</option>
              {paymentOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </Form.Select>
          </Col>
          <Col xs={12} md={3}>
            <Form.Control
              placeholder="Table number"
              value={filters.table}
              onChange={(e) => setFilters((prev) => ({ ...prev, table: e.target.value }))}
            />
          </Col>
          <Col xs={12} md={3}>
            <Form.Control
              placeholder="Customer name"
              value={filters.name}
              onChange={(e) => setFilters((prev) => ({ ...prev, name: e.target.value }))}
            />
          </Col>
        </Row>
        <div className="d-flex gap-2 mt-3 flex-wrap">
          <Button className="theme-btn-sm" onClick={applyFilters}>Apply Filters</Button>
          <Button variant="outline-secondary" size="sm" onClick={resetFilters}>Reset</Button>
        </div>
      </Form>

      <div className="table-responsive mt-3">
        <Table bordered hover className="admin-table align-middle mb-0">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Items Ordered</th>
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
                <td>
                  {(order.items || []).length > 0
                    ? order.items
                        .map((item) => item.foodName || item.name || "Unnamed item")
                        .join(", ")
                    : "-"}
                </td>
                <td>{order.tableNumber ?? "-"}</td>
                <td>₹{order.totalPrice}</td>
                <td className="text-capitalize">{order.status}</td>
                <td className="text-capitalize">{order.paymentStatus || "pending"}</td>
                <td>
                  <div className="d-flex flex-column gap-2 align-items-start">
                    {statusOptions.map((status) => (
                      <Button
                        key={status}
                        size="sm"
                        className="theme-btn-sm"
                        onClick={() => updateStatus(order._id, status)}
                        disabled={(order.status || "pending") === status}
                      >
                        {status}
                      </Button>
                    ))}

                    <Button
                      size="sm"
                      className="theme-btn-sm"
                      onClick={() => markAsPaid(order._id)}
                      disabled={(order.paymentStatus || "pending") === "paid"}
                    >
                      Mark as Paid
                    </Button>
                  </div>
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
