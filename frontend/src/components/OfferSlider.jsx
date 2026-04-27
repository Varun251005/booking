import { Carousel } from "react-bootstrap";

const offerSlides = [
  "http://localhost:5000/uploads/foods/1777125022861-coffee.jpg",
  "http://localhost:5000/uploads/foods/1777125052806-pizza.jpg",
  "http://localhost:5000/uploads/foods/1777125080856-tea.jpg",
];

const OfferSlider = () => {
  return (
    <Carousel controls={false} indicators interval={2000} className="offer-carousel">
      {offerSlides.map((slide, index) => (
        <Carousel.Item key={slide}>
          <img
            className="d-block w-100 offer-image"
            src={slide}
            alt={`Offer ${index + 1}`}
          />
        </Carousel.Item>
      ))}
    </Carousel>
  );
};

export default OfferSlider;
