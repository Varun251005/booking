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
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  const handleChange = (e) => {
    setFood({ ...food, [e.target.name]: e.target.value });
  };

  const handleImageFileChange = (e) => {
    const selectedFile = e.target.files?.[0] || null;
    setImageFile(selectedFile);

    if (!selectedFile) {
      setImagePreview("");
      return;
    }

    const previewUrl = URL.createObjectURL(selectedFile);
    setImagePreview(previewUrl);
  };

  const handleSubmit = async () => {
    try {
      const payload = new FormData();
      payload.append("name", food.name);
      payload.append("price", food.price);
      payload.append("category", food.category);
      payload.append("image", food.image.trim().toLowerCase());

      if (imageFile) {
        payload.append("imageFile", imageFile);
      }

      await API.post("/foods", payload);
      alert("Food added!");
      setFood({
        name: "",
        price: "",
        image: "",
        category: ""
      });
      setImageFile(null);
      setImagePreview("");
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

        <Form.Control
          type="file"
          accept="image/*"
          onChange={handleImageFileChange}
          className="mb-2"
        />

        {imagePreview ? (
          <img
            src={imagePreview}
            alt={food.name || "Food preview"}
            className="food-preview"
          />
        ) : food.image ? (
          <img
            src={resolveFoodImage(food.image)}
            alt={food.name || food.image}
            className="food-preview"
          />
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
