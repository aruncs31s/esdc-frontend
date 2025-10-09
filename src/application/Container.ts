import userRepository from '../infrastructure/repositories/UserRepository.js';
import challengeRepository from '../infrastructure/repositories/ChallengeRepository.js';
import projectRepository from '../infrastructure/repositories/ProjectRepository.js';
import eventRepository from '../infrastructure/repositories/EventRepository.js';

import { UserRegistrationService } from '../domain/services/UserRegistrationService.js';
import { ChallengeEvaluationService } from '../domain/services/ChallengeEvaluationService.js';
import { LeaderboardService } from '../domain/services/LeaderboardService.js';

import { CreateUserUseCase } from '../application/use-cases/users/CreateUserUseCase.js';
import { UpdateUserUseCase } from '../application/use-cases/users/UpdateUserUseCase.js';
import { DeleteUserUseCase } from '../application/use-cases/users/DeleteUserUseCase.js';
import { GetAllUsersUseCase } from '../application/use-cases/users/GetAllUsersUseCase.js';

import { SubmitChallengeUseCase } from '../application/use-cases/challenges/SubmitChallengeUseCase.js';
import { CompleteChallengeUseCase } from '../application/use-cases/challenges/CompleteChallengeUseCase.js';

import { CreateProjectUseCase } from '../application/use-cases/projects/CreateProjectUseCase.js';

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
    this.services.set('challengeRepository', challengeRepository);
    this.services.set('projectRepository', projectRepository);
    this.services.set('eventRepository', eventRepository);

    // Domain Services
    const userRegistrationService = new UserRegistrationService(userRepository);
    const challengeEvaluationService = new ChallengeEvaluationService(
      challengeRepository,
      userRepository
    );
    const leaderboardService = new LeaderboardService(userRepository);

    this.services.set('userRegistrationService', userRegistrationService);
    this.services.set('challengeEvaluationService', challengeEvaluationService);
    this.services.set('leaderboardService', leaderboardService);

    // Use Cases - Users
    this.services.set('createUserUseCase', new CreateUserUseCase(
      userRepository,
      userRegistrationService
    ));
    this.services.set('updateUserUseCase', new UpdateUserUseCase(userRepository));
    this.services.set('deleteUserUseCase', new DeleteUserUseCase(userRepository));
    this.services.set('getAllUsersUseCase', new GetAllUsersUseCase(userRepository));

    // Use Cases - Challenges
    this.services.set('submitChallengeUseCase', new SubmitChallengeUseCase(
      challengeEvaluationService
    ));
    this.services.set('completeChallengeUseCase', new CompleteChallengeUseCase(
      challengeEvaluationService
    ));

    // Use Cases - Projects
    this.services.set('createProjectUseCase', new CreateProjectUseCase(
      projectRepository,
      userRepository
    ));

    this.initialized = true;
  }

  /**
   * Get a service by name
   */
  get(serviceName) {
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
  has(serviceName) {
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
