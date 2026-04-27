import { Carousel } from "react-bootstrap";
import offer1 from "../assets/1.png";
import offer2 from "../assets/2.png";
import offer3 from "../assets/3.png";

const offerSlides = [
  offer1,
  offer2,
  offer3,
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
