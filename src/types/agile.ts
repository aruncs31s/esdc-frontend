/**
 * Agile Workflow Types
 * Kanban boards, Sprints, Epics, and Story Points
 */

// Sprint Status
export const SprintStatus = {
  PLANNING: 'planning',
  ACTIVE: 'active',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
} as const;

export type SprintStatusType = (typeof SprintStatus)[keyof typeof SprintStatus];

// Board Column Types
export const BoardColumnType = {
  BACKLOG: 'backlog',
  TODO: 'todo',
  IN_PROGRESS: 'in_progress',
  IN_REVIEW: 'in_review',
  TESTING: 'testing',
  DONE: 'done',
  BLOCKED: 'blocked',
} as const;

export type BoardColumnTypeType = (typeof BoardColumnType)[keyof typeof BoardColumnType];

// Story Point Values (Fibonacci-like)
export const StoryPointValues = [0, 1, 2, 3, 5, 8, 13, 21, 34] as const;
export type StoryPointValue = (typeof StoryPointValues)[number];

// Epic
export interface Epic {
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

  // Progress
  total_issues: number;
  completed_issues: number;
  total_story_points: number;
  completed_story_points: number;
  progress_percentage: number;
}

// Sprint
export interface Sprint {
  id: number;
  project_id: number;
  name: string;
  goal?: string;
  status: SprintStatusType;
  start_date: string;
  end_date: string;
  created_at: string;
  updated_at: string;
  completed_at?: string | null;

  // Velocity & Progress
  planned_story_points: number;
  completed_story_points: number;
  total_issues: number;
  completed_issues: number;
  velocity?: number; // Calculated from past sprints
}

// Kanban Board
export interface KanbanBoard {
  id: number;
  project_id: number;
  name: string;
  description?: string;
  is_default: boolean;
  created_at: string;
  updated_at: string;
  columns: KanbanColumn[];
}

// Kanban Column
export interface KanbanColumn {
  id: number;
  board_id: number;
  name: string;
  column_type: BoardColumnTypeType;
  position: number;
  wip_limit?: number | null; // Work In Progress limit
  color?: string;
  cards: KanbanCard[];
}

// Kanban Card (represents an issue on the board)
export interface KanbanCard {
  id: number;
  column_id: number;
  issue_id: number;
  position: number;
  created_at: string;
  updated_at: string;

  // Issue details (denormalized for performance)
  issue: {
    id: number;
    number: number;
    title: string;
    priority: string;
    issue_type: string;
    story_points?: number;
    assignees: Array<{
      id: number;
      name: string;
      avatar?: string;
    }>;
    labels: Array<{
      id: number;
      name: string;
      color: string;
    }>;
    due_date?: string | null;
    epic_id?: number | null;
    epic_color?: string;
  };
}

// User Story (Issue with Agile attributes)
export interface UserStory {
  id: number;
  issue_id: number;
  project_id: number;
  epic_id?: number | null;
  sprint_id?: number | null;
  story_points?: StoryPointValue | null;
  acceptance_criteria?: string[];
  business_value?: number;

  // Relationship to Issue
  issue: {
    id: number;
    number: number;
    title: string;
    body: string;
    status: string;
    priority: string;
    labels: Array<{ id: number; name: string; color: string }>;
    assignees: Array<{ id: number; name: string; avatar?: string }>;
  };
}

// Sprint Backlog Item
export interface SprintBacklogItem {
  id: number;
  sprint_id: number;
  issue_id: number;
  position: number;
  added_at: string;
  completed_at?: string | null;

  issue: {
    id: number;
    number: number;
    title: string;
    status: string;
    priority: string;
    story_points?: number;
    assignees: Array<{ id: number; name: string; avatar?: string }>;
  };
}

// Product Backlog Item
export interface ProductBacklogItem {
  id: number;
  project_id: number;
  issue_id: number;
  position: number; // Priority order
  is_refined: boolean;
  refined_at?: string | null;

  issue: {
    id: number;
    number: number;
    title: string;
    body: string;
    status: string;
    priority: string;
    issue_type: string;
    story_points?: number;
    epic_id?: number | null;
    labels: Array<{ id: number; name: string; color: string }>;
  };
}

// Sprint Planning
export interface SprintPlanningData {
  sprint: Sprint;
  available_items: ProductBacklogItem[];
  selected_items: SprintBacklogItem[];
  team_capacity: number; // Total story points team can handle
  planned_velocity: number;
  suggested_velocity: number; // Based on historical data
}

// Burndown Chart Data
export interface BurndownChartData {
  sprint_id: number;
  sprint_name: string;
  start_date: string;
  end_date: string;
  total_story_points: number;
  data_points: Array<{
    date: string;
    ideal_remaining: number;
    actual_remaining: number;
    completed_today: number;
  }>;
}

// Velocity Chart Data
export interface VelocityChartData {
  project_id: number;
  sprints: Array<{
    sprint_id: number;
    sprint_name: string;
    planned_points: number;
    completed_points: number;
    start_date: string;
    end_date: string;
  }>;
  average_velocity: number;
  trend: 'increasing' | 'stable' | 'decreasing';
}

// Cumulative Flow Diagram Data
export interface CumulativeFlowData {
  project_id: number;
  date_range: {
    start: string;
    end: string;
  };
  data_points: Array<{
    date: string;
    backlog: number;
    todo: number;
    in_progress: number;
    in_review: number;
    done: number;
  }>;
}

// Team Capacity
export interface TeamCapacity {
  project_id: number;
  sprint_id?: number;
  members: Array<{
    user_id: number;
    name: string;
    avatar?: string;
    capacity_hours: number;
    assigned_hours: number;
    assigned_story_points: number;
    availability_percentage: number;
  }>;
  total_capacity_hours: number;
  total_assigned_hours: number;
  utilization_percentage: number;
}

// Agile Metrics
export interface AgileMetrics {
  project_id: number;
  current_sprint?: Sprint | null;

  // Velocity metrics
  average_velocity: number;
  velocity_trend: number; // Percentage change

  // Cycle time (average time from start to done)
  average_cycle_time_days: number;
  cycle_time_trend: number;

  // Lead time (average time from creation to done)
  average_lead_time_days: number;
  lead_time_trend: number;

  // Throughput
  issues_completed_this_week: number;
  story_points_completed_this_week: number;

  // WIP
  current_wip: number;
  wip_trend: number;

  // Sprint health
  sprint_burndown_status: 'on_track' | 'at_risk' | 'behind';
  sprint_completion_forecast: number; // Percentage likely to complete
}

// Sprint Filters
export interface SprintFilters {
  status?: SprintStatusType | SprintStatusType[];
  start_date_from?: string;
  start_date_to?: string;
  end_date_from?: string;
  end_date_to?: string;
  has_issues?: boolean;
}

// Sprint Statistics
export interface SprintStatistics {
  total_issues: number;
  completed_issues: number;
  in_progress_issues: number;
  todo_issues: number;
  blocked_issues: number;
  total_story_points: number;
  completed_story_points: number;
  in_progress_story_points: number;
  completion_rate: number;
  velocity: number;
  days_remaining: number;
  burndown_trend: 'on_track' | 'at_risk' | 'behind' | 'ahead';
}

// Sprint Retrospective
export interface SprintRetrospective {
  id: number;
  sprint_id: number;
  what_went_well: string[];
  what_went_wrong: string[];
  action_items: Array<{
    id: number;
    description: string;
    assignee_id?: number;
    completed: boolean;
    created_at: string;
  }>;
  team_morale: number; // 1-5 rating
  created_at: string;
  updated_at: string;
}

// Velocity Data (for repository)
export interface VelocityData {
  project_id: number;
  sprints: Array<{
    sprint_id: number;
    sprint_name: string;
    planned_points: number;
    completed_points: number;
    commitment_rate: number;
  }>;
  average_velocity: number;
  velocity_trend: 'increasing' | 'stable' | 'decreasing';
  predicted_next_velocity: number;
}

// Create Sprint Request
export interface CreateSprintRequest {
  project_id: number;
  name: string;
  goal?: string;
  start_date: string;
  end_date: string;
}

// Update Sprint Request
export interface UpdateSprintRequest {
  name?: string;
  goal?: string;
  start_date?: string;
  end_date?: string;
  status?: SprintStatusType;
}

// Create Epic Request
export interface CreateEpicRequest {
  project_id: number;
  title: string;
  description?: string;
  color?: string;
  start_date?: string;
  target_date?: string;
}

// Move Card Request
export interface MoveCardRequest {
  card_id: number;
  target_column_id: number;
  target_position: number;
}

// Bulk Move to Sprint Request
export interface BulkMoveToSprintRequest {
  sprint_id: number;
  issue_ids: number[];
}

// Estimate Issue Request
export interface EstimateIssueRequest {
  issue_id: number;
  story_points: StoryPointValue;
}

// Create Board Request
export interface CreateBoardRequest {
  project_id: number;
  name: string;
  description?: string;
  is_default?: boolean;
}

// Update Board Request
export interface UpdateBoardRequest {
  name?: string;
  description?: string;
  is_default?: boolean;
}

// Create Column Request
export interface CreateColumnRequest {
  name: string;
  column_type: BoardColumnTypeType;
  position?: number;
  wip_limit?: number | null;
  color?: string;
}

// Update Column Request
export interface UpdateColumnRequest {
  name?: string;
  column_type?: BoardColumnTypeType;
  position?: number;
  wip_limit?: number | null;
  color?: string;
}

// Epic Status
export const EpicStatus = {
  OPEN: 'open',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
} as const;

export type EpicStatusType = (typeof EpicStatus)[keyof typeof EpicStatus];

// Epic Filters
export interface EpicFilters {
  status?: EpicStatusType | EpicStatusType[];
  start_date_from?: string;
  start_date_to?: string;
  target_date_from?: string;
  target_date_to?: string;
  has_issues?: boolean;
  is_overdue?: boolean;
}
