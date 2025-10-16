import { RegisterRequest } from './user';

// For JWT
export interface DecodedToken {
  sub: string; // email
  username: string;
  role: string;
  exp?: number;
  name?: string;
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  data?: any;
  status?: boolean;
  token?: string;
}

export interface AuthResult {
  success: boolean;
  message?: string;
  data?: any;
}
export interface RegisterResponse {
  success: boolean;
  meta?: string;
  data?: RegisterRequest;
  message?: string;
}
