import { IProjectRepository } from '../../domain/repositories/IProjectRepository.js';
import { Project } from '../../domain/entities/Project.js';
import apiClient from '../api/ApiClient.js';
import { ProjectDTO } from '../../dto/project_dto.js';

/**
 * Project Repository Implementation
 * Handles project data persistence via API
 */
export class ProjectRepository extends IProjectRepository {
  private api: typeof apiClient;

  constructor(client = apiClient) {
    super();
    this.api = client;
  }

  /**
   * Find all projects with optional filters
   */
  async findAll(filters = {}): Promise<ProjectDTO[]> {
    try {
      const params = new URLSearchParams(filters);
      const response = await this.api.get(`/api/projects?${params.toString()}`);
      const data = response.data?.data || response.data || [];
      const formatedData =  Project.fromAPIArray(data);
      console.log('Projects fetched from API:', formatedData);
      return formatedData;
    } catch (error) {
      console.error('Error fetching projects:', error);
      return [];
    }
  }

  /**
   * Find project by ID
   */
  async findById(id) {
    try {
      const response = await this.api.get(`/api/admin/projects/${id}`);
      const data = response.data?.data || response.data;
      return Project.fromAPI(data);
    } catch (error) {
      console.error(`Error fetching project ${id}:`, error);
      return null;
    }
  }

  /**
   * Find projects by user ID
   */
  async findByUserId(userId) {
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
  async findByStatus(status) {
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
  async save(project) {
    try {
      if (project.id) {
        // Update existing project
        const response = await this.api.put(
          `/api/admin/projects/${project.id}`,
          project.toJSON()
        );
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
  async delete(id) {
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
  async count() {
    try {
      const projects = await this.findAll();
      return projects.length;
    } catch (error) {
      console.error('Error counting projects:', error);
      return 0;
    }
  }
}

// Singleton instance
const projectRepository = new ProjectRepository();

export default projectRepository;
