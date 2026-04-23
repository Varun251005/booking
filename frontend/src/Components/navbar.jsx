import { Navbar, Nav, Container } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

const AppNavbar = () => {
  const { cart } = useCart();

  return (
    <Navbar className="app-navbar">
      <Container fluid className="app-nav-shell">
        <Navbar.Brand as={Link} to="/" className="brand-glow">OrderEase</Navbar.Brand>

        <Nav className="nav-pill-group">
          <Nav.Link as={Link} to="/">Home</Nav.Link>
          <Nav.Link as={Link} to="/orders">My Orders</Nav.Link>
          <Nav.Link as={Link} to="/admin">Admin</Nav.Link>
        </Nav>

        <div className="nav-actions">
          <Nav.Link as={Link} to="/login" className="nav-action-link">Login</Nav.Link>
          <Nav.Link as={Link} to="/cart" className="demo-btn">
            Cart ({cart.length})
          </Nav.Link>
        </div>
      </Container>
    </Navbar>
  );
};

export default AppNavbar;