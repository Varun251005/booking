import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Form, Button, Alert } from "react-bootstrap";
import API from "../../services/api";
import "./login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSendOtp = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      setError("Please enter your email");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setMessage("");

      await API.post("/auth/send-otp", { email: email.trim() });

      setStep(2);
      setMessage("OTP sent to your email");
    } catch {
      setError("Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();

    if (!otp.trim()) {
      setError("Please enter OTP");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const res = await API.post("/auth/verify-otp", {
        email: email.trim(),
        otp: otp.trim(),
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      localStorage.setItem("role", res.data.user?.role || "user");
      localStorage.setItem("userRole", res.data.user?.role || "user");

      navigate("/");
    } catch {
      setError("Invalid or expired OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="login-container">
      <div className="login-box">
        <h2 className="login-title">Welcome Back</h2>
        <p className="login-subtitle">Login with email OTP</p>

        {error && <Alert variant="danger">{error}</Alert>}
        {message && <Alert variant="success">{message}</Alert>}

        <Form onSubmit={step === 1 ? handleSendOtp : handleVerifyOtp}>
          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onFocus={() => setError("")}
              disabled={step === 2}
            />
          </Form.Group>

          {step === 2 && (
            <Form.Group className="mb-4">
              <Form.Label>OTP</Form.Label>
              <Form.Control
                type="text"
                inputMode="numeric"
                maxLength={6}
                placeholder="Enter 6-digit OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                onFocus={() => setError("")}
              />
            </Form.Group>
          )}

          <Button variant="dark" type="submit" className="w-100" disabled={loading}>
            {loading
              ? "Please wait..."
              : step === 1
                ? "Send OTP"
                : "Verify OTP"}
          </Button>

          {step === 2 && (
            <Button
              variant="outline-secondary"
              type="button"
              className="w-100 mt-2"
              disabled={loading}
              onClick={handleSendOtp}
            >
              Resend OTP
            </Button>
          )}
        </Form>
      </div>
    </Container>
  );
}

export default Login;
