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
  idli: "/images/idli.jpg",
  dosa: "/images/Dosa.jpg",
  biryani: "/images/Biryani.jpg",
  burger: "/images/burger.jpg",
  pizza: "/images/pizza.jpg",
  cake: "/images/cake.jpg",
  coffee: "/images/coffee.jpg",
  tea: "/images/tea.jpg",
  cupcake: "/images/cupcake.jpg",
};

const FILE_NAME_IMAGE_MAP = {
  "idli.jpg": "/images/idli.jpg",
  "dosa.jpg": "/images/Dosa.jpg",
  "biryani.jpg": "/images/Biryani.jpg",
  "burger.jpg": "/images/burger.jpg",
  "pizza.jpg": "/images/pizza.jpg",
  "cake.jpg": "/images/cake.jpg",
  "coffee.jpg": "/images/coffee.jpg",
  "tea.jpg": "/images/tea.jpg",
  "cupcake.jpg": "/images/cupcake.jpg",
  "cupice.jpg": "/images/cupice.jpg",
  "chicken.jpg": "/images/chicken.jpg",
  "straberry cake.jpg": "/images/straberry cake.jpg",
  "ice cream.jpg": "/images/ice cream.jpg",
  "icecreame.jpg": "/images/icecreame.jpg",
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

  if (lowerValue.startsWith("/images/") || lowerValue.startsWith("/")) {
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

  if (KEYWORD_IMAGE_MAP[normalized]) {
    return KEYWORD_IMAGE_MAP[normalized];
  }

  return FALLBACK_FOOD_IMAGE;
};
