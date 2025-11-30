/**
 * Kanban Board Repository Implementation
 * Implements the IKanbanBoardRepository interface using the API client
 */

import { IKanbanBoardRepository } from '@/domain/repositories/IKanbanBoardRepository';
import { ApiClient } from '../api/ApiClient';
import {
  KanbanBoard,
  KanbanColumn,
  KanbanCard,
  CreateBoardRequest,
  UpdateBoardRequest,
  CreateColumnRequest,
  UpdateColumnRequest,
  MoveCardRequest,
} from '@/types/agile';

export class KanbanBoardRepository implements IKanbanBoardRepository {
  private readonly apiClient: ApiClient;
  private readonly basePath = '/api/v1';

  constructor(apiClient: ApiClient) {
    this.apiClient = apiClient;
  }

  // Board CRUD
  async findAll(projectId: number): Promise<KanbanBoard[]> {
    return this.apiClient.getData<KanbanBoard[]>(`${this.basePath}/projects/${projectId}/boards`);
  }

  async findById(boardId: number): Promise<KanbanBoard | null> {
    try {
      return await this.apiClient.getData<KanbanBoard>(`${this.basePath}/boards/${boardId}`);
    } catch {
      return null;
    }
  }

  async findDefault(projectId: number): Promise<KanbanBoard | null> {
    try {
      return await this.apiClient.getData<KanbanBoard>(
        `${this.basePath}/projects/${projectId}/boards/default`
      );
    } catch {
      return null;
    }
  }

  async create(request: CreateBoardRequest): Promise<KanbanBoard> {
    return this.apiClient.postData<KanbanBoard>(
      `${this.basePath}/projects/${request.project_id}/boards`,
      request
    );
  }

  async update(boardId: number, request: UpdateBoardRequest): Promise<KanbanBoard> {
    return this.apiClient.patchData<KanbanBoard>(`${this.basePath}/boards/${boardId}`, request);
  }

  async delete(boardId: number): Promise<boolean> {
    await this.apiClient.deleteData(`${this.basePath}/boards/${boardId}`);
    return true;
  }

  async setDefault(boardId: number): Promise<KanbanBoard> {
    return this.apiClient.postData<KanbanBoard>(
      `${this.basePath}/boards/${boardId}/set-default`,
      {}
    );
  }

  // Column operations
  async getColumns(boardId: number): Promise<KanbanColumn[]> {
    return this.apiClient.getData<KanbanColumn[]>(`${this.basePath}/boards/${boardId}/columns`);
  }

  async createColumn(boardId: number, request: CreateColumnRequest): Promise<KanbanColumn> {
    return this.apiClient.postData<KanbanColumn>(
      `${this.basePath}/boards/${boardId}/columns`,
      request
    );
  }

  async updateColumn(columnId: number, request: UpdateColumnRequest): Promise<KanbanColumn> {
    return this.apiClient.patchData<KanbanColumn>(`${this.basePath}/columns/${columnId}`, request);
  }

  async deleteColumn(columnId: number): Promise<boolean> {
    await this.apiClient.deleteData(`${this.basePath}/columns/${columnId}`);
    return true;
  }

  async reorderColumns(boardId: number, columnOrder: number[]): Promise<KanbanColumn[]> {
    return this.apiClient.putData<KanbanColumn[]>(
      `${this.basePath}/boards/${boardId}/columns/reorder`,
      { column_order: columnOrder }
    );
  }

  // Card operations
  async getCards(columnId: number): Promise<KanbanCard[]> {
    return this.apiClient.getData<KanbanCard[]>(`${this.basePath}/columns/${columnId}/cards`);
  }

  async addCard(columnId: number, issueId: number, position?: number): Promise<KanbanCard> {
    return this.apiClient.postData<KanbanCard>(`${this.basePath}/columns/${columnId}/cards`, {
      issue_id: issueId,
      position,
    });
  }

  async removeCard(cardId: number): Promise<boolean> {
    await this.apiClient.deleteData(`${this.basePath}/cards/${cardId}`);
    return true;
  }

  async moveCard(request: MoveCardRequest): Promise<KanbanCard> {
    return this.apiClient.postData<KanbanCard>(`${this.basePath}/cards/${request.card_id}/move`, {
      target_column_id: request.target_column_id,
      target_position: request.target_position,
    });
  }

  async reorderCards(columnId: number, cardOrder: number[]): Promise<KanbanCard[]> {
    return this.apiClient.putData<KanbanCard[]>(
      `${this.basePath}/columns/${columnId}/cards/reorder`,
      { card_order: cardOrder }
    );
  }

  // Bulk operations
  async bulkMoveCards(cardIds: number[], targetColumnId: number): Promise<KanbanCard[]> {
    return this.apiClient.postData<KanbanCard[]>(`${this.basePath}/cards/bulk/move`, {
      card_ids: cardIds,
      target_column_id: targetColumnId,
    });
  }

  // WIP limit
  async checkWipLimit(
    columnId: number
  ): Promise<{ isExceeded: boolean; current: number; limit: number | null }> {
    return this.apiClient.getData<{ isExceeded: boolean; current: number; limit: number | null }>(
      `${this.basePath}/columns/${columnId}/wip-limit`
    );
  }
}
