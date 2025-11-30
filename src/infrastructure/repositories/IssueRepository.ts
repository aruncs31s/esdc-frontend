/**
 * Issue Repository Implementation
 * Implements the IIssueRepository interface using the API client
 */

import { IIssueRepository } from '@/domain/repositories/IIssueRepository';
import { Issue } from '@/domain/entities/Issue';
import { ApiClient } from '../api/ApiClient';
import {
  Issue as IssueData,
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

export class IssueRepository implements IIssueRepository {
  private readonly apiClient: ApiClient;
  private readonly basePath = '/api/v1';

  constructor(apiClient: ApiClient) {
    this.apiClient = apiClient;
  }

  // Helper to convert API response to Issue entity
  private toIssueEntity(data: IssueData): Issue {
    return Issue.fromAPI(data);
  }

  // Issue CRUD
  async findAll(
    projectId: number,
    filters?: IssueFilters
  ): Promise<{ issues: Issue[]; total: number }> {
    const queryParams = new URLSearchParams();

    if (filters) {
      if (filters.status) {
        const statuses = Array.isArray(filters.status) ? filters.status : [filters.status];
        statuses.forEach((s) => queryParams.append('status', s));
      }
      if (filters.priority) {
        const priorities = Array.isArray(filters.priority) ? filters.priority : [filters.priority];
        priorities.forEach((p) => queryParams.append('priority', p));
      }
      if (filters.issue_type) {
        const types = Array.isArray(filters.issue_type) ? filters.issue_type : [filters.issue_type];
        types.forEach((t) => queryParams.append('type', t));
      }
      if (filters.assignee_ids) {
        filters.assignee_ids.forEach((id) => queryParams.append('assignee_id', id.toString()));
      } else if (filters.assignee_id) {
        queryParams.set('assignee_id', filters.assignee_id.toString());
      }
      if (filters.label_ids) {
        filters.label_ids.forEach((id) => queryParams.append('label_id', id.toString()));
      }
      if (filters.milestone_id) queryParams.set('milestone_id', filters.milestone_id.toString());
      if (filters.epic_id) queryParams.set('epic_id', filters.epic_id.toString());
      if (filters.sprint_id) queryParams.set('sprint_id', filters.sprint_id.toString());
      if (filters.created_by) queryParams.set('created_by', filters.created_by.toString());
      if (filters.search) queryParams.set('search', filters.search);
      if (filters.is_overdue !== undefined)
        queryParams.set('is_overdue', filters.is_overdue.toString());
      if (filters.has_due_date !== undefined)
        queryParams.set('has_due_date', filters.has_due_date.toString());
      if (filters.sort_by) queryParams.set('sort_by', filters.sort_by);
      if (filters.sort_order) queryParams.set('sort_order', filters.sort_order);
      if (filters.page) queryParams.set('page', filters.page.toString());
      if (filters.per_page) queryParams.set('per_page', filters.per_page.toString());
    }

    const response = await this.apiClient.getData<{ issues: IssueData[]; total: number }>(
      `${this.basePath}/projects/${projectId}/issues?${queryParams.toString()}`
    );

    return {
      issues: response.issues.map((data) => this.toIssueEntity(data)),
      total: response.total,
    };
  }

  async findById(issueId: number): Promise<Issue | null> {
    try {
      const response = await this.apiClient.getData<IssueData>(
        `${this.basePath}/issues/${issueId}`
      );
      return this.toIssueEntity(response);
    } catch {
      return null;
    }
  }

  async findByNumber(projectId: number, issueNumber: number): Promise<Issue | null> {
    try {
      const response = await this.apiClient.getData<IssueData>(
        `${this.basePath}/projects/${projectId}/issues/number/${issueNumber}`
      );
      return this.toIssueEntity(response);
    } catch {
      return null;
    }
  }

  async create(request: CreateIssueRequest): Promise<Issue> {
    const response = await this.apiClient.postData<IssueData>(
      `${this.basePath}/projects/${request.project_id}/issues`,
      request
    );
    return this.toIssueEntity(response);
  }

  async update(issueId: number, request: UpdateIssueRequest): Promise<Issue> {
    const response = await this.apiClient.patchData<IssueData>(
      `${this.basePath}/issues/${issueId}`,
      request
    );
    return this.toIssueEntity(response);
  }

  async delete(issueId: number): Promise<boolean> {
    await this.apiClient.deleteData(`${this.basePath}/issues/${issueId}`);
    return true;
  }

  // Status operations
  async close(issueId: number): Promise<Issue> {
    const response = await this.apiClient.postData<IssueData>(
      `${this.basePath}/issues/${issueId}/close`,
      {}
    );
    return this.toIssueEntity(response);
  }

  async reopen(issueId: number): Promise<Issue> {
    const response = await this.apiClient.postData<IssueData>(
      `${this.basePath}/issues/${issueId}/reopen`,
      {}
    );
    return this.toIssueEntity(response);
  }

  // Assignees
  async addAssignee(issueId: number, userId: number): Promise<Issue> {
    const response = await this.apiClient.postData<IssueData>(
      `${this.basePath}/issues/${issueId}/assignees`,
      { user_id: userId }
    );
    return this.toIssueEntity(response);
  }

  async removeAssignee(issueId: number, userId: number): Promise<Issue> {
    const response = await this.apiClient.deleteData<IssueData>(
      `${this.basePath}/issues/${issueId}/assignees/${userId}`
    );
    return this.toIssueEntity(response);
  }

  // Labels
  async findLabels(projectId: number): Promise<IssueLabel[]> {
    return this.apiClient.getData<IssueLabel[]>(`${this.basePath}/projects/${projectId}/labels`);
  }

  async createLabel(request: CreateLabelRequest): Promise<IssueLabel> {
    return this.apiClient.postData<IssueLabel>(
      `${this.basePath}/projects/${request.project_id}/labels`,
      request
    );
  }

  async updateLabel(labelId: number, data: Partial<CreateLabelRequest>): Promise<IssueLabel> {
    return this.apiClient.patchData<IssueLabel>(`${this.basePath}/labels/${labelId}`, data);
  }

  async deleteLabel(labelId: number): Promise<boolean> {
    await this.apiClient.deleteData(`${this.basePath}/labels/${labelId}`);
    return true;
  }

  async addLabelToIssue(issueId: number, labelId: number): Promise<Issue> {
    const response = await this.apiClient.postData<IssueData>(
      `${this.basePath}/issues/${issueId}/labels`,
      { label_id: labelId }
    );
    return this.toIssueEntity(response);
  }

  async removeLabelFromIssue(issueId: number, labelId: number): Promise<Issue> {
    const response = await this.apiClient.deleteData<IssueData>(
      `${this.basePath}/issues/${issueId}/labels/${labelId}`
    );
    return this.toIssueEntity(response);
  }

  // Milestones
  async findMilestones(projectId: number): Promise<IssueMilestone[]> {
    return this.apiClient.getData<IssueMilestone[]>(
      `${this.basePath}/projects/${projectId}/milestones`
    );
  }

  async findMilestoneById(milestoneId: number): Promise<IssueMilestone | null> {
    try {
      return await this.apiClient.getData<IssueMilestone>(
        `${this.basePath}/milestones/${milestoneId}`
      );
    } catch {
      return null;
    }
  }

  async createMilestone(request: CreateMilestoneRequest): Promise<IssueMilestone> {
    return this.apiClient.postData<IssueMilestone>(
      `${this.basePath}/projects/${request.project_id}/milestones`,
      request
    );
  }

  async updateMilestone(
    milestoneId: number,
    data: Partial<CreateMilestoneRequest>
  ): Promise<IssueMilestone> {
    return this.apiClient.patchData<IssueMilestone>(
      `${this.basePath}/milestones/${milestoneId}`,
      data
    );
  }

  async deleteMilestone(milestoneId: number): Promise<boolean> {
    await this.apiClient.deleteData(`${this.basePath}/milestones/${milestoneId}`);
    return true;
  }

  async closeMilestone(milestoneId: number): Promise<IssueMilestone> {
    return this.apiClient.postData<IssueMilestone>(
      `${this.basePath}/milestones/${milestoneId}/close`,
      {}
    );
  }

  async reopenMilestone(milestoneId: number): Promise<IssueMilestone> {
    return this.apiClient.postData<IssueMilestone>(
      `${this.basePath}/milestones/${milestoneId}/reopen`,
      {}
    );
  }

  // Comments
  async findComments(issueId: number): Promise<IssueComment[]> {
    return this.apiClient.getData<IssueComment[]>(`${this.basePath}/issues/${issueId}/comments`);
  }

  async addComment(issueId: number, body: string): Promise<IssueComment> {
    return this.apiClient.postData<IssueComment>(`${this.basePath}/issues/${issueId}/comments`, {
      body,
    });
  }

  async updateComment(commentId: number, body: string): Promise<IssueComment> {
    return this.apiClient.patchData<IssueComment>(`${this.basePath}/comments/${commentId}`, {
      body,
    });
  }

  async deleteComment(commentId: number): Promise<boolean> {
    await this.apiClient.deleteData(`${this.basePath}/comments/${commentId}`);
    return true;
  }

  // Timeline
  async getTimeline(issueId: number): Promise<IssueTimelineEvent[]> {
    return this.apiClient.getData<IssueTimelineEvent[]>(
      `${this.basePath}/issues/${issueId}/timeline`
    );
  }

  // Statistics
  async getStatistics(projectId: number): Promise<IssueStatistics> {
    return this.apiClient.getData<IssueStatistics>(
      `${this.basePath}/projects/${projectId}/issues/statistics`
    );
  }

  // Search
  async search(projectId: number, query: string): Promise<Issue[]> {
    const response = await this.apiClient.getData<IssueData[]>(
      `${this.basePath}/projects/${projectId}/issues/search?q=${encodeURIComponent(query)}`
    );
    return response.map((data) => this.toIssueEntity(data));
  }

  // Bulk operations
  async bulkClose(issueIds: number[]): Promise<Issue[]> {
    const response = await this.apiClient.postData<IssueData[]>(
      `${this.basePath}/issues/bulk/close`,
      { issue_ids: issueIds }
    );
    return response.map((data) => this.toIssueEntity(data));
  }

  async bulkAddLabel(issueIds: number[], labelId: number): Promise<Issue[]> {
    const response = await this.apiClient.postData<IssueData[]>(
      `${this.basePath}/issues/bulk/labels`,
      { issue_ids: issueIds, label_id: labelId }
    );
    return response.map((data) => this.toIssueEntity(data));
  }

  async bulkAssign(issueIds: number[], userId: number): Promise<Issue[]> {
    const response = await this.apiClient.postData<IssueData[]>(
      `${this.basePath}/issues/bulk/assign`,
      { issue_ids: issueIds, user_id: userId }
    );
    return response.map((data) => this.toIssueEntity(data));
  }
}
