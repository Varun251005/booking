import { Container, Row, Col } from "react-bootstrap";
import foods from "../../data/foods";
import FoodCard from "../../Components/foodcart";
import { useCart } from "../../context/CartContext";

const Home = () => {
  const { addToCart } = useCart();

  return (
    <Container className="mt-4">
      <Row>
        {foods.map(food => (
          <Col md={4} key={food.id}>
            <FoodCard food={food} onAdd={addToCart} />
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default Home;