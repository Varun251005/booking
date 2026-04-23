import express from "express";
import mongoose from "mongoose";
import Food from "../models/Food.js";
import defaultFoods from "../data/defaultFoods.js";

const router = express.Router();

const normalizeImageValue = (value = "") =>
  value
    .toString()
    .trim()
    .toLowerCase()
    .replace(/\.[a-z0-9]+$/i, "")
    .replace(/[^a-z]/g, "");

const isDatabaseConnected = () => mongoose.connection.readyState === 1;

const inMemoryFoods = defaultFoods.map((food, index) => ({
  _id: `local-food-${index + 1}`,
  ...food,
}));

// GET ALL FOOD
router.get("/", async (req, res) => {
  if (!isDatabaseConnected()) {
    return res.json(inMemoryFoods);
  }

  const foods = await Food.find();

  if (foods.length > 0) {
    return res.json(foods);
  }

  return res.json(inMemoryFoods);
});

// ADD FOOD (ADMIN)
router.post("/", async (req, res) => {
  const payload = {
    ...req.body,
    image: normalizeImageValue(req.body.image || req.body.name)
  };

  if (!isDatabaseConnected()) {
    const localFood = {
      _id: `local-food-${Date.now()}`,
      ...payload,
    };

    inMemoryFoods.push(localFood);
    return res.json(localFood);
  }

  const food = await Food.create(payload);
  res.json(food);
});

router.post("/seed-defaults", async (req, res) => {
  if (!isDatabaseConnected()) {
    return res.status(400).json({
      message: "MongoDB is not connected. Running with in-memory default foods.",
    });
  }

  const count = await Food.countDocuments();

  if (count > 0) {
    return res.status(400).json({ message: "Foods already exist in database" });
  }

  const seededFoods = await Food.insertMany(defaultFoods);
  return res.json(seededFoods);
});

export default router;