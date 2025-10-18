import { RegisterRequest } from './user';

// For JWT
export interface DecodedToken {
  sub: string; // email
  username: string;
  role: string;
  exp?: number;
  name?: string;
}

// export interface AuthResponse {
//   success: boolean;
//   message?: string;
//   data?: any;
//   status?: boolean;
// }

export interface AuthTokenData {
  token: string;
}

export interface AuthResult<T> {
  success: boolean;
  message?: string;
  data?: T;
  meta?: string;
}
export interface RegisterResponse {
  success: boolean;
  meta?: string;
  data?: RegisterRequest;
  message?: string;
}
