import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import transporter from "../config/mailer.js";
import { saveOTP, verifyOTP } from "../utils/otpStore.js";

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

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const otp = String(Math.floor(100000 + Math.random() * 900000));
    saveOTP(email, otp);

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Your OTP Code",
      text: `Your OTP is ${otp}. It will expire in 5 minutes.`,
    });

    return res.json({ message: "OTP sent successfully" });
  } catch {
    return res.status(500).json({ message: "Failed to send OTP" });
  }
};

export const verifyOtpAndLogin = async (req, res) => {
  try {
    const email = (req.body.email || "").trim().toLowerCase();
    const otp = String(req.body.otp || "").trim();

    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP are required" });
    }

    const isValid = verifyOTP(email, otp);
    if (!isValid) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({ email, isVerified: true, role: "user" });
    } else if (!user.isVerified) {
      user.isVerified = true;
      await user.save();
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
        email: user.email,
        role: user.role || "user",
        isVerified: user.isVerified,
      },
    });
  } catch {
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