/**
 * Sprint Entity (Domain Layer)
 * Represents a sprint with business logic for agile workflows
 */

import { Sprint as SprintData, SprintStatus, SprintStatusType } from '@/types/agile';

// Export the constructor data type for use in repositories
export type SprintConstructorData = SprintData;

export class Sprint {
  readonly id: number;
  readonly project_id: number;
  name: string;
  goal: string;
  status: SprintStatusType;
  start_date: string;
  end_date: string;
  readonly created_at: string;
  updated_at: string;
  completed_at: string | null;
  planned_story_points: number;
  completed_story_points: number;
  total_issues: number;
  completed_issues: number;
  velocity: number;

  constructor(data: SprintData) {
    this.id = data.id;
    this.project_id = data.project_id;
    this.name = data.name;
    this.goal = data.goal || '';
    this.status = data.status;
    this.start_date = data.start_date;
    this.end_date = data.end_date;
    this.created_at = data.created_at;
    this.updated_at = data.updated_at;
    this.completed_at = data.completed_at ?? null;
    this.planned_story_points = data.planned_story_points || 0;
    this.completed_story_points = data.completed_story_points || 0;
    this.total_issues = data.total_issues || 0;
    this.completed_issues = data.completed_issues || 0;
    this.velocity = data.velocity || 0;
  }

  // Status Methods
  isPlanning(): boolean {
    return this.status === SprintStatus.PLANNING;
  }

  isActive(): boolean {
    return this.status === SprintStatus.ACTIVE;
  }

  isCompleted(): boolean {
    return this.status === SprintStatus.COMPLETED;
  }

  isCancelled(): boolean {
    return this.status === SprintStatus.CANCELLED;
  }

  canStart(): boolean {
    return this.isPlanning() && this.total_issues > 0;
  }

  canComplete(): boolean {
    return this.isActive();
  }

  start(): void {
    if (!this.canStart()) {
      throw new Error('Cannot start sprint: must be in planning with at least one issue');
    }
    this.status = SprintStatus.ACTIVE;
    this.updated_at = new Date().toISOString();
  }

  complete(): void {
    if (!this.canComplete()) {
      throw new Error('Cannot complete sprint: must be active');
    }
    this.status = SprintStatus.COMPLETED;
    this.completed_at = new Date().toISOString();
    this.updated_at = new Date().toISOString();
  }

  cancel(): void {
    if (this.isCompleted()) {
      throw new Error('Cannot cancel a completed sprint');
    }
    this.status = SprintStatus.CANCELLED;
    this.updated_at = new Date().toISOString();
  }

  // Duration Methods
  getDurationInDays(): number {
    const start = new Date(this.start_date);
    const end = new Date(this.end_date);
    return Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  }

  getRemainingDays(): number {
    if (!this.isActive()) return 0;
    const now = new Date();
    const end = new Date(this.end_date);
    const remaining = Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return Math.max(0, remaining);
  }

  getElapsedDays(): number {
    const start = new Date(this.start_date);
    const now = new Date();
    const elapsed = Math.ceil((now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    return Math.max(0, Math.min(elapsed, this.getDurationInDays()));
  }

  isOverdue(): boolean {
    if (!this.isActive()) return false;
    return new Date() > new Date(this.end_date);
  }

  // Progress Methods
  getProgressPercentage(): number {
    if (this.total_issues === 0) return 0;
    return Math.round((this.completed_issues / this.total_issues) * 100);
  }

  getStoryPointsProgress(): number {
    if (this.planned_story_points === 0) return 0;
    return Math.round((this.completed_story_points / this.planned_story_points) * 100);
  }

  getRemainingStoryPoints(): number {
    return Math.max(0, this.planned_story_points - this.completed_story_points);
  }

  getRemainingIssues(): number {
    return Math.max(0, this.total_issues - this.completed_issues);
  }

  // Burndown calculations
  getIdealBurndownRate(): number {
    const duration = this.getDurationInDays();
    if (duration === 0) return this.planned_story_points;
    return this.planned_story_points / duration;
  }

  getActualBurndownRate(): number {
    const elapsed = this.getElapsedDays();
    if (elapsed === 0) return 0;
    return this.completed_story_points / elapsed;
  }

  isOnTrack(): boolean {
    const ideal = this.getIdealBurndownRate() * this.getElapsedDays();
    const actualRemaining = this.getRemainingStoryPoints();
    const idealRemaining = this.planned_story_points - ideal;
    // On track if actual remaining is within 20% of ideal
    return actualRemaining <= idealRemaining * 1.2;
  }

  getSprintHealth(): 'healthy' | 'at_risk' | 'critical' {
    const progress = this.getStoryPointsProgress();
    const elapsed = this.getElapsedDays();
    const duration = this.getDurationInDays();
    const expectedProgress = (elapsed / duration) * 100;

    if (progress >= expectedProgress - 10) return 'healthy';
    if (progress >= expectedProgress - 30) return 'at_risk';
    return 'critical';
  }

  // Forecast
  getCompletionForecast(): { likely: boolean; estimatedDate: string | null } {
    if (!this.isActive()) {
      return { likely: this.isCompleted(), estimatedDate: null };
    }

    const rate = this.getActualBurndownRate();
    if (rate === 0) {
      return { likely: false, estimatedDate: null };
    }

    const remainingPoints = this.getRemainingStoryPoints();
    const daysNeeded = Math.ceil(remainingPoints / rate);
    const estimatedDate = new Date();
    estimatedDate.setDate(estimatedDate.getDate() + daysNeeded);

    const endDate = new Date(this.end_date);
    return {
      likely: estimatedDate <= endDate,
      estimatedDate: estimatedDate.toISOString(),
    };
  }

  // Validation
  validate(): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!this.name || this.name.trim().length < 2) {
      errors.push('Sprint name must be at least 2 characters');
    }

    if (!this.start_date) {
      errors.push('Start date is required');
    }

    if (!this.end_date) {
      errors.push('End date is required');
    }

    if (this.start_date && this.end_date) {
      const start = new Date(this.start_date);
      const end = new Date(this.end_date);
      if (end <= start) {
        errors.push('End date must be after start date');
      }
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  // Serialization
  toJSON(): SprintData {
    return {
      id: this.id,
      project_id: this.project_id,
      name: this.name,
      goal: this.goal,
      status: this.status,
      start_date: this.start_date,
      end_date: this.end_date,
      created_at: this.created_at,
      updated_at: this.updated_at,
      completed_at: this.completed_at ?? undefined,
      planned_story_points: this.planned_story_points,
      completed_story_points: this.completed_story_points,
      total_issues: this.total_issues,
      completed_issues: this.completed_issues,
      velocity: this.velocity,
    };
  }

  // Static factory methods
  static fromAPI(data: SprintData): Sprint {
    return new Sprint(data);
  }

  static fromJSON(data: SprintData): Sprint {
    return new Sprint(data);
  }

  static fromAPIArray(dataArray: SprintData[]): Sprint[] {
    if (!Array.isArray(dataArray)) return [];
    return dataArray.map((data) => Sprint.fromAPI(data));
  }
}

export { SprintStatus };
