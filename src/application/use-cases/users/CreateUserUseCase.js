/**
 * Create User Use Case
 * Application service for creating a new user
 */
export class CreateUserUseCase {
  constructor(userRepository, userRegistrationService) {
    this.userRepository = userRepository;
    this.userRegistrationService = userRegistrationService;
  }

  /**
   * Execute the use case
   */
  async execute(command) {
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
        error: error.message,
        message: 'Failed to create user'
      };
    }
  }
}
