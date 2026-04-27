import express from "express";
import mongoose from "mongoose";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import Food from "../models/Food.js";
import defaultFoods from "../data/defaultFoods.js";

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadsFoodsDir = path.join(__dirname, "..", "uploads", "foods");

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

router.get("/saved-images", async (req, res) => {
  try {
    const files = await fs.readdir(uploadsFoodsDir, { withFileTypes: true });
    const imageFiles = files
      .filter(
        (file) =>
          file.isFile() &&
          /\.(png|jpe?g|webp|gif|svg)$/i.test(file.name)
      )
      .map((file) => ({
        name: file.name,
        value: `/uploads/foods/${file.name}`,
      }))
      .sort((a, b) => a.name.localeCompare(b.name));

    return res.json(imageFiles);
  } catch {
    return res.json([]);
  }
});

// GET ALL FOOD
router.get("/", async (req, res) => {
  if (!isDatabaseConnected()) {
    return res.json(inMemoryFoods);
  }

  const foods = await Food.find();

  if (foods.length > 0) {
    return res.json(foods);
  }

  const seededFoods = await Food.insertMany(defaultFoods);
  return res.json(seededFoods);
});

// ADD FOOD (ADMIN)
router.post("/", async (req, res) => {
  const payload = {
    ...req.body,
    price: Number(req.body.price),
    image: req.body.image?.trim() || normalizeImageValue(req.body.name)
  };

  if (!payload.name || !Number.isFinite(payload.price) || payload.price <= 0) {
    return res.status(400).json({ message: "Name and valid price are required" });
  }

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

// DELETE FOOD (ADMIN)
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  if (!isDatabaseConnected()) {
    const index = inMemoryFoods.findIndex((food) => food._id === id);

    if (index === -1) {
      return res.status(404).json({ message: "Food not found" });
    }

    inMemoryFoods.splice(index, 1);
    return res.json({ message: "Food deleted" });
  }

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ message: "Food not found" });
  }

  const deletedFood = await Food.findByIdAndDelete(id);

  if (!deletedFood) {
    return res.status(404).json({ message: "Food not found" });
  }

  return res.json({ message: "Food deleted" });
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