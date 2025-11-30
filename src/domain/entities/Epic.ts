/**
 * Epic Entity
 * Represents a collection of related issues/user stories
 * following Domain-Driven Design principles
 */

import { Epic as EpicData } from '@/types/agile';

/**
 * Epic Entity Constructor Data
 */
export interface EpicConstructorData {
  id: number;
  project_id: number;
  title: string;
  description?: string;
  color: string;
  status: 'open' | 'in_progress' | 'completed';
  start_date?: string | null;
  target_date?: string | null;
  created_at: string;
  updated_at: string;
  total_issues?: number;
  completed_issues?: number;
  total_story_points?: number;
  completed_story_points?: number;
}

/**
 * Epic Entity Class
 */
export class Epic {
  private readonly _id: number;
  private readonly _projectId: number;
  private readonly _createdAt: Date;

  private _title: string;
  private _description: string | undefined;
  private _color: string;
  private _status: 'open' | 'in_progress' | 'completed';
  private _startDate: Date | null;
  private _targetDate: Date | null;
  private _updatedAt: Date;

  // Progress tracking
  private _totalIssues: number;
  private _completedIssues: number;
  private _totalStoryPoints: number;
  private _completedStoryPoints: number;

  constructor(data: EpicConstructorData) {
    this._id = data.id;
    this._projectId = data.project_id;
    this._title = data.title;
    this._description = data.description;
    this._color = data.color;
    this._status = data.status;
    this._startDate = data.start_date ? new Date(data.start_date) : null;
    this._targetDate = data.target_date ? new Date(data.target_date) : null;
    this._createdAt = new Date(data.created_at);
    this._updatedAt = new Date(data.updated_at);
    this._totalIssues = data.total_issues ?? 0;
    this._completedIssues = data.completed_issues ?? 0;
    this._totalStoryPoints = data.total_story_points ?? 0;
    this._completedStoryPoints = data.completed_story_points ?? 0;
  }

  // Getters
  get id(): number {
    return this._id;
  }
  get projectId(): number {
    return this._projectId;
  }
  get title(): string {
    return this._title;
  }
  get description(): string | undefined {
    return this._description;
  }
  get color(): string {
    return this._color;
  }
  get status(): 'open' | 'in_progress' | 'completed' {
    return this._status;
  }
  get startDate(): Date | null {
    return this._startDate;
  }
  get targetDate(): Date | null {
    return this._targetDate;
  }
  get createdAt(): Date {
    return this._createdAt;
  }
  get updatedAt(): Date {
    return this._updatedAt;
  }
  get totalIssues(): number {
    return this._totalIssues;
  }
  get completedIssues(): number {
    return this._completedIssues;
  }
  get totalStoryPoints(): number {
    return this._totalStoryPoints;
  }
  get completedStoryPoints(): number {
    return this._completedStoryPoints;
  }

  // Computed properties
  get progressPercentage(): number {
    if (this._totalIssues === 0) return 0;
    return Math.round((this._completedIssues / this._totalIssues) * 100);
  }

  get storyPointsProgress(): number {
    if (this._totalStoryPoints === 0) return 0;
    return Math.round((this._completedStoryPoints / this._totalStoryPoints) * 100);
  }

  get remainingIssues(): number {
    return this._totalIssues - this._completedIssues;
  }

  get remainingStoryPoints(): number {
    return this._totalStoryPoints - this._completedStoryPoints;
  }

  get isOverdue(): boolean {
    if (!this._targetDate || this._status === 'completed') return false;
    return new Date() > this._targetDate;
  }

  get daysUntilDeadline(): number | null {
    if (!this._targetDate) return null;
    const now = new Date();
    const diffTime = this._targetDate.getTime() - now.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  get isStarted(): boolean {
    return this._status === 'in_progress' || this._status === 'completed';
  }

  get isComplete(): boolean {
    return this._status === 'completed';
  }

  get isOpen(): boolean {
    return this._status === 'open';
  }

  get hasIssues(): boolean {
    return this._totalIssues > 0;
  }

  // Status transitions
  start(): boolean {
    if (this._status !== 'open') {
      return false;
    }
    this._status = 'in_progress';
    this._startDate = new Date();
    this._updatedAt = new Date();
    return true;
  }

  complete(): boolean {
    if (this._status !== 'in_progress') {
      return false;
    }
    this._status = 'completed';
    this._updatedAt = new Date();
    return true;
  }

  reopen(): boolean {
    if (this._status !== 'completed') {
      return false;
    }
    this._status = 'in_progress';
    this._updatedAt = new Date();
    return true;
  }

  // Update methods
  updateTitle(title: string): boolean {
    if (!title || title.trim().length === 0) {
      return false;
    }
    this._title = title.trim();
    this._updatedAt = new Date();
    return true;
  }

  updateDescription(description: string | undefined): void {
    this._description = description;
    this._updatedAt = new Date();
  }

  updateColor(color: string): boolean {
    // Validate hex color
    const hexColorRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
    if (!hexColorRegex.test(color)) {
      return false;
    }
    this._color = color;
    this._updatedAt = new Date();
    return true;
  }

  updateTargetDate(date: Date | null): void {
    this._targetDate = date;
    this._updatedAt = new Date();
  }

  updateStartDate(date: Date | null): void {
    this._startDate = date;
    this._updatedAt = new Date();
  }

  // Progress tracking (called when issues are added/removed/completed)
  updateProgress(
    totalIssues: number,
    completedIssues: number,
    totalStoryPoints: number,
    completedStoryPoints: number
  ): void {
    this._totalIssues = totalIssues;
    this._completedIssues = completedIssues;
    this._totalStoryPoints = totalStoryPoints;
    this._completedStoryPoints = completedStoryPoints;
    this._updatedAt = new Date();

    // Auto-complete if all issues are done
    if (
      this._status === 'in_progress' &&
      this._totalIssues > 0 &&
      this._completedIssues === this._totalIssues
    ) {
      this.complete();
    }
  }

  addIssue(storyPoints: number = 0): void {
    this._totalIssues += 1;
    this._totalStoryPoints += storyPoints;
    this._updatedAt = new Date();

    // Auto-start if first issue is added
    if (this._status === 'open') {
      this._status = 'in_progress';
    }
  }

  removeIssue(storyPoints: number = 0, isCompleted: boolean = false): void {
    this._totalIssues = Math.max(0, this._totalIssues - 1);
    this._totalStoryPoints = Math.max(0, this._totalStoryPoints - storyPoints);

    if (isCompleted) {
      this._completedIssues = Math.max(0, this._completedIssues - 1);
      this._completedStoryPoints = Math.max(0, this._completedStoryPoints - storyPoints);
    }

    this._updatedAt = new Date();
  }

  completeIssue(storyPoints: number = 0): void {
    this._completedIssues = Math.min(this._totalIssues, this._completedIssues + 1);
    this._completedStoryPoints = Math.min(
      this._totalStoryPoints,
      this._completedStoryPoints + storyPoints
    );
    this._updatedAt = new Date();

    // Auto-complete if all issues are done
    if (
      this._status === 'in_progress' &&
      this._totalIssues > 0 &&
      this._completedIssues === this._totalIssues
    ) {
      this.complete();
    }
  }

  uncompleteIssue(storyPoints: number = 0): void {
    this._completedIssues = Math.max(0, this._completedIssues - 1);
    this._completedStoryPoints = Math.max(0, this._completedStoryPoints - storyPoints);
    this._updatedAt = new Date();

    // Reopen if any issue is uncompleted
    if (this._status === 'completed') {
      this._status = 'in_progress';
    }
  }

  // Validation
  validate(): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!this._title || this._title.trim().length === 0) {
      errors.push('Epic title is required');
    }

    if (this._title && this._title.length > 200) {
      errors.push('Epic title must be less than 200 characters');
    }

    if (this._description && this._description.length > 10000) {
      errors.push('Epic description must be less than 10000 characters');
    }

    if (this._startDate && this._targetDate && this._startDate > this._targetDate) {
      errors.push('Start date cannot be after target date');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  // Serialization
  toJSON(): EpicData {
    return {
      id: this._id,
      project_id: this._projectId,
      title: this._title,
      description: this._description,
      color: this._color,
      status: this._status,
      start_date: this._startDate?.toISOString() ?? null,
      target_date: this._targetDate?.toISOString() ?? null,
      created_at: this._createdAt.toISOString(),
      updated_at: this._updatedAt.toISOString(),
      total_issues: this._totalIssues,
      completed_issues: this._completedIssues,
      total_story_points: this._totalStoryPoints,
      completed_story_points: this._completedStoryPoints,
      progress_percentage: this.progressPercentage,
    };
  }

  toPlainObject(): EpicConstructorData & { progress_percentage: number } {
    return {
      id: this._id,
      project_id: this._projectId,
      title: this._title,
      description: this._description,
      color: this._color,
      status: this._status,
      start_date: this._startDate?.toISOString() ?? null,
      target_date: this._targetDate?.toISOString() ?? null,
      created_at: this._createdAt.toISOString(),
      updated_at: this._updatedAt.toISOString(),
      total_issues: this._totalIssues,
      completed_issues: this._completedIssues,
      total_story_points: this._totalStoryPoints,
      completed_story_points: this._completedStoryPoints,
      progress_percentage: this.progressPercentage,
    };
  }

  // Factory methods
  static create(data: EpicConstructorData): Epic {
    return new Epic(data);
  }

  static fromJSON(json: EpicData): Epic {
    return new Epic({
      id: json.id,
      project_id: json.project_id,
      title: json.title,
      description: json.description,
      color: json.color,
      status: json.status,
      start_date: json.start_date,
      target_date: json.target_date,
      created_at: json.created_at,
      updated_at: json.updated_at,
      total_issues: json.total_issues,
      completed_issues: json.completed_issues,
      total_story_points: json.total_story_points,
      completed_story_points: json.completed_story_points,
    });
  }

  // Default colors for epics
  static readonly DEFAULT_COLORS = [
    '#E11D48', // Rose
    '#EA580C', // Orange
    '#D97706', // Amber
    '#65A30D', // Lime
    '#16A34A', // Green
    '#059669', // Emerald
    '#0891B2', // Cyan
    '#0284C7', // Sky
    '#2563EB', // Blue
    '#4F46E5', // Indigo
    '#7C3AED', // Violet
    '#9333EA', // Purple
    '#C026D3', // Fuchsia
    '#DB2777', // Pink
  ];

  static getRandomColor(): string {
    const randomIndex = Math.floor(Math.random() * Epic.DEFAULT_COLORS.length);
    return Epic.DEFAULT_COLORS[randomIndex];
  }
}
