/**
 * Application Facade
 * Provides a simplified interface to the application layer
 * This acts as the main entry point for UI components
 */
import { Project } from '../domain/index.js';
import container from './Container.js';

class ApplicationService {
  private container: typeof container;

  constructor() {
    this.container = container;
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

  async getAllUsers(filters: any = {}): Promise<any> {
    const useCase = this.container.get('getAllUsersUseCase');
    return await useCase.execute(filters);
  }

  async getUserById(userId: string): Promise<any> {
    const repository = this.container.get('userRepository');
    return await repository.findById(userId);
  }

  // Challenge Operations
  async submitChallenge(userId: string, challengeId: string, submissionData: any): Promise<any> {
    const useCase = this.container.get('submitChallengeUseCase');
    return await useCase.execute({
      userId,
      challengeId,
      ...submissionData
    });
  }

  async completeChallenge(userId: string, challengeId: string): Promise<any> {
    const useCase = this.container.get('completeChallengeUseCase');
    return await useCase.execute({ userId, challengeId });
  }

  async getAllChallenges(filters: any = {}): Promise<any> {
    const repository = this.container.get('challengeRepository');
    return await repository.findAll(filters);
  }

  async getChallengeById(challengeId: string): Promise<any> {
    const repository = this.container.get('challengeRepository');
    return await repository.findById(challengeId);
  }

  async createChallenge(challengeData: any): Promise<any> {
    const repository = this.container.get('challengeRepository');
    const { Challenge } = await import('../domain/entities/Challenge.js');
    const challenge = new Challenge(challengeData);
    return await repository.save(challenge);
  }

  async deleteChallenge(challengeId: string): Promise<any> {
    const repository = this.container.get('challengeRepository');
    return await repository.delete(challengeId);
  }

  // Project Operations
  async createProject(userId: string, projectData: any): Promise<any> {
    const useCase = this.container.get('createProjectUseCase');
    return await useCase.execute({ userId, ...projectData });
  }

  async getAllProjects(filters: any = {}): Promise<Project[] > {
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
    const { Event } = await import('../domain/entities/Event.js');
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

  // Stats Operations
  async getAdminStats(): Promise<any> {
    const userRepo = this.container.get('userRepository');
    const challengeRepo = this.container.get('challengeRepository');
    const projectRepo = this.container.get('projectRepository');

    const [totalUsers, totalChallenges, totalProjects] = await Promise.all([
      userRepo.count(),
      challengeRepo.count(),
      projectRepo.count()
    ]);

    const users = await userRepo.findAll();
    const activeUsers = users.filter((u: any) => u.isActive()).length;

    return {
      totalUsers,
      totalChallenges,
      totalProjects,
      activeUsers
    };
  }
}

// Singleton instance
const applicationService = new ApplicationService();

export default applicationService;
