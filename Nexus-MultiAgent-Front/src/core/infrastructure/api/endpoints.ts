const API_VERSION = '/api/v1';

export const ENDPOINTS = {
  CAROUSEL: {
    GET_ALL: `${API_VERSION}/carousel/images`,
    GET_ACTIVE: `${API_VERSION}/carousel/active`,
    GET_BY_ID: (id: string) => `${API_VERSION}/carousel/${id}`,
  },
  MULTIAGENTS: {
    GET_ALL: `${API_VERSION}/multiagents`,
    GET_AVAILABLE: `${API_VERSION}/multiagents/available`,
    GET_BY_ID: (id: string) => `${API_VERSION}/multiagents/${id}`,
    GET_BY_DOMAIN: (domain: string) => `${API_VERSION}/multiagents/domain/${domain}`,
  },
  COMPANY: {
    GET_INFO: `${API_VERSION}/company/info`,
    GET_MOTTO: `${API_VERSION}/company/motto`,
  },
} as const;