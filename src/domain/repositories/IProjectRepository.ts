import { Project } from '../entities/Project';

/**
 * Project Repository Interface
 * Defines the contract for project data access
 */
export interface IProjectRepository {
  findAll(filters?: Record<string, unknown>): Promise<Project[]>;
  findById(id: string): Promise<Project | null>;
  findByUserId(userId: string): Promise<Project[]>;
  findByStatus(status: string): Promise<Project[]>;
  save(project: Project): Promise<Project>;
  delete(id: string): Promise<boolean>;
  count(): Promise<number>;
}
