/**
 * Issue Management Hooks
 * React hooks for issue-related operations
 */

import { useState, useCallback, useEffect } from 'react';
import { Issue } from '@/domain/entities/Issue';
import { getIssueService } from '@/application/services/IssueService';
import { ApiClient } from '@/infrastructure/api/ApiClient';
import {
  IssueFilters,
  IssueComment,
  IssueLabel,
  IssueMilestone,
  IssueStatistics,
  IssueTimelineEvent,
  CreateIssueRequest,
  UpdateIssueRequest,
  CreateLabelRequest,
  CreateMilestoneRequest,
} from '@/types/issues';

// Create a shared API client instance
const apiClient = new ApiClient();
const issueService = getIssueService(apiClient);

/**
 * Hook for fetching and managing a list of issues
 */
export function useIssues(projectId: number, initialFilters?: IssueFilters) {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [filters, setFilters] = useState<IssueFilters | undefined>(initialFilters);

  const fetchIssues = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await issueService.getIssues(projectId, filters);
      setIssues(result.issues);
      setTotal(result.total);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch issues'));
    } finally {
      setLoading(false);
    }
  }, [projectId, filters]);

  useEffect(() => {
    fetchIssues();
  }, [fetchIssues]);

  const updateFilters = useCallback((newFilters: IssueFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters(undefined);
  }, []);

  return {
    issues,
    total,
    loading,
    error,
    filters,
    updateFilters,
    resetFilters,
    refetch: fetchIssues,
  };
}

/**
 * Hook for fetching and managing a single issue
 */
export function useIssue(issueId: number | null) {
  const [issue, setIssue] = useState<Issue | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchIssue = useCallback(async () => {
    if (!issueId) return;

    setLoading(true);
    setError(null);
    try {
      const result = await issueService.getIssue(issueId);
      setIssue(result);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch issue'));
    } finally {
      setLoading(false);
    }
  }, [issueId]);

  useEffect(() => {
    fetchIssue();
  }, [fetchIssue]);

  return {
    issue,
    loading,
    error,
    refetch: fetchIssue,
  };
}

/**
 * Hook for issue mutations (create, update, delete, etc.)
 */
export function useIssueMutations() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const createIssue = useCallback(async (request: CreateIssueRequest): Promise<Issue | null> => {
    setLoading(true);
    setError(null);
    try {
      const result = await issueService.createIssue(request);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to create issue'));
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateIssue = useCallback(
    async (issueId: number, request: UpdateIssueRequest): Promise<Issue | null> => {
      setLoading(true);
      setError(null);
      try {
        const result = await issueService.updateIssue(issueId, request);
        return result;
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to update issue'));
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const deleteIssue = useCallback(async (issueId: number): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      await issueService.deleteIssue(issueId);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to delete issue'));
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const closeIssue = useCallback(async (issueId: number): Promise<Issue | null> => {
    setLoading(true);
    setError(null);
    try {
      const result = await issueService.closeIssue(issueId);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to close issue'));
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const reopenIssue = useCallback(async (issueId: number): Promise<Issue | null> => {
    setLoading(true);
    setError(null);
    try {
      const result = await issueService.reopenIssue(issueId);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to reopen issue'));
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const addAssignee = useCallback(
    async (issueId: number, userId: number): Promise<Issue | null> => {
      setLoading(true);
      setError(null);
      try {
        const result = await issueService.addAssignee(issueId, userId);
        return result;
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to add assignee'));
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const removeAssignee = useCallback(
    async (issueId: number, userId: number): Promise<Issue | null> => {
      setLoading(true);
      setError(null);
      try {
        const result = await issueService.removeAssignee(issueId, userId);
        return result;
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to remove assignee'));
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const addLabel = useCallback(async (issueId: number, labelId: number): Promise<Issue | null> => {
    setLoading(true);
    setError(null);
    try {
      const result = await issueService.addLabelToIssue(issueId, labelId);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to add label'));
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const removeLabel = useCallback(
    async (issueId: number, labelId: number): Promise<Issue | null> => {
      setLoading(true);
      setError(null);
      try {
        const result = await issueService.removeLabelFromIssue(issueId, labelId);
        return result;
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to remove label'));
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return {
    loading,
    error,
    createIssue,
    updateIssue,
    deleteIssue,
    closeIssue,
    reopenIssue,
    addAssignee,
    removeAssignee,
    addLabel,
    removeLabel,
  };
}

/**
 * Hook for managing labels
 */
export function useLabels(projectId: number) {
  const [labels, setLabels] = useState<IssueLabel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchLabels = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await issueService.getLabels(projectId);
      setLabels(result);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch labels'));
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    fetchLabels();
  }, [fetchLabels]);

  const createLabel = useCallback(
    async (request: CreateLabelRequest): Promise<IssueLabel | null> => {
      try {
        const result = await issueService.createLabel(request);
        setLabels((prev) => [...prev, result]);
        return result;
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to create label'));
        return null;
      }
    },
    []
  );

  const updateLabel = useCallback(
    async (labelId: number, data: Partial<CreateLabelRequest>): Promise<IssueLabel | null> => {
      try {
        const result = await issueService.updateLabel(labelId, data);
        setLabels((prev) => prev.map((l) => (l.id === labelId ? result : l)));
        return result;
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to update label'));
        return null;
      }
    },
    []
  );

  const deleteLabel = useCallback(async (labelId: number): Promise<boolean> => {
    try {
      await issueService.deleteLabel(labelId);
      setLabels((prev) => prev.filter((l) => l.id !== labelId));
      return true;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to delete label'));
      return false;
    }
  }, []);

  return {
    labels,
    loading,
    error,
    refetch: fetchLabels,
    createLabel,
    updateLabel,
    deleteLabel,
  };
}

/**
 * Hook for managing milestones
 */
export function useMilestones(projectId: number) {
  const [milestones, setMilestones] = useState<IssueMilestone[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchMilestones = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await issueService.getMilestones(projectId);
      setMilestones(result);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch milestones'));
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    fetchMilestones();
  }, [fetchMilestones]);

  const createMilestone = useCallback(
    async (request: CreateMilestoneRequest): Promise<IssueMilestone | null> => {
      try {
        const result = await issueService.createMilestone(request);
        setMilestones((prev) => [...prev, result]);
        return result;
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to create milestone'));
        return null;
      }
    },
    []
  );

  const updateMilestone = useCallback(
    async (
      milestoneId: number,
      data: Partial<CreateMilestoneRequest>
    ): Promise<IssueMilestone | null> => {
      try {
        const result = await issueService.updateMilestone(milestoneId, data);
        setMilestones((prev) => prev.map((m) => (m.id === milestoneId ? result : m)));
        return result;
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to update milestone'));
        return null;
      }
    },
    []
  );

  const deleteMilestone = useCallback(async (milestoneId: number): Promise<boolean> => {
    try {
      await issueService.deleteMilestone(milestoneId);
      setMilestones((prev) => prev.filter((m) => m.id !== milestoneId));
      return true;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to delete milestone'));
      return false;
    }
  }, []);

  const closeMilestone = useCallback(
    async (milestoneId: number): Promise<IssueMilestone | null> => {
      try {
        const result = await issueService.closeMilestone(milestoneId);
        setMilestones((prev) => prev.map((m) => (m.id === milestoneId ? result : m)));
        return result;
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to close milestone'));
        return null;
      }
    },
    []
  );

  const reopenMilestone = useCallback(
    async (milestoneId: number): Promise<IssueMilestone | null> => {
      try {
        const result = await issueService.reopenMilestone(milestoneId);
        setMilestones((prev) => prev.map((m) => (m.id === milestoneId ? result : m)));
        return result;
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to reopen milestone'));
        return null;
      }
    },
    []
  );

  return {
    milestones,
    loading,
    error,
    refetch: fetchMilestones,
    createMilestone,
    updateMilestone,
    deleteMilestone,
    closeMilestone,
    reopenMilestone,
  };
}

/**
 * Hook for issue comments
 */
export function useIssueComments(issueId: number) {
  const [comments, setComments] = useState<IssueComment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchComments = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await issueService.getComments(issueId);
      setComments(result);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch comments'));
    } finally {
      setLoading(false);
    }
  }, [issueId]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  const addComment = useCallback(
    async (body: string): Promise<IssueComment | null> => {
      try {
        const result = await issueService.addComment(issueId, body);
        setComments((prev) => [...prev, result]);
        return result;
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to add comment'));
        return null;
      }
    },
    [issueId]
  );

  const updateComment = useCallback(
    async (commentId: number, body: string): Promise<IssueComment | null> => {
      try {
        const result = await issueService.updateComment(commentId, body);
        setComments((prev) => prev.map((c) => (c.id === commentId ? result : c)));
        return result;
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to update comment'));
        return null;
      }
    },
    []
  );

  const deleteComment = useCallback(async (commentId: number): Promise<boolean> => {
    try {
      await issueService.deleteComment(commentId);
      setComments((prev) => prev.filter((c) => c.id !== commentId));
      return true;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to delete comment'));
      return false;
    }
  }, []);

  return {
    comments,
    loading,
    error,
    refetch: fetchComments,
    addComment,
    updateComment,
    deleteComment,
  };
}

/**
 * Hook for issue timeline
 */
export function useIssueTimeline(issueId: number) {
  const [timeline, setTimeline] = useState<IssueTimelineEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchTimeline = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await issueService.getTimeline(issueId);
      setTimeline(result);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch timeline'));
    } finally {
      setLoading(false);
    }
  }, [issueId]);

  useEffect(() => {
    fetchTimeline();
  }, [fetchTimeline]);

  return {
    timeline,
    loading,
    error,
    refetch: fetchTimeline,
  };
}

/**
 * Hook for issue statistics
 */
export function useIssueStatistics(projectId: number) {
  const [statistics, setStatistics] = useState<IssueStatistics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchStatistics = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await issueService.getStatistics(projectId);
      setStatistics(result);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch statistics'));
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    fetchStatistics();
  }, [fetchStatistics]);

  return {
    statistics,
    loading,
    error,
    refetch: fetchStatistics,
  };
}
