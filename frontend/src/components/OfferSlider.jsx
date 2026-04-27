import { Carousel } from "react-bootstrap";

const offerSlides = [
  "/images/1.png",
  "/images/2.png",
  "/images/3.png",
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
