import biryaniImage from "../assets/Biryani.jpg";
import dosaImage from "../assets/Dosa.jpg";
import idliImage from "../assets/idli.jpg";
import burgerImage from "../assets/burger.jpg";
import pizzaImage from "../assets/pizza.jpg";
import cakeImage from "../assets/cake.jpg";
import coffeeImage from "../assets/coffee.jpg";
import teaImage from "../assets/tea.jpg";
import cupcakeImage from "../assets/cupcake.jpg";
import cupiceImage from "../assets/cupice.jpg";
import chickenImage from "../assets/chicken.jpg";
import strawberryCakeImage from "../assets/straberry cake.jpg";
import iceCreamImage from "../assets/ice cream.jpg";
import iceCreamAltImage from "../assets/icecreame.jpg";

const DEFAULT_BACKEND_ORIGIN = "http://localhost:5000";
const API_BASE_URL = import.meta.env.VITE_API_URL || `${DEFAULT_BACKEND_ORIGIN}/api`;
const BACKEND_ORIGIN = (() => {
  try {
    return new URL(API_BASE_URL).origin;
  } catch {
    return DEFAULT_BACKEND_ORIGIN;
  }
})();

export const FALLBACK_FOOD_IMAGE = `data:image/svg+xml;utf8,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" width="640" height="420" viewBox="0 0 640 420"><rect width="640" height="420" fill="#ece8e4"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="Arial,sans-serif" font-size="34" fill="#4b4743">Food Image</text></svg>'
)}`;

const KEYWORD_IMAGE_MAP = {
  idli: idliImage,
  dosa: dosaImage,
  biryani: biryaniImage,
  burger: burgerImage,
  pizza: pizzaImage,
  cake: cakeImage,
  coffee: coffeeImage,
  tea: teaImage,
  cupcake: cupcakeImage,
  cupice: cupiceImage,
  chicken: chickenImage,
  strawberrycake: strawberryCakeImage,
  icecream: iceCreamImage,
  icecreame: iceCreamAltImage,
};

const FILE_NAME_IMAGE_MAP = {
  "idli.jpg": idliImage,
  "dosa.jpg": dosaImage,
  "biryani.jpg": biryaniImage,
  "burger.jpg": burgerImage,
  "pizza.jpg": pizzaImage,
  "cake.jpg": cakeImage,
  "coffee.jpg": coffeeImage,
  "tea.jpg": teaImage,
  "cupcake.jpg": cupcakeImage,
  "cupice.jpg": cupiceImage,
  "chicken.jpg": chickenImage,
  "straberry cake.jpg": strawberryCakeImage,
  "ice cream.jpg": iceCreamImage,
  "icecreame.jpg": iceCreamAltImage,
};

export const resolveFoodImage = (imageValue = "") => {
  if (!imageValue) return FALLBACK_FOOD_IMAGE;

  const rawValue = imageValue.toString().trim();
  if (!rawValue) return FALLBACK_FOOD_IMAGE;

  const lowerValue = rawValue.toLowerCase();

  if (lowerValue.startsWith("http") || lowerValue.startsWith("data:") || lowerValue.startsWith("blob:")) {
    return rawValue;
  }

  if (lowerValue.startsWith("/uploads/")) {
    return `${BACKEND_ORIGIN}${rawValue}`;
  }

  if (lowerValue.startsWith("uploads/")) {
    return `${BACKEND_ORIGIN}/${rawValue}`;
  }

  if (lowerValue.startsWith("/images/")) {
    const fileName = lowerValue.split("/").pop() || "";
    return FILE_NAME_IMAGE_MAP[fileName] ?? rawValue;
  }

  if (lowerValue.startsWith("/")) {
    return rawValue;
  }

  if (/\.(png|jpe?g|webp|gif|svg)$/i.test(rawValue) && !rawValue.includes("/")) {
    if (FILE_NAME_IMAGE_MAP[lowerValue]) {
      return FILE_NAME_IMAGE_MAP[lowerValue];
    }

    return `${BACKEND_ORIGIN}/uploads/foods/${rawValue}`;
  }

  const normalized = rawValue
    .toLowerCase()
    .replace(/\.[a-z0-9]+$/i, "")
    .replace(/[^a-z]/g, "");

  const normalizedWithoutImagesPrefix = normalized.startsWith("images")
    ? normalized.slice("images".length)
    : normalized;

  if (KEYWORD_IMAGE_MAP[normalized]) {
    return KEYWORD_IMAGE_MAP[normalized];
  }

  if (KEYWORD_IMAGE_MAP[normalizedWithoutImagesPrefix]) {
    return KEYWORD_IMAGE_MAP[normalizedWithoutImagesPrefix];
  }

  return FALLBACK_FOOD_IMAGE;
};
