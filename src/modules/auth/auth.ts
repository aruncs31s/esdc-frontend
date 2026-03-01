import { User } from '@/domain/entities/User';
import apiClient from '@/infrastructure/api/ApiClient';
import { LoginCredentials, UserRegisterData } from '@/types';

export interface RegisterResponse {
  success?: boolean;
  status?: boolean;
  message?: string;
  meta?: string;
  data?: {
    token?: string;
  };
}

export interface LoginResponse {
  token?: string;
  meta?: string;
  data?: {
    token?: string;
  };
}

export interface DecodedToken {
  id: string;
  email: string;
  sub?: string;
  username?: string;
  name?: string;
  role: string;
  exp: number;
}

export interface AuthTokenData {
  token: string;
  user: any;
}

export interface AuthResult {
  success: boolean;
  token?: string;
  user?: any;
  message?: string;
}

export const authAPI = {
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    const response = await apiClient.post<LoginResponse>('/api/user/login', credentials);

    // Backend might return token directly in data, or wrapped in success/data
    // Handle both cases
    const responseData = response.data || response;
    return responseData as LoginResponse;
  },

  register: async (userData: UserRegisterData): Promise<RegisterResponse> => {
    const response = await apiClient.post<RegisterResponse>('/api/user/register', userData);
    return response.data;
  },

  logout: async () => {
    const response = await apiClient.post('/user/logout', {});
    return response.data;
  },

  getProfile: async (): Promise<User> => {
    const response = await apiClient.get('/api/user/profile');
    // Convert to User model instance
    return User.fromAPI(response.data);
  },
};
