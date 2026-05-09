import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Form, Button, Alert } from "react-bootstrap";
import API from "../../services/api";
import "./login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const resetFlow = () => {
    setStep(1);
    setOtp("");
    setMessage("");
    setError("");
    setResendCooldown(0);
  };

  useEffect(() => {
    if (resendCooldown <= 0) return;

    const timer = setInterval(() => {
      setResendCooldown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [resendCooldown]);

  const handleSendOtp = async (e) => {
    e?.preventDefault?.();

    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail) {
      setError("Please enter your email");
      return;
    }

    if (!normalizedEmail.endsWith("@gmail.com")) {
      setError("Please use a Gmail address (example@gmail.com)");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setMessage("");

      await API.post("/auth/send-otp", { email: normalizedEmail });

      setStep(2);
      setMessage("OTP sent to your email");
      setResendCooldown(30);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send OTP");
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
        email: email.trim().toLowerCase(),
        otp: otp.trim(),
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      localStorage.setItem("role", res.data.user?.role || "user");
      localStorage.setItem("userRole", res.data.user?.role || "user");

      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid or expired OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="login-container">
      <div className="login-box">
        <h2 className="login-title">Email OTP Login</h2>
        <p className="login-subtitle">Sign in with a one-time password</p>

        {error && <Alert variant="danger">{error}</Alert>}
        {message && <Alert variant="success">{message}</Alert>}

        <Form onSubmit={step === 1 ? handleSendOtp : handleVerifyOtp}>
          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              placeholder="example@gmail.com"
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
              disabled={loading || resendCooldown > 0}
              onClick={handleSendOtp}
            >
              {resendCooldown > 0
                ? `Resend OTP in ${resendCooldown}s`
                : "Resend OTP"}
            </Button>
          )}

          {step === 2 && (
            <Button
              variant="link"
              type="button"
              className="w-100 mt-2"
              disabled={loading}
              onClick={resetFlow}
            >
              Change email
            </Button>
          )}
        </Form>
      </div>
    </Container>
  );
}

export default Login;
