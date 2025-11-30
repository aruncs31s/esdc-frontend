export type TaskStatus = 'todo' | 'in_progress' | 'review' | 'completed';
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';
export type MilestoneStatus = 'pending' | 'in_progress' | 'completed' | 'delayed';

export interface Task {
  id: number;
  project_id: number;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  assigned_to: number | null;
  assigned_user?: { id: number; name: string; email: string };
  due_date: string | null;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface Milestone {
  id: number;
  project_id: number;
  title: string;
  description: string;
  status: MilestoneStatus;
  target_date: string;
  completed_at: string | null;
  progress_percentage: number;
  tasks_count: number;
  completed_tasks_count: number;
  created_at: string;
  updated_at: string;
}

export interface ProjectTimeline {
  project_id: number;
  start_date: string;
  end_date: string | null;
  total_duration_days: number;
  milestones: Milestone[];
  tasks: Task[];
  progress_percentage: number;
}

export interface TeamMember {
  id: number;
  user_id: number;
  project_id: number;
  role: string;
  permissions: string[];
  joined_at: string;
  user_details: { id: number; name: string; email: string; avatar: string | null };
}

export interface ProjectResource {
  id: number;
  project_id: number;
  name: string;
  type: 'link' | 'file' | 'document' | 'tool';
  url: string;
  description: string;
  created_at: string;
}

export interface ProjectActivity {
  id: number;
  project_id: number;
  user_id: number;
  action: string;
  description: string;
  metadata: Record<string, any>;
  created_at: string;
  user_details: { id: number; name: string; email: string };
}
