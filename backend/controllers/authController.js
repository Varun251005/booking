import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import transporter, { getEmailFromAddress } from "../config/mailer.js";
import { saveOTP, verifyOTP } from "../utils/otpStore.js";

const otpSendTracker = new Map();
const OTP_COOLDOWN_MS = 60 * 1000;

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const existingUser = await User.findOne({ email: email.trim().toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email: email.trim().toLowerCase(),
      password: hashed,
      isVerified: true,
    });

    return res.json(user);
  } catch {
    return res.status(500).json({ message: "Registration failed" });
  }
};

export const sendOtp = async (req, res) => {
  try {
    const email = (req.body.email || "").trim().toLowerCase();

    const isPlaceholder = (value) =>
      !value || value.includes("yourgmail") || value.includes("your_gmail_app_password");

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    if (!email.endsWith("@gmail.com")) {
      return res.status(400).json({ message: "Please use a Gmail address" });
    }

    const lastSentAt = otpSendTracker.get(email) || 0;
    const now = Date.now();
    if (now - lastSentAt < OTP_COOLDOWN_MS) {
      const secondsLeft = Math.ceil((OTP_COOLDOWN_MS - (now - lastSentAt)) / 1000);
      return res.status(429).json({ message: `Please wait ${secondsLeft}s before requesting another OTP` });
    }

    if (
      !process.env.EMAIL_USER ||
      !process.env.EMAIL_PASS ||
      isPlaceholder(process.env.EMAIL_USER) ||
      isPlaceholder(process.env.EMAIL_PASS)
    ) {
      return res.status(500).json({
        message:
          "Email service is not configured. Set EMAIL_USER and EMAIL_PASS to a Gmail account + app password.",
      });
    }

    await transporter.verify();

    const otp = String(Math.floor(100000 + Math.random() * 900000));
    saveOTP(email, otp);

    const fromAddress = getEmailFromAddress();
    if (!fromAddress) {
      return res.status(500).json({
        message: "Email service is not configured. Set EMAIL_USER to a valid Gmail account.",
      });
    }

    const subject = "Your OTP Code";
    const text = `Your OTP is ${otp}. It will expire in 5 minutes.`;
    const html = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h2 style="margin: 0 0 12px;">Your OTP Code</h2>
        <p>Use the code below to continue logging in:</p>
        <div style="font-size: 24px; font-weight: bold; letter-spacing: 3px;">${otp}</div>
        <p style="margin-top: 12px;">This code expires in 5 minutes.</p>
      </div>
    `;

    await transporter.sendMail({
      from: fromAddress,
      to: email,
      subject,
      text,
      html,
    });

    otpSendTracker.set(email, now);

    return res.json({ message: "OTP sent successfully" });
  } catch (error) {
    const message = error?.response?.data || error?.message || "Failed to send OTP";
    console.error("sendOtp failed:", message);
    return res.status(500).json({ message });
  }
};

export const verifyOtpAndLogin = async (req, res) => {
  try {
    const email = (req.body.email || "").trim().toLowerCase();
    const otp = String(req.body.otp || "").trim();
    const password = String(req.body.password || "");
    const name = req.body.name ? String(req.body.name).trim() : "";
    const mode = String(req.body.mode || "signin").toLowerCase();

    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP are required" });
    }

    if (!password.trim()) {
      return res.status(400).json({ message: "Password is required" });
    }

    if (!['signin', 'signup'].includes(mode)) {
      return res.status(400).json({ message: "mode must be 'signin' or 'signup'" });
    }

    if (mode === "signup" && !name) {
      return res.status(400).json({ message: "Name is required for signup" });
    }

    const isValid = verifyOTP(email, otp);
    if (!isValid) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    let user = await User.findOne({ email });

    if (mode === "signup") {
      if (user) {
        return res.status(400).json({ message: "User already exists. Please sign in." });
      }

      const hashed = await bcrypt.hash(password, 10);
      user = await User.create({
        name,
        email,
        password: hashed,
        isVerified: true,
        role: "user",
      });
    } else {
      if (!user) {
        return res.status(400).json({ message: "User not found. Please sign up." });
      }

      if (!user.password) {
        return res.status(400).json({ message: "Password not set. Please sign up." });
      }

      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        return res.status(400).json({ message: "Invalid credentials" });
      }

      if (!user.isVerified) {
        user.isVerified = true;
        await user.save();
      }
    }

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role || "user" },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role || "user",
        isVerified: user.isVerified,
      },
    });
  } catch (error) {
    console.error("verifyOtpAndLogin failed:", error?.message || error);
    return res.status(500).json({ message: "OTP verification failed" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json("Email and password are required");
    }

    const user = await User.findOne({ email: email.trim().toLowerCase() });

    if (!user) return res.status(400).json("User not found");

    const match = await bcrypt.compare(password, user.password);

    if (!match) return res.status(400).json("Invalid credentials");

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.json({
      token,
      user: {
        id: user._id,
        email: user.email,
        role: user.role
      }
    });
  } catch {
    return res.status(500).json({ message: "Login failed" });
  }
};