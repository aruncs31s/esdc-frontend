import { ProjectStatusType } from "@/types";
import { ProjectStatus, TagDetails, ContributorDetails, TechnologyDetails, ProjectData } from "@/types/project";
import { ValidationResult } from "@/types/validation_errors";


export class Project {
  id?: string;
  title: string;
  description?: string;
  image?: string;
  status: ProjectStatusType;
  category: string;
  tags?: TagDetails[];
  github_link?: string;
  live_url?: string;
  user_id?: string | null;
  likes: number;
  views: number;
  created_at: string;
  updated_at?: string;
  completed_at?: string | null;
  contributors?: ContributorDetails[];
  technologies?: TechnologyDetails[];
  created_by?: string;
  modified_by?: string;
  cost?: number;

  constructor(data: ProjectData = {}) {
    this.id = data.id;
    this.title = data.title || '';
    this.description = data.description || '';
    this.status = data.status || ProjectStatus.DRAFT;
    this.category = data.category || '';
    this.tags = data.tags || [];
    this.github_link = data.github_link || '';
    this.live_url = data.live_url || '';
    this.image = data.image || '';
    this.technologies = data.technologies || [];
    this.user_id = data.user_id || null;
    this.likes = data.likes || 0;
    this.views = data.views || 0;
    this.created_at = data.created_at || new Date().toISOString();
    this.updated_at = data.updated_at || new Date().toISOString();
    this.completed_at = data.completed_at || null;
    this.cost = data.cost || 0;
    this.contributors = data.contributors || [];
  }

  start(): void {
    if (this.status !== ProjectStatus.DRAFT) {
      throw new Error('Can only start draft projects');
    }
    this.status = ProjectStatus.IN_PROGRESS;
    this.updated_at = new Date().toISOString();
  }

  complete(): void {
    if (this.status === ProjectStatus.COMPLETED) {
      throw new Error('Project is already completed');
    }
    this.status = ProjectStatus.COMPLETED;
    this.completed_at = new Date().toISOString();
    this.updated_at = new Date().toISOString();
  }

  archive(): void {
    this.status = ProjectStatus.ARCHIVED;
    this.updated_at = new Date().toISOString();
  }

  addLike(): void {
    this.likes++;
    this.updated_at = new Date().toISOString();
  }

  removeLike(): void {
    if (this.likes > 0) {
      this.likes--;
      this.updated_at = new Date().toISOString();
    }
  }

  incrementViews(): void {
    this.views++;
  }

  // addTechnology(technology: string): void {
  //   if (!this.technologies.some(t => t.name === technology)) {
  //     this.technologies.push({ id: this.technologies.length + 1, name: technology });
  //     this.updated_at = new Date().toISOString();
  //   }
  // }

  // addFeature(feature: string): void {
  //   this..push(feature);
  //   this.updatedAt = new Date().toISOString();
  // }

  // addTag(tag: string): void {
  //   if (!this.tags.includes(tag)) {
  //     this.tags.push(tag);
  //     this.updatedAt = new Date().toISOString();
  //   }
  // }

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
    return user.isAdmin() || user.id === this.user_id;
  }

  canBeDeletedBy(user: any): boolean {
    return user.isAdmin() || user.id === this.user_id;
  }

  getAgeInDays(): number {
    const now = new Date();
    const created = new Date(this.created_at);
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

    if (!this.user_id) {
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
      github_link: this.github_link,
      live_url: this.live_url,
      image_url: this.image,
      technologies: this.technologies,
      likes: this.likes,
      views: this.views,
      created_at: this.created_at,
      updated_at: this.updated_at,
      completed_at: this.completed_at
    };
  }

  static fromAPI(data: any): Project {

    const mappedData = {
      id: data.id?.toString() || null,
      title: data.title,
      description: data.description,
      status: data.status,
      category: data.category,
      tags: data.tags_details || data.tags || [],
      github_link: data.github_link,
      live_url: data.live_url,
      image: data.image_url || data.image,
      technologies: data.technology_details || data.technologies || [],
      user_id: data.user_id?.toString() || data.creator_details?.id?.toString() || null,
      likes: data.likes,
      views: data.views,
      created_at: data.created_at,
      updated_at: data.updated_at,
      completed_at: data.completed_at,
      contributors: data.contributors_details || data.contributors || [],
      cost: data.cost
    };

    console.log('✅ Mapped project data:', mappedData);
    return new Project(mappedData);
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
