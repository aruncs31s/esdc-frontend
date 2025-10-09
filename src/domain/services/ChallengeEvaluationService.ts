import { ChallengeCompletedEvent, PointsAwardedEvent } from '../events/DomainEvents.js';
import eventBus from '../events/EventBus.js';

/**
 * Challenge Evaluation Service
 * Handles challenge submission and evaluation business logic
 */
export class ChallengeEvaluationService {
  constructor(challengeRepository, userRepository) {
    this.challengeRepository = challengeRepository;
    this.userRepository = userRepository;
  }

  /**
   * Submit and evaluate a challenge
   */
  async submitChallenge(userId, challengeId, submissionData) {
    // Get user and challenge
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    const challenge = await this.challengeRepository.findById(challengeId);
    if (!challenge) {
      throw new Error('Challenge not found');
    }

    // Validate business rules
    if (!user.canParticipateInChallenges()) {
      throw new Error('User cannot participate in challenges');
    }

    if (!challenge.canAcceptSubmission()) {
      throw new Error('Challenge is not accepting submissions');
    }

    // Add submission to challenge
    challenge.addSubmission({
      userId,
      ...submissionData,
      submittedAt: new Date().toISOString()
    });

    // Save challenge
    await this.challengeRepository.save(challenge);

    return challenge;
  }

  /**
   * Complete a challenge for a user
   */
  async completeChallenge(userId, challengeId) {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    const challenge = await this.challengeRepository.findById(challengeId);
    if (!challenge) {
      throw new Error('Challenge not found');
    }

    // Award points
    const points = challenge.getAwardPoints();
    user.addPoints(points);
    user.completeChallenge();

    // Save user
    const updatedUser = await this.userRepository.save(user);

    // Publish domain events
    const challengeCompletedEvent = new ChallengeCompletedEvent(
      userId,
      challengeId,
      points.value
    );
    await eventBus.publish(challengeCompletedEvent);

    const pointsAwardedEvent = new PointsAwardedEvent(
      userId,
      points.value,
      `Completed challenge: ${challenge.title}`
    );
    await eventBus.publish(pointsAwardedEvent);

    return {
      user: updatedUser,
      challenge,
      pointsAwarded: points.value
    };
  }

  /**
   * Get user's challenge progress
   */
  async getUserChallengeProgress(userId) {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    const allChallenges = await this.challengeRepository.findAll();
    const activeChallenges = allChallenges.filter(c => c.isActive());

    return {
      totalChallenges: allChallenges.length,
      activeChallenges: activeChallenges.length,
      completedChallenges: user.completedChallenges,
      totalPoints: user.points.value,
      completionRate: allChallenges.length > 0
        ? (user.completedChallenges / allChallenges.length) * 100
        : 0
    };
  }
}
