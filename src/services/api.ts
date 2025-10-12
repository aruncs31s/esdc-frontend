import axios, { AxiosInstance } from 'axios';
import User from '../models/user';

interface LoginCredentials {
    email: string;
    password: string;
}

interface RegisterData {
    name: string;
    username: string;
    email: string;
    password: string;
}

// Create axios instance
const api: AxiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:9090',
    // baseURL: import.meta.env.VITE_API_URL || 'https://esdc-backend.onrender.com',
    timeout: 10000, // 10 seconds timeout
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
        // Don't automatically redirect - let AuthContext handle authentication
        // Just log the error for debugging
        if (error.response?.status === 401) {
            console.warn('Unauthorized request - token may be invalid or expired');
        }
        return Promise.reject(error);
    }
);

// Auth API calls
export const authAPI = {
    login: async(credentials: LoginCredentials) => {
        const response = await api.post('/api/user/login', credentials);
        return response.data
    },

    register: async(userData: RegisterData) => {
        const response = await api.post('/api/user/register', userData);
        return response.data;
    },

    logout: async() => {
        const response = await api.post('/user/logout');
        return response.data;
    },

    getProfile: async(): Promise<User> => {
        const response = await api.get('/api/user/profile');
        // Convert to User model instance
        return User.fromAPI(response.data);
    }
};

// User API calls
export const userAPI = {
    getChallenges: async(): Promise<any[]> => {
        const response = await api.get('/api/user/challenges');
        return Array.isArray(response.data) ? response.data : [];
    },

    getSubmissions: async(): Promise<any> => {
        const response = await api.get('/user/submissions');
        return response.data;
    },

    syncRepository: async(): Promise<any> => {
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

// Chat API calls
export const chatAPI = {
    getMessages: async(limit = 50) => {
        const response = await api.get(`/api/chat/messages?limit=${limit}`);
        return response.data;
    },

    sendMessage: async(messageData: { text: string }) => {
        const response = await api.post('/api/chat/messages', messageData);
        return response.data;
    }
};

// Analytics API calls
export const analyticsAPI = {
    getStats: async() => {
        try {
            const response = await api.get('/api/analytics/stats');
            const data = response.data?.data || response.data || {};
            return {
                totalPageViews: data.total_page_views || data.totalPageViews || 0,
                totalDownloads: data.total_downloads || data.totalDownloads || 0,
                totalViews: data.total_views || data.totalViews || 0,
                activeUsers: data.active_users || data.activeUsers || 0,
                serverUptime: data.server_uptime || data.serverUptime || 0,
                totalResources: data.total_resources || data.totalResources || 0,
                totalProjects: data.total_projects || data.totalProjects || 0,
                totalChallenges: data.total_challenges || data.totalChallenges || 0
            };
        } catch (error) {
            console.error('Error fetching analytics stats:', error);
            // Return mock data if API fails
            return {
                totalPageViews: 15420,
                totalDownloads: 3240,
                totalViews: 8930,
                activeUsers: 127,
                serverUptime: 2592000, // 30 days in seconds
                totalResources: 45,
                totalProjects: 23,
                totalChallenges: 18
            };
        }
    },

    getTopResources: async(limit = 10) => {
        try {
            const response = await api.get(`/api/analytics/resources/top?limit=${limit}`);
            const data = response.data?.data || response.data || [];
            return Array.isArray(data) ? data : [];
        } catch (error) {
            console.error('Error fetching top resources:', error);
            // Return mock data if API fails
            return [
                { title: 'Arduino Basics Tutorial', view_count: 1250, download_count: 450 },
                { title: 'Raspberry Pi Projects Guide', view_count: 980, download_count: 320 },
                { title: 'IoT Sensor Integration', view_count: 875, download_count: 290 },
                { title: 'Python for Hardware', view_count: 720, download_count: 240 },
                { title: 'Circuit Design Principles', view_count: 650, download_count: 210 }
            ];
        }
    },

    getTrafficStats: async() => {
        try {
            const response = await api.get('/api/analytics/traffic');
            const data = response.data?.data || response.data || {};
            return {
                daily: data.daily || 0,
                weekly: data.weekly || 0,
                monthly: data.monthly || 0
            };
        } catch (error) {
            console.error('Error fetching traffic stats:', error);
            // Return mock data if API fails
            return {
                daily: 523,
                weekly: 3450,
                monthly: 15420
            };
        }
    }
};

export default api;