import { 
  MultiAgentEntity, 
  PerformanceMetric, 
  PerformanceMetrics,
  ResponsibleAI,
  DemoAccount 
} from '../../domain/entities/MultiAgent.entity';

interface PerformanceMetricDTO {
  label: string;
  value: string;
  description: string;
}

interface PerformanceMetricsDTO {
  accuracy: number;
  response_time: number;
  reliability: number;
}

interface ResponsibleAIDTO {
  transparency: string;
  fairness: string;
  privacy: string;
}

interface DemoAccountDTO {
  username: string;
  password: string;
}

interface MultiAgentDTO {
  id: string;
  title?: string;
  name: string;
  description: string;
  short_description: string;
  full_description?: string;
  image_url: string;
  logo?: string;
  capabilities: string[];
  domains: string[];
  performance_metrics: PerformanceMetricDTO[] | PerformanceMetricsDTO;
  responsible_ai?: ResponsibleAIDTO;
  demo_url?: string | null;
  documentation_url?: string;
  demo_account?: DemoAccountDTO | null;
  is_available: boolean;
  organizations_count?: number;
  created_at: string;
  updated_at: string;
}

export const multiAgentMapper = {
  toDomain(dto: MultiAgentDTO): MultiAgentEntity {
    let performanceMetrics: PerformanceMetric[] | PerformanceMetrics;

    if (Array.isArray(dto.performance_metrics)) {
      performanceMetrics = dto.performance_metrics.map(metric => ({
        label: metric.label,
        value: metric.value,
        description: metric.description,
      }));
    } else {
      performanceMetrics = {
        accuracy: dto.performance_metrics.accuracy,
        responseTime: dto.performance_metrics.response_time,
        reliability: dto.performance_metrics.reliability,
      };
    }

    const responsibleAI: ResponsibleAI | undefined = dto.responsible_ai
      ? {
          transparency: dto.responsible_ai.transparency,
          fairness: dto.responsible_ai.fairness,
          privacy: dto.responsible_ai.privacy,
        }
      : undefined;

    const demoAccount: DemoAccount | null = dto.demo_account
      ? {
          username: dto.demo_account.username,
          password: dto.demo_account.password,
        }
      : null;

    return MultiAgentEntity.create({
      id: dto.id,
      title: dto.title,
      name: dto.name,
      description: dto.description,
      shortDescription: dto.short_description,
      fullDescription: dto.full_description,
      imageUrl: dto.image_url,
      logo: dto.logo,
      capabilities: dto.capabilities,
      domains: dto.domains,
      performanceMetrics,
      responsibleAI,
      demoUrl: dto.demo_url ?? null,
      documentationUrl: dto.documentation_url,
      demoAccount,
      isAvailable: dto.is_available,
      organizationsCount: dto.organizations_count,
      createdAt: new Date(dto.created_at),
      updatedAt: new Date(dto.updated_at),
    });
  },

  toDomainList(dtos: MultiAgentDTO[]): MultiAgentEntity[] {
    return dtos.map(this.toDomain);
  },
};