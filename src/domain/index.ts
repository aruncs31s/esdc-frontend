// Domain Layer Exports


// Value Objects
export { Email } from './value-objects/Email.js';
export { Points } from './value-objects/Points.js';
export { Difficulty, DifficultyLevel } from './value-objects/Difficulty.js';
export { DateRange } from './value-objects/DateRange.js';

// Entities
export { User, UserRole, UserStatus } from './entities/User.js';

export { ProjectStatus } from '@/types/project.js';
export { Project, createProject } from './entities/Project.js';
export { Event, EventStatus, createEvent } from './entities/Event.js';

// Domain Services
export { UserRegistrationService } from './services/UserRegistrationService.js';
export { ChallengeEvaluationService } from './services/ChallengeEvaluationService.js';
export { LeaderboardService } from './services/LeaderboardService.js';

// Domain Events
export * from './events/DomainEvents.js';
export { default as eventBus } from './events/EventBus.js';

// Repository Interfaces
export { IUserRepository } from './repositories/IUserRepository.js';
export { IChallengeRepository } from './repositories/IChallengeRepository.js';
export { IProjectRepository } from './repositories/IProjectRepository.js';
export { IEventRepository } from './repositories/IEventRepository.js';
