import { Navbar, Nav, Container, Button, NavDropdown } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { FaHome, FaShoppingCart, FaListAlt, FaSignOutAlt } from "react-icons/fa";
import useCart from "../context/useCart";

const AppNavbar = () => {
  const { cart } = useCart();
  const navigate = useNavigate();
  const role = localStorage.getItem("role");
  const userName = (() => {
    const userData = localStorage.getItem("user");

    if (!userData) {
      return "";
    }

    try {
      const user = JSON.parse(userData);
      return user.name || user.email || "";
    } catch (err) {
      console.error("Error parsing user data:", err);
      return "";
    }
  })();

  const handleLogout = () => {
    // Clear user data
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("userRole");
    localStorage.removeItem("deviceId");
    localStorage.removeItem("sessionId");
    navigate("/login");
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
                <Nav.Link as={Link} to="/" aria-label="Home" title="Home">
                  <span className="me-2">Home</span>
                  <FaHome size={20} />
                </Nav.Link>
                <Nav.Link as={Link} to="/orders" aria-label="Orders" title="Orders">
                  <span className="me-2">My Orders</span>
                  <FaListAlt size={20} />
                </Nav.Link>
                <Nav.Link as={Link} to="/cart">
                  <span className="me-2">Cart ({cart.length})</span>
                  <span aria-label={`Cart (${cart.length})`} title={`Cart (${cart.length})`}>
                    <FaShoppingCart size={20} />
                  </span>
                </Nav.Link>
                <NavDropdown
                  title={userName || "Account"}
                  id="user-dropdown"
                  className="ms-lg-3"
                  align="end"
                >
                  <NavDropdown.Item as={Link} to="/orders">
                    My Orders
                  </NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/profile">
                    Profile
                  </NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item onClick={handleLogout}>
                    <FaSignOutAlt size={14} className="me-2" />
                    Logout
                  </NavDropdown.Item>
                </NavDropdown>
              </>
            )}

            {role === "admin" && (
              <div className="admin-nav-actions d-flex gap-2 align-items-center">
                <Link to="/" className="btn btn-dark">
                  Home
                </Link>
                <Link to="/admin/dashboard" className="btn btn-dark">
                  Dashboard
                </Link>
                <Link to="/admin/orders" className="btn btn-dark">
                  Orders
                </Link>
                <Link to="/admin/add-food" className="btn btn-dark">
                  Add Food
                </Link>
                <Link to="/admin/foods" className="btn btn-dark">
                  Foods
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