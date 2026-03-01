/**
 * Issue Repository Interface
 * Defines the contract for issue data access
 */

import { Issue } from '../entities/Issue';
import {
  IssueFilters,
  IssueComment,
  IssueLabel,
  IssueMilestone,
  IssueStatistics,
  IssueTimelineEvent,
  CreateIssueRequest,
  UpdateIssueRequest,
  CreateLabelRequest,
  CreateMilestoneRequest,
} from '@/types/issues';

export interface IIssueRepository {
  // Issue CRUD
  findAll(projectId: number, filters?: IssueFilters): Promise<{ issues: Issue[]; total: number }>;
  findById(issueId: number): Promise<Issue | null>;
  findByNumber(projectId: number, issueNumber: number): Promise<Issue | null>;
  create(request: CreateIssueRequest): Promise<Issue>;
  update(issueId: number, request: UpdateIssueRequest): Promise<Issue>;
  delete(issueId: number): Promise<boolean>;

  // Status operations
  close(issueId: number): Promise<Issue>;
  reopen(issueId: number): Promise<Issue>;

  // Assignees
  addAssignee(issueId: number, userId: number): Promise<Issue>;
  removeAssignee(issueId: number, userId: number): Promise<Issue>;

  // Labels
  findLabels(projectId: number): Promise<IssueLabel[]>;
  createLabel(request: CreateLabelRequest): Promise<IssueLabel>;
  updateLabel(labelId: number, data: Partial<CreateLabelRequest>): Promise<IssueLabel>;
  deleteLabel(labelId: number): Promise<boolean>;
  addLabelToIssue(issueId: number, labelId: number): Promise<Issue>;
  removeLabelFromIssue(issueId: number, labelId: number): Promise<Issue>;

  // Milestones
  findMilestones(projectId: number): Promise<IssueMilestone[]>;
  findMilestoneById(milestoneId: number): Promise<IssueMilestone | null>;
  createMilestone(request: CreateMilestoneRequest): Promise<IssueMilestone>;
  updateMilestone(
    milestoneId: number,
    data: Partial<CreateMilestoneRequest>
  ): Promise<IssueMilestone>;
  deleteMilestone(milestoneId: number): Promise<boolean>;
  closeMilestone(milestoneId: number): Promise<IssueMilestone>;
  reopenMilestone(milestoneId: number): Promise<IssueMilestone>;

  // Comments
  findComments(issueId: number): Promise<IssueComment[]>;
  addComment(issueId: number, body: string): Promise<IssueComment>;
  updateComment(commentId: number, body: string): Promise<IssueComment>;
  deleteComment(commentId: number): Promise<boolean>;

  // Timeline
  getTimeline(issueId: number): Promise<IssueTimelineEvent[]>;

  // Statistics
  getStatistics(projectId: number): Promise<IssueStatistics>;

  // Search
  search(projectId: number, query: string): Promise<Issue[]>;

  // Bulk operations
  bulkClose(issueIds: number[]): Promise<Issue[]>;
  bulkAddLabel(issueIds: number[], labelId: number): Promise<Issue[]>;
  bulkAssign(issueIds: number[], userId: number): Promise<Issue[]>;
}
