import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';
const apiConfig = {
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
};

class AxiosClient {
  private instance: AxiosInstance;

  constructor() {
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || apiConfig.baseURL || 'http://localhost:3000/api';
    this.instance = axios.create({
      ...apiConfig,
      baseURL: API_BASE_URL,
      timeout: 15000,
      headers: {
        ...(apiConfig.headers || {}),
      },
    });
    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    this.instance.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        const token = localStorage.getItem('logto_access_token');
        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error: AxiosError) => Promise.reject(error)
    );

    this.instance.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        if (error.response?.status === 401) {
          localStorage.removeItem('logto_access_token');
          window.location.href = '/';
        }
        return Promise.reject(error);
      }
    );
  }

  getInstance(): AxiosInstance {
    return this.instance;
  }
}

export const axiosClient = new AxiosClient().getInstance();
export default axiosClient;