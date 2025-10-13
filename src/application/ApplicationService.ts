/*
 * Application Facade
 * Provides a simplified interface to the application layer
* This acts as the main entry point for UI components
*/

import { Project } from '../domain/index';
import container from './Container';
import { ProjectData, ProjectDataForAdmin } from '@/types/project';
import { AdminRepository } from '@/infrastructure/repositories/AdminRepository';
import { statsForAdmin } from '@/types';
import { UserDataForAdmin, UserRegisterDataByAdmin } from '@/types/user';

class ApplicationService {
  private container: typeof container;

  constructor() {
    this.container = container;
  }

  async getAllProjectForAdmin(filters: any = {}): Promise<ProjectDataForAdmin[]> {
    const adminRepo = this.container.get('adminRepository') as AdminRepository;
    return await adminRepo.findAllProjects(filters);
  }
  // Stats Operations
  async getAdminStats(): Promise<statsForAdmin> {
    const adminRepo = this.container.get('adminRepository') as AdminRepository;
    return await adminRepo.getAdminStats();
  }
  async getAllUsersForAdmin(filters: any = {}): Promise<UserDataForAdmin[]> {
    const adminRepo = this.container.get('adminRepository') as AdminRepository;
    return await adminRepo.findAllUsers(filters);
  }
  async createUserByAdmin(userData: UserRegisterDataByAdmin): Promise<UserRegisterDataByAdmin> {
    const adminRepo = this.container.get('adminRepository') as AdminRepository;
    return await adminRepo.createUser(userData);
  }
  // Project Operations
  async createProjectByAdmin(userId: string, projectData: ProjectData): Promise<any> {
    const adminRepo = this.container.get('adminRepository') as AdminRepository;
    return await adminRepo.createProject(userId, projectData);
  }
  // User Operations
  async createUser(userData: any): Promise<any> {
    const useCase = this.container.get('createUserUseCase');
    return await useCase.execute(userData);
  }

  async updateUser(userId: string, updates: any): Promise<any> {
    const useCase = this.container.get('updateUserUseCase');
    return await useCase.execute(userId, updates);
  }

  async deleteUser(userId: string): Promise<any> {
    const useCase = this.container.get('deleteUserUseCase');
    return await useCase.execute(userId);
  }



  async getUserById(userId: string): Promise<any> {
    const repository = this.container.get('userRepository');
    return await repository.findById(userId);
  }


  // Project Operations
  async createProject(userId: string, projectData: any): Promise<any> {
    const useCase = this.container.get('createProjectUseCase');
    return await useCase.execute({ userId, ...projectData });
  }

  async getAllProjects(filters: any = {}): Promise<Project[]> {
    const repository = this.container.get('projectRepository');
    return await repository.findAll(filters);
  }

  async getProjectById(projectId: string): Promise<any> {
    const repository = this.container.get('projectRepository');
    return await repository.findById(projectId);
  }

  async getUserProjects(userId: string): Promise<any> {
    const repository = this.container.get('projectRepository');
    return await repository.findByUserId(userId);
  }

  async deleteProject(projectId: string): Promise<any> {
    const repository = this.container.get('projectRepository');
    return await repository.delete(projectId);
  }

  // Event Operations
  async getAllEvents(filters: any = {}): Promise<any> {
    const repository = this.container.get('eventRepository');
    return await repository.findAll(filters);
  }

  async getEventById(eventId: string): Promise<any> {
    const repository = this.container.get('eventRepository');
    return await repository.findById(eventId);
  }

  async getUpcomingEvents(): Promise<any> {
    const repository = this.container.get('eventRepository');
    return await repository.findUpcoming();
  }

  async createEvent(eventData: any): Promise<any> {
    const repository = this.container.get('eventRepository');
    const { Event } = await import('../domain/entities/Event');
    const event = new Event(eventData);
    return await repository.save(event);
  }

  async deleteEvent(eventId: string): Promise<any> {
    const repository = this.container.get('eventRepository');
    return await repository.delete(eventId);
  }

  // Leaderboard Operations
  async getTopUsers(limit: number = 10): Promise<any> {
    const service = this.container.get('leaderboardService');
    return await service.getTopUsers(limit);
  }

  async getUserRank(userId: string): Promise<any> {
    const service = this.container.get('leaderboardService');
    return await service.getUserRank(userId);
  }


  // Chatbot Operations
  async askChatbot(message: string, userId?: string): Promise<{ response: string; confidence?: number }> {
    const useCase = this.container.get('askChatbotUseCase');
    return await useCase.execute(message, userId);
  }

  async getChatHistory(userId: string): Promise<Array<{
    id: string;
    message: string;
    response: string;
    timestamp: Date;
  }>> {
    const service = this.container.get('chatbotService');
    return await service.getUserHistory(userId);
  }

  getChatbotQuickActions(): Array<{ label: string; message: string }> {
    const service = this.container.get('chatbotService');
    return service.getQuickActions();
  }


}

// Singleton instance
const applicationService = new ApplicationService();

export default applicationService;
