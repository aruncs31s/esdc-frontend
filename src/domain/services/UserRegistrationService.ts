import { UserRegisterData } from '@/types/user.js';
import {
  UserCreatedEvent,
  UserActivatedEvent,
  UserSuspendedEvent,
} from '../events/DomainEvents.js';
import eventBus from '../events/EventBus.js';
import { IUserRepository } from '../index.js';

/**
 * User Registration Service
 * Handles complex user registration business logic
 */
export class UserRegistrationService {
  private userRepository: IUserRepository;
  constructor(userRepository: IUserRepository) {
    this.userRepository = userRepository;
  }

  /**
   * Register a new user
   */
  async register(userData: UserRegisterData) {
    // Check if email already exists
    const existingUserByEmail = await this.userRepository.findByEmail(userData.email);
    if (existingUserByEmail) {
      throw new Error('Email already registered');
    }

    // Check if username already exists
    const existingUserByUsername = await this.userRepository.findByUsername(userData.username);
    if (existingUserByUsername) {
      throw new Error('Username already taken');
    }

    // Create and validate user
    const user = new (await import('../entities/User.js')).User(userData);
    const validation = user.validate();
    if (!validation.valid) {
      throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
    }

    // Save user
    const savedUser = await this.userRepository.save(user);

    // Publish domain event
    const event = new UserCreatedEvent(
      savedUser.id ?? '',
      savedUser.email.toString(),
      savedUser.username
    );
    await eventBus.publish(event);

    return savedUser;
  }

  /**
   * Activate user account
   */
  async activateUser(userId: number) {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    user.activate();
    const updatedUser = await this.userRepository.save(user);

    // Publish domain event
    const event = new UserActivatedEvent(userId.toString());
    await eventBus.publish(event);

    return updatedUser;
  }

  /**
   * Suspend user account
   */
  async suspendUser(userId: number, reason: string) {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    user.suspend(reason);
    const updatedUser = await this.userRepository.save(user);

    // Publish domain event
    const event = new UserSuspendedEvent(userId, reason);
    await eventBus.publish(event);

    return updatedUser;
  }
}
