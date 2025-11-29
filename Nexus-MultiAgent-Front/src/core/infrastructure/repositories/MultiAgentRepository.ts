import { IMultiAgentRepository } from '../../domain/repositories/IMultiAgentRepository';
import { MultiAgent } from '../../domain/entities/MultiAgent.entity';
import axiosClient from '../api/axiosClient';
import { ENDPOINTS } from '../api/endpoints';
import { multiAgentMapper } from '../mappers/multiAgentMapper';

export class MultiAgentRepository implements IMultiAgentRepository {
  async getAll(): Promise<MultiAgent[]> {
    try {
      const response = await axiosClient.get(ENDPOINTS.MULTIAGENTS.GET_ALL);
      return multiAgentMapper.toDomainList(response.data);
    } catch (error) {
      console.error('Error fetching all multiagents:', error);
      throw new Error('No se pudieron cargar los sistemas multiagente');
    }
  }

  async getAvailable(): Promise<MultiAgent[]> {
    try {
      const response = await axiosClient.get(ENDPOINTS.MULTIAGENTS.GET_AVAILABLE);
      return multiAgentMapper.toDomainList(response.data);
    } catch (error) {
      console.error('Error fetching available multiagents:', error);
      throw new Error('No se pudieron cargar los sistemas multiagente disponibles');
    }
  }

  async getById(id: string): Promise<MultiAgent | null> {
    try {
      const response = await axiosClient.get(ENDPOINTS.MULTIAGENTS.GET_BY_ID(id));
      return multiAgentMapper.toDomain(response.data);
    } catch (error) {
      console.error(`Error fetching multiagent ${id}:`, error);
      return null;
    }
  }

  async getByDomain(domain: string): Promise<MultiAgent[]> {
    try {
      const response = await axiosClient.get(ENDPOINTS.MULTIAGENTS.GET_BY_DOMAIN(domain));
      return multiAgentMapper.toDomainList(response.data);
    } catch (error) {
      console.error(`Error fetching multiagents by domain ${domain}:`, error);
      throw new Error('No se pudieron cargar los sistemas del dominio especificado');
    }
  }
}