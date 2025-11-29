import axios from 'axios';
import type { AxiosInstance } from 'axios';

export interface AgentMessage {
  action: string;
  data: Record<string, any>;
}

export interface AgentContext {
  priority: 'LOW' | 'NORMAL' | 'HIGH' | 'CRITICAL';
  requiresResponse: boolean;
  timeout?: number;
}

export interface AgentResponse {
  success: boolean;
  data?: any;
  message?: string;
  error?: string;
}

export interface TemporaryDataUpload {
  data: any;
  expirationMinutes: number;
  dataType: string;
  accessControlList?: string[];
}

export class AgentCommunicationService {
  private axiosInstance: AxiosInstance;
  private readonly AGENT_ENDPOINT: string;
  private readonly DEFAULT_TIMEOUT = 30000;

  constructor(agentEndpoint: string, apiKey?: string) {
    this.AGENT_ENDPOINT = agentEndpoint;

    this.axiosInstance = axios.create({
      baseURL: this.AGENT_ENDPOINT,
      timeout: this.DEFAULT_TIMEOUT,
      headers: {
        'Content-Type': 'application/json',
        ...(apiKey && { 'X-API-Key': apiKey })
      }
    });

    this.setupInterceptors();
  }

  async sendToAgent(
    message: AgentMessage,
    context: AgentContext
  ): Promise<AgentResponse> {
    try {
      const payload = {
        ...message,
        context: {
          ...context,
          timestamp: new Date().toISOString(),
          source: 'FRONTEND_APP'
        }
      };

      const timeout = context.timeout || this.DEFAULT_TIMEOUT;

      const response = await this.axiosInstance.post('/agent/message', payload, {
        timeout
      });

      return {
        success: true,
        data: response.data,
        message: 'Message sent successfully'
      };

    } catch (error) {
      console.error('Error sending message to agent:', error);
      return this.handleError(error);
    }
  }

  async handleAgentResponse(response: any): Promise<any> {
    try {
      if (!response || typeof response !== 'object') {
        throw new Error('Invalid agent response format');
      }

      if (response.error) {
        throw new Error(response.error);
      }

      return response.data || response;

    } catch (error) {
      console.error('Error handling agent response:', error);
      throw error;
    }
  }

  async uploadTemporaryData(upload: TemporaryDataUpload): Promise<AgentResponse> {
    try {
      const expirationDate = new Date();
      expirationDate.setMinutes(expirationDate.getMinutes() + upload.expirationMinutes);

      const payload = {
        data: upload.data,
        metadata: {
          expiresAt: expirationDate.toISOString(),
          dataType: upload.dataType,
          uploadedAt: new Date().toISOString(),
          accessControlList: upload.accessControlList || []
        }
      };

      const response = await this.axiosInstance.post('/agent/temporary-data', payload);

      return {
        success: true,
        data: {
          uploadId: response.data.id,
          expiresAt: expirationDate
        },
        message: 'Data uploaded successfully'
      };

    } catch (error) {
      console.error('Error uploading temporary data:', error);
      return this.handleError(error);
    }
  }

  async queryAgent(query: string, context?: Record<string, any>): Promise<AgentResponse> {
    try {
      const response = await this.axiosInstance.post('/agent/query', {
        query,
        context: {
          ...context,
          timestamp: new Date().toISOString()
        }
      });

      return {
        success: true,
        data: response.data,
        message: 'Query executed successfully'
      };

    } catch (error) {
      console.error('Error querying agent:', error);
      return this.handleError(error);
    }
  }

  async getAgentStatus(): Promise<AgentResponse> {
    try {
      const response = await this.axiosInstance.get('/agent/status');

      return {
        success: true,
        data: response.data,
        message: 'Agent status retrieved'
      };

    } catch (error) {
      console.error('Error getting agent status:', error);
      return this.handleError(error);
    }
  }

  async notifyEvent(
    eventType: string,
    eventData: Record<string, any>
  ): Promise<void> {
    try {
      await this.axiosInstance.post('/agent/event', {
        eventType,
        eventData,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error notifying event:', error);
    }
  }

  private setupInterceptors(): void {
    this.axiosInstance.interceptors.request.use(
      (config) => {
        const token = this.getAuthToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    this.axiosInstance.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response?.status === 401) {
          await this.handleUnauthorized();
        }
        return Promise.reject(error);
      }
    );
  }

  private handleError(error: any): AgentResponse {
    if (axios.isAxiosError(error)) {
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Unknown error occurred'
      };
    }

    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }

  private getAuthToken(): string | null {
    return sessionStorage.getItem('authToken');
  }

  private async handleUnauthorized(): Promise<void> {
    sessionStorage.removeItem('authToken');
    window.location.href = '/login';
  }

  setAuthToken(token: string): void {
    sessionStorage.setItem('authToken', token);
  }

  clearAuthToken(): void {
    sessionStorage.removeItem('authToken');
  }
}