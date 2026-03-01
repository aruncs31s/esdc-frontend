import { UserData, LoginCredentials, UserRegisterData } from '@/types/user';
import { ApiSuccessResponse } from '@/types';

export interface AuthTokenData {
  token: string;
  user: any;
}

export interface RegisterResponse {
  success?: boolean;
  status?: boolean;
  message?: string;
  meta?: string;
  data?: {
    token?: string;
  };
}

export interface AuthContextType {
  user: UserData | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (credentials: LoginCredentials) => Promise<ApiSuccessResponse<AuthTokenData>>;
  register: (userData: UserRegisterData) => Promise<RegisterResponse>;
  logout: () => Promise<void>;
  checkAuthStatus: () => Promise<void>;
}
