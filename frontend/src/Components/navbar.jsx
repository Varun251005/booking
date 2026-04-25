import { Navbar, Nav, Container } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

const AppNavbar = () => {
  const { cart } = useCart();
  const role = localStorage.getItem("role");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("userRole");
    window.location.href = "/";
  };

  return (
    <Navbar bg="light" expand="lg" className="app-navbar">
      <Container>
        <Navbar.Brand as={Link} to="/" className="brand-glow">OrderEase</Navbar.Brand>
        <Navbar.Toggle aria-controls="main-navbar" />
        <Navbar.Collapse id="main-navbar">
          <Nav className="ms-auto nav-links">
            {role !== "admin" && (
              <>
                <Nav.Link as={Link} to="/">Home</Nav.Link>
                <Nav.Link as={Link} to="/orders">My Orders</Nav.Link>
                <Nav.Link as={Link} to="/cart">
                  Cart ({cart.length})
                </Nav.Link>
              </>
            )}

            {role === "admin" && (
              <div className="admin-nav-actions d-flex gap-2 align-items-center">
                <Link to="/admin/dashboard" className="btn btn-dark">
                  Dashboard
                </Link>
                <Link to="/admin/orders" className="btn btn-dark">
                  Orders
                </Link>
                <Link to="/admin/add-food" className="btn btn-dark">
                  Add Food
                </Link>
                <button className="btn btn-danger" onClick={handleLogout}>
                  Logout
                </button>
              </div>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default AppNavbar;