/**
 * Update User Use Case
 * Application service for updating a user
 */
export class UpdateUserUseCase {
  private userRepository: any;

  constructor(userRepository: any) {
    this.userRepository = userRepository;
  }

  /**
   * Execute the use case
   */
  async execute(userId, updates) {
    try {
      const user = await this.userRepository.findById(userId);
      
      if (!user) {
        return {
          success: false,
          error: 'User not found',
          message: 'User not found'
        };
      }

      // Apply updates
      Object.assign(user, updates);
      user.updatedAt = new Date().toISOString();

      // Validate
      const validation = user.validate();
      if (!validation.valid) {
        return {
          success: false,
          error: validation.errors.join(', '),
          message: 'Validation failed'
        };
      }

      // Save
      const updatedUser = await this.userRepository.save(user);

      return {
        success: true,
        data: updatedUser,
        message: 'User updated successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: 'Failed to update user'
      };
    }
  }
}
