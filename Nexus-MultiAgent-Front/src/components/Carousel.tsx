import { useEffect, useState } from "react";
import { getCarouselImages } from "../services/MockCarouselService";

import type { CarouselImage } from "../services/MockCarouselService";

export const Carousel = () => {
  const [images, setImages] = useState<CarouselImage[]>([]);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    getCarouselImages().then(setImages);
  }, []);

  useEffect(() => {
    if (images.length === 0) return;
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [images]);

  if (!images.length) return <></>;

  return (
    <div
      className="carousel-container"
      style={{
        perspective: "800px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <img
        src={images[current].imageUrl}
        alt={images[current].title || `Slide ${current + 1}`}
        className="carousel-image"
        style={{
          transform: "translateZ(-150px) scale(0.85)",
          transition: "transform 0.8s ease",
        }}
      />
    </div>
  );
};