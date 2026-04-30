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
  const sessionId = req.body.sessionId && String(req.body.sessionId);
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

  if (!sessionId) {
    return res.status(400).json({ message: "sessionId is required" });
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
    sessionId,
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
  const { name, table, deviceId, sessionId } = req.query;
  const tableNumber = table !== undefined ? Number(table) : undefined;
  const deviceIdValue = deviceId ? String(deviceId) : undefined;
  const sessionIdValue = sessionId ? String(sessionId) : undefined;

  if (table !== undefined && Number.isNaN(tableNumber)) {
    return res.status(400).json({ message: "Table must be a valid number" });
  }

  if (!isDatabaseConnected()) {
    if (name || table !== undefined || deviceIdValue || sessionIdValue) {
      const filtered = inMemoryOrders.filter((order) => {
        if (name && order.name !== name) return false;
        if (table !== undefined && order.tableNumber !== tableNumber) return false;
        if (deviceIdValue && order.deviceId !== deviceIdValue) return false;
        if (sessionIdValue && order.sessionId !== sessionIdValue) return false;
        return true;
      });
      return res.json(filtered);
    }
    return res.json(inMemoryOrders);
  }

  const query = {};
  if (name) {
    query.name = name;
  }
  if (table !== undefined) {
    query.tableNumber = tableNumber;
  }
  if (deviceIdValue) {
    query.deviceId = deviceIdValue;
  }
  if (sessionIdValue) {
    query.sessionId = sessionIdValue;
  }

  const orders = Object.keys(query).length ? await Order.find(query) : await Order.find();
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