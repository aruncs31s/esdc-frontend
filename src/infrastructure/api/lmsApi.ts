import apiClient from './ApiClient';
import { Course, CourseData } from '@/domain/entities/Course';
import { Enrollment, EnrollmentData } from '@/domain/entities/Enrollment';
import { CourseProgress, CourseProgressData } from '@/domain/entities/CourseProgress';
import { mockCourses } from '@/data/mockCourses';

/**
 * LMS API endpoints
 */
const LMS_ENDPOINTS = {
  COURSES: '/api/lms/courses',
  COURSE_BY_ID: (id: string | number) => `/api/lms/courses/${id}`,
  COURSE_CATEGORIES: '/api/lms/courses/categories',
  ENROLLMENTS: '/api/lms/enrollments',
  ENROLLMENT_BY_ID: (id: string | number) => `/api/lms/enrollments/${id}`,
  USER_ENROLLMENTS: (userId: string) => `/api/lms/users/${userId}/enrollments`,
  ENROLL: (courseId: string | number) => `/api/lms/courses/${courseId}/enroll`,
  UNENROLL: (courseId: string | number) => `/api/lms/courses/${courseId}/unenroll`,
  PROGRESS: '/api/lms/progress',
  USER_PROGRESS: (userId: string) => `/api/lms/users/${userId}/progress`,
  COURSE_PROGRESS: (courseId: string | number) => `/api/lms/courses/${courseId}/progress`,
  UPDATE_LESSON_PROGRESS: (courseId: string | number, lessonId: string | number) =>
    `/api/lms/courses/${courseId}/lessons/${lessonId}/progress`,
  QUIZ_RESULT: (courseId: string | number, quizId: string | number) =>
    `/api/lms/courses/${courseId}/quizzes/${quizId}/result`,
};

// Flag to determine if we're using mock data
const USE_MOCK_DATA = true;

/**
 * Convert mock course data to Course entity format
 */
function convertMockToCourse(mockCourse: (typeof mockCourses)[0]): Course {
  return new Course({
    id: mockCourse.id,
    title: mockCourse.title,
    description: mockCourse.description,
    instructor: mockCourse.instructor,
    duration: mockCourse.duration,
    level: mockCourse.level as CourseData['level'],
    enrolled: mockCourse.enrolled,
    rating: mockCourse.rating,
    image: mockCourse.image,
    price: mockCourse.price,
    isFree: mockCourse.isFree,
    lessons: mockCourse.lessons,
    category: mockCourse.category,
    views: mockCourse.views,
    likes: mockCourse.likes,
    comments: mockCourse.comments,
    modules: mockCourse.modules,
    exams: mockCourse.exams,
    tests: mockCourse.tests,
    commentsData: mockCourse.commentsData,
  });
}

// Mock enrollments storage
const mockEnrollments: Map<string, Enrollment> = new Map();

// Mock progress storage
const mockProgress: Map<string, CourseProgress> = new Map();

/**
 * LMS API functions for course management
 */
export const lmsAPI = {
  // Course Operations

  /**
   * Get all courses with optional filters
   */
  async getCourses(filters?: {
    category?: string;
    level?: string;
    search?: string;
    isFree?: boolean;
  }): Promise<Course[]> {
    if (USE_MOCK_DATA) {
      let filteredCourses = [...mockCourses];

      if (filters?.category && filters.category !== 'All') {
        filteredCourses = filteredCourses.filter((c) => c.category === filters.category);
      }
      if (filters?.level && filters.level !== 'All') {
        filteredCourses = filteredCourses.filter((c) => c.level === filters.level);
      }
      if (filters?.search) {
        const searchLower = filters.search.toLowerCase();
        filteredCourses = filteredCourses.filter(
          (c) =>
            c.title.toLowerCase().includes(searchLower) ||
            c.description.toLowerCase().includes(searchLower)
        );
      }
      if (filters?.isFree !== undefined) {
        filteredCourses = filteredCourses.filter((c) => c.isFree === filters.isFree);
      }

      return filteredCourses.map(convertMockToCourse);
    }

    const response = await apiClient.getData<CourseData[]>(LMS_ENDPOINTS.COURSES, {
      params: filters,
    });
    return Course.fromAPIArray(response as unknown as Record<string, unknown>[]);
  },

  /**
   * Get a course by ID
   */
  async getCourseById(id: string | number): Promise<Course | null> {
    if (USE_MOCK_DATA) {
      const course = mockCourses.find((c) => c.id === Number(id));
      return course ? convertMockToCourse(course) : null;
    }

    try {
      const response = await apiClient.getData<CourseData>(LMS_ENDPOINTS.COURSE_BY_ID(id));
      return Course.fromAPI(response as unknown as Record<string, unknown>);
    } catch {
      return null;
    }
  },

  /**
   * Get popular courses
   */
  async getPopularCourses(limit: number = 6): Promise<Course[]> {
    if (USE_MOCK_DATA) {
      const sortedCourses = [...mockCourses]
        .sort((a, b) => b.enrolled - a.enrolled)
        .slice(0, limit);
      return sortedCourses.map(convertMockToCourse);
    }

    const response = await apiClient.getData<CourseData[]>(`${LMS_ENDPOINTS.COURSES}/popular`, {
      params: { limit },
    });
    return Course.fromAPIArray(response as unknown as Record<string, unknown>[]);
  },

  /**
   * Get course categories
   */
  async getCategories(): Promise<string[]> {
    if (USE_MOCK_DATA) {
      return [...new Set(mockCourses.map((c) => c.category))];
    }

    return await apiClient.getData<string[]>(LMS_ENDPOINTS.COURSE_CATEGORIES);
  },

  /**
   * Search courses
   */
  async searchCourses(query: string): Promise<Course[]> {
    return this.getCourses({ search: query });
  },

  /**
   * Create a new course
   */
  async createCourse(courseData: CourseData): Promise<Course> {
    const response = await apiClient.postData<CourseData>(LMS_ENDPOINTS.COURSES, courseData);
    return Course.fromAPI(response as unknown as Record<string, unknown>);
  },

  /**
   * Update a course
   */
  async updateCourse(id: string | number, courseData: Partial<CourseData>): Promise<Course> {
    const response = await apiClient.putData<CourseData>(
      LMS_ENDPOINTS.COURSE_BY_ID(id),
      courseData
    );
    return Course.fromAPI(response as unknown as Record<string, unknown>);
  },

  /**
   * Delete a course
   */
  async deleteCourse(id: string | number): Promise<boolean> {
    await apiClient.deleteData(LMS_ENDPOINTS.COURSE_BY_ID(id));
    return true;
  },

  // Enrollment Operations

  /**
   * Enroll user in a course
   */
  async enrollInCourse(
    userId: string,
    courseId: string | number,
    paymentAmount?: number
  ): Promise<Enrollment> {
    if (USE_MOCK_DATA) {
      const enrollmentKey = `${userId}-${courseId}`;
      const course = mockCourses.find((c) => c.id === Number(courseId));

      const enrollment = new Enrollment({
        id: enrollmentKey,
        userId,
        courseId,
        status: 'active',
        enrolledAt: new Date().toISOString(),
        paymentStatus: course?.isFree ? 'free' : 'completed',
        paymentAmount: paymentAmount ?? course?.price ?? 0,
      });

      mockEnrollments.set(enrollmentKey, enrollment);

      // Initialize progress
      if (course) {
        const progress = new CourseProgress({
          id: enrollmentKey,
          userId,
          courseId,
          enrollmentId: enrollmentKey,
          totalLessons: course.lessons,
          totalModules: course.modules.length,
          status: 'not_started',
        });
        mockProgress.set(enrollmentKey, progress);
      }

      return enrollment;
    }

    const response = await apiClient.postData<EnrollmentData>(LMS_ENDPOINTS.ENROLL(courseId), {
      user_id: userId,
      payment_amount: paymentAmount,
    });
    return Enrollment.fromAPI(response as unknown as Record<string, unknown>);
  },

  /**
   * Unenroll user from a course
   */
  async unenrollFromCourse(userId: string, courseId: string | number): Promise<boolean> {
    if (USE_MOCK_DATA) {
      const enrollmentKey = `${userId}-${courseId}`;
      mockEnrollments.delete(enrollmentKey);
      mockProgress.delete(enrollmentKey);
      return true;
    }

    await apiClient.postData(LMS_ENDPOINTS.UNENROLL(courseId), { user_id: userId });
    return true;
  },

  /**
   * Get user enrollments
   */
  async getUserEnrollments(userId: string): Promise<Enrollment[]> {
    if (USE_MOCK_DATA) {
      const enrollments: Enrollment[] = [];
      mockEnrollments.forEach((enrollment) => {
        if (enrollment.userId === userId) {
          enrollments.push(enrollment);
        }
      });
      return enrollments;
    }

    const response = await apiClient.getData<EnrollmentData[]>(
      LMS_ENDPOINTS.USER_ENROLLMENTS(userId)
    );
    return Enrollment.fromAPIArray(response as unknown as Record<string, unknown>[]);
  },

  /**
   * Check if user is enrolled in a course
   */
  async isEnrolled(userId: string, courseId: string | number): Promise<boolean> {
    if (USE_MOCK_DATA) {
      const enrollmentKey = `${userId}-${courseId}`;
      return mockEnrollments.has(enrollmentKey);
    }

    try {
      const enrollments = await this.getUserEnrollments(userId);
      return enrollments.some((e) => e.courseId === courseId && e.isActive());
    } catch {
      return false;
    }
  },

  /**
   * Get enrollment by user and course
   */
  async getEnrollment(userId: string, courseId: string | number): Promise<Enrollment | null> {
    if (USE_MOCK_DATA) {
      const enrollmentKey = `${userId}-${courseId}`;
      return mockEnrollments.get(enrollmentKey) || null;
    }

    try {
      const enrollments = await this.getUserEnrollments(userId);
      return enrollments.find((e) => e.courseId === courseId) || null;
    } catch {
      return null;
    }
  },

  // Progress Operations

  /**
   * Get user progress for a course
   */
  async getCourseProgress(
    userId: string,
    courseId: string | number
  ): Promise<CourseProgress | null> {
    if (USE_MOCK_DATA) {
      const progressKey = `${userId}-${courseId}`;
      return mockProgress.get(progressKey) || null;
    }

    try {
      const response = await apiClient.getData<CourseProgressData>(
        `${LMS_ENDPOINTS.USER_PROGRESS(userId)}/${courseId}`
      );
      return CourseProgress.fromAPI(response as unknown as Record<string, unknown>);
    } catch {
      return null;
    }
  },

  /**
   * Get all progress for a user
   */
  async getUserProgress(userId: string): Promise<CourseProgress[]> {
    if (USE_MOCK_DATA) {
      const progressList: CourseProgress[] = [];
      mockProgress.forEach((progress) => {
        if (progress.userId === userId) {
          progressList.push(progress);
        }
      });
      return progressList;
    }

    const response = await apiClient.getData<CourseProgressData[]>(
      LMS_ENDPOINTS.USER_PROGRESS(userId)
    );
    return CourseProgress.fromAPIArray(response as unknown as Record<string, unknown>[]);
  },

  /**
   * Update lesson progress
   */
  async updateLessonProgress(
    userId: string,
    courseId: string | number,
    lessonId: string | number,
    completed: boolean,
    timeSpent?: number
  ): Promise<CourseProgress> {
    if (USE_MOCK_DATA) {
      const progressKey = `${userId}-${courseId}`;
      let progress = mockProgress.get(progressKey);

      if (!progress) {
        const course = mockCourses.find((c) => c.id === Number(courseId));
        progress = new CourseProgress({
          id: progressKey,
          userId,
          courseId,
          enrollmentId: progressKey,
          totalLessons: course?.lessons || 0,
          totalModules: course?.modules.length || 0,
        });
      }

      if (completed) {
        progress.completeLesson(lessonId, timeSpent || 0);
      } else {
        progress.startLesson(lessonId);
        if (timeSpent) {
          progress.updateTimeSpent(lessonId, timeSpent);
        }
      }

      mockProgress.set(progressKey, progress);
      return progress;
    }

    const response = await apiClient.postData<CourseProgressData>(
      LMS_ENDPOINTS.UPDATE_LESSON_PROGRESS(courseId, lessonId),
      {
        user_id: userId,
        completed,
        time_spent: timeSpent,
      }
    );
    return CourseProgress.fromAPI(response as unknown as Record<string, unknown>);
  },

  /**
   * Record quiz result
   */
  async recordQuizResult(
    userId: string,
    courseId: string | number,
    quizId: string | number,
    score: number,
    maxScore: number,
    passingScore: number
  ): Promise<CourseProgress> {
    if (USE_MOCK_DATA) {
      const progressKey = `${userId}-${courseId}`;
      let progress = mockProgress.get(progressKey);

      if (!progress) {
        const course = mockCourses.find((c) => c.id === Number(courseId));
        progress = new CourseProgress({
          id: progressKey,
          userId,
          courseId,
          enrollmentId: progressKey,
          totalLessons: course?.lessons || 0,
          totalModules: course?.modules.length || 0,
        });
      }

      progress.recordQuizResult(quizId, score, maxScore, passingScore);
      mockProgress.set(progressKey, progress);
      return progress;
    }

    const response = await apiClient.postData<CourseProgressData>(
      LMS_ENDPOINTS.QUIZ_RESULT(courseId, quizId),
      {
        user_id: userId,
        score,
        max_score: maxScore,
        passing_score: passingScore,
      }
    );
    return CourseProgress.fromAPI(response as unknown as Record<string, unknown>);
  },

  /**
   * Start a course (create initial progress)
   */
  async startCourse(userId: string, courseId: string | number): Promise<CourseProgress> {
    if (USE_MOCK_DATA) {
      const progressKey = `${userId}-${courseId}`;
      let progress = mockProgress.get(progressKey);

      if (!progress) {
        const course = mockCourses.find((c) => c.id === Number(courseId));
        progress = new CourseProgress({
          id: progressKey,
          userId,
          courseId,
          enrollmentId: progressKey,
          totalLessons: course?.lessons || 0,
          totalModules: course?.modules.length || 0,
        });
      }

      if (progress.isNotStarted()) {
        progress.start();
      }

      mockProgress.set(progressKey, progress);
      return progress;
    }

    const response = await apiClient.postData<CourseProgressData>(
      `${LMS_ENDPOINTS.COURSE_PROGRESS(courseId)}/start`,
      { user_id: userId }
    );
    return CourseProgress.fromAPI(response as unknown as Record<string, unknown>);
  },
};

export default lmsAPI;
