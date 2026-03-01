/**
 * Agile Application Service
 * Provides high-level operations for sprints, epics, and kanban boards
 */

import { SprintRepository } from '@/infrastructure/repositories/SprintRepository';
import { EpicRepository } from '@/infrastructure/repositories/EpicRepository';
import { KanbanBoardRepository } from '@/infrastructure/repositories/KanbanBoardRepository';
import { Sprint } from '@/domain/entities/Sprint';
import { Epic } from '@/domain/entities/Epic';
import { ApiClient } from '@/infrastructure/api/ApiClient';
import { EpicStatistics, UpdateEpicRequest } from '@/domain/repositories/IEpicRepository';
import {
  SprintFilters,
  SprintStatistics,
  CreateSprintRequest,
  UpdateSprintRequest,
  SprintRetrospective,
  VelocityData,
  BurndownChartData,
  EpicFilters,
  CreateEpicRequest,
  KanbanBoard,
  KanbanColumn,
  KanbanCard,
  CreateBoardRequest,
  UpdateBoardRequest,
  CreateColumnRequest,
  UpdateColumnRequest,
  MoveCardRequest,
  AgileMetrics,
} from '@/types/agile';

/**
 * Agile Application Service
 * Orchestrates agile workflow operations
 */
export class AgileService {
  private readonly sprintRepository: SprintRepository;
  private readonly epicRepository: EpicRepository;
  private readonly kanbanRepository: KanbanBoardRepository;
  private readonly apiClient: ApiClient;

  constructor(apiClient: ApiClient) {
    this.apiClient = apiClient;
    this.sprintRepository = new SprintRepository(apiClient);
    this.epicRepository = new EpicRepository(apiClient);
    this.kanbanRepository = new KanbanBoardRepository(apiClient);
  }

  // ==================== Sprints ====================

  /**
   * Get all sprints for a project
   */
  async getSprints(projectId: number, filters?: SprintFilters): Promise<Sprint[]> {
    return this.sprintRepository.findAll(projectId, filters);
  }

  /**
   * Get a single sprint by ID
   */
  async getSprint(sprintId: number): Promise<Sprint | null> {
    return this.sprintRepository.findById(sprintId);
  }

  /**
   * Get the currently active sprint
   */
  async getActiveSprint(projectId: number): Promise<Sprint | null> {
    return this.sprintRepository.findActive(projectId);
  }

  /**
   * Create a new sprint
   */
  async createSprint(request: CreateSprintRequest): Promise<Sprint> {
    return this.sprintRepository.create(request);
  }

  /**
   * Update an existing sprint
   */
  async updateSprint(sprintId: number, request: UpdateSprintRequest): Promise<Sprint> {
    return this.sprintRepository.update(sprintId, request);
  }

  /**
   * Delete a sprint
   */
  async deleteSprint(sprintId: number): Promise<boolean> {
    return this.sprintRepository.delete(sprintId);
  }

  /**
   * Start a sprint
   */
  async startSprint(sprintId: number): Promise<Sprint> {
    return this.sprintRepository.start(sprintId);
  }

  /**
   * Complete a sprint
   */
  async completeSprint(sprintId: number): Promise<Sprint> {
    return this.sprintRepository.complete(sprintId);
  }

  /**
   * Cancel a sprint
   */
  async cancelSprint(sprintId: number): Promise<Sprint> {
    return this.sprintRepository.cancel(sprintId);
  }

  /**
   * Add an issue to a sprint
   */
  async addIssueToSprint(sprintId: number, issueId: number): Promise<Sprint> {
    return this.sprintRepository.addIssue(sprintId, issueId);
  }

  /**
   * Remove an issue from a sprint
   */
  async removeIssueFromSprint(sprintId: number, issueId: number): Promise<Sprint> {
    return this.sprintRepository.removeIssue(sprintId, issueId);
  }

  /**
   * Move an issue between sprints
   */
  async moveIssueBetweenSprints(
    fromSprintId: number,
    toSprintId: number,
    issueId: number
  ): Promise<{ from: Sprint; to: Sprint }> {
    return this.sprintRepository.moveIssue(fromSprintId, toSprintId, issueId);
  }

  /**
   * Get sprint retrospective
   */
  async getSprintRetrospective(sprintId: number): Promise<SprintRetrospective | null> {
    return this.sprintRepository.getRetrospective(sprintId);
  }

  /**
   * Save sprint retrospective
   */
  async saveSprintRetrospective(
    sprintId: number,
    retrospective: Omit<SprintRetrospective, 'id' | 'sprint_id'>
  ): Promise<SprintRetrospective> {
    return this.sprintRepository.saveRetrospective(sprintId, retrospective);
  }

  /**
   * Get sprint statistics
   */
  async getSprintStatistics(sprintId: number): Promise<SprintStatistics> {
    return this.sprintRepository.getStatistics(sprintId);
  }

  /**
   * Get velocity data for a project
   */
  async getVelocity(projectId: number, sprintCount?: number): Promise<VelocityData> {
    return this.sprintRepository.getVelocity(projectId, sprintCount);
  }

  /**
   * Get burndown chart data for a sprint
   */
  async getBurndownChart(sprintId: number): Promise<BurndownChartData> {
    return this.sprintRepository.getBurndownChart(sprintId);
  }

  /**
   * Get the product backlog
   */
  async getBacklog(projectId: number): Promise<{ issues: number[]; totalPoints: number }> {
    return this.sprintRepository.getBacklog(projectId);
  }

  /**
   * Prioritize the product backlog
   */
  async prioritizeBacklog(projectId: number, issueOrder: number[]): Promise<boolean> {
    return this.sprintRepository.prioritizeBacklog(projectId, issueOrder);
  }

  // ==================== Epics ====================

  /**
   * Get all epics for a project
   */
  async getEpics(projectId: number, filters?: EpicFilters): Promise<Epic[]> {
    return this.epicRepository.findAll(projectId, filters);
  }

  /**
   * Get a single epic by ID
   */
  async getEpic(epicId: number): Promise<Epic | null> {
    return this.epicRepository.findById(epicId);
  }

  /**
   * Create a new epic
   */
  async createEpic(request: CreateEpicRequest): Promise<Epic> {
    return this.epicRepository.create(request);
  }

  /**
   * Update an existing epic
   */
  async updateEpic(epicId: number, request: UpdateEpicRequest): Promise<Epic> {
    return this.epicRepository.update(epicId, request);
  }

  /**
   * Delete an epic
   */
  async deleteEpic(epicId: number): Promise<boolean> {
    return this.epicRepository.delete(epicId);
  }

  /**
   * Start an epic
   */
  async startEpic(epicId: number): Promise<Epic> {
    return this.epicRepository.start(epicId);
  }

  /**
   * Complete an epic
   */
  async completeEpic(epicId: number): Promise<Epic> {
    return this.epicRepository.complete(epicId);
  }

  /**
   * Reopen an epic
   */
  async reopenEpic(epicId: number): Promise<Epic> {
    return this.epicRepository.reopen(epicId);
  }

  /**
   * Add an issue to an epic
   */
  async addIssueToEpic(epicId: number, issueId: number): Promise<Epic> {
    return this.epicRepository.addIssue(epicId, issueId);
  }

  /**
   * Remove an issue from an epic
   */
  async removeIssueFromEpic(epicId: number, issueId: number): Promise<Epic> {
    return this.epicRepository.removeIssue(epicId, issueId);
  }

  /**
   * Get all issue IDs for an epic
   */
  async getEpicIssues(epicId: number): Promise<number[]> {
    return this.epicRepository.getIssues(epicId);
  }

  /**
   * Get epic statistics for a project
   */
  async getEpicStatistics(projectId: number): Promise<EpicStatistics> {
    return this.epicRepository.getStatistics(projectId);
  }

  /**
   * Get the roadmap view for a project
   */
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
    return this.epicRepository.getRoadmap(projectId);
  }

  /**
   * Search epics
   */
  async searchEpics(projectId: number, query: string): Promise<Epic[]> {
    return this.epicRepository.search(projectId, query);
  }

  // ==================== Kanban Boards ====================

  /**
   * Get all boards for a project
   */
  async getBoards(projectId: number): Promise<KanbanBoard[]> {
    return this.kanbanRepository.findAll(projectId);
  }

  /**
   * Get a single board by ID
   */
  async getBoard(boardId: number): Promise<KanbanBoard | null> {
    return this.kanbanRepository.findById(boardId);
  }

  /**
   * Get the default board for a project
   */
  async getDefaultBoard(projectId: number): Promise<KanbanBoard | null> {
    return this.kanbanRepository.findDefault(projectId);
  }

  /**
   * Create a new board
   */
  async createBoard(request: CreateBoardRequest): Promise<KanbanBoard> {
    return this.kanbanRepository.create(request);
  }

  /**
   * Update an existing board
   */
  async updateBoard(boardId: number, request: UpdateBoardRequest): Promise<KanbanBoard> {
    return this.kanbanRepository.update(boardId, request);
  }

  /**
   * Delete a board
   */
  async deleteBoard(boardId: number): Promise<boolean> {
    return this.kanbanRepository.delete(boardId);
  }

  /**
   * Set a board as the default
   */
  async setDefaultBoard(boardId: number): Promise<KanbanBoard> {
    return this.kanbanRepository.setDefault(boardId);
  }

  // ==================== Board Columns ====================

  /**
   * Get all columns for a board
   */
  async getColumns(boardId: number): Promise<KanbanColumn[]> {
    return this.kanbanRepository.getColumns(boardId);
  }

  /**
   * Create a new column
   */
  async createColumn(boardId: number, request: CreateColumnRequest): Promise<KanbanColumn> {
    return this.kanbanRepository.createColumn(boardId, request);
  }

  /**
   * Update a column
   */
  async updateColumn(columnId: number, request: UpdateColumnRequest): Promise<KanbanColumn> {
    return this.kanbanRepository.updateColumn(columnId, request);
  }

  /**
   * Delete a column
   */
  async deleteColumn(columnId: number): Promise<boolean> {
    return this.kanbanRepository.deleteColumn(columnId);
  }

  /**
   * Reorder columns on a board
   */
  async reorderColumns(boardId: number, columnOrder: number[]): Promise<KanbanColumn[]> {
    return this.kanbanRepository.reorderColumns(boardId, columnOrder);
  }

  // ==================== Board Cards ====================

  /**
   * Get all cards in a column
   */
  async getCards(columnId: number): Promise<KanbanCard[]> {
    return this.kanbanRepository.getCards(columnId);
  }

  /**
   * Add a card to a column
   */
  async addCard(columnId: number, issueId: number, position?: number): Promise<KanbanCard> {
    return this.kanbanRepository.addCard(columnId, issueId, position);
  }

  /**
   * Remove a card from a column
   */
  async removeCard(cardId: number): Promise<boolean> {
    return this.kanbanRepository.removeCard(cardId);
  }

  /**
   * Move a card to a different column or position
   */
  async moveCard(request: MoveCardRequest): Promise<KanbanCard> {
    return this.kanbanRepository.moveCard(request);
  }

  /**
   * Reorder cards within a column
   */
  async reorderCards(columnId: number, cardOrder: number[]): Promise<KanbanCard[]> {
    return this.kanbanRepository.reorderCards(columnId, cardOrder);
  }

  /**
   * Move multiple cards to a column
   */
  async bulkMoveCards(cardIds: number[], targetColumnId: number): Promise<KanbanCard[]> {
    return this.kanbanRepository.bulkMoveCards(cardIds, targetColumnId);
  }

  /**
   * Check WIP limit for a column
   */
  async checkWipLimit(
    columnId: number
  ): Promise<{ isExceeded: boolean; current: number; limit: number | null }> {
    return this.kanbanRepository.checkWipLimit(columnId);
  }

  // ==================== Agile Metrics ====================

  /**
   * Get comprehensive agile metrics for a project
   */
  async getAgileMetrics(projectId: number): Promise<AgileMetrics> {
    return this.apiClient.getData<AgileMetrics>(`/api/v1/projects/${projectId}/agile/metrics`);
  }
}

// Singleton instance
let agileServiceInstance: AgileService | null = null;

/**
 * Get or create the AgileService singleton
 */
export function getAgileService(apiClient: ApiClient): AgileService {
  if (!agileServiceInstance) {
    agileServiceInstance = new AgileService(apiClient);
  }
  return agileServiceInstance;
}
