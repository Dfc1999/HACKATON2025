export interface CarouselImage {
  id: string;
  imageUrl: string;
  altText: string;
  order: number;
  isActive: boolean;
  createdAt: Date;
}

export class CarouselImageEntity implements CarouselImage {
  constructor(
    public id: string,
    public imageUrl: string,
    public altText: string,
    public order: number,
    public isActive: boolean,
    public createdAt: Date
  ) {}

  static create(data: Partial<CarouselImage>): CarouselImageEntity {
    return new CarouselImageEntity(
      data.id || '',
      data.imageUrl || '',
      data.altText || '',
      data.order || 0,
      data.isActive ?? true,
      data.createdAt || new Date()
    );
  }
}