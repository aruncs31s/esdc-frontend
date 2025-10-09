import type { 
    User,
    RegisterRequest,
    LoginRequest,
    ApiSuccessResponse,
} from '../types/index';

import api from './api';

export const createUser = async (user: RegisterRequest): Promise<ApiSuccessResponse<string>> => {
  const { data } = await api.post<ApiSuccessResponse<string>>('/user/register', user);
  return data;
};
export const loginUser = async (user: LoginRequest): Promise<ApiSuccessResponse<User>> => {
  const { data } = await api.post<ApiSuccessResponse<User>>('/user/login', user);
  return data;
}
