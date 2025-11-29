import { useEffect } from 'react';
import { useCarouselStore } from '../stores/carouselStore';
import { CarouselRepository } from '../../infrastructure/repositories/CarouselRepository';

const carouselRepository = new CarouselRepository();

export const useCarouselImages = () => {
  const { images, isLoading, error, setImages, setLoading, setError } = useCarouselStore();

  useEffect(() => {
    const fetchCarouselImages = async () => {
      setLoading(true);
      setError(null);

      try {
        const fetchedImages = await carouselRepository.getActive();
        const sortedImages = fetchedImages.sort((a, b) => a.order - b.order);
        setImages(sortedImages);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al cargar las imágenes');
      } finally {
        setLoading(false);
      }
    };

    fetchCarouselImages();
  }, [setImages, setLoading, setError]);

  return { images, isLoading, error };
};