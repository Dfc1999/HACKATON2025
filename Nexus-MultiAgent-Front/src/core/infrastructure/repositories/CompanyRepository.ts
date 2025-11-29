import { ICompanyRepository } from '../../domain/repositories/ICompanyRepository';
import { CompanyEntity } from '../../domain/entities/Company.entity';
import { axiosClient } from '../api/axiosClient';
import { endpoints } from '../../../config/api.config';
import { companyMapper } from '../mappers/companyMapper';
import { ApiResponse, CompanyDTO } from '../../../types';

export class CompanyRepository implements ICompanyRepository {
  async getCompanyInfo(): Promise<CompanyEntity> {
    const response = await axiosClient.get<ApiResponse<CompanyDTO>>(
      endpoints.company
    );
    return companyMapper.toDomain(response.data.data);
  }
}