/**
 * User Model
 * Represents a user entity in the ESDC system
 */

export const USER_ROLES = {
  ADMIN: 'admin',
  USER: 'user',
  MODERATOR: 'moderator'
};

export const USER_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  SUSPENDED: 'suspended',
  PENDING: 'pending'
};

/**
 * User class representing a user entity
 */
export class User {
  constructor(data = {}) {
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
   * @returns {boolean}
   */
  isAdmin() {
    return this.role === USER_ROLES.ADMIN;
  }

  /**
   * Check if user is active
   * @returns {boolean}
   */
  isActive() {
    return this.status === USER_STATUS.ACTIVE;
  }

  /**
   * Check if user is suspended
   * @returns {boolean}
   */
  isSuspended() {
    return this.status === USER_STATUS.SUSPENDED;
  }

  /**
   * Get user's full display name
   * @returns {string}
   */
  getDisplayName() {
    return this.username || this.email.split('@')[0];
  }

  /**
   * Get formatted joined date
   * @returns {string}
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
   * @returns {string}
   */
  getAvatarUrl() {
    if (this.avatar) {
      return this.avatar;
    }
    // Generate a default avatar using initials
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
   * @returns {boolean}
   */
  canPerformAdminActions() {
    return this.isAdmin() && this.isActive();
  }

  /**
   * Convert user object to plain JSON for API calls
   * @returns {Object}
   */
  toJSON() {
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
   * @param {Object} data - Raw API response data
   * @returns {User}
   */
  static fromAPI(data) {
    return new User(data);
  }

  /**
   * Create multiple User instances from API response array
   * @param {Array} dataArray - Array of raw API response data
   * @returns {Array<User>}
   */
  static fromAPIArray(dataArray) {
    if (!Array.isArray(dataArray)) {
      return [];
    }
    return dataArray.map(data => User.fromAPI(data));
  }

  /**
   * Validate user data
   * @returns {Object} - { valid: boolean, errors: Array<string> }
   */
  validate() {
    const errors = [];

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
   * @param {string} email
   * @returns {boolean}
   */
  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Update user properties
   * @param {Object} updates - Object with properties to update
   */
  update(updates) {
    Object.keys(updates).forEach(key => {
      if (Object.prototype.hasOwnProperty.call(this, key)) {
        this[key] = updates[key];
      }
    });
    this.updatedAt = new Date().toISOString();
  }
}

/**
 * Helper function to create a new user
 * @param {Object} userData
 * @returns {User}
 */
export const createUser = (userData) => {
  return new User(userData);
};

/**
 * Helper function to check if a value is a valid user role
 * @param {string} role
 * @returns {boolean}
 */
export const isValidRole = (role) => {
  return Object.values(USER_ROLES).includes(role);
};

/**
 * Helper function to check if a value is a valid user status
 * @param {string} status
 * @returns {boolean}
 */
export const isValidStatus = (status) => {
  return Object.values(USER_STATUS).includes(status);
};

/**
 * Helper function to get role display name
 * @param {string} role
 * @returns {string}
 */
export const getRoleDisplayName = (role) => {
  const roleNames = {
    [USER_ROLES.ADMIN]: 'Administrator',
    [USER_ROLES.USER]: 'User',
    [USER_ROLES.MODERATOR]: 'Moderator'
  };
  return roleNames[role] || role;
};

/**
 * Helper function to get status display name
 * @param {string} status
 * @returns {string}
 */
export const getStatusDisplayName = (status) => {
  const statusNames = {
    [USER_STATUS.ACTIVE]: 'Active',
    [USER_STATUS.INACTIVE]: 'Inactive',
    [USER_STATUS.SUSPENDED]: 'Suspended',
    [USER_STATUS.PENDING]: 'Pending'
  };
  return statusNames[status] || status;
};

export default User;
