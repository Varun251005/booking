import { useEffect, useState } from "react";
import { Container, Button, Card, Row, Col, Table } from "react-bootstrap";
import { Link } from "react-router-dom";
import API from "../../services/api";

const Dashboard = () => {
  const [foods, setFoods] = useState([]);
  const [loadingFoods, setLoadingFoods] = useState(true);
  const [foodError, setFoodError] = useState("");

  useEffect(() => {
    const loadFoods = async () => {
      try {
        setFoodError("");
        const response = await API.get("/foods");
        setFoods(response.data ?? []);
      } catch {
        setFoodError("Could not load menu items right now.");
      } finally {
        setLoadingFoods(false);
      }
    };

    loadFoods();
    const intervalId = window.setInterval(loadFoods, 10000);

    return () => window.clearInterval(intervalId);
  }, []);

  return (
    <Container className="mt-4 page-shell admin-shell">
      <h2 className="page-title mb-4">Admin Dashboard</h2>

      <Row className="g-3">
        <Col md={4}>
          <Card className="food-card h-100">
            <Card.Body className="d-flex flex-column">
              <Card.Title className="food-title">Manage Orders</Card.Title>
              <Card.Text className="food-price flex-grow-1">
                Review and update incoming customer orders.
              </Card.Text>
              <Link to="/admin/orders" className="mt-2">
                <Button className="theme-btn w-100">Manage Orders</Button>
              </Link>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card className="food-card h-100">
            <Card.Body className="d-flex flex-column">
              <Card.Title className="food-title">Add Food</Card.Title>
              <Card.Text className="food-price flex-grow-1">
                Create and publish new food items to the menu.
              </Card.Text>
              <Link to="/admin/add-food" className="mt-2">
                <Button className="theme-btn w-100">Add Food</Button>
              </Link>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card className="food-card h-100">
            <Card.Body className="d-flex flex-column">
              <Card.Title className="food-title">Manage Foods</Card.Title>
              <Card.Text className="food-price flex-grow-1">
                View all foods and delete items from the menu.
              </Card.Text>
              <Link to="/admin/foods" className="mt-2">
                <Button className="theme-btn w-100">Manage Foods</Button>
              </Link>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <div className="mt-4">
        <h4 className="mb-3">Current Menu Items</h4>
        {loadingFoods ? (
          <p className="status-text">Loading items...</p>
        ) : foodError ? (
          <p className="status-text error-text">{foodError}</p>
        ) : (
          <Table bordered hover responsive className="admin-table align-middle mb-0">
            <thead>
              <tr>
                <th>Name</th>
                <th>Price</th>
                <th>Category</th>
              </tr>
            </thead>
            <tbody>
              {foods.map((food) => (
                <tr key={food._id ?? food.id}>
                  <td>{food.name}</td>
                  <td>₹{food.price}</td>
                  <td>{food.category || "-"}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </div>
    </Container>
  );
};

export default Dashboard;
