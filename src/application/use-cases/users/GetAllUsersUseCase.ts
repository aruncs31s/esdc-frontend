/**
 * Get All Users Use Case
 * Application service for retrieving all users
 */
export class GetAllUsersUseCase {
  private userRepository: any;

  constructor(userRepository: any) {
    this.userRepository = userRepository;
  }

  /**
   * Execute the use case
   */
  async execute(filters = {}) {
    try {
      const users = await this.userRepository.findAll(filters);

      return {
        success: true,
        data: users,
        count: users.length,
        message: 'Users retrieved successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        data: [],
        message: 'Failed to retrieve users'
      };
    }
  }
}
