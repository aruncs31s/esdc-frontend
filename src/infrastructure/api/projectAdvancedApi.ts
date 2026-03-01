import axios from 'axios';
import type {
  TrendingProject,
  RecommendedProject,
  ProjectAnalytics,
  PlatformAnalytics,
  ProjectTemplate,
  ProjectNotification,
  ExportedProject,
  PortfolioExport,
} from '@/types/project-advanced';

const API_BASE = '/api';

export const projectAdvancedApi = {
  // Trending & Recommendations
  getTrending: async (limit = 10, offset = 0): Promise<TrendingProject[]> => {
    const { data } = await axios.get(`${API_BASE}/public/projects/trending`, {
      params: { limit, offset },
    });
    return data;
  },

  getRecommendations: async (limit = 10, offset = 0): Promise<RecommendedProject[]> => {
    const { data } = await axios.get(`${API_BASE}/projects/recommendations`, {
      params: { limit, offset },
    });
    return data;
  },

  getSimilar: async (id: number, limit = 10, offset = 0): Promise<any[]> => {
    const { data } = await axios.get(`${API_BASE}/public/projects/${id}/similar`, {
      params: { limit, offset },
    });
    return data;
  },

  // Analytics
  getProjectAnalytics: async (id: number): Promise<ProjectAnalytics> => {
    const { data } = await axios.get(`${API_BASE}/projects/${id}/analytics`);
    return data;
  },

  getPlatformAnalytics: async (): Promise<PlatformAnalytics> => {
    const { data } = await axios.get(`${API_BASE}/public/projects/analytics/platform`);
    return data;
  },

  // Templates
  createTemplate: async (payload: {
    project_id: number;
    name: string;
    description: string;
    is_public: boolean;
  }): Promise<ProjectTemplate> => {
    const { data } = await axios.post(`${API_BASE}/projects/templates`, payload);
    return data;
  },

  getPublicTemplates: async (limit = 20, offset = 0): Promise<ProjectTemplate[]> => {
    const { data } = await axios.get(`${API_BASE}/public/projects/templates`, {
      params: { limit, offset },
    });
    return data;
  },

  getUserTemplates: async (): Promise<ProjectTemplate[]> => {
    const { data } = await axios.get(`${API_BASE}/projects/templates/user`);
    return data;
  },

  getTemplate: async (id: number): Promise<ProjectTemplate> => {
    const { data } = await axios.get(`${API_BASE}/projects/templates/${id}`);
    return data;
  },

  deleteTemplate: async (id: number): Promise<void> => {
    await axios.delete(`${API_BASE}/projects/templates/${id}`);
  },

  createFromTemplate: async (payload: {
    template_id: number;
    title: string;
    description: string;
    github_link?: string;
  }): Promise<any> => {
    const { data } = await axios.post(`${API_BASE}/projects/from-template`, payload);
    return data;
  },

  // Notifications
  getNotifications: async (): Promise<ProjectNotification[]> => {
    const { data } = await axios.get(`${API_BASE}/projects/notifications`);
    return data;
  },

  markAsRead: async (id: number): Promise<void> => {
    await axios.post(`${API_BASE}/projects/notifications/${id}/read`);
  },

  markAllAsRead: async (): Promise<void> => {
    await axios.post(`${API_BASE}/projects/notifications/read-all`);
  },

  deleteNotification: async (id: number): Promise<void> => {
    await axios.delete(`${API_BASE}/projects/notifications/${id}`);
  },

  // Export
  exportProject: async (
    id: number,
    format: 'json' | 'pdf',
    includeStats = false
  ): Promise<ExportedProject | Blob> => {
    const { data } = await axios.get(`${API_BASE}/projects/${id}/export`, {
      params: { format, include_stats: includeStats },
      responseType: format === 'pdf' ? 'blob' : 'json',
    });
    return data;
  },

  exportPortfolio: async (
    format: 'json' | 'pdf',
    includeStats = false
  ): Promise<PortfolioExport | Blob> => {
    const { data } = await axios.get(`${API_BASE}/projects/portfolio/export`, {
      params: { format, include_stats: includeStats },
      responseType: format === 'pdf' ? 'blob' : 'json',
    });
    return data;
  },
};
