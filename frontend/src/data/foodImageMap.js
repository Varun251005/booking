import biryaniImage from "../assets/Biryani.jpg";
import dosaImage from "../assets/Dosa.jpg";
import idliImage from "../assets/idli.jpg";

const BACKEND_ORIGIN = "http://localhost:5000";

export const FOOD_IMAGE_MAP = {
  biryani: biryaniImage,
  dosa: dosaImage,
  idli: idliImage,
};

export const resolveFoodImage = (imageValue = "") => {
  if (!imageValue) return idliImage;

  if (typeof imageValue === "string" && (imageValue.startsWith("/") || imageValue.startsWith("http"))) {
    if (imageValue.startsWith("/uploads/")) return `${BACKEND_ORIGIN}${imageValue}`;
    return imageValue;
  }

  const normalized = imageValue
    .toString()
    .trim()
    .toLowerCase()
    .replace(/\.[a-z0-9]+$/i, "")
    .replace(/[^a-z]/g, "");

  return FOOD_IMAGE_MAP[normalized] ?? imageValue;
};
