
/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, useEffect, ReactNode } from 'react';
import { authAPI } from '../services/api';
import { jwtDecode } from 'jwt-decode';
import { RegisterRequest } from '../types';
import { UserData, LoginCredentials } from '../types/user';
import { AuthResponse, DecodedToken, AuthResult } from '../types/auth';
import { AuthContextType } from './AuthContextTypes';
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserData | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  const clearAuth = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
    setUser(null);
    setIsAuthenticated(false);
  };

  const isTokenExpired = (token: string): boolean => {
    try {
      const decoded = jwtDecode<DecodedToken & { exp?: number }>(token);
      if (!decoded.exp) return false; // No expiration set
      
      // Check if token is expired (exp is in seconds, Date.now() is in milliseconds)
      const currentTime = Date.now() / 1000;
      return decoded.exp < currentTime;
    } catch (error) {
      console.error('Error decoding token:', error);
      return true; 
    }
  };

  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      const userData = localStorage.getItem('user_data');
      
      if (token && userData) {
        // Check if token is expired
        if (isTokenExpired(token)) {
          console.log('Token expired, clearing authentication');
          clearAuth();
          return;
        }

        try {
          const parsedUserData = JSON.parse(userData);
          setUser(parsedUserData);
          setIsAuthenticated(true);
        } catch (parseError) {
          console.error('Error parsing user data:', parseError);
          clearAuth();
        }
      } else {
        // No token or user data found
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (err) {
      console.error('Auth check failed:', err);
      clearAuth();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuthStatus();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

 
const login = async (credentials: LoginCredentials): Promise<AuthResult> =>  {
  try {
    const response: AuthResponse = await authAPI.login(credentials);
    if (response.status || response.success && response.data.token) {
      // TODO: Standardize this.
      const token = response.data.token || response.token;
      localStorage.setItem('auth_token', token);

      // Decode the JWT to get claims
      const decoded = jwtDecode<DecodedToken>(token);
      console.log("Decoded JWT:", decoded);
      const userData: UserData = {
        email: decoded.sub,
        username: decoded.username,
        role: decoded.role,
        name: decoded.name
      };
      console.log("User Data:", userData);
      
      // Store user data in localStorage for persistence
      localStorage.setItem('user_data', JSON.stringify(userData));
      
      setUser(userData);
      setIsAuthenticated(true);

      return { success: true };
    } else {
      return { success: false, message: response.message || 'Login failed' };
    }
  } catch (error) {
    console.error('Login error:', error);
    return { 
      success: false, 
      message: error.response?.data?.message || 'Login failed' 
    };
  }
};

  const register = async (userData: RegisterRequest): Promise<AuthResult> => {
    try {
      const response = await authAPI.register(userData);

      if (response.success || response.status) {
        return { success: true, message: response.message };
      } else {
        return { success: false, message: response.message || 'Registration failed' };
      }
    } catch (error) {
      console.error('Registration error:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Registration failed' 
      };
    }
  };

  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_data');
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    register,
    logout,
    checkAuthStatus
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};