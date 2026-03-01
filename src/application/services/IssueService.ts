/**
 * Issue Application Service
 * Provides high-level operations for issue management
 */

import { IssueRepository } from '@/infrastructure/repositories/IssueRepository';
import { Issue } from '@/domain/entities/Issue';
import { ApiClient } from '@/infrastructure/api/ApiClient';
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

/**
 * Issue Application Service
 * Orchestrates issue-related operations
 */
export class IssueService {
  private readonly repository: IssueRepository;

  constructor(apiClient: ApiClient) {
    this.repository = new IssueRepository(apiClient);
  }

  // ==================== Issues ====================

  /**
   * Get all issues for a project with optional filtering
   */
  async getIssues(
    projectId: number,
    filters?: IssueFilters
  ): Promise<{ issues: Issue[]; total: number }> {
    return this.repository.findAll(projectId, filters);
  }

  /**
   * Get a single issue by ID
   */
  async getIssue(issueId: number): Promise<Issue | null> {
    return this.repository.findById(issueId);
  }

  /**
   * Get issue by number within a project
   */
  async getIssueByNumber(projectId: number, issueNumber: number): Promise<Issue | null> {
    return this.repository.findByNumber(projectId, issueNumber);
  }

  /**
   * Create a new issue
   */
  async createIssue(request: CreateIssueRequest): Promise<Issue> {
    return this.repository.create(request);
  }

  /**
   * Update an existing issue
   */
  async updateIssue(issueId: number, request: UpdateIssueRequest): Promise<Issue> {
    return this.repository.update(issueId, request);
  }

  /**
   * Delete an issue
   */
  async deleteIssue(issueId: number): Promise<boolean> {
    return this.repository.delete(issueId);
  }

  /**
   * Close an issue
   */
  async closeIssue(issueId: number): Promise<Issue> {
    return this.repository.close(issueId);
  }

  /**
   * Reopen a closed issue
   */
  async reopenIssue(issueId: number): Promise<Issue> {
    return this.repository.reopen(issueId);
  }

  /**
   * Search issues
   */
  async searchIssues(projectId: number, query: string): Promise<Issue[]> {
    return this.repository.search(projectId, query);
  }

  /**
   * Get issue statistics for a project
   */
  async getStatistics(projectId: number): Promise<IssueStatistics> {
    return this.repository.getStatistics(projectId);
  }

  // ==================== Assignees ====================

  /**
   * Add an assignee to an issue
   */
  async addAssignee(issueId: number, userId: number): Promise<Issue> {
    return this.repository.addAssignee(issueId, userId);
  }

  /**
   * Remove an assignee from an issue
   */
  async removeAssignee(issueId: number, userId: number): Promise<Issue> {
    return this.repository.removeAssignee(issueId, userId);
  }

  // ==================== Labels ====================

  /**
   * Get all labels for a project
   */
  async getLabels(projectId: number): Promise<IssueLabel[]> {
    return this.repository.findLabels(projectId);
  }

  /**
   * Create a new label
   */
  async createLabel(request: CreateLabelRequest): Promise<IssueLabel> {
    return this.repository.createLabel(request);
  }

  /**
   * Update a label
   */
  async updateLabel(labelId: number, data: Partial<CreateLabelRequest>): Promise<IssueLabel> {
    return this.repository.updateLabel(labelId, data);
  }

  /**
   * Delete a label
   */
  async deleteLabel(labelId: number): Promise<boolean> {
    return this.repository.deleteLabel(labelId);
  }

  /**
   * Add a label to an issue
   */
  async addLabelToIssue(issueId: number, labelId: number): Promise<Issue> {
    return this.repository.addLabelToIssue(issueId, labelId);
  }

  /**
   * Remove a label from an issue
   */
  async removeLabelFromIssue(issueId: number, labelId: number): Promise<Issue> {
    return this.repository.removeLabelFromIssue(issueId, labelId);
  }

  // ==================== Milestones ====================

  /**
   * Get all milestones for a project
   */
  async getMilestones(projectId: number): Promise<IssueMilestone[]> {
    return this.repository.findMilestones(projectId);
  }

  /**
   * Get a single milestone by ID
   */
  async getMilestone(milestoneId: number): Promise<IssueMilestone | null> {
    return this.repository.findMilestoneById(milestoneId);
  }

  /**
   * Create a new milestone
   */
  async createMilestone(request: CreateMilestoneRequest): Promise<IssueMilestone> {
    return this.repository.createMilestone(request);
  }

  /**
   * Update a milestone
   */
  async updateMilestone(
    milestoneId: number,
    data: Partial<CreateMilestoneRequest>
  ): Promise<IssueMilestone> {
    return this.repository.updateMilestone(milestoneId, data);
  }

  /**
   * Delete a milestone
   */
  async deleteMilestone(milestoneId: number): Promise<boolean> {
    return this.repository.deleteMilestone(milestoneId);
  }

  /**
   * Close a milestone
   */
  async closeMilestone(milestoneId: number): Promise<IssueMilestone> {
    return this.repository.closeMilestone(milestoneId);
  }

  /**
   * Reopen a milestone
   */
  async reopenMilestone(milestoneId: number): Promise<IssueMilestone> {
    return this.repository.reopenMilestone(milestoneId);
  }

  // ==================== Comments ====================

  /**
   * Get all comments for an issue
   */
  async getComments(issueId: number): Promise<IssueComment[]> {
    return this.repository.findComments(issueId);
  }

  /**
   * Add a comment to an issue
   */
  async addComment(issueId: number, body: string): Promise<IssueComment> {
    return this.repository.addComment(issueId, body);
  }

  /**
   * Update a comment
   */
  async updateComment(commentId: number, body: string): Promise<IssueComment> {
    return this.repository.updateComment(commentId, body);
  }

  /**
   * Delete a comment
   */
  async deleteComment(commentId: number): Promise<boolean> {
    return this.repository.deleteComment(commentId);
  }

  // ==================== Timeline ====================

  /**
   * Get the timeline (activity history) for an issue
   */
  async getTimeline(issueId: number): Promise<IssueTimelineEvent[]> {
    return this.repository.getTimeline(issueId);
  }

  // ==================== Bulk Operations ====================

  /**
   * Close multiple issues at once
   */
  async bulkCloseIssues(issueIds: number[]): Promise<Issue[]> {
    return this.repository.bulkClose(issueIds);
  }

  /**
   * Add a label to multiple issues
   */
  async bulkAddLabel(issueIds: number[], labelId: number): Promise<Issue[]> {
    return this.repository.bulkAddLabel(issueIds, labelId);
  }

  /**
   * Assign a user to multiple issues
   */
  async bulkAssign(issueIds: number[], userId: number): Promise<Issue[]> {
    return this.repository.bulkAssign(issueIds, userId);
  }
}

// Singleton instance
let issueServiceInstance: IssueService | null = null;

/**
 * Get or create the IssueService singleton
 */
export function getIssueService(apiClient: ApiClient): IssueService {
  if (!issueServiceInstance) {
    issueServiceInstance = new IssueService(apiClient);
  }
  return issueServiceInstance;
}
