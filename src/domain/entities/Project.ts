export const ProjectStatus = {
  DRAFT: 'draft',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  ARCHIVED: 'archived'
} as const;

export type ProjectStatusType = typeof ProjectStatus[keyof typeof ProjectStatus];

interface ProjectData {
  id?: string | null;
  title?: string;
  description?: string;
  status?: ProjectStatusType;
  category?: string;
  tags?: string[];
  githubUrl?: string;
  github_link?: string;
  liveUrl?: string;
  live_url?: string;
  image?: string;
  image_url?: string;
  technologies?: string[];
  features?: string[];
  userId?: string | null;
  user_id?: string | null;
  likes?: number;
  views?: number;
  createdAt?: string;
  created_at?: string;
  updatedAt?: string;
  updated_at?: string;
  completedAt?: string | null;
  completed_at?: string | null;
  contributors?: string[];
  cost ?: number;
}

interface ValidationResult {
  valid: boolean;
  errors: string[];
}

export class Project {
  id: string | null;
  title: string;
  description: string;
  status: ProjectStatusType;
  category: string;
  tags: string[];
  githubUrl: string;
  liveUrl: string;
  imageUrl: string;
  technologies: string[];
  features: string[];
  userId: string | null;
  likes: number;
  views: number;
  createdAt: string;
  updatedAt: string;
  completedAt: string | null;
  cost: number;
  contributors?: string[];


  constructor(data: ProjectData = {}) {
    this.id = data.id || null;
    this.title = data.title || '';
    this.description = data.description || '';
    this.status = data.status || ProjectStatus.DRAFT;
    this.category = data.category || '';
    this.tags = data.tags || [];
    this.githubUrl = data.githubUrl || data.github_link || '';
    this.liveUrl = data.liveUrl || data.live_url || '';
    this.imageUrl = data.image || data.image || '';
    this.technologies = data.technologies || [];
    this.features = data.features || [];
    this.userId = data.userId || data.user_id || null;
    this.likes = data.likes || 0;
    this.views = data.views || 0;
    this.createdAt = data.createdAt || data.created_at || new Date().toISOString();
    this.updatedAt = data.updatedAt || data.updated_at || new Date().toISOString();
    this.completedAt = data.completedAt || data.completed_at || null;
    this.cost = data.cost || 0;
    this.contributors = data.contributors || [];
  }

  start(): void {
    if (this.status !== ProjectStatus.DRAFT) {
      throw new Error('Can only start draft projects');
    }
    this.status = ProjectStatus.IN_PROGRESS;
    this.updatedAt = new Date().toISOString();
  }

  complete(): void {
    if (this.status === ProjectStatus.COMPLETED) {
      throw new Error('Project is already completed');
    }
    this.status = ProjectStatus.COMPLETED;
    this.completedAt = new Date().toISOString();
    this.updatedAt = new Date().toISOString();
  }

  archive(): void {
    this.status = ProjectStatus.ARCHIVED;
    this.updatedAt = new Date().toISOString();
  }

  addLike(): void {
    this.likes++;
    this.updatedAt = new Date().toISOString();
  }

  removeLike(): void {
    if (this.likes > 0) {
      this.likes--;
      this.updatedAt = new Date().toISOString();
    }
  }

  incrementViews(): void {
    this.views++;
  }

  addTechnology(technology: string): void {
    if (!this.technologies.includes(technology)) {
      this.technologies.push(technology);
      this.updatedAt = new Date().toISOString();
    }
  }

  addFeature(feature: string): void {
    this.features.push(feature);
    this.updatedAt = new Date().toISOString();
  }

  addTag(tag: string): void {
    if (!this.tags.includes(tag)) {
      this.tags.push(tag);
      this.updatedAt = new Date().toISOString();
    }
  }

  isCompleted(): boolean {
    return this.status === ProjectStatus.COMPLETED;
  }

  isInProgress(): boolean {
    return this.status === ProjectStatus.IN_PROGRESS;
  }

  isDraft(): boolean {
    return this.status === ProjectStatus.DRAFT;
  }

  canBeEditedBy(user: any): boolean {
    return user.isAdmin() || user.id === this.userId;
  }

  canBeDeletedBy(user: any): boolean {
    return user.isAdmin() || user.id === this.userId;
  }

  getAgeInDays(): number {
    const now = new Date();
    const created = new Date(this.createdAt);
    const diffTime = Math.abs(now.getTime() - created.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  validate(): ValidationResult {
    const errors: string[] = [];

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

  toJSON(): Record<string, any> {
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

  static fromAPI(data: ProjectData): Project {
    return new Project(data);
  }

  static fromAPIArray(dataArray: ProjectData[]): Project[] {
    if (!Array.isArray(dataArray)) {
      return [];
    }
    return dataArray.map(data => Project.fromAPI(data));
  }
}

export const createProject = (projectData: ProjectData): Project => {
  return new Project(projectData);
};
