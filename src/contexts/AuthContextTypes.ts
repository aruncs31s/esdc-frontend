import { UserData , LoginCredentials, UserRegisterData } from '../types/user';
import { AuthResult } from '../types/auth';


export interface AuthContextType {
  user: UserData | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (credentials: LoginCredentials) => Promise<AuthResult>;
  register: (userData: UserRegisterData) => Promise<AuthResult>;
  logout: () => Promise<void>;
  checkAuthStatus: () => Promise<void>;
}