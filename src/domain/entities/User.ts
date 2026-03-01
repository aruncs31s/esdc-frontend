import { UserRegisterData, UserRegisterDataByAdmin } from '@/types/user.js';
import { Email } from '../value-objects/Email.js';
import { Points } from '../value-objects/Points.js';

/**
 * User Role Enumeration
 */
export const UserRole = {
  ADMIN: 'admin',
  USER: 'user',
  MODERATOR: 'moderator',
} as const;

export type UserRoleType = (typeof UserRole)[keyof typeof UserRole];

/**
 * User Status Enumeration
 */
export const UserStatus = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  SUSPENDED: 'suspended',
  PENDING: 'pending',
} as const;

export type UserStatusType = (typeof UserStatus)[keyof typeof UserStatus];

/**
 * User constructor data type
 */
export interface UserConstructorData {
  id?: string | null;
  name?: string;
  username?: string;
  email?: string | Email;
  role?: string;
  status?: string;
  githubUsername?: string;
  github_username?: string;
  points?: number | Points;
  completedChallenges?: number;
  completed_challenges?: number;
  avatar?: string | null;
  bio?: string;
  joinedDate?: string;
  joined_date?: string;
  lastActive?: string | null;
  last_active?: string | null;
  createdAt?: string;
  created_at?: string;
  updatedAt?: string;
  updated_at?: string;
  suspensionReason?: string | null;
  suspension_reason?: string | null;
  password?: string;
}

/**
 * User Entity (Aggregate Root)
 * Represents a user in the ESDC system with business logic
 */
export class User {
  id: string | null;
  username: string;
  name: string;
  email: Email;
  role: string;
  status: string;
  githubUsername: string;
  points?: Points;
  completedChallenges: number;
  avatar: string | null;
  bio: string;
  joinedDate: string;
  lastActive: string | null;
  createdAt: string;
  updatedAt: string;
  suspensionReason: string | null;
  password?: string; // Optional, only for creation workflows

  constructor(data: UserConstructorData | UserRegisterData | UserRegisterDataByAdmin = {}) {
    // Cast to UserConstructorData for easier property access
    const d = data as UserConstructorData;

    this.id = d.id ?? null;
    this.name = d.name || 'New User';
    this.username = d.username || '';

    // Handle email - use temp email only if none provided
    const emailValue = d.email instanceof Email ? d.email : d.email;
    this.email =
      emailValue instanceof Email ? emailValue : new Email(emailValue || 'temp@example.com');

    this.role = d.role || UserRole.USER;
    this.status = d.status || UserStatus.ACTIVE;
    this.githubUsername = d.githubUsername || d.github_username || '';

    const pointsValue = d.points;
    this.points = pointsValue instanceof Points ? pointsValue : new Points(pointsValue || 0);

    this.completedChallenges = d.completedChallenges || d.completed_challenges || 0;

    // Fix avatar logic - only use GitHub avatar if githubUsername exists
    if (d.avatar) {
      this.avatar = d.avatar;
    } else if (this.githubUsername) {
      this.avatar = `https://github.com/${this.githubUsername}.png?size=200`;
    } else {
      this.avatar = null;
    }

    this.bio = d.bio || '';
    this.joinedDate = d.joinedDate || d.joined_date || new Date().toISOString();
    this.lastActive = d.lastActive || d.last_active || null;
    this.createdAt = d.createdAt || d.created_at || new Date().toISOString();
    this.updatedAt = d.updatedAt || d.updated_at || new Date().toISOString();
    this.suspensionReason = d.suspensionReason || d.suspension_reason || null;
    this.password = d.password; // Only for creation, not stored
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
  suspend(reason: string): void {
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
  deactivate(): void {
    this.status = UserStatus.INACTIVE;
    this.updatedAt = new Date().toISOString();
  }

  /**
   * Add points to user
   */
  addPoints(points: Points | number): void {
    if (!(points instanceof Points)) {
      points = new Points(points);
    }
    if (this.points) {
      this.points = this.points.add(points);
    } else {
      this.points = points;
    }
    this.updatedAt = new Date().toISOString();
  }

  /**
   * Subtract points from user
   */
  subtractPoints(points: Points | number): void {
    if (!(points instanceof Points)) {
      points = new Points(points);
    }
    if (this.points) {
      this.points = this.points.subtract(points);
    }
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
      day: 'numeric',
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
      .map((word) => word[0])
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
    const errors: string[] = [];

    if (!this.username || this.username.length < 3) {
      errors.push('Username must be at least 3 characters long');
    }

    try {
      // Email validation is done in Email constructor
      if (this.email) {
        this.email.toString(); // Just to check it exists
      }
    } catch (error) {
      errors.push((error as Error).message);
    }

    const validRoles = Object.values(UserRole) as string[];
    if (!validRoles.includes(this.role)) {
      errors.push('Invalid user role');
    }

    const validStatuses = Object.values(UserStatus) as string[];
    if (!validStatuses.includes(this.status)) {
      errors.push('Invalid user status');
    }

    return {
      valid: errors.length === 0,
      errors,
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
      points: this.points?.value || 0,
      completed_challenges: this.completedChallenges,
      avatar: this.avatar,
      bio: this.bio,
      joined_date: this.joinedDate,
      last_active: this.lastActive,
      created_at: this.createdAt,
      updated_at: this.updatedAt,
    };
  }
  getJSONForCreation() {
    const userData: UserRegisterDataByAdmin = {
      name: this.name || this.getDisplayName(),
      username: this.username,
      email: this.email.toString(),
      password: this.password,
      role: this.role,
      status: this.status,
      github_username: this.githubUsername,
    };
    return userData;
  }

  /**
   * Create User from API response
   */
  static fromAPI(data: any): User {
    return new User(data);
  }

  /**
   * Create multiple Users from API response array
   */
  static fromAPIArray(dataArray: any): User[] {
    if (!Array.isArray(dataArray)) {
      return [];
    }
    return dataArray.map((data) => User.fromAPI(data));
  }
}

/**
 * Factory function to create a user
 */
export const createUserObject = (userData: UserRegisterData) => {
  return new User(userData);
};
