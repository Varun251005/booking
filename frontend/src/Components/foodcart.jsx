import { Card, Button } from "react-bootstrap";

const FoodCard = ({ food, onAdd }) => {
  return (
    <Card className="mb-4 shadow">
      <Card.Img variant="top" src={food.image} />
      <Card.Body>
        <Card.Title>{food.name}</Card.Title>
        <Card.Text>₹{food.price}</Card.Text>
        <Button onClick={() => onAdd(food)}>Add to Cart</Button>
      </Card.Body>
    </Card>
  );
};

export default FoodCard;