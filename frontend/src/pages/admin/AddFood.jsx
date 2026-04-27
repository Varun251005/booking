import { useEffect, useMemo, useState } from "react";
import { Form, Button, Container } from "react-bootstrap";
import API from "../../services/api";
import { resolveFoodImage } from "../../data/foodImageMap";

const AddFood = () => {
  const [food, setFood] = useState({ name: "", price: "", image: "", category: "" });
  const [savedImages, setSavedImages] = useState([]);
  const [loadingImages, setLoadingImages] = useState(true);

  const handleChange = (e) => setFood({ ...food, [e.target.name]: e.target.value });

  useEffect(() => {
    const loadSavedImages = async () => {
      try {
        const response = await API.get("/foods/saved-images");
        setSavedImages(response.data ?? []);
      } catch {
        setSavedImages([]);
      } finally {
        setLoadingImages(false);
      }
    };

    loadSavedImages();
  }, []);

  const imagePreviewSrc = useMemo(() => {
    if (!food.image) return "";
    return resolveFoodImage(food.image);
  }, [food.image]);

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
          disabled={loadingImages}
        >
          <option value="">{loadingImages ? "Loading saved images..." : "Select saved image"}</option>
          {savedImages.map((imageOption) => (
            <option key={imageOption.value} value={imageOption.value}>
              {imageOption.name}
            </option>
          ))}
        </Form.Select>

        {imagePreviewSrc ? (
          <img src={imagePreviewSrc} alt="preview" className="food-preview mb-2" />
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
