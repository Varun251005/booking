import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    isVerified: { type: Boolean, default: true },
    name: String,
    password: String,
    role: { type: String, default: "user" },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);