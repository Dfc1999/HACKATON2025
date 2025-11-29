import { ICarouselRepository } from '../../domain/repositories/ICarouselRepository';
import { CarouselImage } from '../../domain/entities/CarouselImage.entity';
import axiosClient from '../api/axiosClient';
import { ENDPOINTS } from '../api/endpoints';
import { carouselImageMapper } from '../mappers/carouselImageMapper';

export class CarouselRepository implements ICarouselRepository {
  async getAll(): Promise<CarouselImage[]> {
    const response = await axiosClient.get(ENDPOINTS.CAROUSEL.GET_ALL);
    return carouselImageMapper.toDomainList(response.data);
  }

  async getActive(): Promise<CarouselImage[]> {
    const response = await axiosClient.get(ENDPOINTS.CAROUSEL.GET_ACTIVE);
    return carouselImageMapper.toDomainList(response.data);
  }

  async getById(id: string): Promise<CarouselImage | null> {
    try {
      const response = await axiosClient.get(ENDPOINTS.CAROUSEL.GET_BY_ID(id));
      return carouselImageMapper.toDomain(response.data);
    } catch (error) {
      return  null;
    }
  }
}