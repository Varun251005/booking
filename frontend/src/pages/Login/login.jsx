import { useState } from "react";
import { Form, Button, Container } from "react-bootstrap";
import API from "../../services/api";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await API.post("/auth/login", {
        email,
        password
      });

      localStorage.setItem("token", res.data.token);
      alert("Login successful");
    } catch (err) {
      alert("Login failed");
    }
  };

  return (
    <Container className="mt-5 page-shell login-shell">
      <h2 className="page-title">Login</h2>

      <Form onSubmit={handleLogin} className="themed-form">
        <Form.Group>
          <Form.Label>Email</Form.Label>
          <Form.Control
            onChange={(e) => setEmail(e.target.value)}
            type="email"
          />
        </Form.Group>

        <Form.Group className="mt-3">
          <Form.Label>Password</Form.Label>
          <Form.Control
            onChange={(e) => setPassword(e.target.value)}
            type="password"
          />
        </Form.Group>

        <Button className="mt-3 theme-btn" type="submit">
          Login
        </Button>
      </Form>
    </Container>
  );
};

export default Login;