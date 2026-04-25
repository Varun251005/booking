import { Carousel } from "react-bootstrap";
import offer1 from "../assets/1.png";
import offer2 from "../assets/2.png";
import offer3 from "../assets/3.png";

const OfferSlider = () => {
  return (
    <Carousel controls={false} indicators interval={3000} className="offer-carousel">
      <Carousel.Item>
        <img
          className="d-block w-100 offer-image"
          src={offer1}
          alt="Offer 1"
        />
      </Carousel.Item>

      <Carousel.Item>
        <img
          className="d-block w-100 offer-image"
          src={offer2}
          alt="Offer 2"
        />
      </Carousel.Item>

      <Carousel.Item>
        <img
          className="d-block w-100 offer-image"
          src={offer3}
          alt="Offer 3"
        />
      </Carousel.Item>
    </Carousel>
  );
};

export default OfferSlider;
