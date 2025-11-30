import { ValidationResult } from '@/types/validation_errors';

/**
 * Lesson Type Enumeration
 */
export const LessonType = {
  VIDEO: 'video',
  TEXT: 'text',
  QUIZ: 'quiz',
  ASSIGNMENT: 'assignment',
  INTERACTIVE: 'interactive',
} as const;

export type LessonTypeType = (typeof LessonType)[keyof typeof LessonType];

/**
 * Lesson Status Enumeration
 */
export const LessonStatus = {
  DRAFT: 'draft',
  PUBLISHED: 'published',
  ARCHIVED: 'archived',
} as const;

export type LessonStatusType = (typeof LessonStatus)[keyof typeof LessonStatus];

/**
 * Resource interface for lesson resources
 */
export interface LessonResource {
  id: string;
  title: string;
  type: 'pdf' | 'code' | 'link' | 'file';
  url: string;
  size?: number;
}

/**
 * Lesson constructor data type
 */
export interface LessonData {
  id?: string | number;
  courseId?: string | number;
  moduleId?: string | number;
  title?: string;
  description?: string;
  content?: string;
  type?: LessonTypeType;
  duration?: number; // in minutes
  order?: number;
  videoUrl?: string;
  status?: LessonStatusType;
  resources?: LessonResource[];
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Lesson Entity
 * Represents a single lesson within a course module
 */
export class Lesson {
  id: string | number;
  courseId: string | number;
  moduleId: string | number;
  title: string;
  description: string;
  content: string;
  type: LessonTypeType;
  duration: number;
  order: number;
  videoUrl?: string;
  status: LessonStatusType;
  resources: LessonResource[];
  createdAt: string;
  updatedAt: string;

  constructor(data: LessonData = {}) {
    this.id = data.id ?? '';
    this.courseId = data.courseId ?? '';
    this.moduleId = data.moduleId ?? '';
    this.title = data.title || '';
    this.description = data.description || '';
    this.content = data.content || '';
    this.type = data.type || LessonType.TEXT;
    this.duration = data.duration || 0;
    this.order = data.order || 0;
    this.videoUrl = data.videoUrl;
    this.status = data.status || LessonStatus.DRAFT;
    this.resources = data.resources || [];
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
  }

  // Business Logic Methods

  /**
   * Publish the lesson
   */
  publish(): void {
    if (this.status === LessonStatus.PUBLISHED) {
      throw new Error('Lesson is already published');
    }
    const validation = this.validate();
    if (!validation.valid) {
      throw new Error(`Cannot publish lesson: ${validation.errors.join(', ')}`);
    }
    this.status = LessonStatus.PUBLISHED;
    this.updatedAt = new Date().toISOString();
  }

  /**
   * Archive the lesson
   */
  archive(): void {
    this.status = LessonStatus.ARCHIVED;
    this.updatedAt = new Date().toISOString();
  }

  /**
   * Add a resource to the lesson
   */
  addResource(resource: LessonResource): void {
    this.resources.push(resource);
    this.updatedAt = new Date().toISOString();
  }

  /**
   * Remove a resource from the lesson
   */
  removeResource(resourceId: string): void {
    this.resources = this.resources.filter((r) => r.id !== resourceId);
    this.updatedAt = new Date().toISOString();
  }

  /**
   * Update lesson content
   */
  updateContent(content: string): void {
    this.content = content;
    this.updatedAt = new Date().toISOString();
  }

  /**
   * Set video URL for video lessons
   */
  setVideoUrl(url: string): void {
    if (this.type !== LessonType.VIDEO) {
      throw new Error('Video URL can only be set for video lessons');
    }
    this.videoUrl = url;
    this.updatedAt = new Date().toISOString();
  }

  // Query Methods

  /**
   * Check if lesson is published
   */
  isPublished(): boolean {
    return this.status === LessonStatus.PUBLISHED;
  }

  /**
   * Check if lesson is a video lesson
   */
  isVideo(): boolean {
    return this.type === LessonType.VIDEO;
  }

  /**
   * Check if lesson is a quiz
   */
  isQuiz(): boolean {
    return this.type === LessonType.QUIZ;
  }

  /**
   * Get formatted duration
   */
  getFormattedDuration(): string {
    if (this.duration < 60) {
      return `${this.duration} min`;
    }
    const hours = Math.floor(this.duration / 60);
    const minutes = this.duration % 60;
    return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
  }

  // Validation

  /**
   * Validate lesson data
   */
  validate(): ValidationResult {
    const errors: string[] = [];

    if (!this.title || this.title.length < 3) {
      errors.push('Title must be at least 3 characters long');
    }

    if (!this.courseId) {
      errors.push('Course ID is required');
    }

    if (!this.moduleId) {
      errors.push('Module ID is required');
    }

    if (!Object.values(LessonType).includes(this.type)) {
      errors.push('Invalid lesson type');
    }

    if (this.type === LessonType.VIDEO && !this.videoUrl) {
      errors.push('Video URL is required for video lessons');
    }

    if (this.duration < 0) {
      errors.push('Duration cannot be negative');
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
  toJSON(): Record<string, unknown> {
    return {
      id: this.id,
      course_id: this.courseId,
      module_id: this.moduleId,
      title: this.title,
      description: this.description,
      content: this.content,
      type: this.type,
      duration: this.duration,
      order: this.order,
      video_url: this.videoUrl,
      status: this.status,
      resources: this.resources,
      created_at: this.createdAt,
      updated_at: this.updatedAt,
    };
  }

  /**
   * Create Lesson from API response
   */
  static fromAPI(data: Record<string, unknown>): Lesson {
    return new Lesson({
      id: data.id as string | number,
      courseId: (data.course_id || data.courseId) as string | number,
      moduleId: (data.module_id || data.moduleId) as string | number,
      title: data.title as string,
      description: data.description as string,
      content: data.content as string,
      type: data.type as LessonTypeType,
      duration: data.duration as number,
      order: data.order as number,
      videoUrl: (data.video_url || data.videoUrl) as string | undefined,
      status: data.status as LessonStatusType,
      resources: (data.resources || []) as LessonResource[],
      createdAt: (data.created_at || data.createdAt) as string,
      updatedAt: (data.updated_at || data.updatedAt) as string,
    });
  }

  /**
   * Create multiple Lessons from API response array
   */
  static fromAPIArray(dataArray: Record<string, unknown>[]): Lesson[] {
    if (!Array.isArray(dataArray)) {
      return [];
    }
    return dataArray.map((data) => Lesson.fromAPI(data));
  }
}

/**
 * Factory function to create a lesson
 */
export const createLesson = (lessonData: LessonData): Lesson => {
  return new Lesson(lessonData);
};
