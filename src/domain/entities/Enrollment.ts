import { ValidationResult } from '@/types/validation_errors';

/**
 * Enrollment Status Enumeration
 */
export const EnrollmentStatus = {
  ACTIVE: 'active',
  COMPLETED: 'completed',
  PAUSED: 'paused',
  CANCELLED: 'cancelled',
  EXPIRED: 'expired',
} as const;

export type EnrollmentStatusType = (typeof EnrollmentStatus)[keyof typeof EnrollmentStatus];

/**
 * Payment Status Enumeration
 */
export const PaymentStatus = {
  PENDING: 'pending',
  COMPLETED: 'completed',
  FAILED: 'failed',
  REFUNDED: 'refunded',
  FREE: 'free',
} as const;

export type PaymentStatusType = (typeof PaymentStatus)[keyof typeof PaymentStatus];

/**
 * Enrollment constructor data type
 */
export interface EnrollmentData {
  id?: string | number;
  userId?: string;
  courseId?: string | number;
  status?: EnrollmentStatusType;
  enrolledAt?: string;
  completedAt?: string | null;
  expiresAt?: string | null;
  paymentStatus?: PaymentStatusType;
  paymentAmount?: number;
  paymentId?: string | null;
  certificateId?: string | null;
  certificateUrl?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Enrollment Entity
 * Represents a user's enrollment in a course
 */
export class Enrollment {
  id: string | number;
  userId: string;
  courseId: string | number;
  status: EnrollmentStatusType;
  enrolledAt: string;
  completedAt: string | null;
  expiresAt: string | null;
  paymentStatus: PaymentStatusType;
  paymentAmount: number;
  paymentId: string | null;
  certificateId: string | null;
  certificateUrl: string | null;
  createdAt: string;
  updatedAt: string;

  constructor(data: EnrollmentData = {}) {
    this.id = data.id ?? '';
    this.userId = data.userId || '';
    this.courseId = data.courseId ?? '';
    this.status = data.status || EnrollmentStatus.ACTIVE;
    this.enrolledAt = data.enrolledAt || new Date().toISOString();
    this.completedAt = data.completedAt ?? null;
    this.expiresAt = data.expiresAt ?? null;
    this.paymentStatus = data.paymentStatus || PaymentStatus.PENDING;
    this.paymentAmount = data.paymentAmount || 0;
    this.paymentId = data.paymentId ?? null;
    this.certificateId = data.certificateId ?? null;
    this.certificateUrl = data.certificateUrl ?? null;
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
  }

  // Business Logic Methods

  /**
   * Mark enrollment as completed
   */
  complete(): void {
    if (this.status === EnrollmentStatus.COMPLETED) {
      throw new Error('Enrollment is already completed');
    }
    this.status = EnrollmentStatus.COMPLETED;
    this.completedAt = new Date().toISOString();
    this.updatedAt = new Date().toISOString();
  }

  /**
   * Pause enrollment
   */
  pause(): void {
    if (this.status !== EnrollmentStatus.ACTIVE) {
      throw new Error('Can only pause active enrollments');
    }
    this.status = EnrollmentStatus.PAUSED;
    this.updatedAt = new Date().toISOString();
  }

  /**
   * Resume paused enrollment
   */
  resume(): void {
    if (this.status !== EnrollmentStatus.PAUSED) {
      throw new Error('Can only resume paused enrollments');
    }
    this.status = EnrollmentStatus.ACTIVE;
    this.updatedAt = new Date().toISOString();
  }

  /**
   * Cancel enrollment
   */
  cancel(): void {
    if (this.status === EnrollmentStatus.COMPLETED) {
      throw new Error('Cannot cancel completed enrollment');
    }
    this.status = EnrollmentStatus.CANCELLED;
    this.updatedAt = new Date().toISOString();
  }

  /**
   * Mark payment as completed
   */
  markPaymentCompleted(paymentId: string): void {
    this.paymentStatus = PaymentStatus.COMPLETED;
    this.paymentId = paymentId;
    this.updatedAt = new Date().toISOString();
  }

  /**
   * Mark payment as failed
   */
  markPaymentFailed(): void {
    this.paymentStatus = PaymentStatus.FAILED;
    this.updatedAt = new Date().toISOString();
  }

  /**
   * Process refund
   */
  refund(): void {
    if (this.paymentStatus !== PaymentStatus.COMPLETED) {
      throw new Error('Can only refund completed payments');
    }
    this.paymentStatus = PaymentStatus.REFUNDED;
    this.status = EnrollmentStatus.CANCELLED;
    this.updatedAt = new Date().toISOString();
  }

  /**
   * Issue certificate
   */
  issueCertificate(certificateId: string, certificateUrl: string): void {
    if (this.status !== EnrollmentStatus.COMPLETED) {
      throw new Error('Can only issue certificate for completed enrollments');
    }
    this.certificateId = certificateId;
    this.certificateUrl = certificateUrl;
    this.updatedAt = new Date().toISOString();
  }

  // Query Methods

  /**
   * Check if enrollment is active
   */
  isActive(): boolean {
    return this.status === EnrollmentStatus.ACTIVE;
  }

  /**
   * Check if enrollment is completed
   */
  isCompleted(): boolean {
    return this.status === EnrollmentStatus.COMPLETED;
  }

  /**
   * Check if enrollment is expired
   */
  isExpired(): boolean {
    if (this.status === EnrollmentStatus.EXPIRED) {
      return true;
    }
    if (this.expiresAt) {
      return new Date(this.expiresAt) < new Date();
    }
    return false;
  }

  /**
   * Check if enrollment has certificate
   */
  hasCertificate(): boolean {
    return this.certificateId !== null && this.certificateUrl !== null;
  }

  /**
   * Check if payment is completed
   */
  isPaid(): boolean {
    return (
      this.paymentStatus === PaymentStatus.COMPLETED || this.paymentStatus === PaymentStatus.FREE
    );
  }

  /**
   * Get days since enrollment
   */
  getDaysSinceEnrollment(): number {
    const now = new Date();
    const enrolled = new Date(this.enrolledAt);
    const diffTime = Math.abs(now.getTime() - enrolled.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  /**
   * Get days until expiration
   */
  getDaysUntilExpiration(): number | null {
    if (!this.expiresAt) {
      return null;
    }
    const now = new Date();
    const expires = new Date(this.expiresAt);
    const diffTime = expires.getTime() - now.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  // Validation

  /**
   * Validate enrollment data
   */
  validate(): ValidationResult {
    const errors: string[] = [];

    if (!this.userId) {
      errors.push('User ID is required');
    }

    if (!this.courseId) {
      errors.push('Course ID is required');
    }

    if (!Object.values(EnrollmentStatus).includes(this.status)) {
      errors.push('Invalid enrollment status');
    }

    if (!Object.values(PaymentStatus).includes(this.paymentStatus)) {
      errors.push('Invalid payment status');
    }

    if (this.paymentAmount < 0) {
      errors.push('Payment amount cannot be negative');
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
      status: this.status,
      enrolled_at: this.enrolledAt,
      completed_at: this.completedAt,
      expires_at: this.expiresAt,
      payment_status: this.paymentStatus,
      payment_amount: this.paymentAmount,
      payment_id: this.paymentId,
      certificate_id: this.certificateId,
      certificate_url: this.certificateUrl,
      created_at: this.createdAt,
      updated_at: this.updatedAt,
    };
  }

  /**
   * Create Enrollment from API response
   */
  static fromAPI(data: Record<string, unknown>): Enrollment {
    return new Enrollment({
      id: data.id as string | number,
      userId: (data.user_id || data.userId) as string,
      courseId: (data.course_id || data.courseId) as string | number,
      status: data.status as EnrollmentStatusType,
      enrolledAt: (data.enrolled_at || data.enrolledAt) as string,
      completedAt: (data.completed_at || data.completedAt) as string | null,
      expiresAt: (data.expires_at || data.expiresAt) as string | null,
      paymentStatus: (data.payment_status || data.paymentStatus) as PaymentStatusType,
      paymentAmount: (data.payment_amount || data.paymentAmount) as number,
      paymentId: (data.payment_id || data.paymentId) as string | null,
      certificateId: (data.certificate_id || data.certificateId) as string | null,
      certificateUrl: (data.certificate_url || data.certificateUrl) as string | null,
      createdAt: (data.created_at || data.createdAt) as string,
      updatedAt: (data.updated_at || data.updatedAt) as string,
    });
  }

  /**
   * Create multiple Enrollments from API response array
   */
  static fromAPIArray(dataArray: Record<string, unknown>[]): Enrollment[] {
    if (!Array.isArray(dataArray)) {
      return [];
    }
    return dataArray.map((data) => Enrollment.fromAPI(data));
  }
}

/**
 * Factory function to create an enrollment
 */
export const createEnrollment = (enrollmentData: EnrollmentData): Enrollment => {
  return new Enrollment(enrollmentData);
};
