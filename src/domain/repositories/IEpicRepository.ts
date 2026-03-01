/**
 * Epic Repository Interface
 * Defines the contract for epic data access
 */

import { Epic } from '../entities/Epic';
import { EpicFilters, CreateEpicRequest } from '@/types/agile';

export interface UpdateEpicRequest {
  title?: string;
  description?: string;
  color?: string;
  status?: 'open' | 'in_progress' | 'completed';
  start_date?: string | null;
  target_date?: string | null;
}

export interface EpicStatistics {
  total_epics: number;
  open_epics: number;
  in_progress_epics: number;
  completed_epics: number;
  overdue_epics: number;
  total_issues_across_epics: number;
  completed_issues_across_epics: number;
  total_story_points_across_epics: number;
  completed_story_points_across_epics: number;
}

export interface IEpicRepository {
  // Epic CRUD
  findAll(projectId: number, filters?: EpicFilters): Promise<Epic[]>;
  findById(epicId: number): Promise<Epic | null>;
  findByStatus(projectId: number, status: 'open' | 'in_progress' | 'completed'): Promise<Epic[]>;
  create(request: CreateEpicRequest): Promise<Epic>;
  update(epicId: number, request: UpdateEpicRequest): Promise<Epic>;
  delete(epicId: number): Promise<boolean>;

  // Status transitions
  start(epicId: number): Promise<Epic>;
  complete(epicId: number): Promise<Epic>;
  reopen(epicId: number): Promise<Epic>;

  // Issue management
  addIssue(epicId: number, issueId: number): Promise<Epic>;
  removeIssue(epicId: number, issueId: number): Promise<Epic>;
  getIssues(epicId: number): Promise<number[]>; // Returns issue IDs

  // Statistics
  getStatistics(projectId: number): Promise<EpicStatistics>;

  // Roadmap view
  getRoadmap(projectId: number): Promise<
    Array<{
      epic: Epic;
      timeline: {
        start: string | null;
        end: string | null;
        duration_days: number | null;
      };
    }>
  >;

  // Search
  search(projectId: number, query: string): Promise<Epic[]>;
}
