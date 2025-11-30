import { Project } from '../entities/Project';
import { ProjectDataForAdmin } from '@/types/project';
import { UserDataForAdmin, UserRegisterDataByAdmin } from '@/types/user';
import { statsForAdmin } from '@/types';

/**
 * Admin Repository Interface
 * Defines the contract for admin data access
 */
export interface IAdminRepository {
  findAllProjects(filters?: Record<string, unknown>): Promise<ProjectDataForAdmin[]>;
  findById(id: string): Promise<Project | null>;
  findByUserId(userId: string): Promise<Project[]>;
  findByStatus(status: string): Promise<Project[]>;
  saveProject(project: Project): Promise<Project>;
  deleteProject(id: string): Promise<boolean>;
  countProjects(): Promise<number>;
  getAdminStats(filters?: Record<string, unknown>): Promise<statsForAdmin>;
  findAllUsers(filters?: Record<string, unknown>): Promise<UserDataForAdmin[]>;
  createUser(userData: UserRegisterDataByAdmin): Promise<UserRegisterDataByAdmin>;
  createProject(userId: string, projectData: Record<string, unknown>): Promise<Project>;
}
