import { useState } from "react";
import { Form, Button, Container } from "react-bootstrap";
import API from "../../services/api";
import { resolveFoodImage } from "../../data/foodImageMap";

const IMAGE_OPTIONS = [
  { label: "Burger", value: "/images/burger.jpg" },
  { label: "Pizza", value: "/images/pizza.jpg" },
  { label: "Cake", value: "/images/cake.jpg" },
  { label: "Coffee", value: "/images/coffee.jpg" },
  { label: "Tea", value: "/images/tea.jpg" },
  { label: "Cupcake", value: "/images/cupcake.jpg" },
  { label: "Idli", value: "/images/idli.jpg" },
  { label: "Dosa", value: "/images/Dosa.jpg" },
  { label: "Biryani", value: "/images/Biryani.jpg" },
];

const AddFood = () => {
  const [food, setFood] = useState({ name: "", price: "", image: "", category: "" });

  const handleChange = (e) => setFood({ ...food, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    if (!food.image) {
      alert("Please select an image");
      return;
    }

    try {
      await API.post("/foods", food);
      alert("Food added!");
      setFood({ name: "", price: "", image: "", category: "" });
    } catch {
      alert("Error adding food");
    }
  };

  return (
    <Container className="mt-4 page-shell admin-shell">
      <h2 className="page-title">Add Food</h2>

      <Form className="themed-form">
        <Form.Control
          name="name"
          placeholder="Name"
          value={food.name}
          onChange={handleChange}
          className="mb-2"
        />

        <Form.Control
          name="price"
          type="number"
          min="1"
          placeholder="Price"
          value={food.price}
          onChange={handleChange}
          className="mb-2"
        />

        <Form.Select
          name="image"
          value={food.image}
          onChange={handleChange}
          className="mb-2"
        >
          <option value="">Select saved image</option>
          {IMAGE_OPTIONS.map((imageOption) => (
            <option key={imageOption.value} value={imageOption.value}>
              {imageOption.label}
            </option>
          ))}
        </Form.Select>

        {food.image ? (
          <img src={resolveFoodImage(food.image)} alt="preview" className="food-preview mb-2" />
        ) : null}

        <Form.Control
          name="category"
          placeholder="Category"
          value={food.category}
          onChange={handleChange}
          className="mb-2"
        />

        <Button className="theme-btn mt-2" onClick={handleSubmit}>Add</Button>
      </Form>
    </Container>
  );
};

export default AddFood;
