/**
 * Sprint Repository Implementation
 * Implements the ISprintRepository interface using the API client
 */

import { ISprintRepository } from '@/domain/repositories/ISprintRepository';
import { Sprint } from '@/domain/entities/Sprint';
import { ApiClient } from '../api/ApiClient';
import {
  Sprint as SprintData,
  SprintFilters,
  SprintStatistics,
  CreateSprintRequest,
  UpdateSprintRequest,
  SprintRetrospective,
  VelocityData,
  BurndownChartData,
} from '@/types/agile';

export class SprintRepository implements ISprintRepository {
  private readonly apiClient: ApiClient;
  private readonly basePath = '/api/v1';

  constructor(apiClient: ApiClient) {
    this.apiClient = apiClient;
  }

  // Helper to convert API response to Sprint entity
  private toSprintEntity(data: SprintData): Sprint {
    return Sprint.fromAPI(data);
  }

  // Sprint CRUD
  async findAll(projectId: number, filters?: SprintFilters): Promise<Sprint[]> {
    const queryParams = new URLSearchParams();

    if (filters) {
      if (filters.status) {
        const statuses = Array.isArray(filters.status) ? filters.status : [filters.status];
        statuses.forEach((s) => queryParams.append('status', s));
      }
      if (filters.start_date_from) queryParams.set('start_date_from', filters.start_date_from);
      if (filters.start_date_to) queryParams.set('start_date_to', filters.start_date_to);
      if (filters.end_date_from) queryParams.set('end_date_from', filters.end_date_from);
      if (filters.end_date_to) queryParams.set('end_date_to', filters.end_date_to);
      if (filters.has_issues !== undefined)
        queryParams.set('has_issues', filters.has_issues.toString());
    }

    const response = await this.apiClient.getData<SprintData[]>(
      `${this.basePath}/projects/${projectId}/sprints?${queryParams.toString()}`
    );

    return response.map((data) => this.toSprintEntity(data));
  }

  async findById(sprintId: number): Promise<Sprint | null> {
    try {
      const response = await this.apiClient.getData<SprintData>(
        `${this.basePath}/sprints/${sprintId}`
      );
      return this.toSprintEntity(response);
    } catch {
      return null;
    }
  }

  async findActive(projectId: number): Promise<Sprint | null> {
    try {
      const response = await this.apiClient.getData<SprintData>(
        `${this.basePath}/projects/${projectId}/sprints/active`
      );
      return this.toSprintEntity(response);
    } catch {
      return null;
    }
  }

  async findByStatus(
    projectId: number,
    status: 'planning' | 'active' | 'completed' | 'cancelled'
  ): Promise<Sprint[]> {
    const response = await this.apiClient.getData<SprintData[]>(
      `${this.basePath}/projects/${projectId}/sprints?status=${status}`
    );
    return response.map((data) => this.toSprintEntity(data));
  }

  async create(request: CreateSprintRequest): Promise<Sprint> {
    const response = await this.apiClient.postData<SprintData>(
      `${this.basePath}/projects/${request.project_id}/sprints`,
      request
    );
    return this.toSprintEntity(response);
  }

  async update(sprintId: number, request: UpdateSprintRequest): Promise<Sprint> {
    const response = await this.apiClient.patchData<SprintData>(
      `${this.basePath}/sprints/${sprintId}`,
      request
    );
    return this.toSprintEntity(response);
  }

  async delete(sprintId: number): Promise<boolean> {
    await this.apiClient.deleteData(`${this.basePath}/sprints/${sprintId}`);
    return true;
  }

  // Sprint lifecycle
  async start(sprintId: number): Promise<Sprint> {
    const response = await this.apiClient.postData<SprintData>(
      `${this.basePath}/sprints/${sprintId}/start`,
      {}
    );
    return this.toSprintEntity(response);
  }

  async complete(sprintId: number): Promise<Sprint> {
    const response = await this.apiClient.postData<SprintData>(
      `${this.basePath}/sprints/${sprintId}/complete`,
      {}
    );
    return this.toSprintEntity(response);
  }

  async cancel(sprintId: number): Promise<Sprint> {
    const response = await this.apiClient.postData<SprintData>(
      `${this.basePath}/sprints/${sprintId}/cancel`,
      {}
    );
    return this.toSprintEntity(response);
  }

  // Issue management
  async addIssue(sprintId: number, issueId: number): Promise<Sprint> {
    const response = await this.apiClient.postData<SprintData>(
      `${this.basePath}/sprints/${sprintId}/issues`,
      { issue_id: issueId }
    );
    return this.toSprintEntity(response);
  }

  async removeIssue(sprintId: number, issueId: number): Promise<Sprint> {
    const response = await this.apiClient.deleteData<SprintData>(
      `${this.basePath}/sprints/${sprintId}/issues/${issueId}`
    );
    return this.toSprintEntity(response);
  }

  async moveIssue(
    fromSprintId: number,
    toSprintId: number,
    issueId: number
  ): Promise<{ from: Sprint; to: Sprint }> {
    const response = await this.apiClient.postData<{ from: SprintData; to: SprintData }>(
      `${this.basePath}/sprints/${fromSprintId}/issues/${issueId}/move`,
      { target_sprint_id: toSprintId }
    );
    return {
      from: this.toSprintEntity(response.from),
      to: this.toSprintEntity(response.to),
    };
  }

  // Retrospective
  async getRetrospective(sprintId: number): Promise<SprintRetrospective | null> {
    try {
      return await this.apiClient.getData<SprintRetrospective>(
        `${this.basePath}/sprints/${sprintId}/retrospective`
      );
    } catch {
      return null;
    }
  }

  async saveRetrospective(
    sprintId: number,
    retrospective: Omit<SprintRetrospective, 'id' | 'sprint_id'>
  ): Promise<SprintRetrospective> {
    return this.apiClient.postData<SprintRetrospective>(
      `${this.basePath}/sprints/${sprintId}/retrospective`,
      retrospective
    );
  }

  async updateRetrospective(
    retrospectiveId: number,
    data: Partial<SprintRetrospective>
  ): Promise<SprintRetrospective> {
    return this.apiClient.patchData<SprintRetrospective>(
      `${this.basePath}/retrospectives/${retrospectiveId}`,
      data
    );
  }

  // Metrics
  async getVelocity(projectId: number, sprintCount: number = 5): Promise<VelocityData> {
    return this.apiClient.getData<VelocityData>(
      `${this.basePath}/projects/${projectId}/velocity?sprint_count=${sprintCount}`
    );
  }

  async getBurndownChart(sprintId: number): Promise<BurndownChartData> {
    return this.apiClient.getData<BurndownChartData>(
      `${this.basePath}/sprints/${sprintId}/burndown`
    );
  }

  async getStatistics(sprintId: number): Promise<SprintStatistics> {
    return this.apiClient.getData<SprintStatistics>(
      `${this.basePath}/sprints/${sprintId}/statistics`
    );
  }

  // Backlog
  async getBacklog(projectId: number): Promise<{ issues: number[]; totalPoints: number }> {
    return this.apiClient.getData<{ issues: number[]; totalPoints: number }>(
      `${this.basePath}/projects/${projectId}/backlog`
    );
  }

  async prioritizeBacklog(projectId: number, issueOrder: number[]): Promise<boolean> {
    await this.apiClient.putData(`${this.basePath}/projects/${projectId}/backlog/prioritize`, {
      issue_order: issueOrder,
    });
    return true;
  }
}
