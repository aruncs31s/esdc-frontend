import { IEnrollmentRepository } from '@/domain/repositories/IEnrollmentRepository';
import { Enrollment, PaymentStatus } from '@/domain/entities/Enrollment';
import { lmsAPI } from '@/infrastructure/api/lmsApi';

/**
 * Enrollment Repository Implementation
 * Implements IEnrollmentRepository using the LMS API
 */
export class EnrollmentRepository implements IEnrollmentRepository {
  async findByUserId(userId: string): Promise<Enrollment[]> {
    return await lmsAPI.getUserEnrollments(userId);
  }

  async findByCourseId(_courseId: string | number): Promise<Enrollment[]> {
    // This would require a backend endpoint to get all enrollments for a course
    // For now, we return an empty array as this is typically an admin operation
    console.warn('findByCourseId: This operation requires backend support');
    return [];
  }

  async findByUserAndCourse(userId: string, courseId: string | number): Promise<Enrollment | null> {
    return await lmsAPI.getEnrollment(userId, courseId);
  }

  async findById(_id: string | number): Promise<Enrollment | null> {
    // This would require a backend endpoint
    console.warn('findById: This operation requires backend support');
    return null;
  }

  async save(enrollment: Enrollment): Promise<Enrollment> {
    // For updates, we would need a backend endpoint
    // For creates, use the enroll method
    if (!enrollment.id) {
      return await this.enroll(enrollment.userId, enrollment.courseId, enrollment.paymentAmount);
    }
    console.warn('save: Update operation requires backend support');
    return enrollment;
  }

  async delete(_id: string | number): Promise<boolean> {
    // This would require parsing the ID to get userId and courseId
    console.warn('delete: This operation requires backend support');
    return false;
  }

  async findActiveByUserId(userId: string): Promise<Enrollment[]> {
    const enrollments = await this.findByUserId(userId);
    return enrollments.filter((e) => e.isActive());
  }

  async findCompletedByUserId(userId: string): Promise<Enrollment[]> {
    const enrollments = await this.findByUserId(userId);
    return enrollments.filter((e) => e.isCompleted());
  }

  async isEnrolled(userId: string, courseId: string | number): Promise<boolean> {
    return await lmsAPI.isEnrolled(userId, courseId);
  }

  async countByCourseId(courseId: string | number): Promise<number> {
    const enrollments = await this.findByCourseId(courseId);
    return enrollments.length;
  }

  async enroll(
    userId: string,
    courseId: string | number,
    paymentAmount?: number
  ): Promise<Enrollment> {
    return await lmsAPI.enrollInCourse(userId, courseId, paymentAmount);
  }

  async unenroll(userId: string, courseId: string | number): Promise<boolean> {
    return await lmsAPI.unenrollFromCourse(userId, courseId);
  }

  /**
   * Create a free enrollment
   */
  async enrollFree(userId: string, courseId: string | number): Promise<Enrollment> {
    const enrollment = await this.enroll(userId, courseId, 0);
    enrollment.paymentStatus = PaymentStatus.FREE;
    return enrollment;
  }
}

// Singleton instance
const enrollmentRepository = new EnrollmentRepository();
export default enrollmentRepository;
