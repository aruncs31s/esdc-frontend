/*
 * Application Facade
 * Provides a simplified interface to the application layer
 * This acts as the main entry point for UI components
 */

import { Project, Course, Enrollment, CourseProgress } from '../domain/index';
import container from './Container';
import { ProjectData, ProjectDataForAdmin } from '@/types/project';
import { AdminRepository } from '@/infrastructure/repositories/AdminRepository';
import { statsForAdmin } from '@/types';
import { UserDataForAdmin, UserRegisterDataByAdmin } from '@/types/user';
import { authAPI } from '@/infrastructure/api/auth';
import { LoginCredentials, UserRegisterData } from '@/types';
import { NotificationRepository } from '@/infrastructure/repositories/NotificationsRepository';
import { Notification as AppNotification } from '@/types/notifications';
import { CourseRepository } from '@/infrastructure/repositories/CourseRepository';
import { EnrollmentRepository } from '@/infrastructure/repositories/EnrollmentRepository';
import { CourseProgressRepository } from '@/infrastructure/repositories/CourseProgressRepository';

class ApplicationService {
  private container: typeof container;

  constructor() {
    this.container = container;
  }

  // Authentication Operations
  async login(credentials: LoginCredentials): Promise<any> {
    const response = await authAPI.login(credentials);
    // The response is already the data payload { token: string }
    // Transform to AuthResponse format expected by AuthProvider
    return {
      success: true,
      status: true,
      data: response,
      token: (response as any).token,
      message: 'Login successful',
    };
  }

  async register(userData: UserRegisterData): Promise<any> {
    const response = await authAPI.register(userData);
    // Transform to AuthResponse format expected by AuthProvider
    return {
      success: true,
      status: true,
      data: response,
      message: 'Registration successful',
    };
  }

  async logout() {
    return await authAPI.logout();
  }

  async getProfile() {
    return await authAPI.getProfile();
  }

  async getAllProjectForAdmin(filters: any = {}): Promise<ProjectDataForAdmin[]> {
    const adminRepo = this.container.get('adminRepository') as AdminRepository;
    return await adminRepo.findAllProjects(filters);
  }
  // Stats Operations
  async getAdminStats(): Promise<statsForAdmin> {
    const adminRepo = this.container.get('adminRepository') as AdminRepository;
    return await adminRepo.getAdminStats();
  }
  async getAllUsersForAdmin(filters: any = {}): Promise<UserDataForAdmin[]> {
    const adminRepo = this.container.get('adminRepository') as AdminRepository;
    return await adminRepo.findAllUsers(filters);
  }
  async createUserByAdmin(userData: UserRegisterDataByAdmin): Promise<UserRegisterDataByAdmin> {
    const adminRepo = this.container.get('adminRepository') as AdminRepository;
    return await adminRepo.createUser(userData);
  }
  // Project Operations
  async createProjectByAdmin(userId: string, projectData: ProjectData): Promise<any> {
    const adminRepo = this.container.get('adminRepository') as AdminRepository;
    return await adminRepo.createProject(userId, projectData);
  }
  // User Operations
  async createUser(userData: any): Promise<any> {
    const useCase = this.container.get('createUserUseCase');
    return await useCase.execute(userData);
  }

  async updateUser(userId: string, updates: any): Promise<any> {
    const useCase = this.container.get('updateUserUseCase');
    return await useCase.execute(userId, updates);
  }

  async deleteUser(userId: string): Promise<any> {
    const useCase = this.container.get('deleteUserUseCase');
    return await useCase.execute(userId);
  }

  async getUserById(userId: string): Promise<any> {
    const repository = this.container.get('userRepository');
    return await repository.findById(userId);
  }

  // Project Operations
  async createProject(userId: string, projectData: any): Promise<any> {
    const useCase = this.container.get('createProjectUseCase');
    return await useCase.execute({ userId, ...projectData });
  }

  async getAllProjects(filters: any = {}): Promise<Project[]> {
    const repository = this.container.get('projectRepository');
    return await repository.findAll(filters);
  }

  async getProjectById(projectId: string): Promise<any> {
    const repository = this.container.get('projectRepository');
    return await repository.findById(projectId);
  }

  async getUserProjects(userId: string): Promise<any> {
    const repository = this.container.get('projectRepository');
    return await repository.findByUserId(userId);
  }

  async deleteProject(projectId: string): Promise<any> {
    const repository = this.container.get('projectRepository');
    return await repository.delete(projectId);
  }

  // Event Operations
  async getAllEvents(filters: any = {}): Promise<any> {
    const repository = this.container.get('eventRepository');
    return await repository.findAll(filters);
  }

  async getEventById(eventId: string): Promise<any> {
    const repository = this.container.get('eventRepository');
    return await repository.findById(eventId);
  }

  async getUpcomingEvents(): Promise<any> {
    const repository = this.container.get('eventRepository');
    return await repository.findUpcoming();
  }

  async createEvent(eventData: any): Promise<any> {
    const repository = this.container.get('eventRepository');
    const { Event } = await import('../domain/entities/Event');
    const event = new Event(eventData);
    return await repository.save(event);
  }

  async deleteEvent(eventId: string): Promise<any> {
    const repository = this.container.get('eventRepository');
    return await repository.delete(eventId);
  }

  // Leaderboard Operations
  async getTopUsers(limit: number = 10): Promise<any> {
    const service = this.container.get('leaderboardService');
    return await service.getTopUsers(limit);
  }

  async getUserRank(userId: string): Promise<any> {
    const service = this.container.get('leaderboardService');
    return await service.getUserRank(userId);
  }

  // Chatbot Operations
  async askChatbot(
    message: string,
    userId?: string
  ): Promise<{ response: string; confidence?: number }> {
    const useCase = this.container.get('askChatbotUseCase');
    return await useCase.execute(message, userId);
  }

  async getChatHistory(userId: string): Promise<
    Array<{
      id: string;
      message: string;
      response: string;
      timestamp: Date;
    }>
  > {
    const service = this.container.get('chatbotService');
    return await service.getUserHistory(userId);
  }

  getChatbotQuickActions(): Array<{ label: string; message: string }> {
    const service = this.container.get('chatbotService');
    return service.getQuickActions();
  }

  async getUserNotifications(): Promise<AppNotification[]> {
    const repository = this.container.get('notificationRepository') as NotificationRepository;
    return await repository.getNotifications();
  }

  // LMS - Course Operations
  async getAllCourses(filters?: {
    category?: string;
    level?: string;
    search?: string;
    isFree?: boolean;
  }): Promise<Course[]> {
    const repository = this.container.get('courseRepository') as CourseRepository;
    return await repository.findAll(filters);
  }

  async getCourseById(courseId: string | number): Promise<Course | null> {
    const repository = this.container.get('courseRepository') as CourseRepository;
    return await repository.findById(courseId);
  }

  async getPopularCourses(limit?: number): Promise<Course[]> {
    const repository = this.container.get('courseRepository') as CourseRepository;
    return await repository.findPopular(limit);
  }

  async getCoursesByCategory(category: string): Promise<Course[]> {
    const repository = this.container.get('courseRepository') as CourseRepository;
    return await repository.findByCategory(category);
  }

  async getCoursesByLevel(level: string): Promise<Course[]> {
    const repository = this.container.get('courseRepository') as CourseRepository;
    return await repository.findByLevel(level);
  }

  async searchCourses(query: string): Promise<Course[]> {
    const repository = this.container.get('courseRepository') as CourseRepository;
    return await repository.search(query);
  }

  async getCourseCategories(): Promise<string[]> {
    const repository = this.container.get('courseRepository') as CourseRepository;
    return await repository.getCategories();
  }

  // LMS - Enrollment Operations
  async enrollInCourse(
    userId: string,
    courseId: string | number,
    paymentAmount?: number
  ): Promise<Enrollment> {
    const repository = this.container.get('enrollmentRepository') as EnrollmentRepository;
    return await repository.enroll(userId, courseId, paymentAmount);
  }

  async unenrollFromCourse(userId: string, courseId: string | number): Promise<boolean> {
    const repository = this.container.get('enrollmentRepository') as EnrollmentRepository;
    return await repository.unenroll(userId, courseId);
  }

  async getUserEnrollments(userId: string): Promise<Enrollment[]> {
    const repository = this.container.get('enrollmentRepository') as EnrollmentRepository;
    return await repository.findByUserId(userId);
  }

  async getActiveEnrollments(userId: string): Promise<Enrollment[]> {
    const repository = this.container.get('enrollmentRepository') as EnrollmentRepository;
    return await repository.findActiveByUserId(userId);
  }

  async getCompletedEnrollments(userId: string): Promise<Enrollment[]> {
    const repository = this.container.get('enrollmentRepository') as EnrollmentRepository;
    return await repository.findCompletedByUserId(userId);
  }

  async isEnrolledInCourse(userId: string, courseId: string | number): Promise<boolean> {
    const repository = this.container.get('enrollmentRepository') as EnrollmentRepository;
    return await repository.isEnrolled(userId, courseId);
  }

  async getEnrollment(userId: string, courseId: string | number): Promise<Enrollment | null> {
    const repository = this.container.get('enrollmentRepository') as EnrollmentRepository;
    return await repository.findByUserAndCourse(userId, courseId);
  }

  // LMS - Progress Operations
  async getCourseProgress(
    userId: string,
    courseId: string | number
  ): Promise<CourseProgress | null> {
    const repository = this.container.get('courseProgressRepository') as CourseProgressRepository;
    return await repository.findByUserAndCourse(userId, courseId);
  }

  async getUserCourseProgress(userId: string): Promise<CourseProgress[]> {
    const repository = this.container.get('courseProgressRepository') as CourseProgressRepository;
    return await repository.findByUserId(userId);
  }

  async startCourse(userId: string, courseId: string | number): Promise<CourseProgress> {
    const repository = this.container.get('courseProgressRepository') as CourseProgressRepository;
    return await repository.startCourse(userId, courseId);
  }

  async startLesson(
    userId: string,
    courseId: string | number,
    lessonId: string | number
  ): Promise<CourseProgress> {
    const repository = this.container.get('courseProgressRepository') as CourseProgressRepository;
    return await repository.startLesson(userId, courseId, lessonId);
  }

  async completeLesson(
    userId: string,
    courseId: string | number,
    lessonId: string | number,
    timeSpent?: number
  ): Promise<CourseProgress> {
    const repository = this.container.get('courseProgressRepository') as CourseProgressRepository;
    return await repository.completeLesson(userId, courseId, lessonId, timeSpent);
  }

  async recordQuizResult(
    userId: string,
    courseId: string | number,
    quizId: string | number,
    score: number,
    maxScore: number,
    passingScore: number
  ): Promise<CourseProgress> {
    const repository = this.container.get('courseProgressRepository') as CourseProgressRepository;
    return await repository.recordQuizResult(
      userId,
      courseId,
      quizId,
      score,
      maxScore,
      passingScore
    );
  }
}

// Singleton instance
const applicationService = new ApplicationService();

export default applicationService;
