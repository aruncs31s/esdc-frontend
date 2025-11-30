/**
 * Issue Tracking System Types
 * GitHub-like issue management with labels, milestones, and assignments
 */

// Issue Status
export const IssueStatus = {
  OPEN: 'open',
  IN_PROGRESS: 'in_progress',
  REVIEW: 'review',
  CLOSED: 'closed',
  REOPENED: 'reopened',
} as const;

export type IssueStatusType = (typeof IssueStatus)[keyof typeof IssueStatus];

// Issue Priority
export const IssuePriority = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  CRITICAL: 'critical',
} as const;

export type IssuePriorityType = (typeof IssuePriority)[keyof typeof IssuePriority];

// Issue Type
export const IssueType = {
  BUG: 'bug',
  FEATURE: 'feature',
  ENHANCEMENT: 'enhancement',
  DOCUMENTATION: 'documentation',
  QUESTION: 'question',
  TASK: 'task',
} as const;

export type IssueTypeType = (typeof IssueType)[keyof typeof IssueType];

// Label
export interface IssueLabel {
  id: number;
  name: string;
  color: string; // Hex color code
  description?: string;
  project_id: number;
  created_at: string;
}

// Issue Assignee
export interface IssueAssignee {
  id: number;
  user_id: number;
  issue_id: number;
  assigned_at: string;
  user_details: {
    id: number;
    name: string;
    email: string;
    avatar?: string;
  };
}

// Issue Comment
export interface IssueComment {
  id: number;
  issue_id: number;
  user_id: number;
  body: string;
  created_at: string;
  updated_at: string;
  user_details: {
    id: number;
    name: string;
    email: string;
    avatar?: string;
  };
  reactions?: IssueReaction[];
}

// Issue Reaction
export interface IssueReaction {
  id: number;
  user_id: number;
  reaction_type: 'thumbs_up' | 'thumbs_down' | 'heart' | 'hooray' | 'confused' | 'eyes' | 'rocket';
  created_at: string;
}

// Issue Timeline Event
export interface IssueTimelineEvent {
  id: number;
  issue_id: number;
  user_id: number;
  event_type:
    | 'created'
    | 'closed'
    | 'reopened'
    | 'assigned'
    | 'unassigned'
    | 'labeled'
    | 'unlabeled'
    | 'milestoned'
    | 'demilestoned'
    | 'referenced'
    | 'mentioned'
    | 'renamed'
    | 'locked'
    | 'unlocked';
  metadata: Record<string, unknown>;
  created_at: string;
  user_details: {
    id: number;
    name: string;
    email: string;
    avatar?: string;
  };
}

// Main Issue Interface
export interface Issue {
  id: number;
  number: number; // Issue number within project (like #123)
  project_id: number;
  title: string;
  body: string;
  status: IssueStatusType;
  priority: IssuePriorityType;
  issue_type: IssueTypeType;
  milestone_id?: number | null;
  created_by: number;
  closed_by?: number | null;
  closed_at?: string | null;
  created_at: string;
  updated_at: string;

  // Relationships
  labels: IssueLabel[];
  assignees: IssueAssignee[];
  milestone?: IssueMilestone | null;
  creator_details: {
    id: number;
    name: string;
    email: string;
    avatar?: string;
  };

  // Counts
  comment_count: number;
  reaction_count: number;

  // Linked items
  linked_issues?: number[];
  linked_pull_requests?: number[];
}

// Issue Milestone
export interface IssueMilestone {
  id: number;
  project_id: number;
  title: string;
  description?: string;
  due_date?: string | null;
  state: 'open' | 'closed';
  created_at: string;
  updated_at: string;
  closed_at?: string | null;

  // Progress
  open_issues: number;
  closed_issues: number;
  progress_percentage: number;
}

// Create Issue Request
export interface CreateIssueRequest {
  project_id: number;
  title: string;
  body: string;
  priority?: IssuePriorityType;
  issue_type?: IssueTypeType;
  milestone_id?: number | null;
  label_ids?: number[];
  assignee_ids?: number[];
}

// Update Issue Request
export interface UpdateIssueRequest {
  title?: string;
  body?: string;
  status?: IssueStatusType;
  priority?: IssuePriorityType;
  issue_type?: IssueTypeType;
  milestone_id?: number | null;
  label_ids?: number[];
  assignee_ids?: number[];
}

// Issue Filter Options
export interface IssueFilters {
  status?: IssueStatusType | IssueStatusType[];
  priority?: IssuePriorityType | IssuePriorityType[];
  issue_type?: IssueTypeType | IssueTypeType[];
  type?: IssueTypeType | IssueTypeType[]; // Alias for issue_type
  milestone_id?: number | null;
  assignee_id?: number | null;
  assignee_ids?: number[]; // Multiple assignees
  label_ids?: number[];
  epic_id?: number;
  sprint_id?: number;
  created_by?: number;
  search?: string;
  is_overdue?: boolean;
  has_due_date?: boolean;
  sort_by?: 'created_at' | 'updated_at' | 'priority' | 'comments' | 'due_date';
  sort_order?: 'asc' | 'desc';
  page?: number;
  per_page?: number;
}

// Issue Statistics
export interface IssueStatistics {
  project_id: number;
  total_issues: number;
  open_issues: number;
  closed_issues: number;
  in_progress_issues: number;
  issues_by_priority: Record<IssuePriorityType, number>;
  issues_by_type: Record<IssueTypeType, number>;
  avg_resolution_time_hours: number;
  issues_closed_this_week: number;
  issues_opened_this_week: number;
}

// Create Label Request
export interface CreateLabelRequest {
  project_id: number;
  name: string;
  color: string;
  description?: string;
}

// Create Milestone Request
export interface CreateMilestoneRequest {
  project_id: number;
  title: string;
  description?: string;
  due_date?: string | null;
}
