import { useEffect, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import FoodCard from "../../Components/foodcart";
import { useCart } from "../../context/CartContext";
import API from "../../services/api";

const Home = () => {
  const [foods, setFoods] = useState([]);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchFoods = async () => {
      const res = await API.get("/foods");
      setFoods(res.data);
    };

    fetchFoods();
  }, []);

  return (
    <Container className="mt-4 page-shell">
      <h2 className="page-title">Popular Foods</h2>
      <Row>
        {foods.map(food => (
          <Col md={4} key={food._id}>
            <FoodCard food={food} onAdd={addToCart} />
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default Home;