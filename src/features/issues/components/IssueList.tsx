/**
 * Issue List Component
 * Displays a filterable list of issues
 */

import { useState, useMemo } from 'react';
import { FiSearch, FiFilter, FiPlus, FiGrid, FiList } from 'react-icons/fi';
import {
  Issue,
  IssueFilters,
  IssuePriorityType,
  IssueStatusType,
  IssueStatus,
  IssuePriority,
} from '@/types/issues';
import IssueCard from './IssueCard';

interface IssueListProps {
  issues: Issue[];
  loading?: boolean;
  onIssueClick?: (issue: Issue) => void;
  onCreateIssue?: () => void;
  projectId?: number;
}

export function IssueList({
  issues,
  loading = false,
  onIssueClick,
  onCreateIssue,
}: IssueListProps) {
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<IssueFilters>({});
  const [showFilters, setShowFilters] = useState(false);

  // Filter issues locally
  const filteredIssues = useMemo(() => {
    let result = [...issues];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (issue) =>
          issue.title.toLowerCase().includes(query) ||
          issue.body?.toLowerCase().includes(query) ||
          issue.number.toString().includes(query)
      );
    }

    // Status filter
    if (filters.status) {
      const statuses = Array.isArray(filters.status) ? filters.status : [filters.status];
      result = result.filter((issue) => statuses.includes(issue.status));
    }

    // Priority filter
    if (filters.priority) {
      const priorities = Array.isArray(filters.priority) ? filters.priority : [filters.priority];
      result = result.filter((issue) => priorities.includes(issue.priority));
    }

    // Sort
    result.sort((a, b) => {
      const order = filters.sort_order === 'asc' ? 1 : -1;
      switch (filters.sort_by) {
        case 'priority': {
          const priorityOrder: Record<IssuePriorityType, number> = {
            critical: 4,
            high: 3,
            medium: 2,
            low: 1,
          };
          return order * (priorityOrder[a.priority] - priorityOrder[b.priority]);
        }
        case 'updated_at':
          return order * (new Date(a.updated_at).getTime() - new Date(b.updated_at).getTime());
        case 'created_at':
        default:
          return order * (new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
      }
    });

    return result;
  }, [issues, searchQuery, filters]);

  const statusOptions: { value: IssueStatusType; label: string }[] = [
    { value: IssueStatus.OPEN, label: 'Open' },
    { value: IssueStatus.IN_PROGRESS, label: 'In Progress' },
    { value: IssueStatus.REVIEW, label: 'Review' },
    { value: IssueStatus.CLOSED, label: 'Closed' },
    { value: IssueStatus.REOPENED, label: 'Reopened' },
  ];

  const priorityOptions: { value: IssuePriorityType; label: string }[] = [
    { value: IssuePriority.CRITICAL, label: 'Critical' },
    { value: IssuePriority.HIGH, label: 'High' },
    { value: IssuePriority.MEDIUM, label: 'Medium' },
    { value: IssuePriority.LOW, label: 'Low' },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="issue-list">
      {/* Toolbar */}
      <div className="flex flex-wrap gap-4 items-center justify-between mb-6">
        {/* Search */}
        <div className="relative flex-1 min-w-64 max-w-md">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={18} />
          <input
            type="text"
            placeholder="Search issues..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg bg-surface0 border border-surface1 focus:border-primary focus:outline-none"
          />
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {/* Filter toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`p-2 rounded-lg transition-colors ${
              showFilters ? 'bg-primary text-white' : 'bg-surface0 hover:bg-surface1'
            }`}
          >
            <FiFilter size={18} />
          </button>

          {/* View mode toggle */}
          <div className="flex bg-surface0 rounded-lg p-1">
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded ${viewMode === 'list' ? 'bg-primary text-white' : 'hover:bg-surface1'}`}
            >
              <FiList size={16} />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded ${viewMode === 'grid' ? 'bg-primary text-white' : 'hover:bg-surface1'}`}
            >
              <FiGrid size={16} />
            </button>
          </div>

          {/* Create issue */}
          {onCreateIssue && (
            <button
              onClick={onCreateIssue}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
            >
              <FiPlus size={18} />
              New Issue
            </button>
          )}
        </div>
      </div>

      {/* Filters panel */}
      {showFilters && (
        <div className="bg-surface0 rounded-lg p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Status filter */}
            <div>
              <label className="block text-sm font-medium mb-2">Status</label>
              <select
                value={(filters.status as string) || ''}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    status: (e.target.value as IssueStatusType) || undefined,
                  }))
                }
                className="w-full px-3 py-2 rounded-lg bg-base border border-surface1 focus:border-primary focus:outline-none"
              >
                <option value="">All Statuses</option>
                {statusOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Priority filter */}
            <div>
              <label className="block text-sm font-medium mb-2">Priority</label>
              <select
                value={(filters.priority as string) || ''}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    priority: (e.target.value as IssuePriorityType) || undefined,
                  }))
                }
                className="w-full px-3 py-2 rounded-lg bg-base border border-surface1 focus:border-primary focus:outline-none"
              >
                <option value="">All Priorities</option>
                {priorityOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort by */}
            <div>
              <label className="block text-sm font-medium mb-2">Sort By</label>
              <select
                value={filters.sort_by || 'created_at'}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    sort_by: e.target.value as IssueFilters['sort_by'],
                  }))
                }
                className="w-full px-3 py-2 rounded-lg bg-base border border-surface1 focus:border-primary focus:outline-none"
              >
                <option value="created_at">Created Date</option>
                <option value="updated_at">Updated Date</option>
                <option value="priority">Priority</option>
              </select>
            </div>

            {/* Sort order */}
            <div>
              <label className="block text-sm font-medium mb-2">Order</label>
              <select
                value={filters.sort_order || 'desc'}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    sort_order: e.target.value as 'asc' | 'desc',
                  }))
                }
                className="w-full px-3 py-2 rounded-lg bg-base border border-surface1 focus:border-primary focus:outline-none"
              >
                <option value="desc">Newest First</option>
                <option value="asc">Oldest First</option>
              </select>
            </div>
          </div>

          {/* Clear filters */}
          <div className="mt-4 flex justify-end">
            <button onClick={() => setFilters({})} className="text-sm text-muted hover:text-text">
              Clear Filters
            </button>
          </div>
        </div>
      )}

      {/* Issue count */}
      <div className="text-sm text-muted mb-4">
        Showing {filteredIssues.length} of {issues.length} issues
      </div>

      {/* Issues */}
      {filteredIssues.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted mb-4">No issues found</p>
          {onCreateIssue && (
            <button
              onClick={onCreateIssue}
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
            >
              <FiPlus size={18} />
              Create First Issue
            </button>
          )}
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredIssues.map((issue) => (
            <IssueCard key={issue.id} issue={issue} onClick={onIssueClick} />
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredIssues.map((issue) => (
            <IssueCard key={issue.id} issue={issue} onClick={onIssueClick} compact={true} />
          ))}
        </div>
      )}
    </div>
  );
}

export default IssueList;
