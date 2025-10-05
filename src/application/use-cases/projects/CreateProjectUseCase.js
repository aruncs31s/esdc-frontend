/**
 * Create Project Use Case
 * Application service for creating a new project
 */
export class CreateProjectUseCase {
  constructor(projectRepository, userRepository) {
    this.projectRepository = projectRepository;
    this.userRepository = userRepository;
  }

  /**
   * Execute the use case
   */
  async execute(command) {
    try {
      const { userId, ...projectData } = command;

      // Verify user exists
      const user = await this.userRepository.findById(userId);
      if (!user) {
        return {
          success: false,
          error: 'User not found',
          message: 'User not found'
        };
      }

      // Create project
      const { Project } = await import('../../../domain/entities/Project.js');
      const project = new Project({
        ...projectData,
        userId
      });

      // Validate
      const validation = project.validate();
      if (!validation.valid) {
        return {
          success: false,
          error: validation.errors.join(', '),
          message: 'Validation failed'
        };
      }

      // Save
      const savedProject = await this.projectRepository.save(project);

      return {
        success: true,
        data: savedProject,
        message: 'Project created successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: 'Failed to create project'
      };
    }
  }
}
