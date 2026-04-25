import { Card, Button } from "react-bootstrap";

const FoodCard = ({ food, onAdd }) => {
  return (
    <Card className="food-card">
      <Card.Img variant="top" src={food.image} alt={food.name} className="food-image" />
      <Card.Body>
        <div className="food-meta-row">
          <Card.Title className="food-title">{food.name}</Card.Title>
          {food.category ? <span className="food-tag">{food.category}</span> : null}
        </div>
        <Card.Text className="food-price">₹{food.price}</Card.Text>
        <Button className="theme-btn w-100" onClick={() => onAdd(food)}>Add to Cart</Button>
      </Card.Body>
    </Card>
  );
};

export default FoodCard;