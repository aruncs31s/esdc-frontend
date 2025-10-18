import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { ApiSuccessResponse } from '@/types';
// Base URL for the API
// const API_BASE_URL = 'http://localhost:9090';
const API_BASE_URL = 'https://esdc-backend.onrender.com';
/**
 * API Client
 * Central HTTP client with interceptors for authentication
 */
export class ApiClient {
  private client: AxiosInstance;
  constructor(baseURL: string = API_BASE_URL) {
    this.client = axios.create({
      baseURL,
      timeout: 2000, // 2 seconds timeout
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  setupInterceptors() {
    // Request interceptor to add auth token
    this.client.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('auth_token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor to handle errors
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          // Clear auth data on unauthorized
          localStorage.removeItem('auth_token');
          localStorage.removeItem('user_data');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  async get<T = any>(url: string, config: AxiosRequestConfig = {}): Promise<ApiSuccessResponse<T>> {
    const response = await this.client.get(url, config);
    return response.data;
  }

  async post<T = any>(
    url: string,
    data: any,
    config: AxiosRequestConfig = {}
  ): Promise<ApiSuccessResponse<T>> {
    const response = await this.client.post(url, data, config);
    console.log('🔍 ApiClient POST Response:', response);
    console.log('🔍 ApiClient POST Response.data:', response.data);
    return response as any;
  }

  async put<T = any>(
    url: string,
    data: any,
    config: AxiosRequestConfig = {}
  ): Promise<ApiSuccessResponse<T>> {
    return this.client.put(url, data, config);
  }

  async patch<T = any>(
    url: string,
    data: any,
    config: AxiosRequestConfig = {}
  ): Promise<ApiSuccessResponse<T>> {
    return this.client.patch(url, data, config);
  }

  async delete<T = any>(
    url: string,
    config: AxiosRequestConfig = {}
  ): Promise<ApiSuccessResponse<T>> {
    return this.client.delete(url, config);
  }
}

// Singleton instance
const apiClient = new ApiClient();
export default apiClient;
