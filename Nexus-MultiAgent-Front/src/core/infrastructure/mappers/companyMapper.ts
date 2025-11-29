import { CompanyEntity } from '../../domain/entities/Company.entity';
import { CompanyDTO } from '../../../types';

export const companyMapper = {
  toDomain(dto: CompanyDTO): CompanyEntity {
    return new CompanyEntity(
      dto.id,
      dto.name,
      dto.description,
      dto.logo_url,
      dto.mission,
      dto.vision,
      dto.values,
      dto.contact_email,
      dto.phone,
      dto.address,
      dto.social_media
    );
  },

  toDTO(entity: CompanyEntity): CompanyDTO {
    return {
      id: entity.id,
      name: entity.name,
      description: entity.description,
      logo_url: entity.logoUrl,
      mission: entity.mission,
      vision: entity.vision,
      values: entity.values,
      contact_email: entity.contactEmail,
      phone: entity.phone,
      address: entity.address,
      social_media: entity.socialMedia,
    };
  }
};