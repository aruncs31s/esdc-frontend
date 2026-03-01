/**
 * Sprint Board Component
 * Displays sprints with their issues in a kanban-like view
 */

import { useState } from 'react';
import {
  FiPlay,
  FiCheckCircle,
  FiXCircle,
  FiPlus,
  FiCalendar,
  FiClock,
  FiTrendingUp,
  FiChevronDown,
  FiChevronRight,
} from 'react-icons/fi';
import { Sprint, SprintStatusType } from '@/types/agile';
import { Issue } from '@/types/issues';
import IssueCard from '@/features/issues/components/IssueCard';

interface SprintBoardProps {
  sprints: Sprint[];
  issues: Issue[];
  loading?: boolean;
  onStartSprint?: (sprintId: number) => void;
  onCompleteSprint?: (sprintId: number) => void;
  onCancelSprint?: (sprintId: number) => void;
  onCreateSprint?: () => void;
  onIssueClick?: (issue: Issue) => void;
  onMoveIssue?: (issueId: number, toSprintId: number | null) => void;
}

const statusColors: Record<SprintStatusType, { bg: string; text: string; label: string }> = {
  planning: { bg: 'bg-gray-100', text: 'text-gray-600', label: 'Planning' },
  active: { bg: 'bg-green-100', text: 'text-green-600', label: 'Active' },
  completed: { bg: 'bg-blue-100', text: 'text-blue-600', label: 'Completed' },
  cancelled: { bg: 'bg-red-100', text: 'text-red-600', label: 'Cancelled' },
};

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function getDaysRemaining(endDate: string): number {
  const end = new Date(endDate);
  const now = new Date();
  const diff = end.getTime() - now.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

interface SprintCardProps {
  sprint: Sprint;
  sprintIssues: Issue[];
  onStartSprint?: (sprintId: number) => void;
  onCompleteSprint?: (sprintId: number) => void;
  onCancelSprint?: (sprintId: number) => void;
  onIssueClick?: (issue: Issue) => void;
}

function SprintCard({
  sprint,
  sprintIssues,
  onStartSprint,
  onCompleteSprint,
  onCancelSprint,
  onIssueClick,
}: SprintCardProps) {
  const [isExpanded, setIsExpanded] = useState(sprint.status === 'active');
  const statusStyle = statusColors[sprint.status];
  const daysRemaining = sprint.end_date ? getDaysRemaining(sprint.end_date) : null;

  // Calculate progress
  const completedIssues = sprintIssues.filter((i) => i.status === 'closed').length;
  const totalIssues = sprintIssues.length;
  const progress = totalIssues > 0 ? Math.round((completedIssues / totalIssues) * 100) : 0;

  // Calculate story points
  const completedPoints = sprint.completed_story_points || 0;

  return (
    <div className="bg-base rounded-lg border border-surface0 overflow-hidden">
      {/* Sprint Header */}
      <div
        className="p-4 cursor-pointer hover:bg-surface0/50 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {isExpanded ? <FiChevronDown size={20} /> : <FiChevronRight size={20} />}
            <h3 className="font-semibold text-lg">{sprint.name}</h3>
            <span
              className={`text-xs px-2 py-1 rounded-full ${statusStyle.bg} ${statusStyle.text}`}
            >
              {statusStyle.label}
            </span>
          </div>

          <div className="flex items-center gap-4 text-sm text-muted">
            {sprint.start_date && sprint.end_date && (
              <span className="flex items-center gap-1">
                <FiCalendar size={14} />
                {formatDate(sprint.start_date)} - {formatDate(sprint.end_date)}
              </span>
            )}
            {sprint.status === 'active' && daysRemaining !== null && (
              <span
                className={`flex items-center gap-1 ${daysRemaining < 0 ? 'text-red-500' : ''}`}
              >
                <FiClock size={14} />
                {daysRemaining > 0
                  ? `${daysRemaining} days left`
                  : daysRemaining === 0
                    ? 'Ends today'
                    : `${Math.abs(daysRemaining)} days overdue`}
              </span>
            )}
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-3">
          <div className="flex justify-between text-xs text-muted mb-1">
            <span>
              {completedIssues} of {totalIssues} issues
            </span>
            <span>{progress}% complete</span>
          </div>
          <div className="h-2 bg-surface1 rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Quick stats */}
        <div className="flex items-center gap-6 mt-3 text-sm">
          <div className="flex items-center gap-1">
            <FiTrendingUp size={14} className="text-muted" />
            <span>{sprint.planned_story_points || 0} pts committed</span>
          </div>
          <div className="flex items-center gap-1 text-green-500">
            <FiCheckCircle size={14} />
            <span>{Math.round(completedPoints)} pts done</span>
          </div>
        </div>
      </div>

      {/* Sprint Actions & Issues */}
      {isExpanded && (
        <div className="border-t border-surface0">
          {/* Actions */}
          <div className="p-4 bg-surface0/30 flex items-center gap-2">
            {sprint.status === 'planning' && onStartSprint && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onStartSprint(sprint.id);
                }}
                className="flex items-center gap-2 px-3 py-1.5 bg-green-500 text-white rounded-lg text-sm hover:bg-green-600 transition-colors"
              >
                <FiPlay size={14} />
                Start Sprint
              </button>
            )}
            {sprint.status === 'active' && onCompleteSprint && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onCompleteSprint(sprint.id);
                }}
                className="flex items-center gap-2 px-3 py-1.5 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600 transition-colors"
              >
                <FiCheckCircle size={14} />
                Complete Sprint
              </button>
            )}
            {(sprint.status === 'planning' || sprint.status === 'active') && onCancelSprint && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onCancelSprint(sprint.id);
                }}
                className="flex items-center gap-2 px-3 py-1.5 bg-red-500 text-white rounded-lg text-sm hover:bg-red-600 transition-colors"
              >
                <FiXCircle size={14} />
                Cancel
              </button>
            )}
          </div>

          {/* Issues */}
          <div className="p-4">
            {sprintIssues.length === 0 ? (
              <p className="text-center text-muted py-4">No issues in this sprint</p>
            ) : (
              <div className="space-y-2">
                {sprintIssues.map((issue) => (
                  <IssueCard key={issue.id} issue={issue} onClick={onIssueClick} compact />
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export function SprintBoard({
  sprints,
  issues,
  loading = false,
  onStartSprint,
  onCompleteSprint,
  onCancelSprint,
  onCreateSprint,
  onIssueClick,
}: SprintBoardProps) {
  const [showCompleted, setShowCompleted] = useState(false);

  // Group issues by sprint
  const getSprintIssues = (_sprintId: number) => {
    // For now, we'll use a placeholder since issues don't have sprint_id in the base type
    // This should be joined from the backend or stored in a separate mapping
    return issues.filter(() => false); // Placeholder - should filter by sprint_id
  };

  // Get backlog issues (not in any sprint)
  const backlogIssues = issues.filter((i) => i.status !== 'closed');

  // Filter sprints
  const activeSprints = sprints.filter((s) => s.status === 'active');
  const planningSprints = sprints.filter((s) => s.status === 'planning');
  const completedSprints = sprints.filter((s) => s.status === 'completed');

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="sprint-board">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Sprint Board</h2>
        {onCreateSprint && (
          <button
            onClick={onCreateSprint}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
          >
            <FiPlus size={18} />
            New Sprint
          </button>
        )}
      </div>

      {/* Active Sprints */}
      {activeSprints.length > 0 && (
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
            Active Sprint
          </h3>
          <div className="space-y-4">
            {activeSprints.map((sprint) => (
              <SprintCard
                key={sprint.id}
                sprint={sprint}
                sprintIssues={getSprintIssues(sprint.id)}
                onStartSprint={onStartSprint}
                onCompleteSprint={onCompleteSprint}
                onCancelSprint={onCancelSprint}
                onIssueClick={onIssueClick}
              />
            ))}
          </div>
        </div>
      )}

      {/* Planning Sprints */}
      {planningSprints.length > 0 && (
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <span className="w-2 h-2 bg-gray-400 rounded-full"></span>
            Upcoming Sprints
          </h3>
          <div className="space-y-4">
            {planningSprints.map((sprint) => (
              <SprintCard
                key={sprint.id}
                sprint={sprint}
                sprintIssues={getSprintIssues(sprint.id)}
                onStartSprint={onStartSprint}
                onCompleteSprint={onCompleteSprint}
                onCancelSprint={onCancelSprint}
                onIssueClick={onIssueClick}
              />
            ))}
          </div>
        </div>
      )}

      {/* Backlog */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
          Product Backlog
          <span className="text-sm font-normal text-muted">({backlogIssues.length} items)</span>
        </h3>
        <div className="bg-base rounded-lg border border-surface0 p-4">
          {backlogIssues.length === 0 ? (
            <p className="text-center text-muted py-4">No items in backlog</p>
          ) : (
            <div className="space-y-2">
              {backlogIssues.slice(0, 10).map((issue) => (
                <IssueCard key={issue.id} issue={issue} onClick={onIssueClick} compact />
              ))}
              {backlogIssues.length > 10 && (
                <p className="text-center text-muted text-sm py-2">
                  +{backlogIssues.length - 10} more items
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Completed Sprints */}
      {completedSprints.length > 0 && (
        <div>
          <button
            onClick={() => setShowCompleted(!showCompleted)}
            className="flex items-center gap-2 text-lg font-semibold mb-4"
          >
            {showCompleted ? <FiChevronDown size={20} /> : <FiChevronRight size={20} />}
            <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
            Completed Sprints
            <span className="text-sm font-normal text-muted">({completedSprints.length})</span>
          </button>
          {showCompleted && (
            <div className="space-y-4">
              {completedSprints.map((sprint) => (
                <SprintCard
                  key={sprint.id}
                  sprint={sprint}
                  sprintIssues={getSprintIssues(sprint.id)}
                  onIssueClick={onIssueClick}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Empty state */}
      {sprints.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted mb-4">
            No sprints yet. Create your first sprint to get started!
          </p>
          {onCreateSprint && (
            <button
              onClick={onCreateSprint}
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
            >
              <FiPlus size={18} />
              Create First Sprint
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default SprintBoard;
