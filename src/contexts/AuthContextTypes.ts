import { UserData, LoginCredentials, UserRegisterData } from '../types/user';
import { AuthTokenData, RegisterResponse } from '../types/auth';
import { ApiSuccessResponse } from '@/types';

export interface AuthContextType {
  user: UserData | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (credentials: LoginCredentials) => Promise<ApiSuccessResponse<AuthTokenData>>;
  register: (userData: UserRegisterData) => Promise<RegisterResponse>;
  logout: () => Promise<void>;
  checkAuthStatus: () => Promise<void>;
}
