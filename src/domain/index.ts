// Domain Layer Exports

// Value Objects
export { Email } from './value-objects/Email.js';
export { Points } from './value-objects/Points.js';
export { Difficulty, DifficultyLevel } from './value-objects/Difficulty.js';
export { DateRange } from './value-objects/DateRange.js';

// Entities
export { User, UserRole, UserStatus } from './entities/User.js';
export type { UserRoleType, UserStatusType, UserConstructorData } from './entities/User.js';

export { ProjectStatus } from '@/types/project.js';
export { Project, createProject } from './entities/Project.js';
export { Event, EventStatus, createEvent } from './entities/Event.js';

// LMS Entities
export { Course, CourseLevel, CourseStatus, createCourse } from './entities/Course.js';
export type {
  CourseLevelType,
  CourseStatusType,
  CourseData,
  CourseModule,
  CourseExam,
  CourseTest,
  CourseComment,
} from './entities/Course.js';

export { Lesson, LessonType, LessonStatus, createLesson } from './entities/Lesson.js';
export type {
  LessonTypeType,
  LessonStatusType,
  LessonData,
  LessonResource,
} from './entities/Lesson.js';

export {
  Enrollment,
  EnrollmentStatus,
  PaymentStatus,
  createEnrollment,
} from './entities/Enrollment.js';
export type {
  EnrollmentStatusType,
  PaymentStatusType,
  EnrollmentData,
} from './entities/Enrollment.js';

export { CourseProgress, ProgressStatus, createCourseProgress } from './entities/CourseProgress.js';
export type {
  ProgressStatusType,
  CourseProgressData,
  LessonProgress,
  ModuleProgress,
  QuizResult,
} from './entities/CourseProgress.js';

// Domain Services
export { UserRegistrationService } from './services/UserRegistrationService.js';
export { ChallengeEvaluationService } from './services/ChallengeEvaluationService.js';
export { LeaderboardService } from './services/LeaderboardService.js';

// Domain Events
export * from './events/DomainEvents.js';
export { default as eventBus } from './events/EventBus.js';

// Repository Interfaces (use export type for interfaces)
export type { IUserRepository } from './repositories/IUserRepository.js';
export type { IChallengeRepository } from './repositories/IChallengeRepository.js';
export type { IProjectRepository } from './repositories/IProjectRepository.js';
export type { IEventRepository } from './repositories/IEventRepository.js';

// LMS Repository Interfaces
export type { ICourseRepository } from './repositories/ICourseRepository.js';
export type { IEnrollmentRepository } from './repositories/IEnrollmentRepository.js';
export type { ICourseProgressRepository } from './repositories/ICourseProgressRepository.js';
