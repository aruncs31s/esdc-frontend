/**
 * API Configuration
 * Centralized place to define all API endpoints
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

export const API_ENDPOINTS = {
  // Auth
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
  },

  // Users
  USERS: {
    ALL: '/api/users',
    GET_BY_ID: (id: string | number) => `/users/${id}`,
    CREATE: '/users',
    UPDATE: (id: string | number) => `/users/${id}`,
    DELETE: (id: string | number) => `/users/${id}`,
    PROFILE: '/users/profile',
    SEARCH: '/users/search',
  },

  // Projects
  PROJECTS: {
    ALL: '/projects',
    GET_BY_ID: (id: string | number) => `/projects/${id}`,
    CREATE: '/projects',
    UPDATE: (id: string | number) => `/projects/${id}`,
    DELETE: (id: string | number) => `/projects/${id}`,
    MY_PROJECTS: '/users/projects',
  },

  // Issues
  ISSUES: {
    ALL: '/issues',
    GET_BY_ID: (id: string | number) => `/issues/${id}`,
    CREATE: '/issues',
    UPDATE: (id: string | number) => `/issues/${id}`,
    DELETE: (id: string | number) => `/issues/${id}`,
  },

  // Courses (LMS)
  COURSES: {
    ALL: '/courses',
    GET_BY_ID: (id: string | number) => `/courses/${id}`,
    CREATE: '/courses',
    UPDATE: (id: string | number) => `/courses/${id}`,
    DELETE: (id: string | number) => `/courses/${id}`,
  },

  // Enrollments
  ENROLLMENTS: {
    ALL: '/enrollments',
    GET_BY_ID: (id: string | number) => `/enrollments/${id}`,
    CREATE: '/enrollments',
    DELETE: (id: string | number) => `/enrollments/${id}`,
  },

  // Notifications
  NOTIFICATIONS: {
    ALL: '/notifications',
    GET_BY_ID: (id: string | number) => `/notifications/${id}`,
    MARK_READ: (id: string | number) => `/notifications/${id}/read`,
    MARK_ALL_READ: '/notifications/mark-all-read',
    DELETE: (id: string | number) => `/notifications/${id}`,
  },

  // Admin
  ADMIN: {
    STATS: '/admin/stats',
    USERS: '/admin/users',
    PROJECTS: '/admin/projects',
    REPORTS: '/admin/reports',
  },
};

/**
 * Build complete API URL
 * @param endpoint - The endpoint path
 * @returns Full API URL
 */
export const getApiUrl = (endpoint: string): string => {
  return `${API_BASE_URL}${endpoint}`;
};

/**
 * Get the base API URL
 */
export const getApiBaseUrl = (): string => {
  return API_BASE_URL;
};

export default API_ENDPOINTS;
