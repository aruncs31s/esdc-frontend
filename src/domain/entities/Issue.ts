/**
 * Issue Entity (Domain Layer)
 * Represents an issue with business logic
 */

import {
  Issue as IssueData,
  IssueStatus,
  IssueStatusType,
  IssuePriority,
  IssuePriorityType,
  IssueType,
  IssueTypeType,
  IssueLabel,
  IssueAssignee,
  IssueMilestone,
  CreateIssueRequest,
  UpdateIssueRequest,
} from '@/types/issues';

// Export the constructor data type for use in repositories
export type IssueConstructorData = IssueData;

export class Issue {
  readonly id: number;
  readonly number: number;
  readonly project_id: number;
  title: string;
  body: string;
  status: IssueStatusType;
  priority: IssuePriorityType;
  issue_type: IssueTypeType;
  milestone_id: number | null;
  readonly created_by: number;
  closed_by: number | null;
  closed_at: string | null;
  readonly created_at: string;
  updated_at: string;
  labels: IssueLabel[];
  assignees: IssueAssignee[];
  milestone: IssueMilestone | null;
  creator_details: {
    id: number;
    name: string;
    email: string;
    avatar?: string;
  };
  comment_count: number;
  reaction_count: number;
  linked_issues: number[];
  linked_pull_requests: number[];

  constructor(data: IssueData) {
    this.id = data.id;
    this.number = data.number;
    this.project_id = data.project_id;
    this.title = data.title;
    this.body = data.body;
    this.status = data.status;
    this.priority = data.priority;
    this.issue_type = data.issue_type;
    this.milestone_id = data.milestone_id ?? null;
    this.created_by = data.created_by;
    this.closed_by = data.closed_by ?? null;
    this.closed_at = data.closed_at ?? null;
    this.created_at = data.created_at;
    this.updated_at = data.updated_at;
    this.labels = data.labels || [];
    this.assignees = data.assignees || [];
    this.milestone = data.milestone ?? null;
    this.creator_details = data.creator_details;
    this.comment_count = data.comment_count || 0;
    this.reaction_count = data.reaction_count || 0;
    this.linked_issues = data.linked_issues || [];
    this.linked_pull_requests = data.linked_pull_requests || [];
  }

  // Status Methods
  isOpen(): boolean {
    return this.status === IssueStatus.OPEN || this.status === IssueStatus.REOPENED;
  }

  isClosed(): boolean {
    return this.status === IssueStatus.CLOSED;
  }

  isInProgress(): boolean {
    return this.status === IssueStatus.IN_PROGRESS;
  }

  close(userId: number): void {
    if (this.isClosed()) {
      throw new Error('Issue is already closed');
    }
    this.status = IssueStatus.CLOSED;
    this.closed_by = userId;
    this.closed_at = new Date().toISOString();
    this.updated_at = new Date().toISOString();
  }

  reopen(): void {
    if (!this.isClosed()) {
      throw new Error('Issue is not closed');
    }
    this.status = IssueStatus.REOPENED;
    this.closed_by = null;
    this.closed_at = null;
    this.updated_at = new Date().toISOString();
  }

  startProgress(): void {
    if (this.isInProgress()) {
      throw new Error('Issue is already in progress');
    }
    this.status = IssueStatus.IN_PROGRESS;
    this.updated_at = new Date().toISOString();
  }

  // Priority Methods
  isCritical(): boolean {
    return this.priority === IssuePriority.CRITICAL;
  }

  isHighPriority(): boolean {
    return this.priority === IssuePriority.HIGH || this.priority === IssuePriority.CRITICAL;
  }

  setPriority(priority: IssuePriorityType): void {
    this.priority = priority;
    this.updated_at = new Date().toISOString();
  }

  // Label Methods
  hasLabel(labelName: string): boolean {
    return this.labels.some((l) => l.name.toLowerCase() === labelName.toLowerCase());
  }

  addLabel(label: IssueLabel): void {
    if (!this.labels.find((l) => l.id === label.id)) {
      this.labels.push(label);
      this.updated_at = new Date().toISOString();
    }
  }

  removeLabel(labelId: number): void {
    this.labels = this.labels.filter((l) => l.id !== labelId);
    this.updated_at = new Date().toISOString();
  }

  // Assignee Methods
  isAssignedTo(userId: number): boolean {
    return this.assignees.some((a) => a.user_id === userId);
  }

  hasAssignees(): boolean {
    return this.assignees.length > 0;
  }

  // Milestone Methods
  hasMilestone(): boolean {
    return this.milestone_id !== null;
  }

  setMilestone(milestoneId: number | null): void {
    this.milestone_id = milestoneId;
    this.updated_at = new Date().toISOString();
  }

  // Type Methods
  isBug(): boolean {
    return this.issue_type === IssueType.BUG;
  }

  isFeature(): boolean {
    return this.issue_type === IssueType.FEATURE;
  }

  // Age Methods
  getAgeInDays(): number {
    const now = new Date();
    const created = new Date(this.created_at);
    return Math.ceil((now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24));
  }

  getTimeToCloseInHours(): number | null {
    if (!this.closed_at) return null;
    const closed = new Date(this.closed_at);
    const created = new Date(this.created_at);
    return Math.ceil((closed.getTime() - created.getTime()) / (1000 * 60 * 60));
  }

  // Validation
  validate(): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!this.title || this.title.trim().length < 3) {
      errors.push('Title must be at least 3 characters long');
    }

    if (this.title.length > 256) {
      errors.push('Title must be less than 256 characters');
    }

    if (!Object.values(IssueStatus).includes(this.status)) {
      errors.push('Invalid issue status');
    }

    if (!Object.values(IssuePriority).includes(this.priority)) {
      errors.push('Invalid issue priority');
    }

    if (!Object.values(IssueType).includes(this.issue_type)) {
      errors.push('Invalid issue type');
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  // Display helpers
  getStatusBadgeColor(): string {
    switch (this.status) {
      case IssueStatus.OPEN:
        return 'green';
      case IssueStatus.IN_PROGRESS:
        return 'blue';
      case IssueStatus.REVIEW:
        return 'purple';
      case IssueStatus.CLOSED:
        return 'red';
      case IssueStatus.REOPENED:
        return 'yellow';
      default:
        return 'gray';
    }
  }

  getPriorityIcon(): string {
    switch (this.priority) {
      case IssuePriority.CRITICAL:
        return '🔴';
      case IssuePriority.HIGH:
        return '🟠';
      case IssuePriority.MEDIUM:
        return '🟡';
      case IssuePriority.LOW:
        return '🟢';
      default:
        return '⚪';
    }
  }

  getTypeIcon(): string {
    switch (this.issue_type) {
      case IssueType.BUG:
        return '🐛';
      case IssueType.FEATURE:
        return '✨';
      case IssueType.ENHANCEMENT:
        return '💡';
      case IssueType.DOCUMENTATION:
        return '📚';
      case IssueType.QUESTION:
        return '❓';
      case IssueType.TASK:
        return '📋';
      default:
        return '📌';
    }
  }

  // Serialization
  toJSON(): IssueData {
    return {
      id: this.id,
      number: this.number,
      project_id: this.project_id,
      title: this.title,
      body: this.body,
      status: this.status,
      priority: this.priority,
      issue_type: this.issue_type,
      milestone_id: this.milestone_id,
      created_by: this.created_by,
      closed_by: this.closed_by,
      closed_at: this.closed_at,
      created_at: this.created_at,
      updated_at: this.updated_at,
      labels: this.labels,
      assignees: this.assignees,
      milestone: this.milestone,
      creator_details: this.creator_details,
      comment_count: this.comment_count,
      reaction_count: this.reaction_count,
      linked_issues: this.linked_issues,
      linked_pull_requests: this.linked_pull_requests,
    };
  }

  toUpdateRequest(): UpdateIssueRequest {
    return {
      title: this.title,
      body: this.body,
      status: this.status,
      priority: this.priority,
      issue_type: this.issue_type,
      milestone_id: this.milestone_id,
      label_ids: this.labels.map((l) => l.id),
      assignee_ids: this.assignees.map((a) => a.user_id),
    };
  }

  // Static factory methods
  static fromAPI(data: IssueData): Issue {
    return new Issue(data);
  }

  static fromAPIArray(dataArray: IssueData[]): Issue[] {
    if (!Array.isArray(dataArray)) return [];
    return dataArray.map((data) => Issue.fromAPI(data));
  }

  static fromJSON(data: IssueData): Issue {
    return new Issue(data);
  }

  static createNew(request: CreateIssueRequest & { created_by: number }): Partial<IssueData> {
    return {
      project_id: request.project_id,
      title: request.title,
      body: request.body,
      priority: request.priority || IssuePriority.MEDIUM,
      issue_type: request.issue_type || IssueType.TASK,
      milestone_id: request.milestone_id,
      created_by: request.created_by,
      status: IssueStatus.OPEN,
    };
  }
}

export { IssueStatus, IssuePriority, IssueType };
