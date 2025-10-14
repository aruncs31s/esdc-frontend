import { ProjectData, ProjectDataForAdmin } from '@/types/project';
import { Project } from '../../domain/entities/Project';
import apiClient from '../api/ApiClient';
import { IAdminRepository } from '@/domain/repositories/IAdminRepository';
import { ApiSuccessResponse, statsForAdmin } from '@/types';
import { UserDataForAdmin, UserRegisterDataByAdmin } from '@/types/user';
/**
 * Admin Repository Implementation v0.0.1
 * Handles admin data persistence via API
 */

export class AdminRepository extends IAdminRepository {
  private api: typeof apiClient;

  constructor(client = apiClient) {
    super();
    this.api = client;
  }

  /**
   * Find all projects with optional filters
   */
  async findAllProjects(_filters = {}): Promise<ProjectDataForAdmin[]> {
    try {
      // const params = new URLSearchParams(filters);
      const response: ApiSuccessResponse<ProjectDataForAdmin[]> =
        await this.api.get(`/api/admin/projects`);
      const data = response.data || [];
      console.log('Projects fetched from API:', data);
      return data;
      // return data.map(item => ({
      //   id: item.id,
      //   title: item.title,
      //   created_by: item.created_by,
      //   status: item.status
      // })) as ProjectDataForAdmin[];
    } catch (error) {
      console.error('Error fetching projects:', error);
      return [];
    }
  }

  /**
   * Find project by ID
   */
  async findById(id: string): Promise<Project | null> {
    try {
      const response = await this.api.get(`/api/projects/${id}`);

      const data = response.data?.data || response.data;
      console.log(`Project ${id} fetched from API:`, data);
      return Project.fromAPI(data);
    } catch (error) {
      console.error(`Error fetching project ${id}:`, error);
      return null;
    }
  }

  /**
   * Find projects by user ID
   */
  async findByUserId(userId: string) {
    try {
      const response = await this.api.get(`/api/admin/projects?user_id=${userId}`);
      const data = response.data?.data || response.data || [];
      return Project.fromAPIArray(data);
    } catch (error) {
      console.error(`Error fetching projects for user ${userId}:`, error);
      return [];
    }
  }

  /**
   * Find projects by status
   */
  async findByStatus(status: string) {
    try {
      const response = await this.api.get(`/api/admin/projects?status=${status}`);
      const data = response.data?.data || response.data || [];
      return Project.fromAPIArray(data);
    } catch (error) {
      console.error(`Error fetching projects by status ${status}:`, error);
      return [];
    }
  }

  /**
   * Save project (create or update)
   */
  async saveProject(project: any) {
    try {
      if (project.id) {
        // Update existing project
        const response = await this.api.put(`/api/admin/projects/${project.id}`, project.toJSON());
        const data = response.data?.data || response.data;
        return Project.fromAPI(data);
      } else {
        // Create new project
        const response = await this.api.post('/api/admin/projects', project.toJSON());
        const data = response.data?.data || response.data;
        return Project.fromAPI(data);
      }
    } catch (error) {
      console.error('Error saving project:', error);
      throw error;
    }
  }

  /**
   * Delete project by ID
   */
  async deleteProject(id: string) {
    try {
      await this.api.delete(`/api/admin/projects/${id}`);
      return true;
    } catch (error) {
      console.error(`Error deleting project ${id}:`, error);
      throw error;
    }
  }

  /**
   * Count total projects
   */
  async countProjects() {
    try {
      const projects = await this.findAllProjects();
      return projects.length;
    } catch (error) {
      console.error('Error counting projects:', error);
      return 0;
    }
  }

  async getAdminStats(_filters = {}): Promise<statsForAdmin> {
    try {
      // const params = new URLSearchParams(filters);
      const response: ApiSuccessResponse<statsForAdmin> = await this.api.get(`/api/admin/projects`);
      const data = response.data || [];
      return data;
    } catch (error) {
      console.error('Error fetching admin stats:', error);
      return {
        total_users: 0,
        total_projects: 0,
        active_users: 0,
      };
    }
  }
  async findAllUsers(_filters = {}): Promise<UserDataForAdmin[]> {
    try {
      // const params = new URLSearchParams(filters);
      const response: ApiSuccessResponse<UserDataForAdmin[]> =
        await this.api.get(`/api/admin/users`);
      const data = response.data || [];
      console.log('Users fetched from API:', data);
      return data;
    } catch (error) {
      console.error('Error fetching users:', error);
      return [];
    }
  }
  async createUser(userData: UserRegisterDataByAdmin): Promise<any> {
    try {
      const response: ApiSuccessResponse<{ message: string }> = await this.api.post(
        '/api/admin/users',
        userData
      );
      return response.data;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }
  async createProject(userId: string, projectData: ProjectData): Promise<any> {
    try {
      const response: ApiSuccessResponse<{ message: string }> = await this.api.post(
        '/api/admin/projects',
        { user_id: userId, ...projectData }
      );
      return response.data;
    } catch (error) {
      console.error('Error creating project:', error);
      throw error;
    }
  }
}
// Singleton instance
const adminRepository = new AdminRepository();

export default adminRepository;
