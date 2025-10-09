/**
 * Complete Challenge Use Case
 * Application service for completing a challenge
 */
export class CompleteChallengeUseCase {
  constructor(challengeEvaluationService) {
    this.challengeEvaluationService = challengeEvaluationService;
  }

  /**
   * Execute the use case
   */
  async execute(command) {
    try {
      const { userId, challengeId } = command;

      const result = await this.challengeEvaluationService.completeChallenge(
        userId,
        challengeId
      );

      return {
        success: true,
        data: result,
        message: `Challenge completed! You earned ${result.pointsAwarded} points!`
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: 'Failed to complete challenge'
      };
    }
  }
}
