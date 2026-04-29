import express from "express";
import mongoose from "mongoose";
import Order from "../models/Order.js";

const router = express.Router();

const isDatabaseConnected = () => mongoose.connection.readyState === 1;
const inMemoryOrders = [];
const validPaymentStatuses = ["pending", "paid"];

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
  const tableNumber = Number(req.body.tableNumber);
  const name = req.body.name && String(req.body.name).trim();
  const deviceId = req.body.deviceId && String(req.body.deviceId);
  const paymentStatus = req.body.paymentStatus || "pending";

  if (!normalizedItems.length) {
    return res.status(400).json({ message: "Order must include valid food items" });
  }

  if (!tableNumber) {
    return res.status(400).json({ message: "Table number is required" });
  }

  if (!name) {
    return res.status(400).json({ message: "Name is required" });
  }

  if (!deviceId) {
    return res.status(400).json({ message: "deviceId is required" });
  }

  if (!validPaymentStatuses.includes(paymentStatus)) {
    return res.status(400).json({ message: "Invalid payment status" });
  }

  const totalPriceFromItems = normalizedItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const payload = {
    ...req.body,
    items: normalizedItems,
    totalPrice: Number(req.body.totalPrice) || totalPriceFromItems,
    tableNumber,
    name,
    paymentStatus,
    deviceId,
  };

  if (!isDatabaseConnected()) {
    const localOrder = {
      _id: `local-order-${Date.now()}`,
      ...payload,
      status: payload.status || "pending",
      paymentStatus: payload.paymentStatus || "pending",
    };

    inMemoryOrders.unshift(localOrder);
    return res.json(localOrder);
  }

  const order = await Order.create(payload);
  return res.json(order);
});

// GET ALL ORDERS (or filter by name and table if provided)
router.get("/", async (req, res) => {
  const { name, table } = req.query;

  if (!isDatabaseConnected()) {
    // If name and table are provided, filter in-memory orders
    if (name && table) {
      const filtered = inMemoryOrders.filter(
        (o) => o.name === name && o.tableNumber === Number(table)
      );
      return res.json(filtered);
    }
    return res.json(inMemoryOrders);
  }

  // If name and table are provided, filter database orders
  if (name && table) {
    const orders = await Order.find({
      name,
      tableNumber: Number(table),
    });
    return res.json(orders);
  }

  // Return all orders if no filters provided
  const orders = await Order.find();
  res.json(orders);
});

// GET ORDERS FOR DEVICE
router.get("/:deviceId", async (req, res) => {
  const deviceIdParam = req.params.deviceId;

  if (!isDatabaseConnected()) {
    const filtered = inMemoryOrders.filter((o) => o.deviceId === deviceIdParam);
    return res.json(filtered);
  }

  const orders = await Order.find({ deviceId: deviceIdParam });
  res.json(orders);
});

router.put("/:id", async (req, res) => {
  const updates = {};

  if (req.body.status) {
    updates.status = req.body.status;
  }

  if (req.body.paymentStatus) {
    if (!validPaymentStatuses.includes(req.body.paymentStatus)) {
      return res.status(400).json({ message: "Invalid payment status" });
    }

    updates.paymentStatus = req.body.paymentStatus;
  }

  if (Object.keys(updates).length === 0) {
    return res.status(400).json({ message: "No valid fields provided for update" });
  }

  if (!isDatabaseConnected()) {
    const orderIndex = inMemoryOrders.findIndex(
      (order) => order._id === req.params.id
    );

    if (orderIndex === -1) {
      return res.status(404).json({ message: "Order not found" });
    }

    inMemoryOrders[orderIndex] = {
      ...inMemoryOrders[orderIndex],
      ...updates,
    };

    return res.json(inMemoryOrders[orderIndex]);
  }

  const order = await Order.findByIdAndUpdate(
    req.params.id,
    updates,
    { new: true }
  );

  res.json(order);
});

export default router;