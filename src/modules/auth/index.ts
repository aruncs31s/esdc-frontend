/**
 * Auth Module - Public API
 * Centralized exports for authentication functionality
 */

// Components
export { default as Login } from './Login';
export { default as Register } from './Register';
export { default as ProtectedRoute } from './ProtectedRoute';

// Context & Provider
export { AuthContext, AuthProvider } from './AuthContext';
export type { AuthContextType } from './AuthContextTypes';

// Hooks
export { useAuth } from './useAuth';

// API
export { authAPI } from './auth';

// Types
export type {
  RegisterResponse,
  LoginResponse,
  DecodedToken,
  AuthTokenData,
  AuthResult,
} from './auth';
