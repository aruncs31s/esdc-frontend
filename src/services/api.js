import axios from 'axios';
import User from '../models/user';

// const API_BASE_URL = 'http://localhost:9999';

const API_BASE_URL = 'https://esdc-backend.onrender.com';

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
        const response = await api.post('/api/user/login', credentials);
        return response.data
    },

    register: async(userData) => {
        const response = await api.post('/api/user/register', userData);
        return response.data;
    },

    logout: async() => {
        const response = await api.post('/user/logout');
        return response.data;
    },

    getProfile: async() => {
        const response = await api.get('/api/user/profile');
        // Convert to User model instance
        return User.fromAPI(response.data);
    }
};

// User API calls
export const userAPI = {
    getChallenges: async() => {
        const response = await api.get('/api/user/challenges');
        return Array.isArray(response.data) ? response.data : [];
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



// Admin API calls
export const adminAPI = {
    // Stats
    getStats: async() => {
        try {
            const response = await api.get('/api/admin/stats');
            const data = response.data?.data || {};
            return {
                totalUsers: data.total_users || 0,
                totalProjects: data.total_projects || 0,
                totalChallenges: data.total_challenges || 0,
                activeUsers: data.active_users || 0
            };
        } catch (error) {
            console.error('Error fetching stats:', error);
            // Return mock data if API fails
            return {
                totalUsers: 0,
                totalProjects: 0,
                totalChallenges: 0,
                activeUsers: 0
            };
        }
    },

    // Users Management
    getUsers: async() => {
        try {
            const response = await api.get('/api/admin/users');
            const data = response.data.data;
            console.log("Fetched users data:", data);
            // Convert raw API data to User model instances
            return User.fromAPIArray(data);
        } catch (error) {
            console.error('Error fetching users:', error);
            return [];
        }
    },

    createUser: async(userData) => {
        // If userData is a User instance, convert to JSON
        const payload = userData instanceof User ? userData.toJSON() : userData;
        const response = await api.post('/api/admin/users', payload);
        return User.fromAPI(response.data);
    },

    deleteUser: async(userId) => {
        const response = await api.delete(`/api/admin/users/${userId}`);
        return response.data;
    },

    updateUser: async(userId, userData) => {
        // If userData is a User instance, convert to JSON
        const payload = userData instanceof User ? userData.toJSON() : userData;
        const response = await api.put(`/api/admin/users/${userId}`, payload);
        return User.fromAPI(response.data);
    },

    // Projects Management
    getProjects: async() => {
        try {
            const response = await api.get('/api/admin/projects');
            return Array.isArray(response.data) ? response.data : [];
        } catch (error) {
            console.error('Error fetching projects:', error);
            // Return mock data if API fails
            return [
                { 
                    id: 1, 
                    title: 'IoT Weather Station', 
                    description: 'Build a weather monitoring system with Arduino',
                    status: 'active',
                    createdAt: new Date().toISOString()
                },
                { 
                    id: 2, 
                    title: 'Smart Home Automation', 
                    description: 'Control home appliances using ESP32',
                    status: 'active',
                    createdAt: new Date().toISOString()
                }
            ];
        }
    },

    createProject: async(projectData) => {
        const response = await api.post('/api/admin/projects', projectData);
        return response.data;
    },

    deleteProject: async(projectId) => {
        const response = await api.delete(`/api/admin/projects/${projectId}`);
        return response.data;
    },

    updateProject: async(projectId, projectData) => {
        const response = await api.put(`/api/admin/projects/${projectId}`, projectData);
        return response.data;
    },

    // Challenges Management
    getChallenges: async() => {
        try {
            const response = await api.get('/api/admin/challenges');
            return Array.isArray(response.data) ? response.data : [];
        } catch (error) {
            console.error('Error fetching challenges:', error);
            // Return mock data if API fails
            return [
                { 
                    id: 1, 
                    title: 'LED Blink Challenge', 
                    difficulty: 'Easy',
                    points: 10,
                    status: 'active'
                },
                { 
                    id: 2, 
                    title: 'Motor Control Challenge', 
                    difficulty: 'Medium',
                    points: 25,
                    status: 'active'
                },
                { 
                    id: 3, 
                    title: 'Advanced Robotics', 
                    difficulty: 'Hard',
                    points: 50,
                    status: 'active'
                }
            ];
        }
    },

    createChallenge: async(challengeData) => {
        const response = await api.post('/api/admin/challenges', challengeData);
        return response.data;
    },

    deleteChallenge: async(challengeId) => {
        const response = await api.delete(`/api/admin/challenges/${challengeId}`);
        return response.data;
    },

    updateChallenge: async(challengeId, challengeData) => {
        const response = await api.put(`/api/admin/challenges/${challengeId}`, challengeData);
        return response.data;
    }
};

export default api;