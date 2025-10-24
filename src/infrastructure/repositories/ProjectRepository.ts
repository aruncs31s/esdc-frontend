import { IProjectRepository } from '../../domain/repositories/IProjectRepository.js';
import { Project } from '../../domain/entities/Project.js';
import apiClient from '../api/ApiClient.js';
import { ProjectCreateData } from '@/types/project.js';

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
  async findAll(_filters = {}): Promise<Project[]> {
    try {
      // const params = new URLSearchParams(filters);
      const response = await this.api.get(`/api/projects`);
      const data = response.data?.data || response.data || [];
      const formatedData = Project.fromAPIArray(data);
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

  async createProject(project: ProjectCreateData) {
    try {
      console.log('Project Data', project);
      // Update existing project
      const response = await this.api.post(`/api/projects`, project);

      const data = response.data?.data || response.data;
      return Project.fromAPI(data);
    } catch (error) {
      console.error('Error saving project:', error);
      throw error;
    }
  }
}

// Singleton instance
const projectRepository: ProjectRepository = new ProjectRepository();

export default projectRepository;
