import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
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
  totalPrice: Number,
  tableNumber: {
    type: Number,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  deviceId: {
    type: String,
    required: true,
  },
  sessionId: {
    type: String,
    required: true,
  },
  paymentStatus: {
    type: String,
    enum: ["pending", "paid"],
    default: "pending"
  },
  status: {
    type: String,
    default: "pending"
  }
});

export default mongoose.model("Order", orderSchema);