import axios from 'axios';
import type {
  Task,
  Milestone,
  ProjectTimeline,
  TeamMember,
  ProjectResource,
  ProjectActivity,
} from '@/types/project-planning';

const API_BASE = '/api';

export const projectPlanningApi = {
  // Tasks
  getTasks: async (projectId: number): Promise<Task[]> => {
    const { data } = await axios.get(`${API_BASE}/projects/${projectId}/tasks`);
    return data;
  },

  createTask: async (projectId: number, task: Partial<Task>): Promise<Task> => {
    const { data } = await axios.post(`${API_BASE}/projects/${projectId}/tasks`, task);
    return data;
  },

  updateTask: async (projectId: number, taskId: number, updates: Partial<Task>): Promise<Task> => {
    const { data } = await axios.put(`${API_BASE}/projects/${projectId}/tasks/${taskId}`, updates);
    return data;
  },

  deleteTask: async (projectId: number, taskId: number): Promise<void> => {
    await axios.delete(`${API_BASE}/projects/${projectId}/tasks/${taskId}`);
  },

  // Milestones
  getMilestones: async (projectId: number): Promise<Milestone[]> => {
    const { data } = await axios.get(`${API_BASE}/projects/${projectId}/milestones`);
    return data;
  },

  createMilestone: async (projectId: number, milestone: Partial<Milestone>): Promise<Milestone> => {
    const { data } = await axios.post(`${API_BASE}/projects/${projectId}/milestones`, milestone);
    return data;
  },

  updateMilestone: async (
    projectId: number,
    milestoneId: number,
    updates: Partial<Milestone>
  ): Promise<Milestone> => {
    const { data } = await axios.put(
      `${API_BASE}/projects/${projectId}/milestones/${milestoneId}`,
      updates
    );
    return data;
  },

  deleteMilestone: async (projectId: number, milestoneId: number): Promise<void> => {
    await axios.delete(`${API_BASE}/projects/${projectId}/milestones/${milestoneId}`);
  },

  // Timeline
  getTimeline: async (projectId: number): Promise<ProjectTimeline> => {
    const { data } = await axios.get(`${API_BASE}/projects/${projectId}/timeline`);
    return data;
  },

  // Team
  getTeamMembers: async (projectId: number): Promise<TeamMember[]> => {
    const { data } = await axios.get(`${API_BASE}/projects/${projectId}/team`);
    return data;
  },

  addTeamMember: async (
    projectId: number,
    member: { user_id: number; role: string; permissions: string[] }
  ): Promise<TeamMember> => {
    const { data } = await axios.post(`${API_BASE}/projects/${projectId}/team`, member);
    return data;
  },

  updateTeamMember: async (
    projectId: number,
    memberId: number,
    updates: Partial<TeamMember>
  ): Promise<TeamMember> => {
    const { data } = await axios.put(`${API_BASE}/projects/${projectId}/team/${memberId}`, updates);
    return data;
  },

  removeTeamMember: async (projectId: number, memberId: number): Promise<void> => {
    await axios.delete(`${API_BASE}/projects/${projectId}/team/${memberId}`);
  },

  // Resources
  getResources: async (projectId: number): Promise<ProjectResource[]> => {
    const { data } = await axios.get(`${API_BASE}/projects/${projectId}/resources`);
    return data;
  },

  addResource: async (
    projectId: number,
    resource: Partial<ProjectResource>
  ): Promise<ProjectResource> => {
    const { data } = await axios.post(`${API_BASE}/projects/${projectId}/resources`, resource);
    return data;
  },

  deleteResource: async (projectId: number, resourceId: number): Promise<void> => {
    await axios.delete(`${API_BASE}/projects/${projectId}/resources/${resourceId}`);
  },

  // Activity
  getActivity: async (projectId: number, limit = 50): Promise<ProjectActivity[]> => {
    const { data } = await axios.get(`${API_BASE}/projects/${projectId}/activity`, {
      params: { limit },
    });
    return data;
  },
};
