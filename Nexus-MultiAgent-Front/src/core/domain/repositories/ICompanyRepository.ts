import { CompanyEntity } from '../entities/Company.entity';

export interface ICompanyRepository {
  getCompanyInfo(): Promise<CompanyEntity>;
}