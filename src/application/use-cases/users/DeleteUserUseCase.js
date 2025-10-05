/**
 * Delete User Use Case
 * Application service for deleting a user
 */
export class DeleteUserUseCase {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  /**
   * Execute the use case
   */
  async execute(userId) {
    try {
      const user = await this.userRepository.findById(userId);
      
      if (!user) {
        return {
          success: false,
          error: 'User not found',
          message: 'User not found'
        };
      }

      await this.userRepository.delete(userId);

      return {
        success: true,
        message: 'User deleted successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: 'Failed to delete user'
      };
    }
  }
}
