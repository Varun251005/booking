import express from "express";
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

// GET ALL FOOD
router.get("/", async (req, res) => {
  const foods = await Food.find();

  if (foods.length > 0) {
    return res.json(foods);
  }

  return res.json(defaultFoods);
});

// ADD FOOD (ADMIN)
router.post("/", async (req, res) => {
  const payload = {
    ...req.body,
    image: normalizeImageValue(req.body.image || req.body.name)
  };

  const food = await Food.create(payload);
  res.json(food);
});

router.post("/seed-defaults", async (req, res) => {
  const count = await Food.countDocuments();

  if (count > 0) {
    return res.status(400).json({ message: "Foods already exist in database" });
  }

  const seededFoods = await Food.insertMany(defaultFoods);
  return res.json(seededFoods);
});

export default router;