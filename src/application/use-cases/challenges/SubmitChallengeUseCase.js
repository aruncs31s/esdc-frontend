/**
 * Submit Challenge Use Case
 * Application service for submitting a challenge solution
 */
export class SubmitChallengeUseCase {
  constructor(challengeEvaluationService) {
    this.challengeEvaluationService = challengeEvaluationService;
  }

  /**
   * Execute the use case
   */
  async execute(command) {
    try {
      const { userId, challengeId, solution, githubUrl } = command;

      const challenge = await this.challengeEvaluationService.submitChallenge(
        userId,
        challengeId,
        { solution, githubUrl }
      );

      return {
        success: true,
        data: challenge,
        message: 'Challenge submitted successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: 'Failed to submit challenge'
      };
    }
  }
}
