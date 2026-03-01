/**
 * Kanban Board Repository Interface
 * Defines the contract for Kanban board data access
 */

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

export interface IKanbanBoardRepository {
  // Board CRUD
  findAll(projectId: number): Promise<KanbanBoard[]>;
  findById(boardId: number): Promise<KanbanBoard | null>;
  findDefault(projectId: number): Promise<KanbanBoard | null>;
  create(request: CreateBoardRequest): Promise<KanbanBoard>;
  update(boardId: number, request: UpdateBoardRequest): Promise<KanbanBoard>;
  delete(boardId: number): Promise<boolean>;
  setDefault(boardId: number): Promise<KanbanBoard>;

  // Column operations
  getColumns(boardId: number): Promise<KanbanColumn[]>;
  createColumn(boardId: number, request: CreateColumnRequest): Promise<KanbanColumn>;
  updateColumn(columnId: number, request: UpdateColumnRequest): Promise<KanbanColumn>;
  deleteColumn(columnId: number): Promise<boolean>;
  reorderColumns(boardId: number, columnOrder: number[]): Promise<KanbanColumn[]>;

  // Card operations
  getCards(columnId: number): Promise<KanbanCard[]>;
  addCard(columnId: number, issueId: number, position?: number): Promise<KanbanCard>;
  removeCard(cardId: number): Promise<boolean>;
  moveCard(request: MoveCardRequest): Promise<KanbanCard>;
  reorderCards(columnId: number, cardOrder: number[]): Promise<KanbanCard[]>;

  // Bulk operations
  bulkMoveCards(cardIds: number[], targetColumnId: number): Promise<KanbanCard[]>;

  // WIP limit
  checkWipLimit(
    columnId: number
  ): Promise<{ isExceeded: boolean; current: number; limit: number | null }>;
}
