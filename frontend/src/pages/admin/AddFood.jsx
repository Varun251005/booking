import { useState } from "react";
import { Form, Button, Container, Alert, Spinner } from "react-bootstrap";
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
  const [imageFile, setImageFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleChange = (e) => setFood({ ...food, [e.target.name]: e.target.value });

  const handleUpload = async () => {
    if (!imageFile) {
      setError("Please select an image to upload");
      return;
    }

    try {
      setUploading(true);
      setError("");
      setMessage("");

      const formData = new FormData();
      formData.append("image", imageFile);

      const res = await API.post("/foods/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setFood((prev) => ({ ...prev, image: res.data.url }));
      setMessage("Image uploaded successfully");
    } catch (err) {
      setError(err.response?.data?.message || "Image upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async () => {
    if (!food.image) {
      setError("Please select or upload an image");
      return;
    }

    try {
      setError("");
      setMessage("");
      await API.post("/foods", food);
      setMessage("Food added!");
      setFood({ name: "", price: "", image: "", category: "" });
      setImageFile(null);
    } catch {
      setError("Error adding food");
    }
  };

  return (
    <Container className="mt-4 page-shell admin-shell">
      <h2 className="page-title">Add Food</h2>

      {error && <Alert variant="danger" className="mt-3">{error}</Alert>}
      {message && <Alert variant="success" className="mt-3">{message}</Alert>}

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

        <Form.Group className="mb-2">
          <Form.Label>Upload image (Cloudinary)</Form.Label>
          <Form.Control
            type="file"
            accept="image/*"
            onChange={(e) => setImageFile(e.target.files?.[0] || null)}
          />
          <Button
            variant="outline-dark"
            className="mt-2"
            onClick={handleUpload}
            disabled={uploading}
          >
            {uploading ? (
              <>
                <Spinner animation="border" size="sm" className="me-2" />
                Uploading...
              </>
            ) : (
              "Upload Image"
            )}
          </Button>
        </Form.Group>

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
