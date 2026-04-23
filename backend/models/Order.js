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
  status: {
    type: String,
    default: "pending"
  }
});

export default mongoose.model("Order", orderSchema);