import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Form, Button, Alert } from "react-bootstrap";
import API from "../../services/api";
import "./login.css";

function Login() {
  const [mode, setMode] = useState("signin");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const resetFlow = () => {
    setStep(1);
    setOtp("");
    setMessage("");
    setError("");
  };

  const handleSendOtp = async (e) => {
    e?.preventDefault?.();

    const normalizedEmail = email.trim().toLowerCase();

    if (mode === "signup" && !name.trim()) {
      setError("Please enter your name");
      return;
    }

    if (!normalizedEmail) {
      setError("Please enter your email");
      return;
    }

    if (!normalizedEmail.endsWith("@gmail.com")) {
      setError("Please use a Gmail address (example@gmail.com)");
      return;
    }

    if (!password.trim()) {
      setError("Please enter your password");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setMessage("");

      await API.post("/auth/send-otp", { email: normalizedEmail });

      setStep(2);
      setMessage("OTP sent to your email");
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

    if (!password.trim()) {
      setError("Please enter your password");
      return;
    }

    if (mode === "signup" && !name.trim()) {
      setError("Please enter your name");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const res = await API.post("/auth/verify-otp", {
        mode,
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password,
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
        <h2 className="login-title">Authentication</h2>
        <p className="login-subtitle">
          {mode === "signup" ? "Create account with OTP" : "Sign in with OTP"}
        </p>

        {error && <Alert variant="danger">{error}</Alert>}
        {message && <Alert variant="success">{message}</Alert>}

        <div className="d-flex gap-2 mb-3">
          <Button
            type="button"
            variant={mode === "signin" ? "dark" : "outline-dark"}
            className="w-100"
            onClick={() => {
              setMode("signin");
              resetFlow();
            }}
            disabled={loading}
          >
            Sign In
          </Button>
          <Button
            type="button"
            variant={mode === "signup" ? "dark" : "outline-dark"}
            className="w-100"
            onClick={() => {
              setMode("signup");
              resetFlow();
            }}
            disabled={loading}
          >
            Sign Up
          </Button>
        </div>

        <Form onSubmit={step === 1 ? handleSendOtp : handleVerifyOtp}>
          <Form.Group className="mb-3">
            <Form.Label>User Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onFocus={() => setError("")}
              disabled={loading}
            />
          </Form.Group>

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

          <Form.Group className={step === 2 ? "mb-3" : "mb-4"}>
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onFocus={() => setError("")}
              disabled={loading}
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
                : mode === "signup"
                  ? "Verify & Sign Up"
                  : "Verify & Sign In"}
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
