import { MultiAgent } from '../entities/MultiAgent.entity';

export interface IMultiAgentRepository {
  getAll(): Promise<MultiAgent[]>;
  getAvailable(): Promise<MultiAgent[]>;
  getById(id: string): Promise<MultiAgent | null>;
  getByDomain(domain: string): Promise<MultiAgent[]>;
}