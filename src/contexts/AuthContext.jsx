
/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';
import { jwtDecode } from 'jwt-decode';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  const clearAuth = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
    setUser(null);
    setIsAuthenticated(false);
  };

  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      const userData = localStorage.getItem('user_data');
      
      if (token && userData) {
        const parsedUserData = JSON.parse(userData);
        setUser(parsedUserData);
        setIsAuthenticated(true);
        
        // Verify token with backend (optional - only clears if 401/403)
        try {
          const profile = await authAPI.getProfile();
          if (profile.user) {
            setUser(profile.user);
            // Update stored user data with fresh data from backend
            localStorage.setItem('user_data', JSON.stringify(profile.user));
          }
        } catch (err) {
          console.error('Token verification failed:', err);
          // Only clear auth if it's an authentication error (401/403)
          if (err.response?.status === 401 || err.response?.status === 403) {
            clearAuth();
          }
          // For other errors (network issues, etc.), keep the user logged in locally
        }
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

 
const login = async (credentials) => {
  try {
    const response = await authAPI.login(credentials);
    if (response.status && response.data.token) {
      const token = response.data.token;
      localStorage.setItem('auth_token', token);

      // Decode the JWT to get claims
      const decoded = jwtDecode(token);
      console.log("Decoded JWT:", decoded);
      const userData = {
        email: decoded.sub,
        username: decoded.user,
        role: decoded.role
      };
      
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

  const register = async (userData) => {
    try {
      const response = await authAPI.register(userData);
      
      if (response.success) {
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