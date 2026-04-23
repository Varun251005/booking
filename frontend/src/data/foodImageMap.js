import biryaniImage from "../assets/Biryani.jpg";
import dosaImage from "../assets/Dosa.jpg";
import idliImage from "../assets/idli.jpg";

export const FOOD_IMAGE_MAP = {
  biryani: biryaniImage,
  dosa: dosaImage,
  idli: idliImage,
};

export const resolveFoodImage = (imageValue = "") => {
  if (!imageValue) return idliImage;

  const normalized = imageValue
    .toString()
    .trim()
    .toLowerCase()
    .replace(/\.[a-z0-9]+$/i, "")
    .replace(/[^a-z]/g, "");

  return FOOD_IMAGE_MAP[normalized] ?? imageValue;
};
