/**
 * Issue Card Component
 * Displays a single issue in a card format
 */

import { FiMessageSquare, FiClock, FiUser, FiTag, FiCheckCircle } from 'react-icons/fi';
import { Issue as IssueData, IssuePriorityType, IssueStatusType, IssueLabel } from '@/types/issues';

interface IssueCardProps {
  issue: IssueData;
  onClick?: (issue: IssueData) => void;
  showProject?: boolean;
  compact?: boolean;
}

const priorityColors: Record<IssuePriorityType, string> = {
  critical: 'bg-red-500 text-white',
  high: 'bg-orange-500 text-white',
  medium: 'bg-yellow-500 text-black',
  low: 'bg-gray-400 text-white',
};

const statusColors: Record<IssueStatusType, string> = {
  open: 'bg-blue-500',
  in_progress: 'bg-purple-500',
  review: 'bg-yellow-500',
  closed: 'bg-gray-500',
  reopened: 'bg-green-500',
};

const statusLabels: Record<IssueStatusType, string> = {
  open: 'Open',
  in_progress: 'In Progress',
  review: 'Review',
  closed: 'Closed',
  reopened: 'Reopened',
};

function formatTimeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return 'just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 604800)}w ago`;

  return date.toLocaleDateString();
}

export function IssueCard({
  issue,
  onClick,
  showProject = false,
  compact = false,
}: IssueCardProps) {
  const timeAgo = formatTimeAgo(issue.created_at);

  if (compact) {
    return (
      <div
        onClick={() => onClick?.(issue)}
        className="flex items-center gap-3 p-3 bg-base rounded-lg border border-surface0 hover:border-primary cursor-pointer transition-colors"
      >
        <div className={`w-2 h-2 rounded-full ${statusColors[issue.status]}`} />
        <span className="text-sm font-medium flex-1 truncate">{issue.title}</span>
        <span className={`text-xs px-2 py-0.5 rounded ${priorityColors[issue.priority]}`}>
          {issue.priority}
        </span>
        <span className="text-xs text-muted">#{issue.number}</span>
      </div>
    );
  }

  return (
    <div
      onClick={() => onClick?.(issue)}
      className="bg-base p-4 rounded-lg border border-surface0 hover:border-primary cursor-pointer transition-all hover:shadow-lg"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className={`w-2.5 h-2.5 rounded-full ${statusColors[issue.status]}`} />
          <span className="text-xs text-muted">#{issue.number}</span>
          {showProject && (
            <span className="text-xs text-muted bg-surface0 px-2 py-0.5 rounded">
              Project #{issue.project_id}
            </span>
          )}
        </div>
        <span className={`text-xs px-2 py-0.5 rounded ${priorityColors[issue.priority]}`}>
          {issue.priority}
        </span>
      </div>

      {/* Title */}
      <h3 className="font-semibold mb-2 text-text hover:text-primary transition-colors">
        {issue.title}
      </h3>

      {/* Description preview */}
      {issue.body && <p className="text-sm text-muted mb-3 line-clamp-2">{issue.body}</p>}

      {/* Labels */}
      {issue.labels && issue.labels.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {issue.labels.slice(0, 4).map((label: IssueLabel) => (
            <span
              key={label.id}
              className="text-xs px-2 py-0.5 rounded-full"
              style={{
                backgroundColor: `${label.color}20`,
                color: label.color,
              }}
            >
              <FiTag className="inline mr-1" size={10} />
              {label.name}
            </span>
          ))}
          {issue.labels.length > 4 && (
            <span className="text-xs text-muted">+{issue.labels.length - 4} more</span>
          )}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between text-xs text-muted">
        <div className="flex items-center gap-4">
          {/* Status */}
          <span className="flex items-center gap-1">
            <FiCheckCircle size={12} />
            {statusLabels[issue.status]}
          </span>

          {/* Comments count */}
          {issue.comment_count !== undefined && issue.comment_count > 0 && (
            <span className="flex items-center gap-1">
              <FiMessageSquare size={12} />
              {issue.comment_count}
            </span>
          )}
        </div>

        <div className="flex items-center gap-3">
          {/* Creator */}
          {issue.creator_details && (
            <span className="flex items-center gap-1">
              <FiUser size={12} />
              {issue.creator_details.name || issue.creator_details.email}
            </span>
          )}

          {/* Time ago */}
          <span className="flex items-center gap-1">
            <FiClock size={12} />
            {timeAgo}
          </span>
        </div>
      </div>
    </div>
  );
}

export default IssueCard;
