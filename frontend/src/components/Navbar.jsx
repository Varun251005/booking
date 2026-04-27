import { Navbar, Nav, Container } from "react-bootstrap";
import { Link } from "react-router-dom";
import { FaHome, FaShoppingCart, FaListAlt } from "react-icons/fa";
import { useCart } from "../context/CartContext";

const AppNavbar = () => {
  const { cart } = useCart();
  const role = localStorage.getItem("role");
  const storedName =
    localStorage.getItem("userName") ||
    localStorage.getItem("name") ||
    localStorage.getItem("email") ||
    localStorage.getItem("userEmail") ||
    "";
  const displayName = storedName ? storedName.split("@")[0] : "Guest";

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
                <span className="navbar-user-name" title={storedName || "Guest"}>
                  Hi, {displayName}
                </span>
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