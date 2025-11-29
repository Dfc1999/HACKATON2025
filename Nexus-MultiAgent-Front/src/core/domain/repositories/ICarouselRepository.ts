import { CarouselImage } from '../entities/CarouselImage.entity';

export interface ICarouselRepository {
  getAll(): Promise<CarouselImage[]>;
  getActive(): Promise<CarouselImage[]>;
  getById(id: string): Promise<CarouselImage | null>;
}