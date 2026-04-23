import express from "express";
import Order from "../models/Order.js";

const router = express.Router();

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

  const order = await Order.create(payload);
  return res.json(order);
});

// GET ALL ORDERS
router.get("/", async (req, res) => {
  const orders = await Order.find();
  res.json(orders);
});

router.put("/:id", async (req, res) => {
  const order = await Order.findByIdAndUpdate(
    req.params.id,
    { status: req.body.status },
    { new: true }
  );

  res.json(order);
});

export default router;