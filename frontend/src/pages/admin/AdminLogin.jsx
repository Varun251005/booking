import { useState } from "react";
import { Alert, Button, Container, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import API from "../../services/api";

const AdminLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (event) => {
    event.preventDefault();

    if (!email.trim() || !password.trim()) {
      setError("Email and password are required");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await API.post("/auth/login", {
        email: email.trim(),
        password,
      });

      if (response.data.user?.role !== "admin") {
        alert("Access denied");
        return;
      }

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("role", response.data.user?.role || "");
      localStorage.setItem("userRole", response.data.user?.role || "");

      navigate("/admin/dashboard");
    } catch {
      alert("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container fluid className="min-vh-100 d-flex align-items-center justify-content-center px-3">
      <div className="page-shell login-shell w-100" style={{ maxWidth: "460px" }}>
        <h2 className="page-title mb-3">Admin Login</h2>

        {error && <Alert variant="danger" className="mb-3">{error}</Alert>}

        <Form onSubmit={handleLogin} className="themed-form">
          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="Enter admin email"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Enter password"
            />
          </Form.Group>

          <Button type="submit" className="theme-btn w-100" disabled={loading}>
            {loading ? "Signing in..." : "Admin Login"}
          </Button>
        </Form>
      </div>
    </Container>
  );
};

export default AdminLogin;
