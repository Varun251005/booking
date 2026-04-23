import { Container, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

const Dashboard = () => {
  return (
    <Container className="mt-4 page-shell admin-shell">
      <h2 className="page-title">Admin Dashboard</h2>

      <Link to="/admin/add-food">
        <Button className="m-2 theme-btn">Add Food</Button>
      </Link>

      <Link to="/admin/orders">
        <Button className="m-2 theme-btn">Manage Orders</Button>
      </Link>
    </Container>
  );
};

export default Dashboard;
