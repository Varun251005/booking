import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  items: [
    {
      foodId: {
        type: String,
        required: true
      },
      foodName: String,
      price: Number,
      quantity: {
        type: Number,
        default: 1
      }
    }
  ],
  totalPrice: {
    type: Number,
    required: true,
  },
  tableNumber: Number,
  name: String,
  deviceId: String,
  sessionId: String,
  paymentStatus: {
    type: String,
    enum: ["pending", "paid"],
    default: "pending"
  },
  status: {
    type: String,
    default: "pending"
  }
}, { timestamps: true });

export default mongoose.model("Order", orderSchema);