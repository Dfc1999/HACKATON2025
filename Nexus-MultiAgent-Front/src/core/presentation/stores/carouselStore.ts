import { create } from 'zustand';
import { CarouselImage } from '../../domain/entities/CarouselImage.entity';

interface CarouselState {
  images: CarouselImage[];
  currentIndex: number;
  isAutoPlaying: boolean;
  isLoading: boolean;
  error: string | null;
  setImages: (images: CarouselImage[]) => void;
  setCurrentIndex: (index: number) => void;
  nextSlide: () => void;
  prevSlide: () => void;
  goToSlide: (index: number) => void;
  toggleAutoPlay: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useCarouselStore = create<CarouselState>((set, get) => ({
  images: [],
  currentIndex: 0,
  isAutoPlaying: true,
  isLoading: false,
  error: null,

  setImages: (images) => set({ images }),

  setCurrentIndex: (index) => set({ currentIndex: index }),

  nextSlide: () => {
    const { images, currentIndex } = get();
    const nextIndex = currentIndex === images.length - 1 ? 0 : currentIndex + 1;
    set({ currentIndex: nextIndex });
  },

  prevSlide: () => {
    const { images, currentIndex } = get();
    const prevIndex = currentIndex === 0 ? images.length - 1 : currentIndex - 1;
    set({ currentIndex: prevIndex });
  },

  goToSlide: (index) => set({ currentIndex: index }),

  toggleAutoPlay: () => set((state) => ({ isAutoPlaying: !state.isAutoPlaying })),

  setLoading: (loading) => set({ isLoading: loading }),

  setError: (error) => set({ error }),
}));