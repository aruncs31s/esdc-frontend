import { ValidationResult } from '@/types/validation_errors';

/**
 * Course Level Enumeration
 */
export const CourseLevel = {
  BEGINNER: 'Beginner',
  INTERMEDIATE: 'Intermediate',
  ADVANCED: 'Advanced',
} as const;

export type CourseLevelType = (typeof CourseLevel)[keyof typeof CourseLevel];

/**
 * Course Status Enumeration
 */
export const CourseStatus = {
  DRAFT: 'draft',
  PUBLISHED: 'published',
  ARCHIVED: 'archived',
} as const;

export type CourseStatusType = (typeof CourseStatus)[keyof typeof CourseStatus];

/**
 * Module interface for course modules
 */
export interface CourseModule {
  id: number;
  title: string;
  duration: string;
  lessons: number;
  order?: number;
}

/**
 * Exam interface for course exams
 */
export interface CourseExam {
  id: number;
  title: string;
  duration: string;
  questions: number;
  passingScore?: number;
}

/**
 * Test interface for course tests
 */
export interface CourseTest {
  id: number;
  title: string;
  duration: string;
  questions: number;
}

/**
 * Course Comment/Review interface
 */
export interface CourseComment {
  id?: string;
  user: string;
  userId?: string;
  avatar: string;
  text: string;
  rating: number;
  createdAt?: string;
}

/**
 * Course constructor data type
 */
export interface CourseData {
  id?: number | string;
  title?: string;
  description?: string;
  instructor?: string;
  instructorId?: string;
  duration?: string;
  level?: CourseLevelType;
  enrolled?: number;
  rating?: number;
  image?: string;
  price?: number;
  isFree?: boolean;
  lessons?: number;
  category?: string;
  views?: number;
  likes?: number;
  comments?: number;
  status?: CourseStatusType;
  modules?: CourseModule[];
  exams?: CourseExam[];
  tests?: CourseTest[];
  commentsData?: CourseComment[];
  prerequisites?: string[];
  learningOutcomes?: string[];
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Course Entity (Aggregate Root)
 * Represents a course in the Learning Management System
 */
export class Course {
  id: number | string;
  title: string;
  description: string;
  instructor: string;
  instructorId?: string;
  duration: string;
  level: CourseLevelType;
  enrolled: number;
  rating: number;
  image: string;
  price: number;
  isFree: boolean;
  lessons: number;
  category: string;
  views: number;
  likes: number;
  comments: number;
  status: CourseStatusType;
  modules: CourseModule[];
  exams: CourseExam[];
  tests: CourseTest[];
  commentsData: CourseComment[];
  prerequisites: string[];
  learningOutcomes: string[];
  createdAt: string;
  updatedAt: string;

  constructor(data: CourseData = {}) {
    this.id = data.id ?? 0;
    this.title = data.title || '';
    this.description = data.description || '';
    this.instructor = data.instructor || '';
    this.instructorId = data.instructorId;
    this.duration = data.duration || '';
    this.level = data.level || CourseLevel.BEGINNER;
    this.enrolled = data.enrolled || 0;
    this.rating = data.rating || 0;
    this.image = data.image || '';
    this.price = data.price || 0;
    this.isFree = data.isFree ?? data.price === 0;
    this.lessons = data.lessons || 0;
    this.category = data.category || '';
    this.views = data.views || 0;
    this.likes = data.likes || 0;
    this.comments = data.comments || 0;
    this.status = data.status || CourseStatus.PUBLISHED;
    this.modules = data.modules || [];
    this.exams = data.exams || [];
    this.tests = data.tests || [];
    this.commentsData = data.commentsData || [];
    this.prerequisites = data.prerequisites || [];
    this.learningOutcomes = data.learningOutcomes || [];
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
  }

  // Business Logic Methods

  /**
   * Publish the course
   */
  publish(): void {
    if (this.status === CourseStatus.PUBLISHED) {
      throw new Error('Course is already published');
    }
    const validation = this.validate();
    if (!validation.valid) {
      throw new Error(`Cannot publish course: ${validation.errors.join(', ')}`);
    }
    this.status = CourseStatus.PUBLISHED;
    this.updatedAt = new Date().toISOString();
  }

  /**
   * Archive the course
   */
  archive(): void {
    this.status = CourseStatus.ARCHIVED;
    this.updatedAt = new Date().toISOString();
  }

  /**
   * Add a module to the course
   */
  addModule(module: CourseModule): void {
    this.modules.push({
      ...module,
      order: module.order ?? this.modules.length + 1,
    });
    this.lessons = this.calculateTotalLessons();
    this.updatedAt = new Date().toISOString();
  }

  /**
   * Remove a module from the course
   */
  removeModule(moduleId: number): void {
    this.modules = this.modules.filter((m) => m.id !== moduleId);
    this.lessons = this.calculateTotalLessons();
    this.updatedAt = new Date().toISOString();
  }

  /**
   * Add an exam to the course
   */
  addExam(exam: CourseExam): void {
    this.exams.push(exam);
    this.updatedAt = new Date().toISOString();
  }

  /**
   * Add a test to the course
   */
  addTest(test: CourseTest): void {
    this.tests.push(test);
    this.updatedAt = new Date().toISOString();
  }

  /**
   * Add a review/comment to the course
   */
  addReview(review: CourseComment): void {
    this.commentsData.push({
      ...review,
      createdAt: review.createdAt || new Date().toISOString(),
    });
    this.comments = this.commentsData.length;
    this.updateRating();
    this.updatedAt = new Date().toISOString();
  }

  /**
   * Enroll a user (increment enrolled count)
   */
  enrollUser(): void {
    this.enrolled++;
    this.updatedAt = new Date().toISOString();
  }

  /**
   * Unenroll a user (decrement enrolled count)
   */
  unenrollUser(): void {
    if (this.enrolled > 0) {
      this.enrolled--;
      this.updatedAt = new Date().toISOString();
    }
  }

  /**
   * Increment view count
   */
  incrementViews(): void {
    this.views++;
  }

  /**
   * Add a like
   */
  addLike(): void {
    this.likes++;
    this.updatedAt = new Date().toISOString();
  }

  /**
   * Remove a like
   */
  removeLike(): void {
    if (this.likes > 0) {
      this.likes--;
      this.updatedAt = new Date().toISOString();
    }
  }

  // Private Helper Methods

  /**
   * Calculate total lessons from modules
   */
  private calculateTotalLessons(): number {
    return this.modules.reduce((total, module) => total + module.lessons, 0);
  }

  /**
   * Update average rating from reviews
   */
  private updateRating(): void {
    if (this.commentsData.length === 0) {
      this.rating = 0;
      return;
    }
    const totalRating = this.commentsData.reduce((sum, comment) => sum + comment.rating, 0);
    this.rating = Math.round((totalRating / this.commentsData.length) * 10) / 10;
  }

  // Query Methods

  /**
   * Check if course is published
   */
  isPublished(): boolean {
    return this.status === CourseStatus.PUBLISHED;
  }

  /**
   * Check if course is draft
   */
  isDraft(): boolean {
    return this.status === CourseStatus.DRAFT;
  }

  /**
   * Check if course is archived
   */
  isArchived(): boolean {
    return this.status === CourseStatus.ARCHIVED;
  }

  /**
   * Check if course is free
   */
  isFreeAccess(): boolean {
    return this.isFree || this.price === 0;
  }

  /**
   * Get total duration as minutes
   */
  getTotalDurationMinutes(): number {
    // Parse duration string (e.g., "6 weeks", "10 hours")
    const match = this.duration.match(/(\d+)\s*(week|hour|minute|day)/i);
    if (!match) return 0;

    const value = parseInt(match[1], 10);
    const unit = match[2].toLowerCase();

    switch (unit) {
      case 'week':
        return value * 7 * 24 * 60;
      case 'day':
        return value * 24 * 60;
      case 'hour':
        return value * 60;
      case 'minute':
        return value;
      default:
        return 0;
    }
  }

  /**
   * Get formatted price
   */
  getFormattedPrice(): string {
    if (this.isFreeAccess()) {
      return 'FREE';
    }
    return `₹${this.price.toLocaleString()}`;
  }

  /**
   * Get level badge class
   */
  getLevelBadgeClass(): string {
    switch (this.level) {
      case CourseLevel.BEGINNER:
        return 'level-badge-beginner';
      case CourseLevel.INTERMEDIATE:
        return 'level-badge-intermediate';
      case CourseLevel.ADVANCED:
        return 'level-badge-advanced';
      default:
        return '';
    }
  }

  // Validation

  /**
   * Validate course data
   */
  validate(): ValidationResult {
    const errors: string[] = [];

    if (!this.title || this.title.length < 5) {
      errors.push('Title must be at least 5 characters long');
    }

    if (!this.description || this.description.length < 20) {
      errors.push('Description must be at least 20 characters long');
    }

    if (!this.instructor) {
      errors.push('Instructor is required');
    }

    if (!this.category) {
      errors.push('Category is required');
    }

    if (!Object.values(CourseLevel).includes(this.level)) {
      errors.push('Invalid course level');
    }

    if (this.modules.length === 0) {
      errors.push('Course must have at least one module');
    }

    if (this.price < 0) {
      errors.push('Price cannot be negative');
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
      title: this.title,
      description: this.description,
      instructor: this.instructor,
      instructor_id: this.instructorId,
      duration: this.duration,
      level: this.level,
      enrolled: this.enrolled,
      rating: this.rating,
      image: this.image,
      price: this.price,
      is_free: this.isFree,
      lessons: this.lessons,
      category: this.category,
      views: this.views,
      likes: this.likes,
      comments: this.comments,
      status: this.status,
      modules: this.modules,
      exams: this.exams,
      tests: this.tests,
      comments_data: this.commentsData,
      prerequisites: this.prerequisites,
      learning_outcomes: this.learningOutcomes,
      created_at: this.createdAt,
      updated_at: this.updatedAt,
    };
  }

  /**
   * Create Course from API response
   */
  static fromAPI(data: Record<string, unknown>): Course {
    return new Course({
      id: data.id as number | string,
      title: data.title as string,
      description: data.description as string,
      instructor: data.instructor as string,
      instructorId: (data.instructor_id || data.instructorId) as string | undefined,
      duration: data.duration as string,
      level: data.level as CourseLevelType,
      enrolled: data.enrolled as number,
      rating: data.rating as number,
      image: (data.image || data.image_url) as string,
      price: data.price as number,
      isFree: (data.is_free ?? data.isFree) as boolean,
      lessons: data.lessons as number,
      category: data.category as string,
      views: data.views as number,
      likes: data.likes as number,
      comments: data.comments as number,
      status: data.status as CourseStatusType,
      modules: (data.modules || []) as CourseModule[],
      exams: (data.exams || []) as CourseExam[],
      tests: (data.tests || []) as CourseTest[],
      commentsData: (data.comments_data || data.commentsData || []) as CourseComment[],
      prerequisites: (data.prerequisites || []) as string[],
      learningOutcomes: (data.learning_outcomes || data.learningOutcomes || []) as string[],
      createdAt: (data.created_at || data.createdAt) as string,
      updatedAt: (data.updated_at || data.updatedAt) as string,
    });
  }

  /**
   * Create multiple Courses from API response array
   */
  static fromAPIArray(dataArray: Record<string, unknown>[]): Course[] {
    if (!Array.isArray(dataArray)) {
      return [];
    }
    return dataArray.map((data) => Course.fromAPI(data));
  }
}

/**
 * Factory function to create a course
 */
export const createCourse = (courseData: CourseData): Course => {
  return new Course(courseData);
};
