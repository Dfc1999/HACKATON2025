export interface PerformanceMetric {
  label: string;
  value: string;
  description: string;
}

export interface MultiAgent {
  id: string;
  title?: string;
  name: string;
  description: string;
  shortDescription: string;
  fullDescription?: string;
  imageUrl: string;
  logo?: string;
  capabilities: string[];
  domains: string[];
  performanceMetrics: PerformanceMetric[] | PerformanceMetrics;
  responsibleAI?: ResponsibleAI;
  demoUrl?: string | null;
  documentationUrl?: string;
  demoAccount?: DemoAccount | null;
  isAvailable: boolean;
  organizationsCount?: number;
  createdAt: Date;
  updatedAt: Date;
}




export interface PerformanceMetrics {
  accuracy: number;
  responseTime: number;
  reliability: number;
}

export interface ResponsibleAI {
  transparency: string;
  fairness: string;
  privacy: string;
}

export interface DemoAccount {
  username: string;
  password: string;
}

export class MultiAgentEntity implements MultiAgent {
  constructor(
    public id: string,
    public title?: string,
    public name: string = '',
    public description: string = '',
    public shortDescription: string = '',
    public fullDescription?: string,
    public imageUrl: string = '',
    public logo?: string,
    public capabilities: string[] = [],
    public domains: string[] = [],
    public performanceMetrics: PerformanceMetric[] | PerformanceMetrics = [],
    public responsibleAI?: ResponsibleAI,
    public demoUrl?: string | null,
    public documentationUrl?: string,
    public demoAccount?: DemoAccount | null,
    public isAvailable: boolean = true,
    public organizationsCount?: number,
    public createdAt: Date = new Date(),
    public updatedAt: Date = new Date()
  ) {}

  static create(data: Partial<MultiAgent>): MultiAgentEntity {
    return new MultiAgentEntity(
      data.id || '',
      data.title,
      data.name || '',
      data.description || '',
      data.shortDescription || '',
      data.fullDescription,
      data.imageUrl || '',
      data.logo,
      data.capabilities || [],
      data.domains || [],
      data.performanceMetrics || [],
      data.responsibleAI,
      data.demoUrl ?? null,
      data.documentationUrl,
      data.demoAccount ?? null,
      data.isAvailable ?? true,
      data.organizationsCount,
      data.createdAt || new Date(),
      data.updatedAt || new Date()
    );
  }

  get hasDemo(): boolean {
    return !!this.demoUrl;
  }

  get hasDemoAccount(): boolean {
    return !!this.demoAccount;
  }

  get isPopular(): boolean {
    return (this.organizationsCount ?? 0) > 10;
  }

  get averagePerformance(): number {
    if (!Array.isArray(this.performanceMetrics)) {
      const { accuracy, reliability } = this.performanceMetrics as PerformanceMetrics;
      return (accuracy + reliability) / 2;
    }
    return 0;
  }

}