/**
 * Application Facade
 * Provides a simplified interface to the application layer
 * This acts as the main entry point for UI components
 */
import container from './Container.js';

class ApplicationService {
  constructor() {
    this.container = container;
  }

  // User Operations
  async createUser(userData) {
    const useCase = this.container.get('createUserUseCase');
    return await useCase.execute(userData);
  }

  async updateUser(userId, updates) {
    const useCase = this.container.get('updateUserUseCase');
    return await useCase.execute(userId, updates);
  }

  async deleteUser(userId) {
    const useCase = this.container.get('deleteUserUseCase');
    return await useCase.execute(userId);
  }

  async getAllUsers(filters = {}) {
    const useCase = this.container.get('getAllUsersUseCase');
    return await useCase.execute(filters);
  }

  async getUserById(userId) {
    const repository = this.container.get('userRepository');
    return await repository.findById(userId);
  }

  // Challenge Operations
  async submitChallenge(userId, challengeId, submissionData) {
    const useCase = this.container.get('submitChallengeUseCase');
    return await useCase.execute({
      userId,
      challengeId,
      ...submissionData
    });
  }

  async completeChallenge(userId, challengeId) {
    const useCase = this.container.get('completeChallengeUseCase');
    return await useCase.execute({ userId, challengeId });
  }

  async getAllChallenges(filters = {}) {
    const repository = this.container.get('challengeRepository');
    return await repository.findAll(filters);
  }

  async getChallengeById(challengeId) {
    const repository = this.container.get('challengeRepository');
    return await repository.findById(challengeId);
  }

  async createChallenge(challengeData) {
    const repository = this.container.get('challengeRepository');
    const { Challenge } = await import('../domain/entities/Challenge.js');
    const challenge = new Challenge(challengeData);
    return await repository.save(challenge);
  }

  async deleteChallenge(challengeId) {
    const repository = this.container.get('challengeRepository');
    return await repository.delete(challengeId);
  }

  // Project Operations
  async createProject(userId, projectData) {
    const useCase = this.container.get('createProjectUseCase');
    return await useCase.execute({ userId, ...projectData });
  }

  async getAllProjects(filters = {}) {
    const repository = this.container.get('projectRepository');
    return await repository.findAll(filters);
  }

  async getProjectById(projectId) {
    const repository = this.container.get('projectRepository');
    return await repository.findById(projectId);
  }

  async getUserProjects(userId) {
    const repository = this.container.get('projectRepository');
    return await repository.findByUserId(userId);
  }

  async deleteProject(projectId) {
    const repository = this.container.get('projectRepository');
    return await repository.delete(projectId);
  }

  // Event Operations
  async getAllEvents(filters = {}) {
    const repository = this.container.get('eventRepository');
    return await repository.findAll(filters);
  }

  async getEventById(eventId) {
    const repository = this.container.get('eventRepository');
    return await repository.findById(eventId);
  }

  async getUpcomingEvents() {
    const repository = this.container.get('eventRepository');
    return await repository.findUpcoming();
  }

  async createEvent(eventData) {
    const repository = this.container.get('eventRepository');
    const { Event } = await import('../domain/entities/Event.js');
    const event = new Event(eventData);
    return await repository.save(event);
  }

  async deleteEvent(eventId) {
    const repository = this.container.get('eventRepository');
    return await repository.delete(eventId);
  }

  // Leaderboard Operations
  async getTopUsers(limit = 10) {
    const service = this.container.get('leaderboardService');
    return await service.getTopUsers(limit);
  }

  async getUserRank(userId) {
    const service = this.container.get('leaderboardService');
    return await service.getUserRank(userId);
  }

  // Stats Operations
  async getAdminStats() {
    const userRepo = this.container.get('userRepository');
    const challengeRepo = this.container.get('challengeRepository');
    const projectRepo = this.container.get('projectRepository');

    const [totalUsers, totalChallenges, totalProjects] = await Promise.all([
      userRepo.count(),
      challengeRepo.count(),
      projectRepo.count()
    ]);

    const users = await userRepo.findAll();
    const activeUsers = users.filter(u => u.isActive()).length;

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
