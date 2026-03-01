import { CourseProgress } from '../entities/CourseProgress';

/**
 * Course Progress Repository Interface
 * Defines the contract for course progress data access in the LMS
 */
export interface ICourseProgressRepository {
  /**
   * Find progress by user and course
   */
  findByUserAndCourse(userId: string, courseId: string | number): Promise<CourseProgress | null>;

  /**
   * Find all progress records for a user
   */
  findByUserId(userId: string): Promise<CourseProgress[]>;

  /**
   * Find progress by enrollment ID
   */
  findByEnrollmentId(enrollmentId: string | number): Promise<CourseProgress | null>;

  /**
   * Find progress by its ID
   */
  findById(id: string | number): Promise<CourseProgress | null>;

  /**
   * Save progress (create or update)
   */
  save(progress: CourseProgress): Promise<CourseProgress>;

  /**
   * Delete progress by ID
   */
  delete(id: string | number): Promise<boolean>;

  /**
   * Initialize progress for a new enrollment
   */
  initializeProgress(
    userId: string,
    courseId: string | number,
    enrollmentId: string | number,
    totalLessons: number,
    totalModules: number
  ): Promise<CourseProgress>;

  /**
   * Update lesson progress
   */
  updateLessonProgress(
    userId: string,
    courseId: string | number,
    lessonId: string | number,
    completed: boolean,
    timeSpent?: number
  ): Promise<CourseProgress>;

  /**
   * Record quiz result
   */
  recordQuizResult(
    userId: string,
    courseId: string | number,
    quizId: string | number,
    score: number,
    maxScore: number,
    passingScore: number
  ): Promise<CourseProgress>;

  /**
   * Get leaderboard for a course (users with highest progress)
   */
  getLeaderboard(courseId: string | number, limit?: number): Promise<CourseProgress[]>;

  /**
   * Get completion statistics for a course
   */
  getCourseStatistics(courseId: string | number): Promise<{
    totalEnrolled: number;
    averageProgress: number;
    completionRate: number;
    averageTimeSpent: number;
  }>;
}
