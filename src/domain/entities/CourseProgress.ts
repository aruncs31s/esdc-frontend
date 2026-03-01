import { ValidationResult } from '@/types/validation_errors';

/**
 * Course Progress Status Enumeration
 */
export const ProgressStatus = {
  NOT_STARTED: 'not_started',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
} as const;

export type ProgressStatusType = (typeof ProgressStatus)[keyof typeof ProgressStatus];

/**
 * Lesson Progress interface
 */
export interface LessonProgress {
  lessonId: string | number;
  status: ProgressStatusType;
  startedAt: string | null;
  completedAt: string | null;
  timeSpent: number; // in seconds
  lastAccessedAt: string;
}

/**
 * Module Progress interface
 */
export interface ModuleProgress {
  moduleId: number;
  lessonsCompleted: number;
  totalLessons: number;
  status: ProgressStatusType;
}

/**
 * Quiz/Test Result interface
 */
export interface QuizResult {
  quizId: string | number;
  score: number;
  maxScore: number;
  passed: boolean;
  completedAt: string;
  attempts: number;
}

/**
 * Course Progress constructor data type
 */
export interface CourseProgressData {
  id?: string | number;
  userId?: string;
  courseId?: string | number;
  enrollmentId?: string | number;
  overallProgress?: number; // percentage 0-100
  status?: ProgressStatusType;
  lessonsCompleted?: number;
  totalLessons?: number;
  modulesCompleted?: number;
  totalModules?: number;
  currentLessonId?: string | number | null;
  currentModuleId?: number | null;
  lessonProgress?: LessonProgress[];
  moduleProgress?: ModuleProgress[];
  quizResults?: QuizResult[];
  totalTimeSpent?: number; // in seconds
  lastAccessedAt?: string;
  startedAt?: string | null;
  completedAt?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Course Progress Entity
 * Represents a user's progress in a course
 */
export class CourseProgress {
  id: string | number;
  userId: string;
  courseId: string | number;
  enrollmentId: string | number;
  overallProgress: number;
  status: ProgressStatusType;
  lessonsCompleted: number;
  totalLessons: number;
  modulesCompleted: number;
  totalModules: number;
  currentLessonId: string | number | null;
  currentModuleId: number | null;
  lessonProgress: LessonProgress[];
  moduleProgress: ModuleProgress[];
  quizResults: QuizResult[];
  totalTimeSpent: number;
  lastAccessedAt: string;
  startedAt: string | null;
  completedAt: string | null;
  createdAt: string;
  updatedAt: string;

  constructor(data: CourseProgressData = {}) {
    this.id = data.id ?? '';
    this.userId = data.userId || '';
    this.courseId = data.courseId ?? '';
    this.enrollmentId = data.enrollmentId ?? '';
    this.overallProgress = data.overallProgress || 0;
    this.status = data.status || ProgressStatus.NOT_STARTED;
    this.lessonsCompleted = data.lessonsCompleted || 0;
    this.totalLessons = data.totalLessons || 0;
    this.modulesCompleted = data.modulesCompleted || 0;
    this.totalModules = data.totalModules || 0;
    this.currentLessonId = data.currentLessonId ?? null;
    this.currentModuleId = data.currentModuleId ?? null;
    this.lessonProgress = data.lessonProgress || [];
    this.moduleProgress = data.moduleProgress || [];
    this.quizResults = data.quizResults || [];
    this.totalTimeSpent = data.totalTimeSpent || 0;
    this.lastAccessedAt = data.lastAccessedAt || new Date().toISOString();
    this.startedAt = data.startedAt ?? null;
    this.completedAt = data.completedAt ?? null;
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
  }

  // Business Logic Methods

  /**
   * Start the course
   */
  start(): void {
    if (this.status !== ProgressStatus.NOT_STARTED) {
      throw new Error('Course has already been started');
    }
    this.status = ProgressStatus.IN_PROGRESS;
    this.startedAt = new Date().toISOString();
    this.lastAccessedAt = new Date().toISOString();
    this.updatedAt = new Date().toISOString();
  }

  /**
   * Mark a lesson as started
   */
  startLesson(lessonId: string | number): void {
    const existingProgress = this.lessonProgress.find((lp) => lp.lessonId === lessonId);
    if (existingProgress) {
      existingProgress.lastAccessedAt = new Date().toISOString();
      if (existingProgress.status === ProgressStatus.NOT_STARTED) {
        existingProgress.status = ProgressStatus.IN_PROGRESS;
        existingProgress.startedAt = new Date().toISOString();
      }
    } else {
      this.lessonProgress.push({
        lessonId,
        status: ProgressStatus.IN_PROGRESS,
        startedAt: new Date().toISOString(),
        completedAt: null,
        timeSpent: 0,
        lastAccessedAt: new Date().toISOString(),
      });
    }
    this.currentLessonId = lessonId;
    this.lastAccessedAt = new Date().toISOString();
    this.updatedAt = new Date().toISOString();
  }

  /**
   * Mark a lesson as completed
   */
  completeLesson(lessonId: string | number, timeSpent: number = 0): void {
    const lessonProgressItem = this.lessonProgress.find((lp) => lp.lessonId === lessonId);
    if (lessonProgressItem) {
      lessonProgressItem.status = ProgressStatus.COMPLETED;
      lessonProgressItem.completedAt = new Date().toISOString();
      lessonProgressItem.timeSpent += timeSpent;
      lessonProgressItem.lastAccessedAt = new Date().toISOString();
    } else {
      this.lessonProgress.push({
        lessonId,
        status: ProgressStatus.COMPLETED,
        startedAt: new Date().toISOString(),
        completedAt: new Date().toISOString(),
        timeSpent,
        lastAccessedAt: new Date().toISOString(),
      });
    }

    this.lessonsCompleted = this.lessonProgress.filter(
      (lp) => lp.status === ProgressStatus.COMPLETED
    ).length;
    this.totalTimeSpent += timeSpent;
    this.recalculateProgress();
    this.lastAccessedAt = new Date().toISOString();
    this.updatedAt = new Date().toISOString();
  }

  /**
   * Update time spent on a lesson
   */
  updateTimeSpent(lessonId: string | number, additionalTime: number): void {
    const lessonProgressItem = this.lessonProgress.find((lp) => lp.lessonId === lessonId);
    if (lessonProgressItem) {
      lessonProgressItem.timeSpent += additionalTime;
      lessonProgressItem.lastAccessedAt = new Date().toISOString();
    }
    this.totalTimeSpent += additionalTime;
    this.lastAccessedAt = new Date().toISOString();
    this.updatedAt = new Date().toISOString();
  }

  /**
   * Record quiz result
   */
  recordQuizResult(
    quizId: string | number,
    score: number,
    maxScore: number,
    passingScore: number
  ): void {
    const existingResult = this.quizResults.find((qr) => qr.quizId === quizId);
    const passed = score >= passingScore;

    if (existingResult) {
      existingResult.score = Math.max(existingResult.score, score);
      existingResult.passed = existingResult.passed || passed;
      existingResult.attempts += 1;
      if (score > existingResult.score) {
        existingResult.completedAt = new Date().toISOString();
      }
    } else {
      this.quizResults.push({
        quizId,
        score,
        maxScore,
        passed,
        completedAt: new Date().toISOString(),
        attempts: 1,
      });
    }
    this.updatedAt = new Date().toISOString();
  }

  /**
   * Complete a module
   */
  completeModule(moduleId: number): void {
    const moduleProgressItem = this.moduleProgress.find((mp) => mp.moduleId === moduleId);
    if (moduleProgressItem) {
      moduleProgressItem.status = ProgressStatus.COMPLETED;
      moduleProgressItem.lessonsCompleted = moduleProgressItem.totalLessons;
    }
    this.modulesCompleted = this.moduleProgress.filter(
      (mp) => mp.status === ProgressStatus.COMPLETED
    ).length;
    this.recalculateProgress();
    this.updatedAt = new Date().toISOString();
  }

  /**
   * Complete the entire course
   */
  completeCourse(): void {
    if (this.status === ProgressStatus.COMPLETED) {
      throw new Error('Course is already completed');
    }
    this.status = ProgressStatus.COMPLETED;
    this.overallProgress = 100;
    this.completedAt = new Date().toISOString();
    this.lastAccessedAt = new Date().toISOString();
    this.updatedAt = new Date().toISOString();
  }

  /**
   * Recalculate overall progress
   */
  recalculateProgress(): void {
    if (this.totalLessons === 0) {
      this.overallProgress = 0;
      return;
    }
    this.overallProgress = Math.round((this.lessonsCompleted / this.totalLessons) * 100);

    if (this.overallProgress >= 100 && this.status !== ProgressStatus.COMPLETED) {
      this.completeCourse();
    } else if (this.overallProgress > 0 && this.status === ProgressStatus.NOT_STARTED) {
      this.status = ProgressStatus.IN_PROGRESS;
      this.startedAt = this.startedAt || new Date().toISOString();
    }
  }

  // Query Methods

  /**
   * Check if course is completed
   */
  isCompleted(): boolean {
    return this.status === ProgressStatus.COMPLETED;
  }

  /**
   * Check if course is in progress
   */
  isInProgress(): boolean {
    return this.status === ProgressStatus.IN_PROGRESS;
  }

  /**
   * Check if course hasn't been started
   */
  isNotStarted(): boolean {
    return this.status === ProgressStatus.NOT_STARTED;
  }

  /**
   * Get lesson progress by ID
   */
  getLessonProgress(lessonId: string | number): LessonProgress | undefined {
    return this.lessonProgress.find((lp) => lp.lessonId === lessonId);
  }

  /**
   * Check if lesson is completed
   */
  isLessonCompleted(lessonId: string | number): boolean {
    const progress = this.getLessonProgress(lessonId);
    return progress?.status === ProgressStatus.COMPLETED;
  }

  /**
   * Get formatted total time spent
   */
  getFormattedTimeSpent(): string {
    const hours = Math.floor(this.totalTimeSpent / 3600);
    const minutes = Math.floor((this.totalTimeSpent % 3600) / 60);

    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  }

  /**
   * Get next lesson to complete
   */
  getNextLesson(): string | number | null {
    if (this.currentLessonId) {
      const currentProgress = this.getLessonProgress(this.currentLessonId);
      if (currentProgress?.status !== ProgressStatus.COMPLETED) {
        return this.currentLessonId;
      }
    }
    // Find first incomplete lesson
    const incompleteLessons = this.lessonProgress.filter(
      (lp) => lp.status !== ProgressStatus.COMPLETED
    );
    return incompleteLessons.length > 0 ? incompleteLessons[0].lessonId : null;
  }

  /**
   * Get average quiz score
   */
  getAverageQuizScore(): number {
    if (this.quizResults.length === 0) {
      return 0;
    }
    const totalPercentage = this.quizResults.reduce(
      (sum, qr) => sum + (qr.score / qr.maxScore) * 100,
      0
    );
    return Math.round(totalPercentage / this.quizResults.length);
  }

  // Validation

  /**
   * Validate progress data
   */
  validate(): ValidationResult {
    const errors: string[] = [];

    if (!this.userId) {
      errors.push('User ID is required');
    }

    if (!this.courseId) {
      errors.push('Course ID is required');
    }

    if (this.overallProgress < 0 || this.overallProgress > 100) {
      errors.push('Progress must be between 0 and 100');
    }

    if (!Object.values(ProgressStatus).includes(this.status)) {
      errors.push('Invalid progress status');
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
      user_id: this.userId,
      course_id: this.courseId,
      enrollment_id: this.enrollmentId,
      overall_progress: this.overallProgress,
      status: this.status,
      lessons_completed: this.lessonsCompleted,
      total_lessons: this.totalLessons,
      modules_completed: this.modulesCompleted,
      total_modules: this.totalModules,
      current_lesson_id: this.currentLessonId,
      current_module_id: this.currentModuleId,
      lesson_progress: this.lessonProgress,
      module_progress: this.moduleProgress,
      quiz_results: this.quizResults,
      total_time_spent: this.totalTimeSpent,
      last_accessed_at: this.lastAccessedAt,
      started_at: this.startedAt,
      completed_at: this.completedAt,
      created_at: this.createdAt,
      updated_at: this.updatedAt,
    };
  }

  /**
   * Create CourseProgress from API response
   */
  static fromAPI(data: Record<string, unknown>): CourseProgress {
    return new CourseProgress({
      id: data.id as string | number,
      userId: (data.user_id || data.userId) as string,
      courseId: (data.course_id || data.courseId) as string | number,
      enrollmentId: (data.enrollment_id || data.enrollmentId) as string | number,
      overallProgress: (data.overall_progress || data.overallProgress) as number,
      status: data.status as ProgressStatusType,
      lessonsCompleted: (data.lessons_completed || data.lessonsCompleted) as number,
      totalLessons: (data.total_lessons || data.totalLessons) as number,
      modulesCompleted: (data.modules_completed || data.modulesCompleted) as number,
      totalModules: (data.total_modules || data.totalModules) as number,
      currentLessonId: (data.current_lesson_id || data.currentLessonId) as string | number | null,
      currentModuleId: (data.current_module_id || data.currentModuleId) as number | null,
      lessonProgress: (data.lesson_progress || data.lessonProgress || []) as LessonProgress[],
      moduleProgress: (data.module_progress || data.moduleProgress || []) as ModuleProgress[],
      quizResults: (data.quiz_results || data.quizResults || []) as QuizResult[],
      totalTimeSpent: (data.total_time_spent || data.totalTimeSpent) as number,
      lastAccessedAt: (data.last_accessed_at || data.lastAccessedAt) as string,
      startedAt: (data.started_at || data.startedAt) as string | null,
      completedAt: (data.completed_at || data.completedAt) as string | null,
      createdAt: (data.created_at || data.createdAt) as string,
      updatedAt: (data.updated_at || data.updatedAt) as string,
    });
  }

  /**
   * Create multiple CourseProgress from API response array
   */
  static fromAPIArray(dataArray: Record<string, unknown>[]): CourseProgress[] {
    if (!Array.isArray(dataArray)) {
      return [];
    }
    return dataArray.map((data) => CourseProgress.fromAPI(data));
  }
}

/**
 * Factory function to create course progress
 */
export const createCourseProgress = (progressData: CourseProgressData): CourseProgress => {
  return new CourseProgress(progressData);
};
