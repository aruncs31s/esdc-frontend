/**
 * User Model
 * Represents a user entity in the ESDC system
 */

export const USER_ROLES = {
  ADMIN: 'admin',
  USER: 'user',
  MODERATOR: 'moderator'
} as const;

export const USER_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  SUSPENDED: 'suspended',
  PENDING: 'pending'
} as const;

export type UserRole = typeof USER_ROLES[keyof typeof USER_ROLES];
export type UserStatus = typeof USER_STATUS[keyof typeof USER_STATUS];



export interface UserData {
  id?: string | null;
  username?: string;
  email?: string;
  role?: UserRole;
  status?: UserStatus;
  github_username?: string;
  githubUsername?: string;
  joined_date?: string;
  joinedDate?: string;
  last_active?: string | null;
  lastActive?: string | null;
  points?: number;
  completed_challenges?: number;
  completedChallenges?: number;
  avatar?: string | null;
  bio?: string;
  created_at?: string;
  createdAt?: string;
  updated_at?: string;
  updatedAt?: string;
}

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

/**
 * User class representing a user entity
 */
export class User {
  id: string | null;
  username: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  githubUsername: string;
  joinedDate: string;
  lastActive: string | null;
  points: number;
  completedChallenges: number;
  avatar: string | null;
  bio: string;
  createdAt: string;
  updatedAt: string;

  constructor(data: UserData = {}) {
    this.id = data.id || null;
    this.username = data.username || '';
    this.email = data.email || '';
    this.role = data.role || USER_ROLES.USER;
    this.status = data.status || USER_STATUS.ACTIVE;
    this.githubUsername = data.github_username || data.githubUsername || '';
    this.joinedDate = data.joined_date || data.joinedDate || new Date().toISOString();
    this.lastActive = data.last_active || data.lastActive || null;
    this.points = data.points || 0;
    this.completedChallenges = data.completed_challenges || data.completedChallenges || 0;
    this.avatar = data.avatar || null;
    this.bio = data.bio || '';
    this.createdAt = data.created_at || data.createdAt || new Date().toISOString();
    this.updatedAt = data.updated_at || data.updatedAt || new Date().toISOString();
  }

  /**
   * Check if user is an admin
   */
  isAdmin(): boolean {
    return this.role === USER_ROLES.ADMIN;
  }

  /**
   * Check if user is active
   */
  isActive(): boolean {
    return this.status === USER_STATUS.ACTIVE;
  }

  /**
   * Check if user is suspended
   */
  isSuspended(): boolean {
    return this.status === USER_STATUS.SUSPENDED;
  }

  /**
   * Get user's full display name
   */
  getDisplayName(): string {
    return this.username || this.email.split('@')[0];
  }

  /**
   * Get formatted joined date
   */
  getFormattedJoinDate(): string {
    return new Date(this.joinedDate).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  /**
   * Get user's avatar URL or default
   */
  getAvatarUrl(): string {
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

  /**
   * Check if user can perform admin actions
   */
  canPerformAdminActions(): boolean {
    return this.isAdmin() && this.isActive();
  }

  /**
   * Convert user object to plain JSON for API calls
   */
  toJSON(): Record<string, any> {
    return {
      id: this.id,
      username: this.username,
      email: this.email,
      role: this.role,
      status: this.status,
      github_username: this.githubUsername,
      joined_date: this.joinedDate,
      last_active: this.lastActive,
      points: this.points,
      completed_challenges: this.completedChallenges,
      avatar: this.avatar,
      bio: this.bio,
      created_at: this.createdAt,
      updated_at: this.updatedAt
    };
  }

  /**
   * Create User instance from API response
   */
  static fromAPI(data: UserData): User {
    return new User(data);
  }

  /**
   * Create multiple User instances from API response array
   */
  static fromAPIArray(dataArray: UserData[]): User[] {
    if (!Array.isArray(dataArray)) {
      return [];
    }
    return dataArray.map(data => User.fromAPI(data));
  }

  /**
   * Validate user data
   */
  validate(): ValidationResult {
    const errors: string[] = [];

    if (!this.username || this.username.length < 3) {
      errors.push('Username must be at least 3 characters long');
    }

    if (!this.email || !this.isValidEmail(this.email)) {
      errors.push('Valid email is required');
    }

    if (!Object.values(USER_ROLES).includes(this.role)) {
      errors.push('Invalid user role');
    }

    if (!Object.values(USER_STATUS).includes(this.status)) {
      errors.push('Invalid user status');
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  /**
   * Check if email is valid
   */
  isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Update user properties
   */
  update(updates: Partial<UserData>): void {
    Object.keys(updates).forEach(key => {
      if (Object.prototype.hasOwnProperty.call(this, key)) {
        (this as any)[key] = (updates as any)[key];
      }
    });
    this.updatedAt = new Date().toISOString();
  }
}

/**
 * Helper function to create a new user
 */
export const createUser = (userData: UserData): User => {
  return new User(userData);
};

/**
 * Helper function to check if a value is a valid user role
 */
export const isValidRole = (role: string): role is UserRole => {
  return Object.values(USER_ROLES).includes(role as UserRole);
};

/**
 * Helper function to check if a value is a valid user status
 */
export const isValidStatus = (status: string): status is UserStatus => {
  return Object.values(USER_STATUS).includes(status as UserStatus);
};

/**
 * Helper function to get role display name
 */
export const getRoleDisplayName = (role: UserRole): string => {
  const roleNames: Record<UserRole, string> = {
    [USER_ROLES.ADMIN]: 'Administrator',
    [USER_ROLES.USER]: 'User',
    [USER_ROLES.MODERATOR]: 'Moderator'
  };
  return roleNames[role] || role;
};

/**
 * Helper function to get status display name
 */
export const getStatusDisplayName = (status: UserStatus): string => {
  const statusNames: Record<UserStatus, string> = {
    [USER_STATUS.ACTIVE]: 'Active',
    [USER_STATUS.INACTIVE]: 'Inactive',
    [USER_STATUS.SUSPENDED]: 'Suspended',
    [USER_STATUS.PENDING]: 'Pending'
  };
  return statusNames[status] || status;
};

export default User;
