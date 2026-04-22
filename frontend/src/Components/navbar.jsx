import { Navbar, Nav, Container } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

const AppNavbar = () => {
  const { cart } = useCart();

  return (
    <Navbar bg="dark" variant="dark" className="app-navbar">
      <Container>
        <Navbar.Brand as={Link} to="/" className="brand-glow">FoodApp</Navbar.Brand>
        <Nav className="ms-auto">
          <Nav.Link as={Link} to="/">Home</Nav.Link>
          <Nav.Link as={Link} to="/cart">
            Cart ({cart.length})
          </Nav.Link>
          <Nav.Link as={Link} to="/login">Login</Nav.Link>
        </Nav>
      </Container>
    </Navbar>
  );
};

export default AppNavbar;