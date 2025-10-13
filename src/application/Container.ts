import userRepository from '../infrastructure/repositories/UserRepository.js';
import projectRepository from '../infrastructure/repositories/ProjectRepository.js';
import eventRepository from '../infrastructure/repositories/EventRepository.js';
import chatbotRepository from '../infrastructure/repositories/ChatbotRepository.js';

import { UserRegistrationService } from '../domain/services/UserRegistrationService.js';
import { LeaderboardService } from '../domain/services/LeaderboardService.js';
import { ChatbotService } from '../domain/services/ChatbotService.js';

import { CreateUserUseCase } from '../application/use-cases/users/CreateUserUseCase.js';
import { UpdateUserUseCase } from '../application/use-cases/users/UpdateUserUseCase.js';
import { DeleteUserUseCase } from '../application/use-cases/users/DeleteUserUseCase.js';
import { GetAllUsersUseCase } from '../application/use-cases/users/GetAllUsersUseCase.js';


import { CreateProjectUseCase } from '../application/use-cases/projects/CreateProjectUseCase.js';
import { AskChatbotUseCase } from '../application/use-cases/AskChatbotUseCase.js';
import { adminRepository } from '@/infrastructure/index.js';

/**
 * Dependency Injection Container
 * Manages application dependencies and their lifecycle
 */
class Container {
  private services: Map<string, any>;
  private initialized: boolean;

  constructor() {
    this.services = new Map();
    this.initialized = false;
  }

  /**
   * Initialize all services
   */
  initialize() {
    if (this.initialized) {
      return;
    }

    // Repositories
    this.services.set('userRepository', userRepository);
    this.services.set('projectRepository', projectRepository);
    this.services.set('eventRepository', eventRepository);
    this.services.set('chatbotRepository', chatbotRepository);
    this.services.set('adminRepository', adminRepository)
    // Domain Services
    const userRegistrationService = new UserRegistrationService(userRepository);

    const leaderboardService = new LeaderboardService(userRepository);
    const chatbotService = new ChatbotService(chatbotRepository);

    this.services.set('userRegistrationService', userRegistrationService);
    this.services.set('leaderboardService', leaderboardService);
    this.services.set('chatbotService', chatbotService);

    // Use Cases - Users
    this.services.set('createUserUseCase', new CreateUserUseCase(
      userRepository,
    ));
    this.services.set('updateUserUseCase', new UpdateUserUseCase(userRepository));
    this.services.set('deleteUserUseCase', new DeleteUserUseCase(userRepository));
    this.services.set('getAllUsersUseCase', new GetAllUsersUseCase(userRepository));

    // Use Cases - Challenges
    ``


    // Use Cases - Projects
    this.services.set('createProjectUseCase', new CreateProjectUseCase(
      projectRepository,
      userRepository
    ));

    // Use Cases - Chatbot
    this.services.set('askChatbotUseCase', new AskChatbotUseCase(chatbotService));

    this.initialized = true;
  }

  /**
   * Get a service by name
   */
  get(serviceName: string) {
    if (!this.initialized) {
      this.initialize();
    }

    if (!this.services.has(serviceName)) {
      throw new Error(`Service '${serviceName}' not found in container`);
    }

    return this.services.get(serviceName);
  }

  /**
   * Check if service exists
   */
  has(serviceName: string) {
    return this.services.has(serviceName);
  }

  /**
   * Get all services
   */
  getAll() {
    if (!this.initialized) {
      this.initialize();
    }
    return Object.fromEntries(this.services);
  }
}

// Singleton instance
const container = new Container();
container.initialize();

export default container;
