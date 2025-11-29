import { CarouselImageEntity } from '../../domain/entities/CarouselImage.entity';

interface CarouselImageDTO {
  id: string;
  image_url: string;
  alt_text: string;
  order: number;
  is_active: boolean;
  created_at: string;
}

export const carouselImageMapper = {
  toDomain(dto: CarouselImageDTO): CarouselImageEntity {
    return CarouselImageEntity.create({
      id: dto.id,
      imageUrl: dto.image_url,
      altText: dto.alt_text,
      order: dto.order,
      isActive: dto.is_active,
      createdAt: new Date(dto.created_at),
    });
  },

  toDomainList(dtos: CarouselImageDTO[]): CarouselImageEntity[] {
    return dtos.map(this.toDomain);
  },
};