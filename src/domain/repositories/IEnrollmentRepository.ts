import { Enrollment } from '../entities/Enrollment';

/**
 * Enrollment Repository Interface
 * Defines the contract for enrollment data access in the LMS
 */
export interface IEnrollmentRepository {
  /**
   * Find all enrollments for a user
   */
  findByUserId(userId: string): Promise<Enrollment[]>;

  /**
   * Find all enrollments for a course
   */
  findByCourseId(courseId: string | number): Promise<Enrollment[]>;

  /**
   * Find a specific enrollment by user and course
   */
  findByUserAndCourse(userId: string, courseId: string | number): Promise<Enrollment | null>;

  /**
   * Find an enrollment by its ID
   */
  findById(id: string | number): Promise<Enrollment | null>;

  /**
   * Save an enrollment (create or update)
   */
  save(enrollment: Enrollment): Promise<Enrollment>;

  /**
   * Delete an enrollment by ID
   */
  delete(id: string | number): Promise<boolean>;

  /**
   * Get active enrollments for a user
   */
  findActiveByUserId(userId: string): Promise<Enrollment[]>;

  /**
   * Get completed enrollments for a user
   */
  findCompletedByUserId(userId: string): Promise<Enrollment[]>;

  /**
   * Check if user is enrolled in a course
   */
  isEnrolled(userId: string, courseId: string | number): Promise<boolean>;

  /**
   * Get enrollment count for a course
   */
  countByCourseId(courseId: string | number): Promise<number>;

  /**
   * Enroll a user in a course
   */
  enroll(userId: string, courseId: string | number, paymentAmount?: number): Promise<Enrollment>;

  /**
   * Unenroll a user from a course
   */
  unenroll(userId: string, courseId: string | number): Promise<boolean>;
}
