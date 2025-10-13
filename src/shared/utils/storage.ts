/**
 * Local Storage Utilities
 */
import { STORAGE_KEYS } from '@/shared/constants';
import { safeJsonParse } from './index';

export const storage = {
  /**
   * Get item from localStorage
   */
  get: <T = any>(key: string, fallback: T | null = null): T | null => {
    try {
      const item = localStorage.getItem(key);
      if (!item) return fallback;
      return safeJsonParse(item, fallback);
    } catch {
      return fallback;
    }
  },

  /**
   * Set item in localStorage
   */
  set: (key: string, value: any): void => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  },

  /**
   * Remove item from localStorage
   */
  remove: (key: string): void => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Error removing from localStorage:', error);
    }
  },

  /**
   * Clear all localStorage
   */
  clear: (): void => {
    try {
      localStorage.clear();
    } catch (error) {
      console.error('Error clearing localStorage:', error);
    }
  },

  // Typed helpers for common keys
  auth: {
    getToken: (): string | null => storage.get(STORAGE_KEYS.AUTH_TOKEN),
    setToken: (token: string): void => storage.set(STORAGE_KEYS.AUTH_TOKEN, token),
    removeToken: (): void => storage.remove(STORAGE_KEYS.AUTH_TOKEN),
    
    getUserData: <T = any>(): T | null => storage.get(STORAGE_KEYS.USER_DATA),
    setUserData: (data: any): void => storage.set(STORAGE_KEYS.USER_DATA, data),
    removeUserData: (): void => storage.remove(STORAGE_KEYS.USER_DATA),
  },
};
