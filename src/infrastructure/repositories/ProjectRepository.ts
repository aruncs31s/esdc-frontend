import { IProjectRepository } from '../../domain/repositories/IProjectRepository.js';
import { Project } from '../../domain/entities/Project.js';
import apiClient from '../api/ApiClient.js';
import { ProjectCreateData } from '@/types/project.js';

/**
 * Project Repository Implementation
 * Handles project data persistence via API
 */
export class ProjectRepository implements IProjectRepository {
  private api: typeof apiClient;

  constructor(client = apiClient) {
    this.api = client;
  }

  /**
   * Find all projects with optional filters
   */
  async findAll(_filters: Record<string, unknown> = {}): Promise<Project[]> {
    try {
      const response = await this.api.get<Project[]>(`/api/projects`);
      const data = response.data || [];
      return Project.fromAPIArray(data);
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
      const response = await this.api.get<Project>(`/api/projects/${id}`);
      const data = response.data;
      return Project.fromAPI(data);
    } catch (error) {
      console.error(`Error fetching project ${id}:`, error);
      return null;
    }
  }

  /**
   * Find projects by user ID
   */
  async findByUserId(userId: string): Promise<Project[]> {
    try {
      const response = await this.api.get<Project[]>(`/api/projects?user_id=${userId}`);
      const data = response.data || [];
      return Project.fromAPIArray(data);
    } catch (error) {
      console.error(`Error fetching projects for user ${userId}:`, error);
      return [];
    }
  }

  /**
   * Find projects by status
   */
  async findByStatus(status: string): Promise<Project[]> {
    try {
      const response = await this.api.get<Project[]>(`/api/projects?status=${status}`);
      const data = response.data || [];
      return Project.fromAPIArray(data);
    } catch (error) {
      console.error(`Error fetching projects by status ${status}:`, error);
      return [];
    }
  }

  /**
   * Save project (create or update)
   */
  async save(project: Project): Promise<Project> {
    try {
      if (project.id) {
        const response = await this.api.put<Project>(
          `/api/projects/${project.id}`,
          project.toJSON()
        );
        const data = response.data;
        return Project.fromAPI(data);
      } else {
        const response = await this.api.post<Project>('/api/projects', project.toJSON());
        const data = response.data;
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
  async delete(id: string): Promise<boolean> {
    try {
      await this.api.delete(`/api/projects/${id}`);
      return true;
    } catch (error) {
      console.error(`Error deleting project ${id}:`, error);
      throw error;
    }
  }

  /**
   * Count total projects
   */
  async count(): Promise<number> {
    try {
      const projects = await this.findAll();
      return projects.length;
    } catch (error) {
      console.error('Error counting projects:', error);
      return 0;
    }
  }

  /**
   * Create project (convenience method)
   */
  async createProject(project: ProjectCreateData): Promise<Project> {
    try {
      const response = await this.api.post<Project>(`/api/projects`, project);
      const data = response.data;
      return Project.fromAPI(data);
    } catch (error) {
      console.error('Error creating project:', error);
      throw error;
    }
  }
}

// Singleton instance
const projectRepository: ProjectRepository = new ProjectRepository();

export default projectRepository;
