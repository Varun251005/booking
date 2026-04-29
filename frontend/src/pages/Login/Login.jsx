import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Form, Button, Alert } from "react-bootstrap";
import "./login.css";

function Login() {
  const [name, setName] = useState("");
  const [table, setTable] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    
    if (!name.trim() || !table.trim()) {
      setError("Please enter all fields");
      return;
    }

    try {
      localStorage.setItem("user", JSON.stringify({ name: name.trim(), table: table.trim() }));
      setError("");
      navigate("/");
    } catch (err) {
      setError("Failed to save user data");
    }
  };

  return (
    <Container className="login-container">
      <div className="login-box">
        <h2 className="login-title">Welcome! 🍽️</h2>
        <p className="login-subtitle">Enter your details to continue</p>

        {error && <Alert variant="danger">{error}</Alert>}

        <Form onSubmit={handleLogin}>
          <Form.Group className="mb-3">
            <Form.Label>Your Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onFocus={() => setError("")}
            />
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label>Table Number</Form.Label>
            <Form.Control
              type="number"
              min="1"
              placeholder="Enter table number"
              value={table}
              onChange={(e) => setTable(e.target.value)}
              onFocus={() => setError("")}
            />
          </Form.Group>

          <Button variant="dark" type="submit" className="w-100">
            Enter
          </Button>
        </Form>
      </div>
    </Container>
  );
}

export default Login;
