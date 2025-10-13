import { User } from '@/domain/entities/User';
import { UserRegisterDataByAdmin } from '../../../types/user';

/**
 * Create User Use Case
 * Application service for creating a new user
 */
export class CreateUserUseCase {
  private userRegistrationService: any;

  constructor(userRegistrationService: any) {
    this.userRegistrationService = userRegistrationService;
  }

  /**
   * Execute the use case
   */
  async execute(command: any): Promise<any> {
    try {
      const user = await this.userRegistrationService.register(command);
      return {
        success: true,
        data: user,
        message: 'User created successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        message: 'Failed to create user'
      };
    }
  }

  /**
   * Create user by admin - returns User entity
   * This method creates a user entity for admin user creation workflows
   */
  createUserByAdmin(adminUserData: UserRegisterDataByAdmin): User {
    // Create user using domain entity constructor
    const user = new User({
      name: adminUserData.name,
      username: adminUserData.username,
      email: adminUserData.email,
      role: adminUserData.role,
      status: 'active', // Default status for admin-created users
      github_username: adminUserData.github_username || '',
      password: adminUserData.password // Password is required for creation
    });

    // Validate the user
    const validation = user.validate();
    if (!validation.valid) {
      throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
    }

    return user;
  }
}
