import { UserData, LoginCredentials, UserRegisterData } from '@/types/user';
import { AuthTokenData, RegisterResponse } from './auth';
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
