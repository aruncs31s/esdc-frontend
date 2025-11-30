/**
 * Project Issues Page
 * GitHub-like issue tracking interface with multiple views
 */

import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiList, FiTrello, FiCalendar, FiPlus, FiArrowLeft, FiSettings } from 'react-icons/fi';
import { IssueList } from '@/components/issues';
import { SprintBoard, KanbanBoard } from '@/components/agile';
import { Issue, IssueFilters } from '@/types/issues';
import { Sprint, KanbanBoard as KanbanBoardType, KanbanColumn, KanbanCard } from '@/types/agile';
import { getIssueService } from '@/application/services/IssueService';
import { getAgileService } from '@/application/services/AgileService';
import apiClient from '@/infrastructure/api/ApiClient';

type ViewMode = 'list' | 'board' | 'sprints' | 'calendar';

export default function ProjectIssuesPage() {
  const { projectId: projectIdParam } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const projectId = parseInt(projectIdParam || '0', 10);

  // Services
  const issueService = getIssueService(apiClient);
  const agileService = getAgileService(apiClient);

  // State
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [issues, setIssues] = useState<Issue[]>([]);
  const [sprints, setSprints] = useState<Sprint[]>([]);
  const [kanbanBoard, setKanbanBoard] = useState<KanbanBoardType | null>(null);
  const [kanbanColumns, setKanbanColumns] = useState<KanbanColumn[]>([]);
  const [kanbanCards, setKanbanCards] = useState<Record<number, KanbanCard[]>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [_filters, _setFilters] = useState<IssueFilters>({});

  // Load issues
  const loadIssues = useCallback(async () => {
    try {
      const result = await issueService.getIssues(projectId, _filters);
      setIssues(result.issues);
    } catch (err) {
      console.error('Failed to load issues:', err);
      setError('Failed to load issues');
    }
  }, [projectId, _filters, issueService]);

  // Load sprints
  const loadSprints = useCallback(async () => {
    try {
      const data = await agileService.getSprints(projectId);
      setSprints(data);
    } catch (err) {
      console.error('Failed to load sprints:', err);
    }
  }, [projectId, agileService]);

  // Load kanban board
  const loadKanbanBoard = useCallback(async () => {
    try {
      const board = await agileService.getDefaultBoard(projectId);
      if (board) {
        setKanbanBoard(board);
        const columns = await agileService.getColumns(board.id);
        setKanbanColumns(columns);

        // Load cards for each column
        const cardsByColumn: Record<number, KanbanCard[]> = {};
        for (const column of columns) {
          const columnCards = await agileService.getCards(column.id);
          cardsByColumn[column.id] = columnCards;
        }
        setKanbanCards(cardsByColumn);
      }
    } catch (err) {
      console.error('Failed to load kanban board:', err);
    }
  }, [projectId, agileService]);

  // Initial load
  useEffect(() => {
    if (!projectId) return;

    const loadData = async () => {
      setLoading(true);
      setError(null);
      try {
        await Promise.all([loadIssues(), loadSprints(), loadKanbanBoard()]);
      } catch (err) {
        console.error('Failed to load data:', err);
        setError('Failed to load project data');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [projectId, loadIssues, loadSprints, loadKanbanBoard]);

  // Handlers
  const handleIssueClick = (issue: Issue) => {
    navigate(`/projects/${projectId}/issues/${issue.number}`);
  };

  const handleCreateIssue = () => {
    navigate(`/projects/${projectId}/issues/new`);
  };

  const handleStartSprint = async (sprintId: number) => {
    try {
      await agileService.startSprint(sprintId);
      await loadSprints();
    } catch (err) {
      console.error('Failed to start sprint:', err);
    }
  };

  const handleCompleteSprint = async (sprintId: number) => {
    try {
      await agileService.completeSprint(sprintId);
      await loadSprints();
    } catch (err) {
      console.error('Failed to complete sprint:', err);
    }
  };

  const handleCancelSprint = async (sprintId: number) => {
    if (!confirm('Are you sure you want to cancel this sprint?')) return;
    try {
      await agileService.cancelSprint(sprintId);
      await loadSprints();
    } catch (err) {
      console.error('Failed to cancel sprint:', err);
    }
  };

  const handleCreateSprint = () => {
    navigate(`/projects/${projectId}/sprints/new`);
  };

  const handleMoveCard = async (cardId: number, targetColumnId: number, position: number) => {
    try {
      await agileService.moveCard({
        card_id: cardId,
        target_column_id: targetColumnId,
        target_position: position,
      });
      await loadKanbanBoard();
    } catch (err) {
      console.error('Failed to move card:', err);
    }
  };

  // Create issue map for kanban board
  const issueMap = issues.reduce(
    (acc, issue) => {
      acc[issue.id] = issue;
      return acc;
    },
    {} as Record<number, Issue>
  );

  // View tabs
  const viewTabs = [
    { id: 'list' as ViewMode, label: 'List', icon: FiList },
    { id: 'board' as ViewMode, label: 'Board', icon: FiTrello },
    { id: 'sprints' as ViewMode, label: 'Sprints', icon: FiCalendar },
  ];

  if (error) {
    return (
      <div className="container py-8">
        <div className="text-center text-red-500">
          <p>{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-primary text-white rounded-lg"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(`/projects/${projectId}`)}
            className="p-2 rounded-lg hover:bg-surface0 transition-colors"
          >
            <FiArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-3xl font-bold">Issues</h1>
            <p className="text-muted">Track and manage project issues</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* View Mode Tabs */}
          <div className="flex bg-surface0 rounded-lg p-1">
            {viewTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setViewMode(tab.id)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  viewMode === tab.id ? 'bg-primary text-white' : 'hover:bg-surface1'
                }`}
              >
                <tab.icon size={16} />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Settings */}
          <button className="p-2 rounded-lg hover:bg-surface0 transition-colors">
            <FiSettings size={20} />
          </button>

          {/* Create Issue */}
          <button
            onClick={handleCreateIssue}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
          >
            <FiPlus size={18} />
            New Issue
          </button>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : (
        <>
          {viewMode === 'list' && (
            <IssueList
              issues={issues}
              onIssueClick={handleIssueClick}
              onCreateIssue={handleCreateIssue}
            />
          )}

          {viewMode === 'board' && kanbanBoard && (
            <KanbanBoard
              board={kanbanBoard}
              columns={kanbanColumns}
              cards={kanbanCards}
              issues={issueMap}
              onIssueClick={handleIssueClick}
              onMoveCard={handleMoveCard}
              onAddColumn={() => navigate(`/projects/${projectId}/board/columns/new`)}
            />
          )}

          {viewMode === 'board' && !kanbanBoard && (
            <div className="text-center py-12">
              <p className="text-muted mb-4">No kanban board configured for this project.</p>
              <button
                onClick={() => navigate(`/projects/${projectId}/board/new`)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
              >
                <FiPlus size={18} />
                Create Kanban Board
              </button>
            </div>
          )}

          {viewMode === 'sprints' && (
            <SprintBoard
              sprints={sprints}
              issues={issues}
              onStartSprint={handleStartSprint}
              onCompleteSprint={handleCompleteSprint}
              onCancelSprint={handleCancelSprint}
              onCreateSprint={handleCreateSprint}
              onIssueClick={handleIssueClick}
            />
          )}
        </>
      )}
    </div>
  );
}
