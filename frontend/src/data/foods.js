import { resolveFoodImage } from "./foodImageMap";

const foods = [
  {
    id: 1,
    name: "Classic Idli",
    price: 120,
    image: resolveFoodImage("idli"),
    category: "Breakfast"
  },
  {
    id: 2,
    name: "Crispy Dosa",
    price: 180,
    image: resolveFoodImage("dosa"),
    category: "Breakfast"
  },
  {
    id: 3,
    name: "Chicken Biryani",
    price: 260,
    image: resolveFoodImage("biryani"),
    category: "Main Course"
  },
  {
    id: 4,
    name: "Masala Idli",
    price: 150,
    image: resolveFoodImage("idli"),
    category: "Breakfast"
  },
  {
    id: 5,
    name: "Butter Dosa",
    price: 210,
    image: resolveFoodImage("dosa"),
    category: "Breakfast"
  },
  {
    id: 6,
    name: "Veg Biryani",
    price: 220,
    image: resolveFoodImage("biryani"),
    category: "Main Course"
  },
  {
    id: 7,
    name: "Mini Idli Bowl",
    price: 140,
    image: resolveFoodImage("idli"),
    category: "Snacks"
  },
  {
    id: 8,
    name: "Ghee Roast Dosa",
    price: 240,
    image: resolveFoodImage("dosa"),
    category: "Special"
  },
  {
    id: 9,
    name: "Mutton Biryani",
    price: 320,
    image: resolveFoodImage("biryani"),
    category: "Main Course"
  },
  {
    id: 10,
    name: "Sambar Idli",
    price: 160,
    image: resolveFoodImage("idli"),
    category: "Breakfast"
  },
];

export default foods;