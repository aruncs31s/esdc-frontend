import { Points } from '../value-objects/Points.js';
import { Difficulty } from '../value-objects/Difficulty.js';

/**
 * Challenge Status Enumeration
 */
export const ChallengeStatus = {
  DRAFT: 'draft',
  ACTIVE: 'active',
  COMPLETED: 'completed',
  ARCHIVED: 'archived'
};

/**
 * Challenge Entity (Aggregate Root)
 * Represents a coding challenge with submissions
 */
export class Challenge {
  constructor(data = {}) {
    this.id = data.id || null;
    this.title = data.title || '';
    this.description = data.description || '';
    this.difficulty = data.difficulty instanceof Difficulty 
      ? data.difficulty 
      : new Difficulty(data.difficulty || 'beginner');
    this.points = data.points instanceof Points 
      ? data.points 
      : new Points(data.points || 0);
    this.status = data.status || ChallengeStatus.DRAFT;
    this.category = data.category || '';
    this.tags = data.tags || [];
    this.requirements = data.requirements || [];
    this.resources = data.resources || [];
    this.githubUrl = data.githubUrl || data.github_url || '';
    this.deadlineDate = data.deadlineDate || data.deadline_date || null;
    this.createdBy = data.createdBy || data.created_by || null;
    this.submissions = data.submissions || [];
    this.createdAt = data.createdAt || data.created_at || new Date().toISOString();
    this.updatedAt = data.updatedAt || data.updated_at || new Date().toISOString();
  }

  // Business Logic Methods

  /**
   * Publish challenge (make it active)
   */
  publish() {
    if (this.status === ChallengeStatus.ACTIVE) {
      throw new Error('Challenge is already active');
    }
    this.validate();
    this.status = ChallengeStatus.ACTIVE;
    this.updatedAt = new Date().toISOString();
  }

  /**
   * Archive challenge
   */
  archive() {
    this.status = ChallengeStatus.ARCHIVED;
    this.updatedAt = new Date().toISOString();
  }

  /**
   * Complete challenge
   */
  complete() {
    this.status = ChallengeStatus.COMPLETED;
    this.updatedAt = new Date().toISOString();
  }

  /**
   * Check if challenge is expired
   */
  isExpired() {
    if (!this.deadlineDate) {
      return false;
    }
    return new Date() > new Date(this.deadlineDate);
  }

  /**
   * Check if challenge is active
   */
  isActive() {
    return this.status === ChallengeStatus.ACTIVE && !this.isExpired();
  }

  /**
   * Check if user can submit to this challenge
   */
  canAcceptSubmission() {
    return this.isActive();
  }

  /**
   * Add a submission
   */
  addSubmission(submission) {
    if (!this.canAcceptSubmission()) {
      throw new Error('Challenge is not accepting submissions');
    }
    this.submissions.push(submission);
    this.updatedAt = new Date().toISOString();
  }

  /**
   * Calculate points with difficulty multiplier
   */
  getAwardPoints() {
    const multiplier = this.difficulty.getPointsMultiplier();
    return this.points.multiply(multiplier);
  }

  /**
   * Check if user can edit challenge
   */
  canBeEditedBy(user) {
    return user.isAdmin() || user.id === this.createdBy;
  }

  /**
   * Get submission count
   */
  getSubmissionCount() {
    return this.submissions.length;
  }

  /**
   * Get days until deadline
   */
  getDaysUntilDeadline() {
    if (!this.deadlineDate) {
      return null;
    }
    const now = new Date();
    const deadline = new Date(this.deadlineDate);
    const diffTime = deadline - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  }

  // Validation

  /**
   * Validate challenge data
   */
  validate() {
    const errors = [];

    if (!this.title || this.title.length < 5) {
      errors.push('Title must be at least 5 characters long');
    }

    if (!this.description || this.description.length < 20) {
      errors.push('Description must be at least 20 characters long');
    }

    try {
      this.difficulty.toString();
    } catch (error) {
      errors.push('Invalid difficulty level');
    }

    if (this.points.value <= 0) {
      errors.push('Points must be greater than zero');
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  // Serialization

  /**
   * Convert to JSON for API calls
   */
  toJSON() {
    return {
      id: this.id,
      title: this.title,
      description: this.description,
      difficulty: this.difficulty.toString(),
      points: this.points.value,
      status: this.status,
      category: this.category,
      tags: this.tags,
      requirements: this.requirements,
      resources: this.resources,
      github_url: this.githubUrl,
      deadline_date: this.deadlineDate,
      created_by: this.createdBy,
      created_at: this.createdAt,
      updated_at: this.updatedAt
    };
  }

  /**
   * Create Challenge from API response
   */
  static fromAPI(data) {
    return new Challenge(data);
  }

  /**
   * Create multiple Challenges from API response array
   */
  static fromAPIArray(dataArray) {
    if (!Array.isArray(dataArray)) {
      return [];
    }
    return dataArray.map(data => Challenge.fromAPI(data));
  }
}

/**
 * Factory function to create a challenge
 */
export const createChallenge = (challengeData) => {
  return new Challenge(challengeData);
};
