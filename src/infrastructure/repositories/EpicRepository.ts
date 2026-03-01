/**
 * Epic Repository Implementation
 * Implements the IEpicRepository interface using the API client
 */

import {
  IEpicRepository,
  UpdateEpicRequest,
  EpicStatistics,
} from '@/domain/repositories/IEpicRepository';
import { Epic, EpicConstructorData } from '@/domain/entities/Epic';
import { ApiClient } from '../api/ApiClient';
import { EpicFilters, CreateEpicRequest } from '@/types/agile';

export class EpicRepository implements IEpicRepository {
  private readonly apiClient: ApiClient;
  private readonly basePath = '/api/v1';

  constructor(apiClient: ApiClient) {
    this.apiClient = apiClient;
  }

  // Helper to convert API response to Epic entity
  private toEpicEntity(data: EpicConstructorData): Epic {
    return Epic.fromJSON(data as any);
  }

  // Epic CRUD
  async findAll(projectId: number, filters?: EpicFilters): Promise<Epic[]> {
    const queryParams = new URLSearchParams();

    if (filters) {
      if (filters.status) {
        const statuses = Array.isArray(filters.status) ? filters.status : [filters.status];
        statuses.forEach((s) => queryParams.append('status', s));
      }
      if (filters.start_date_from) queryParams.set('start_date_from', filters.start_date_from);
      if (filters.start_date_to) queryParams.set('start_date_to', filters.start_date_to);
      if (filters.target_date_from) queryParams.set('target_date_from', filters.target_date_from);
      if (filters.target_date_to) queryParams.set('target_date_to', filters.target_date_to);
      if (filters.has_issues !== undefined)
        queryParams.set('has_issues', filters.has_issues.toString());
      if (filters.is_overdue !== undefined)
        queryParams.set('is_overdue', filters.is_overdue.toString());
    }

    const response = await this.apiClient.getData<EpicConstructorData[]>(
      `${this.basePath}/projects/${projectId}/epics?${queryParams.toString()}`
    );

    return response.map((data) => this.toEpicEntity(data));
  }

  async findById(epicId: number): Promise<Epic | null> {
    try {
      const response = await this.apiClient.getData<EpicConstructorData>(
        `${this.basePath}/epics/${epicId}`
      );
      return this.toEpicEntity(response);
    } catch {
      return null;
    }
  }

  async findByStatus(
    projectId: number,
    status: 'open' | 'in_progress' | 'completed'
  ): Promise<Epic[]> {
    const response = await this.apiClient.getData<EpicConstructorData[]>(
      `${this.basePath}/projects/${projectId}/epics?status=${status}`
    );
    return response.map((data) => this.toEpicEntity(data));
  }

  async create(request: CreateEpicRequest): Promise<Epic> {
    const response = await this.apiClient.postData<EpicConstructorData>(
      `${this.basePath}/projects/${request.project_id}/epics`,
      request
    );
    return this.toEpicEntity(response);
  }

  async update(epicId: number, request: UpdateEpicRequest): Promise<Epic> {
    const response = await this.apiClient.patchData<EpicConstructorData>(
      `${this.basePath}/epics/${epicId}`,
      request
    );
    return this.toEpicEntity(response);
  }

  async delete(epicId: number): Promise<boolean> {
    await this.apiClient.deleteData(`${this.basePath}/epics/${epicId}`);
    return true;
  }

  // Status transitions
  async start(epicId: number): Promise<Epic> {
    const response = await this.apiClient.postData<EpicConstructorData>(
      `${this.basePath}/epics/${epicId}/start`,
      {}
    );
    return this.toEpicEntity(response);
  }

  async complete(epicId: number): Promise<Epic> {
    const response = await this.apiClient.postData<EpicConstructorData>(
      `${this.basePath}/epics/${epicId}/complete`,
      {}
    );
    return this.toEpicEntity(response);
  }

  async reopen(epicId: number): Promise<Epic> {
    const response = await this.apiClient.postData<EpicConstructorData>(
      `${this.basePath}/epics/${epicId}/reopen`,
      {}
    );
    return this.toEpicEntity(response);
  }

  // Issue management
  async addIssue(epicId: number, issueId: number): Promise<Epic> {
    const response = await this.apiClient.postData<EpicConstructorData>(
      `${this.basePath}/epics/${epicId}/issues`,
      { issue_id: issueId }
    );
    return this.toEpicEntity(response);
  }

  async removeIssue(epicId: number, issueId: number): Promise<Epic> {
    const response = await this.apiClient.deleteData<EpicConstructorData>(
      `${this.basePath}/epics/${epicId}/issues/${issueId}`
    );
    return this.toEpicEntity(response);
  }

  async getIssues(epicId: number): Promise<number[]> {
    return this.apiClient.getData<number[]>(`${this.basePath}/epics/${epicId}/issue-ids`);
  }

  // Statistics
  async getStatistics(projectId: number): Promise<EpicStatistics> {
    return this.apiClient.getData<EpicStatistics>(
      `${this.basePath}/projects/${projectId}/epics/statistics`
    );
  }

  // Roadmap view
  async getRoadmap(projectId: number): Promise<
    Array<{
      epic: Epic;
      timeline: {
        start: string | null;
        end: string | null;
        duration_days: number | null;
      };
    }>
  > {
    const response = await this.apiClient.getData<
      Array<{
        epic: EpicConstructorData;
        timeline: {
          start: string | null;
          end: string | null;
          duration_days: number | null;
        };
      }>
    >(`${this.basePath}/projects/${projectId}/roadmap`);

    return response.map((item) => ({
      epic: this.toEpicEntity(item.epic),
      timeline: item.timeline,
    }));
  }

  // Search
  async search(projectId: number, query: string): Promise<Epic[]> {
    const response = await this.apiClient.getData<EpicConstructorData[]>(
      `${this.basePath}/projects/${projectId}/epics/search?q=${encodeURIComponent(query)}`
    );
    return response.map((data) => this.toEpicEntity(data));
  }
}
