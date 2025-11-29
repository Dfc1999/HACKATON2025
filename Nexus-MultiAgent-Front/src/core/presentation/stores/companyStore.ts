import { create } from 'zustand';
import { CompanyEntity } from '../../domain/entities/Company.entity';
import  { CompanyRepository } from '../../infrastructure/repositories/CompanyRepository';

interface CompanyState {
  company: CompanyEntity | null;
  isLoading: boolean;
  error: string | null;
  fetchCompanyInfo: () => Promise<void>;
}

export const useCompanyStore = create<CompanyState>((set) => ({
  company: null,
  isLoading: false,
  error: null,
  fetchCompanyInfo: async () => {
    set({ isLoading: true, error: null });
    try {
    const companyRepository = new CompanyRepository();
      const company = await companyRepository.getCompanyInfo();
      set({ company, isLoading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Error fetching company info',
        isLoading: false 
      });
    }
  },
}));