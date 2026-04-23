import { useEffect, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import FoodCard from "../../Components/foodcart";
import { useCart } from "../../context/CartContext";
import API from "../../services/api";
import fallbackFoods from "../../data/foods";
import { resolveFoodImage } from "../../data/foodImageMap";

const Home = () => {
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { addToCart } = useCart();
  const getFoodId = (food) => food._id ?? food.id;

  useEffect(() => {
    const fetchFoods = async () => {
      try {
        setError("");
        setLoading(true);
        const res = await API.get("/foods");
        const normalizedFoods = (res.data ?? []).map((food) => ({
          ...food,
          image: resolveFoodImage(food.image || food.name)
        }));

        if (normalizedFoods.length >= 10) {
          setFoods(normalizedFoods);
        } else {
          setFoods(fallbackFoods);
        }
      } catch (err) {
        setFoods(fallbackFoods);
        setError("Could not load foods from server. Showing available menu.");
      } finally {
        setLoading(false);
      }
    };

    fetchFoods();
  }, []);

  return (
    <div className="home-page">
      <Container fluid className="hero-shell">
        <div className="hero-grid">
          <div className="text-start py-2 py-md-3">
            <p className="hero-badge mb-3">OrderEase</p>
            <h1 className="hero-title fw-bold">THE EASIEST WAY TO ORDER GREAT FOOD</h1>
            <p className="hero-subtitle text-muted mb-0">
              Explore delicious meals, add them to your cart, and enjoy a smooth and fast checkout experience.
            </p>
            <div className="hero-actions mt-4">
              <Link to="/cart" className="hero-btn-primary">View Cart</Link>
              <Link to="/orders" className="hero-btn-ghost">My Orders</Link>
            </div>
          </div>
        </div>
      </Container>

      <Container className="menu-shell">
        <div className="menu-header">
          <h2 className="page-title">Popular Foods</h2>
          <p>Handpicked dishes with clean ingredients and rich flavor.</p>
        </div>

        {loading ? (
          <p className="status-text">Loading foods...</p>
        ) : (
          <>
            {error && <p className="status-text error-text">{error}</p>}
            <Row className="g-4">
              {foods.map(food => (
                <Col md={6} lg={3} key={getFoodId(food)}>
                  <FoodCard food={food} onAdd={addToCart} />
                </Col>
              ))}
            </Row>
          </>
        )}
      </Container>
    </div>
  );
};

export default Home;