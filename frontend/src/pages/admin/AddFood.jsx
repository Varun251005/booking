import { useState } from "react";
import { Form, Button, Container } from "react-bootstrap";
import API from "../../services/api";

const AddFood = () => {
  const [food, setFood] = useState({ name: "", price: "", image: "", category: "" });

  const handleChange = (e) => setFood({ ...food, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
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

        <Form.Control
          name="image"
          placeholder="Image URL (e.g. /images/burger.png)"
          value={food.image}
          onChange={handleChange}
          className="mb-2"
        />

        {food.image ? (
          <img src={food.image} alt="preview" className="food-preview mb-2" />
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
