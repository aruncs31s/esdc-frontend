import { Email } from '../value-objects/Email.js';
import { Points } from '../value-objects/Points.js';

/**
 * User Role Enumeration
 */
export const UserRole = {
  ADMIN: 'admin',
  USER: 'user',
  MODERATOR: 'moderator'
};

/**
 * User Status Enumeration
 */
export const UserStatus = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  SUSPENDED: 'suspended',
  PENDING: 'pending'
};

/**
 * User Entity (Aggregate Root)
 * Represents a user in the ESDC system with business logic
 */
export class User {
  id: string | null;
  username: string;
  email: Email;
  role: string;
  status: string;
  githubUsername: string;
  points: Points;
  completedChallenges: number;
  avatar: string | null;
  bio: string;
  joinedDate: string;
  lastActive: string | null;
  createdAt: string;
  updatedAt: string;
  suspensionReason: string | null;

  constructor(data: any = {}) {
    this.id = data.id || null;
    this.username = data.username || '';
    this.email = data.email instanceof Email ? data.email : new Email(data.email || 'temp@example.com');
    this.role = data.role || UserRole.USER;
    this.status = data.status || UserStatus.ACTIVE;
    this.githubUsername = data.githubUsername || data.github_username || '';
    this.points = data.points instanceof Points ? data.points : new Points(data.points || 0);
    this.completedChallenges = data.completedChallenges || data.completed_challenges || 0;
    this.avatar = data.avatar || null;
    this.bio = data.bio || '';
    this.joinedDate = data.joinedDate || data.joined_date || new Date().toISOString();
    this.lastActive = data.lastActive || data.last_active || null;
    this.createdAt = data.createdAt || data.created_at || new Date().toISOString();
    this.updatedAt = data.updatedAt || data.updated_at || new Date().toISOString();
    this.suspensionReason = data.suspensionReason || data.suspension_reason || null;
  }

  // Business Logic Methods

  /**
   * Activate user account
   */
  activate() {
    if (this.status === UserStatus.ACTIVE) {
      throw new Error('User is already active');
    }
    this.status = UserStatus.ACTIVE;
    this.updatedAt = new Date().toISOString();
  }

  /**
   * Suspend user account
   */
  suspend(reason) {
    if (this.status === UserStatus.SUSPENDED) {
      throw new Error('User is already suspended');
    }
    this.status = UserStatus.SUSPENDED;
    this.suspensionReason = reason;
    this.updatedAt = new Date().toISOString();
  }

  /**
   * Deactivate user account
   */
  deactivate() {
    this.status = UserStatus.INACTIVE;
    this.updatedAt = new Date().toISOString();
  }

  /**
   * Add points to user
   */
  addPoints(points) {
    if (!(points instanceof Points)) {
      points = new Points(points);
    }
    this.points = this.points.add(points);
    this.updatedAt = new Date().toISOString();
  }

  /**
   * Subtract points from user
   */
  subtractPoints(points) {
    if (!(points instanceof Points)) {
      points = new Points(points);
    }
    this.points = this.points.subtract(points);
    this.updatedAt = new Date().toISOString();
  }

  /**
   * Increment completed challenges
   */
  completeChallenge() {
    this.completedChallenges++;
    this.updatedAt = new Date().toISOString();
  }

  /**
   * Update last active timestamp
   */
  updateLastActive() {
    this.lastActive = new Date().toISOString();
  }

  // Query Methods

  /**
   * Check if user is admin
   */
  isAdmin() {
    return this.role === UserRole.ADMIN;
  }

  /**
   * Check if user is moderator
   */
  isModerator() {
    return this.role === UserRole.MODERATOR;
  }

  /**
   * Check if user is active
   */
  isActive() {
    return this.status === UserStatus.ACTIVE;
  }

  /**
   * Check if user is suspended
   */
  isSuspended() {
    return this.status === UserStatus.SUSPENDED;
  }

  /**
   * Check if user can participate in challenges
   */
  canParticipateInChallenges() {
    return this.status === UserStatus.ACTIVE;
  }

  /**
   * Check if user can perform admin actions
   */
  canPerformAdminActions() {
    return this.isAdmin() && this.isActive();
  }

  /**
   * Check if user can moderate
   */
  canModerate() {
    return (this.isAdmin() || this.isModerator()) && this.isActive();
  }

  /**
   * Get user's display name
   */
  getDisplayName() {
    return this.username || this.email.value.split('@')[0];
  }

  /**
   * Get formatted joined date
   */
  getFormattedJoinDate() {
    return new Date(this.joinedDate).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  /**
   * Get user's avatar URL or default
   */
  getAvatarUrl() {
    if (this.avatar) {
      return this.avatar;
    }
    const initials = this.getDisplayName()
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
    return `https://ui-avatars.com/api/?name=${initials}&background=random`;
  }

  // Validation

  /**
   * Validate user data
   */
  validate() {
    const errors = [];

    if (!this.username || this.username.length < 3) {
      errors.push('Username must be at least 3 characters long');
    }

    try {
      this.email.validate();
    } catch (error) {
      errors.push(error.message);
    }

    if (!Object.values(UserRole).includes(this.role)) {
      errors.push('Invalid user role');
    }

    if (!Object.values(UserStatus).includes(this.status)) {
      errors.push('Invalid user status');
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
      username: this.username,
      email: this.email.toString(),
      role: this.role,
      status: this.status,
      github_username: this.githubUsername,
      points: this.points.value,
      completed_challenges: this.completedChallenges,
      avatar: this.avatar,
      bio: this.bio,
      joined_date: this.joinedDate,
      last_active: this.lastActive,
      created_at: this.createdAt,
      updated_at: this.updatedAt
    };
  }

  /**
   * Create User from API response
   */
  static fromAPI(data) {
    return new User(data);
  }

  /**
   * Create multiple Users from API response array
   */
  static fromAPIArray(dataArray) {
    if (!Array.isArray(dataArray)) {
      return [];
    }
    return dataArray.map(data => User.fromAPI(data));
  }
}

/**
 * Factory function to create a user
 */
export const createUser = (userData) => {
  return new User(userData);
};
