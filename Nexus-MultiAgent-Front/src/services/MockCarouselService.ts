export interface CarouselImage {
  imageUrl: string;
  title?: string;
  description?: string;
}

export const getCarouselImages = async (): Promise<CarouselImage[]> => {
  return [
    { imageUrl: "/images/image.webp", title: "Imagen 1" },
    { imageUrl: "/images/image.webp", title: "Imagen 2" },
    { imageUrl: "/images/image3.png", title: "Imagen 3" },
    { imageUrl: "/images/image4.png", title: "Imagen 4" },
    { imageUrl: "/images/image5.png", title: "Imagen 5" },
  ];
};