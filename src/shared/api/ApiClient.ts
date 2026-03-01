import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { ApiSuccessResponse } from '@/types';

// Base URL for the API - use environment variable with fallback
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

/**
 * API Client
 * Central HTTP client with interceptors for authentication
 */
export class ApiClient {
  private client: AxiosInstance;
  constructor(baseURL: string = API_BASE_URL) {
    this.client = axios.create({
      baseURL,
      timeout: 30000, // 30 seconds timeout
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

  async get<T = unknown>(
    url: string,
    config: AxiosRequestConfig = {}
  ): Promise<ApiSuccessResponse<T>> {
    const response = await this.client.get<ApiSuccessResponse<T>>(url, config);
    return response.data;
  }

  async post<T = unknown>(
    url: string,
    data: unknown,
    config: AxiosRequestConfig = {}
  ): Promise<ApiSuccessResponse<T>> {
    const response = await this.client.post<ApiSuccessResponse<T>>(url, data, config);
    return response.data;
  }

  async put<T = unknown>(
    url: string,
    data: unknown,
    config: AxiosRequestConfig = {}
  ): Promise<ApiSuccessResponse<T>> {
    const response = await this.client.put<ApiSuccessResponse<T>>(url, data, config);
    return response.data;
  }

  async patch<T = unknown>(
    url: string,
    data: unknown,
    config: AxiosRequestConfig = {}
  ): Promise<ApiSuccessResponse<T>> {
    const response = await this.client.patch<ApiSuccessResponse<T>>(url, data, config);
    return response.data;
  }

  async delete<T = unknown>(
    url: string,
    config: AxiosRequestConfig = {}
  ): Promise<ApiSuccessResponse<T>> {
    const response = await this.client.delete<ApiSuccessResponse<T>>(url, config);
    return response.data;
  }

  /**
   * Helper methods that extract data directly (for new repositories)
   * These methods call the API and return only the inner data, not the ApiSuccessResponse wrapper
   */
  async getData<T>(url: string, config: AxiosRequestConfig = {}): Promise<T> {
    const response = await this.get<T>(url, config);
    return response.data;
  }

  async postData<T>(url: string, data: unknown, config: AxiosRequestConfig = {}): Promise<T> {
    const response = await this.post<T>(url, data, config);
    return response.data;
  }

  async putData<T>(url: string, data: unknown, config: AxiosRequestConfig = {}): Promise<T> {
    const response = await this.put<T>(url, data, config);
    return response.data;
  }

  async patchData<T>(url: string, data: unknown, config: AxiosRequestConfig = {}): Promise<T> {
    const response = await this.patch<T>(url, data, config);
    return response.data;
  }

  async deleteData<T>(url: string, config: AxiosRequestConfig = {}): Promise<T> {
    const response = await this.delete<T>(url, config);
    return response.data;
  }
}

// Singleton instance
const apiClient = new ApiClient();
export default apiClient;
