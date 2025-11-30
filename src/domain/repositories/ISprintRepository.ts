/**
 * Sprint Repository Interface
 * Defines the contract for sprint data access
 */

import { Sprint } from '../entities/Sprint';
import {
  SprintFilters,
  SprintStatistics,
  CreateSprintRequest,
  UpdateSprintRequest,
  SprintRetrospective,
  VelocityData,
  BurndownChartData,
} from '@/types/agile';

export interface ISprintRepository {
  // Sprint CRUD
  findAll(projectId: number, filters?: SprintFilters): Promise<Sprint[]>;
  findById(sprintId: number): Promise<Sprint | null>;
  findActive(projectId: number): Promise<Sprint | null>;
  findByStatus(
    projectId: number,
    status: 'planning' | 'active' | 'completed' | 'cancelled'
  ): Promise<Sprint[]>;
  create(request: CreateSprintRequest): Promise<Sprint>;
  update(sprintId: number, request: UpdateSprintRequest): Promise<Sprint>;
  delete(sprintId: number): Promise<boolean>;

  // Sprint lifecycle
  start(sprintId: number): Promise<Sprint>;
  complete(sprintId: number): Promise<Sprint>;
  cancel(sprintId: number): Promise<Sprint>;

  // Issue management
  addIssue(sprintId: number, issueId: number): Promise<Sprint>;
  removeIssue(sprintId: number, issueId: number): Promise<Sprint>;
  moveIssue(
    fromSprintId: number,
    toSprintId: number,
    issueId: number
  ): Promise<{ from: Sprint; to: Sprint }>;

  // Retrospective
  getRetrospective(sprintId: number): Promise<SprintRetrospective | null>;
  saveRetrospective(
    sprintId: number,
    retrospective: Omit<SprintRetrospective, 'id' | 'sprint_id'>
  ): Promise<SprintRetrospective>;
  updateRetrospective(
    retrospectiveId: number,
    data: Partial<SprintRetrospective>
  ): Promise<SprintRetrospective>;

  // Metrics
  getVelocity(projectId: number, sprintCount?: number): Promise<VelocityData>;
  getBurndownChart(sprintId: number): Promise<BurndownChartData>;
  getStatistics(sprintId: number): Promise<SprintStatistics>;

  // Backlog
  getBacklog(projectId: number): Promise<{ issues: number[]; totalPoints: number }>;
  prioritizeBacklog(projectId: number, issueOrder: number[]): Promise<boolean>;
}
