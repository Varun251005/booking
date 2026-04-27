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

  if (/\.(png|jpe?g|webp|gif|svg)$/i.test(rawValue) && !rawValue.includes("/")) {
    return `${BACKEND_ORIGIN}/uploads/foods/${rawValue}`;
  }

  return FALLBACK_FOOD_IMAGE;
};
