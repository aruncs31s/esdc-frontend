/**
 * Auth Feature - Public API
 */

export { AuthProvider, AuthContext } from './components/AuthContext';
export { default as Login } from './components/Login';
export { default as Register } from './components/Register';
export { default as ProtectedRoute } from './components/ProtectedRoute';
export { useAuth } from './hooks/useAuth';
export { authAPI } from './services/authService';
export type { AuthContextType } from './types';
