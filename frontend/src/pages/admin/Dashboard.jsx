import { Container, Button, Card, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";

const Dashboard = () => {
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
              <Card.Title className="food-title">View Menu</Card.Title>
              <Card.Text className="food-price flex-grow-1">
                Open the live menu page as customers see it.
              </Card.Text>
              <Link to="/" className="mt-2">
                <Button className="theme-btn w-100">View Menu</Button>
              </Link>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard;
