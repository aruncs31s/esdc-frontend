/**
 * Project Status Enumeration
 */
export const ProjectStatus = {
  DRAFT: 'draft',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  ARCHIVED: 'archived'
};

/**
 * Project Entity (Aggregate Root)
 * Represents a user project in the ESDC system
 */
export class Project {
  constructor(data = {}) {
    this.id = data.id || null;
    this.title = data.title || '';
    this.description = data.description || '';
    this.status = data.status || ProjectStatus.DRAFT;
    this.category = data.category || '';
    this.tags = data.tags || [];
    this.githubUrl = data.githubUrl || data.github_url || '';
    this.liveUrl = data.liveUrl || data.live_url || '';
    this.imageUrl = data.imageUrl || data.image_url || '';
    this.technologies = data.technologies || [];
    this.features = data.features || [];
    this.userId = data.userId || data.user_id || null;
    this.likes = data.likes || 0;
    this.views = data.views || 0;
    this.createdAt = data.createdAt || data.created_at || new Date().toISOString();
    this.updatedAt = data.updatedAt || data.updated_at || new Date().toISOString();
    this.completedAt = data.completedAt || data.completed_at || null;
  }

  // Business Logic Methods

  /**
   * Start project (move to in progress)
   */
  start() {
    if (this.status !== ProjectStatus.DRAFT) {
      throw new Error('Can only start draft projects');
    }
    this.status = ProjectStatus.IN_PROGRESS;
    this.updatedAt = new Date().toISOString();
  }

  /**
   * Complete project
   */
  complete() {
    if (this.status === ProjectStatus.COMPLETED) {
      throw new Error('Project is already completed');
    }
    this.status = ProjectStatus.COMPLETED;
    this.completedAt = new Date().toISOString();
    this.updatedAt = new Date().toISOString();
  }

  /**
   * Archive project
   */
  archive() {
    this.status = ProjectStatus.ARCHIVED;
    this.updatedAt = new Date().toISOString();
  }

  /**
   * Add a like
   */
  addLike() {
    this.likes++;
    this.updatedAt = new Date().toISOString();
  }

  /**
   * Remove a like
   */
  removeLike() {
    if (this.likes > 0) {
      this.likes--;
      this.updatedAt = new Date().toISOString();
    }
  }

  /**
   * Increment view count
   */
  incrementViews() {
    this.views++;
  }

  /**
   * Add a technology
   */
  addTechnology(technology) {
    if (!this.technologies.includes(technology)) {
      this.technologies.push(technology);
      this.updatedAt = new Date().toISOString();
    }
  }

  /**
   * Add a feature
   */
  addFeature(feature) {
    this.features.push(feature);
    this.updatedAt = new Date().toISOString();
  }

  /**
   * Add a tag
   */
  addTag(tag) {
    if (!this.tags.includes(tag)) {
      this.tags.push(tag);
      this.updatedAt = new Date().toISOString();
    }
  }

  // Query Methods

  /**
   * Check if project is completed
   */
  isCompleted() {
    return this.status === ProjectStatus.COMPLETED;
  }

  /**
   * Check if project is in progress
   */
  isInProgress() {
    return this.status === ProjectStatus.IN_PROGRESS;
  }

  /**
   * Check if project is draft
   */
  isDraft() {
    return this.status === ProjectStatus.DRAFT;
  }

  /**
   * Check if user can edit project
   */
  canBeEditedBy(user) {
    return user.isAdmin() || user.id === this.userId;
  }

  /**
   * Check if user can delete project
   */
  canBeDeletedBy(user) {
    return user.isAdmin() || user.id === this.userId;
  }

  /**
   * Get project age in days
   */
  getAgeInDays() {
    const now = new Date();
    const created = new Date(this.createdAt);
    const diffTime = Math.abs(now - created);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  // Validation

  /**
   * Validate project data
   */
  validate() {
    const errors = [];

    if (!this.title || this.title.length < 5) {
      errors.push('Title must be at least 5 characters long');
    }

    if (!this.description || this.description.length < 20) {
      errors.push('Description must be at least 20 characters long');
    }

    if (!this.userId) {
      errors.push('User ID is required');
    }

    if (!Object.values(ProjectStatus).includes(this.status)) {
      errors.push('Invalid project status');
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
      status: this.status,
      category: this.category,
      tags: this.tags,
      github_url: this.githubUrl,
      live_url: this.liveUrl,
      image_url: this.imageUrl,
      technologies: this.technologies,
      features: this.features,
      user_id: this.userId,
      likes: this.likes,
      views: this.views,
      created_at: this.createdAt,
      updated_at: this.updatedAt,
      completed_at: this.completedAt
    };
  }

  /**
   * Create Project from API response
   */
  static fromAPI(data) {
    return new Project(data);
  }

  /**
   * Create multiple Projects from API response array
   */
  static fromAPIArray(dataArray) {
    if (!Array.isArray(dataArray)) {
      return [];
    }
    return dataArray.map(data => Project.fromAPI(data));
  }
}

/**
 * Factory function to create a project
 */
export const createProject = (projectData) => {
  return new Project(projectData);
};
