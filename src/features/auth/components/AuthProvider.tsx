/**
 * Auth Provider - Migrated from contexts
 * Manages authentication state and operations
 */
/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, useEffect, ReactNode, useContext } from 'react';
import { jwtDecode } from 'jwt-decode';
import { UserData, LoginCredentials, UserRegisterData } from '@/types/user';
import { DecodedToken, AuthTokenData, RegisterResponse } from '@/types/auth';
import { ApiSuccessResponse } from '@/types';
import { AuthContextType } from '@/contexts/AuthContextTypes';
import { applicationService } from '@/application';

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
      if (!decoded.exp) return false;

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

  const login = async (
    credentials: LoginCredentials
  ): Promise<ApiSuccessResponse<AuthTokenData>> => {
    try {
      const response = await applicationService.login(credentials);
      if (response.status || (response.success && response.data.token)) {
        const token = response.data.token || response.token;
        localStorage.setItem('auth_token', token);

        const decoded = jwtDecode<DecodedToken>(token);
        const userData: UserData = {
          email: decoded.sub,
          username: decoded.username,
          role: decoded.role,
          name: decoded.name,
        };

        localStorage.setItem('user_data', JSON.stringify(userData));
        setUser(userData);
        setIsAuthenticated(true);

        return {
          success: true as const,
          data: { token },
          meta: new Date().toISOString(),
        };
      }

      throw new Error(response.message || 'Login failed');
    } catch (err: any) {
      console.error('Login error:', err);
      throw new Error(err.response?.data?.message || 'Login failed. Please try again.');
    }
  };

  const register = async (registerData: UserRegisterData): Promise<RegisterResponse> => {
    try {
      const response = await applicationService.register(registerData);

      if (response.success && response.data.token) {
        const token = response.data.token;
        localStorage.setItem('auth_token', token);

        const decoded = jwtDecode<DecodedToken>(token);
        const userData: UserData = {
          email: decoded.sub,
          username: decoded.username,
          role: decoded.role,
          name: decoded.name,
        };

        localStorage.setItem('user_data', JSON.stringify(userData));
        setUser(userData);
        setIsAuthenticated(true);

        return {
          success: true,
          meta: new Date().toISOString(),
          data: registerData, // The original register data
          message: 'Registration successful!',
        };
      }

      return {
        success: false,
        message: response.message || 'Registration failed',
      };
    } catch (err: any) {
      console.error('Register error:', err);
      return {
        success: false,
        message: err.response?.data?.message || 'Registration failed. Please try again.',
      };
    }
  };

  const logout = async () => {
    clearAuth();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        loading,
        login,
        register,
        logout,
        checkAuthStatus,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Export the hook
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
