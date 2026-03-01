import { Course } from '../entities/Course';

/**
 * Course Repository Interface
 * Defines the contract for course data access in the LMS
 */
export interface ICourseRepository {
  /**
   * Find all courses with optional filters
   */
  findAll(filters?: {
    category?: string;
    level?: string;
    status?: string;
    search?: string;
    isFree?: boolean;
  }): Promise<Course[]>;

  /**
   * Find a course by its ID
   */
  findById(id: string | number): Promise<Course | null>;

  /**
   * Find courses by category
   */
  findByCategory(category: string): Promise<Course[]>;

  /**
   * Find courses by instructor ID
   */
  findByInstructor(instructorId: string): Promise<Course[]>;

  /**
   * Find popular courses (by enrollment count)
   */
  findPopular(limit?: number): Promise<Course[]>;

  /**
   * Find featured/recommended courses
   */
  findFeatured(): Promise<Course[]>;

  /**
   * Find courses by level
   */
  findByLevel(level: string): Promise<Course[]>;

  /**
   * Save a course (create or update)
   */
  save(course: Course): Promise<Course>;

  /**
   * Delete a course by ID
   */
  delete(id: string | number): Promise<boolean>;

  /**
   * Get total count of courses
   */
  count(filters?: Record<string, unknown>): Promise<number>;

  /**
   * Get all available categories
   */
  getCategories(): Promise<string[]>;

  /**
   * Search courses by query
   */
  search(query: string): Promise<Course[]>;
}
