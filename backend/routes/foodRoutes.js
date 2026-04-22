import express from "express";
import Food from "../models/Food.js";

const router = express.Router();

// GET ALL FOOD
router.get("/", async (req, res) => {
  const foods = await Food.find();
  res.json(foods);
});

// ADD FOOD (ADMIN)
router.post("/", async (req, res) => {
  const food = await Food.create(req.body);
  res.json(food);
});

export default router;