import { resolveFoodImage } from "./foodImageMap";

const foods = [
  {
    id: 1,
    name: "Idli",
    price: 120,
    image: resolveFoodImage("idli"),
    category: "Breakfast"
  },
  {
    id: 2,
    name: "Dosa",
    price: 250,
    image: resolveFoodImage("dosa"),
    category: "Breakfast"
  },
  {
    id: 3,
    name: "Biryani",
    price: 180,
    image: resolveFoodImage("biryani"),
    category: "Main Course"
  },
];

export default foods;