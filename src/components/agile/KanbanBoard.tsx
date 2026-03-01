/**
 * Kanban Board Component
 * Drag-and-drop kanban board for issue management
 */

import { useState } from 'react';
import { FiPlus, FiMoreVertical, FiEdit2, FiTrash2, FiSettings, FiMaximize2 } from 'react-icons/fi';
import { KanbanBoard as KanbanBoardType, KanbanColumn, KanbanCard } from '@/types/agile';
import { Issue } from '@/types/issues';
import IssueCard from '@/features/issues/components/IssueCard';

interface KanbanBoardProps {
  board: KanbanBoardType;
  columns: KanbanColumn[];
  cards: Record<number, KanbanCard[]>; // columnId -> cards
  issues: Record<number, Issue>; // issueId -> issue
  loading?: boolean;
  onMoveCard?: (cardId: number, targetColumnId: number, targetPosition: number) => void;
  onAddCard?: (columnId: number, issueId: number) => void;
  onRemoveCard?: (cardId: number) => void;
  onIssueClick?: (issue: Issue) => void;
  onAddColumn?: () => void;
  onEditColumn?: (column: KanbanColumn) => void;
  onDeleteColumn?: (columnId: number) => void;
  onReorderColumns?: (columnOrder: number[]) => void;
  onBoardSettings?: () => void;
}

// Column type to color mapping
const columnTypeColors: Record<string, { bg: string; border: string; badge: string }> = {
  backlog: { bg: 'bg-gray-50', border: 'border-gray-200', badge: 'bg-gray-500' },
  todo: { bg: 'bg-blue-50', border: 'border-blue-200', badge: 'bg-blue-500' },
  in_progress: { bg: 'bg-purple-50', border: 'border-purple-200', badge: 'bg-purple-500' },
  review: { bg: 'bg-yellow-50', border: 'border-yellow-200', badge: 'bg-yellow-500' },
  testing: { bg: 'bg-cyan-50', border: 'border-cyan-200', badge: 'bg-cyan-500' },
  done: { bg: 'bg-green-50', border: 'border-green-200', badge: 'bg-green-500' },
  blocked: { bg: 'bg-red-50', border: 'border-red-200', badge: 'bg-red-500' },
};

interface ColumnCardProps {
  column: KanbanColumn;
  cards: KanbanCard[];
  issues: Record<number, Issue>;
  onIssueClick?: (issue: Issue) => void;
  onAddCard?: (columnId: number) => void;
  onEditColumn?: (column: KanbanColumn) => void;
  onDeleteColumn?: (columnId: number) => void;
  onRemoveCard?: (cardId: number) => void;
  onDragStart?: (cardId: number, columnId: number) => void;
  onDragOver?: (e: React.DragEvent, columnId: number) => void;
  onDrop?: (columnId: number, position: number) => void;
}

function ColumnComponent({
  column,
  cards,
  issues,
  onIssueClick,
  onAddCard,
  onEditColumn,
  onDeleteColumn,
  onRemoveCard,
  onDragStart,
  onDragOver,
  onDrop,
}: ColumnCardProps) {
  const [showMenu, setShowMenu] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);

  const colors = columnTypeColors[column.column_type] || columnTypeColors.todo;
  const isWipExceeded = column.wip_limit != null && cards.length > column.wip_limit;

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
    onDragOver?.(e, column.id);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    onDrop?.(column.id, cards.length);
  };

  return (
    <div
      className={`flex flex-col min-w-[300px] max-w-[350px] ${colors.bg} rounded-lg border ${colors.border} ${isDragOver ? 'ring-2 ring-primary' : ''}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* Column Header */}
      <div className="p-3 border-b border-surface0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className={`w-2.5 h-2.5 rounded-full ${colors.badge}`}></span>
            <h3 className="font-semibold">{column.name}</h3>
            <span
              className={`text-xs px-1.5 py-0.5 rounded ${isWipExceeded ? 'bg-red-100 text-red-600' : 'bg-surface0 text-muted'}`}
            >
              {cards.length}
              {column.wip_limit !== null && `/${column.wip_limit}`}
            </span>
          </div>

          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-1 rounded hover:bg-surface0 transition-colors"
            >
              <FiMoreVertical size={16} />
            </button>

            {showMenu && (
              <div className="absolute right-0 top-full mt-1 bg-base rounded-lg shadow-lg border border-surface0 py-1 min-w-[140px] z-10">
                {onEditColumn && (
                  <button
                    onClick={() => {
                      onEditColumn(column);
                      setShowMenu(false);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-surface0"
                  >
                    <FiEdit2 size={14} />
                    Edit Column
                  </button>
                )}
                {onDeleteColumn && (
                  <button
                    onClick={() => {
                      onDeleteColumn(column.id);
                      setShowMenu(false);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-500 hover:bg-red-50"
                  >
                    <FiTrash2 size={14} />
                    Delete Column
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* WIP Warning */}
        {isWipExceeded && (
          <p className="text-xs text-red-500 mt-2">
            ⚠️ WIP limit exceeded ({cards.length}/{column.wip_limit})
          </p>
        )}
      </div>

      {/* Cards */}
      <div className="flex-1 p-2 space-y-2 overflow-y-auto max-h-[600px]">
        {cards.map((card) => {
          const issue = issues[card.issue_id];
          if (!issue) return null;

          return (
            <div
              key={card.id}
              draggable
              onDragStart={() => onDragStart?.(card.id, column.id)}
              className="cursor-move"
            >
              <div className="relative group">
                <IssueCard issue={issue} onClick={onIssueClick} compact />
                {onRemoveCard && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemoveCard(card.id);
                    }}
                    className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <FiTrash2 size={12} />
                  </button>
                )}
              </div>
            </div>
          );
        })}

        {cards.length === 0 && (
          <div className="text-center py-8 text-muted text-sm">
            <p>No cards</p>
            <p className="text-xs mt-1">Drag issues here</p>
          </div>
        )}
      </div>

      {/* Add Card Button */}
      {onAddCard && (
        <div className="p-2 border-t border-surface0">
          <button
            onClick={() => onAddCard(column.id)}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm text-muted hover:text-text hover:bg-surface0 rounded-lg transition-colors"
          >
            <FiPlus size={16} />
            Add Card
          </button>
        </div>
      )}
    </div>
  );
}

export function KanbanBoard({
  board,
  columns,
  cards,
  issues,
  loading = false,
  onMoveCard,
  onAddCard,
  onRemoveCard,
  onIssueClick,
  onAddColumn,
  onEditColumn,
  onDeleteColumn,
  onBoardSettings,
}: KanbanBoardProps) {
  const [dragState, setDragState] = useState<{ cardId: number; fromColumnId: number } | null>(null);

  const handleDragStart = (cardId: number, columnId: number) => {
    setDragState({ cardId, fromColumnId: columnId });
  };

  const handleDrop = (targetColumnId: number, position: number) => {
    if (dragState && onMoveCard) {
      onMoveCard(dragState.cardId, targetColumnId, position);
    }
    setDragState(null);
  };

  const sortedColumns = [...columns].sort((a, b) => a.position - b.position);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="kanban-board">
      {/* Board Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold">{board.name}</h2>
          {board.is_default && <span className="text-xs text-muted">Default Board</span>}
        </div>
        <div className="flex items-center gap-2">
          {onAddColumn && (
            <button
              onClick={onAddColumn}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
            >
              <FiPlus size={18} />
              Add Column
            </button>
          )}
          {onBoardSettings && (
            <button
              onClick={onBoardSettings}
              className="p-2 rounded-lg hover:bg-surface0 transition-colors"
            >
              <FiSettings size={20} />
            </button>
          )}
          <button className="p-2 rounded-lg hover:bg-surface0 transition-colors">
            <FiMaximize2 size={20} />
          </button>
        </div>
      </div>

      {/* Board Columns */}
      <div className="flex gap-4 overflow-x-auto pb-4">
        {sortedColumns.map((column) => (
          <ColumnComponent
            key={column.id}
            column={column}
            cards={cards[column.id] || []}
            issues={issues}
            onIssueClick={onIssueClick}
            onAddCard={onAddCard ? () => onAddCard(column.id, 0) : undefined}
            onEditColumn={onEditColumn}
            onDeleteColumn={onDeleteColumn}
            onRemoveCard={onRemoveCard}
            onDragStart={handleDragStart}
            onDrop={handleDrop}
          />
        ))}

        {/* Empty State */}
        {columns.length === 0 && (
          <div className="flex-1 flex items-center justify-center py-12">
            <div className="text-center">
              <p className="text-muted mb-4">
                No columns yet. Add columns to organize your issues.
              </p>
              {onAddColumn && (
                <button
                  onClick={onAddColumn}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
                >
                  <FiPlus size={18} />
                  Add First Column
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default KanbanBoard;
