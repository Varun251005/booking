import { useState } from "react";
import { Form, Button, Container } from "react-bootstrap";
import API from "../../services/api";
import { resolveFoodImage } from "../../data/foodImageMap";

const imageOptions = ["idli", "dosa", "biryani"];

const AddFood = () => {
  const [food, setFood] = useState({
    name: "",
    price: "",
    image: "",
    category: ""
  });

  const handleChange = (e) => {
    setFood({ ...food, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      await API.post("/foods", {
        ...food,
        image: food.image.trim().toLowerCase()
      });
      alert("Food added!");
      setFood({
        name: "",
        price: "",
        image: "",
        category: ""
      });
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
          <option value="">Select Image</option>
          {imageOptions.map((item) => (
            <option key={item} value={item}>
              {item[0].toUpperCase() + item.slice(1)}
            </option>
          ))}
        </Form.Select>

        {food.image && (
          <img
            src={resolveFoodImage(food.image)}
            alt={food.name || food.image}
            className="food-preview"
          />
        )}

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
