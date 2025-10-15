import { User } from '@/domain/entities/User';
import apiClient from './ApiClient';
import { LoginCredentials, UserRegisterData } from '@/types';

export const authAPI = {
  login: async (credentials: LoginCredentials) => {
    const response = await apiClient.post('/api/user/login', credentials);

    // Backend might return token directly in data, or wrapped in success/data
    // Handle both cases
    const responseData: any = response.data || response;
    return responseData;
  },

  register: async (userData: UserRegisterData) => {
    const response = await apiClient.post('/api/user/register', userData);
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
