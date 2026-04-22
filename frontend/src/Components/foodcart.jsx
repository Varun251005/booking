import { Card, Button } from "react-bootstrap";

const FoodCard = ({ food, onAdd }) => {
  return (
    <Card className="mb-4 shadow food-card">
      <Card.Img variant="top" src={food.image} />
      <Card.Body>
        <Card.Title className="food-title">{food.name}</Card.Title>
        <Card.Text className="food-price">₹{food.price}</Card.Text>
        <Button className="theme-btn" onClick={() => onAdd(food)}>Add to Cart</Button>
      </Card.Body>
    </Card>
  );
};

export default FoodCard;