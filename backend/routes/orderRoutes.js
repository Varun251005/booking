import express from "express";
import mongoose from "mongoose";
import Order from "../models/Order.js";

const router = express.Router();

const isDatabaseConnected = () => mongoose.connection.readyState === 1;
const inMemoryOrders = [];

const normalizeOrderItems = (items = []) =>
  items
    .map((item) => {
      const rawFoodId = item.foodId ?? item.id;

      if (!rawFoodId) {
        return null;
      }

      return {
        foodId: rawFoodId.toString(),
        foodName: item.foodName ?? item.name,
        price: Number(item.price) || 0,
        quantity: Number(item.quantity) > 0 ? Number(item.quantity) : 1,
      };
    })
    .filter(Boolean);

// CREATE ORDER
router.post("/", async (req, res) => {
  const normalizedItems = normalizeOrderItems(req.body.items);

  if (!normalizedItems.length) {
    return res.status(400).json({ message: "Order must include valid food items" });
  }

  const totalPriceFromItems = normalizedItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const payload = {
    ...req.body,
    items: normalizedItems,
    totalPrice: Number(req.body.totalPrice) || totalPriceFromItems,
  };

  if (!isDatabaseConnected()) {
    const localOrder = {
      _id: `local-order-${Date.now()}`,
      ...payload,
      status: payload.status || "pending",
    };

    inMemoryOrders.unshift(localOrder);
    return res.json(localOrder);
  }

  const order = await Order.create(payload);
  return res.json(order);
});

// GET ALL ORDERS
router.get("/", async (req, res) => {
  if (!isDatabaseConnected()) {
    return res.json(inMemoryOrders);
  }

  const orders = await Order.find();
  res.json(orders);
});

router.put("/:id", async (req, res) => {
  if (!isDatabaseConnected()) {
    const orderIndex = inMemoryOrders.findIndex(
      (order) => order._id === req.params.id
    );

    if (orderIndex === -1) {
      return res.status(404).json({ message: "Order not found" });
    }

    inMemoryOrders[orderIndex] = {
      ...inMemoryOrders[orderIndex],
      status: req.body.status,
    };

    return res.json(inMemoryOrders[orderIndex]);
  }

  const order = await Order.findByIdAndUpdate(
    req.params.id,
    { status: req.body.status },
    { new: true }
  );

  res.json(order);
});

export default router;