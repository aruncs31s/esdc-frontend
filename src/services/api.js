import axios from 'axios';

const API_BASE_URL = import.meta.env.DEV ? '/api' : (import.meta.env.VITE_BACKEND_URL || 'http://localhost:8080');

// Create axios instance with default config
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add auth token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('auth_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor to handle errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Clear auth data on unauthorized
            localStorage.removeItem('auth_token');
            localStorage.removeItem('user_data');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// Auth API calls
export const authAPI = {
    login: async(credentials) => {
        const response = await api.post('/user/login', credentials);
        return response.data;
    },

    register: async(userData) => {
        const response = await api.post('/user/register', userData);
        return response.data;
    },

    logout: async() => {
        const response = await api.post('/user/logout');
        return response.data;
    },

    getProfile: async() => {
        const response = await api.get('/user/profile');
        return response.data;
    }
};

// User API calls
export const userAPI = {
    getChallenges: async() => {
        const response = await api.get('/user/challenges');
        return response.data;
    },

    getSubmissions: async() => {
        const response = await api.get('/user/submissions');
        return response.data;
    },

    syncRepository: async() => {
        const response = await api.post('/user/sync-repo');
        return response.data;
    }
};

export default api;