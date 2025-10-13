/**
 * Shared Constants
 * Application-wide configuration values
 */

export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'https://esdc-backend.onrender.com',
  TIMEOUT: Number(import.meta.env.VITE_API_TIMEOUT) || 30000,
} as const;

export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  USER_DATA: 'user_data',
  THEME: 'theme',
  SETTINGS: 'settings',
} as const;

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  PROFILE: '/profile',
  ADMIN: '/admin',
  PROJECTS: '/projects',
  CHALLENGES: '/challenges',
  EVENTS: '/events',
  RESOURCES: '/resources',
  SHOP: '/shop',
  GAMES: '/games',
} as const;

export const USER_ROLES = {
  ADMIN: 'admin',
  USER: 'user',
  MODERATOR: 'moderator',
} as const;

export const FEATURE_FLAGS = {
  CHATBOT: import.meta.env.VITE_ENABLE_CHATBOT === 'true',
  EVENTS: import.meta.env.VITE_ENABLE_EVENTS === 'true',
  CHALLENGES: import.meta.env.VITE_ENABLE_CHALLENGES === 'true',
  RESOURCES: import.meta.env.VITE_ENABLE_RESOURCES === 'true',
} as const;
