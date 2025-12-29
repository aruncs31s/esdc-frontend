/**
 * Agile Management Hooks
 * React hooks for sprints, epics, and kanban boards
 */

import { useState, useCallback, useEffect } from 'react';
import { Sprint } from '@/domain/entities/Sprint';
import { Epic } from '@/domain/entities/Epic';
import { getAgileService } from '@/application/services/AgileService';
import { ApiClient } from '@/infrastructure/api/ApiClient';
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
import { UpdateEpicRequest } from '@/domain/repositories/IEpicRepository';

// Create a shared API client instance
const apiClient = new ApiClient();
const agileService = getAgileService(apiClient);

// ==================== Sprint Hooks ====================

/**
 * Hook for fetching and managing sprints
 */
export function useSprints(projectId: number, initialFilters?: SprintFilters) {
  const [sprints, setSprints] = useState<Sprint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [filters, setFilters] = useState<SprintFilters | undefined>(initialFilters);

  const fetchSprints = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await agileService.getSprints(projectId, filters);
      setSprints(result);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch sprints'));
    } finally {
      setLoading(false);
    }
  }, [projectId, filters]);

  useEffect(() => {
    fetchSprints();
  }, [fetchSprints]);

  const updateFilters = useCallback((newFilters: SprintFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  }, []);

  return {
    sprints,
    loading,
    error,
    filters,
    updateFilters,
    refetch: fetchSprints,
  };
}

/**
 * Hook for the active sprint
 */
export function useActiveSprint(projectId: number) {
  const [sprint, setSprint] = useState<Sprint | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchActiveSprint = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await agileService.getActiveSprint(projectId);
      setSprint(result);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch active sprint'));
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    fetchActiveSprint();
  }, [fetchActiveSprint]);

  return {
    sprint,
    loading,
    error,
    refetch: fetchActiveSprint,
  };
}

/**
 * Hook for a single sprint
 */
export function useSprint(sprintId: number | null) {
  const [sprint, setSprint] = useState<Sprint | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchSprint = useCallback(async () => {
    if (!sprintId) return;

    setLoading(true);
    setError(null);
    try {
      const result = await agileService.getSprint(sprintId);
      setSprint(result);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch sprint'));
    } finally {
      setLoading(false);
    }
  }, [sprintId]);

  useEffect(() => {
    fetchSprint();
  }, [fetchSprint]);

  return {
    sprint,
    loading,
    error,
    refetch: fetchSprint,
  };
}

/**
 * Hook for sprint mutations
 */
export function useSprintMutations() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const createSprint = useCallback(async (request: CreateSprintRequest): Promise<Sprint | null> => {
    setLoading(true);
    setError(null);
    try {
      return await agileService.createSprint(request);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to create sprint'));
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateSprint = useCallback(
    async (sprintId: number, request: UpdateSprintRequest): Promise<Sprint | null> => {
      setLoading(true);
      setError(null);
      try {
        return await agileService.updateSprint(sprintId, request);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to update sprint'));
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const deleteSprint = useCallback(async (sprintId: number): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      return await agileService.deleteSprint(sprintId);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to delete sprint'));
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const startSprint = useCallback(async (sprintId: number): Promise<Sprint | null> => {
    setLoading(true);
    setError(null);
    try {
      return await agileService.startSprint(sprintId);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to start sprint'));
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const completeSprint = useCallback(async (sprintId: number): Promise<Sprint | null> => {
    setLoading(true);
    setError(null);
    try {
      return await agileService.completeSprint(sprintId);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to complete sprint'));
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const cancelSprint = useCallback(async (sprintId: number): Promise<Sprint | null> => {
    setLoading(true);
    setError(null);
    try {
      return await agileService.cancelSprint(sprintId);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to cancel sprint'));
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const addIssueToSprint = useCallback(
    async (sprintId: number, issueId: number): Promise<Sprint | null> => {
      setLoading(true);
      setError(null);
      try {
        return await agileService.addIssueToSprint(sprintId, issueId);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to add issue to sprint'));
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const removeIssueFromSprint = useCallback(
    async (sprintId: number, issueId: number): Promise<Sprint | null> => {
      setLoading(true);
      setError(null);
      try {
        return await agileService.removeIssueFromSprint(sprintId, issueId);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to remove issue from sprint'));
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
    createSprint,
    updateSprint,
    deleteSprint,
    startSprint,
    completeSprint,
    cancelSprint,
    addIssueToSprint,
    removeIssueFromSprint,
  };
}

/**
 * Hook for sprint metrics
 */
export function useSprintMetrics(sprintId: number) {
  const [statistics, setStatistics] = useState<SprintStatistics | null>(null);
  const [burndown, setBurndown] = useState<BurndownChartData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchMetrics = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [stats, chart] = await Promise.all([
        agileService.getSprintStatistics(sprintId),
        agileService.getBurndownChart(sprintId),
      ]);
      setStatistics(stats);
      setBurndown(chart);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch sprint metrics'));
    } finally {
      setLoading(false);
    }
  }, [sprintId]);

  useEffect(() => {
    fetchMetrics();
  }, [fetchMetrics]);

  return {
    statistics,
    burndown,
    loading,
    error,
    refetch: fetchMetrics,
  };
}

/**
 * Hook for velocity data
 */
export function useVelocity(projectId: number, sprintCount: number = 5) {
  const [velocity, setVelocity] = useState<VelocityData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchVelocity = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await agileService.getVelocity(projectId, sprintCount);
      setVelocity(result);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch velocity'));
    } finally {
      setLoading(false);
    }
  }, [projectId, sprintCount]);

  useEffect(() => {
    fetchVelocity();
  }, [fetchVelocity]);

  return {
    velocity,
    loading,
    error,
    refetch: fetchVelocity,
  };
}

/**
 * Hook for sprint retrospective
 */
export function useSprintRetrospective(sprintId: number) {
  const [retrospective, setRetrospective] = useState<SprintRetrospective | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchRetrospective = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await agileService.getSprintRetrospective(sprintId);
      setRetrospective(result);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch retrospective'));
    } finally {
      setLoading(false);
    }
  }, [sprintId]);

  useEffect(() => {
    fetchRetrospective();
  }, [fetchRetrospective]);

  const saveRetrospective = useCallback(
    async (
      data: Omit<SprintRetrospective, 'id' | 'sprint_id'>
    ): Promise<SprintRetrospective | null> => {
      try {
        const result = await agileService.saveSprintRetrospective(sprintId, data);
        setRetrospective(result);
        return result;
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to save retrospective'));
        return null;
      }
    },
    [sprintId]
  );

  return {
    retrospective,
    loading,
    error,
    refetch: fetchRetrospective,
    saveRetrospective,
  };
}

// ==================== Epic Hooks ====================

/**
 * Hook for fetching and managing epics
 */
export function useEpics(projectId: number, initialFilters?: EpicFilters) {
  const [epics, setEpics] = useState<Epic[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [filters, setFilters] = useState<EpicFilters | undefined>(initialFilters);

  const fetchEpics = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await agileService.getEpics(projectId, filters);
      setEpics(result);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch epics'));
    } finally {
      setLoading(false);
    }
  }, [projectId, filters]);

  useEffect(() => {
    fetchEpics();
  }, [fetchEpics]);

  const updateFilters = useCallback((newFilters: EpicFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  }, []);

  return {
    epics,
    loading,
    error,
    filters,
    updateFilters,
    refetch: fetchEpics,
  };
}

/**
 * Hook for a single epic
 */
export function useEpic(epicId: number | null) {
  const [epic, setEpic] = useState<Epic | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchEpic = useCallback(async () => {
    if (!epicId) return;

    setLoading(true);
    setError(null);
    try {
      const result = await agileService.getEpic(epicId);
      setEpic(result);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch epic'));
    } finally {
      setLoading(false);
    }
  }, [epicId]);

  useEffect(() => {
    fetchEpic();
  }, [fetchEpic]);

  return {
    epic,
    loading,
    error,
    refetch: fetchEpic,
  };
}

/**
 * Hook for epic mutations
 */
export function useEpicMutations() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const createEpic = useCallback(async (request: CreateEpicRequest): Promise<Epic | null> => {
    setLoading(true);
    setError(null);
    try {
      return await agileService.createEpic(request);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to create epic'));
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateEpic = useCallback(
    async (epicId: number, request: UpdateEpicRequest): Promise<Epic | null> => {
      setLoading(true);
      setError(null);
      try {
        return await agileService.updateEpic(epicId, request);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to update epic'));
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const deleteEpic = useCallback(async (epicId: number): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      return await agileService.deleteEpic(epicId);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to delete epic'));
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const startEpic = useCallback(async (epicId: number): Promise<Epic | null> => {
    setLoading(true);
    setError(null);
    try {
      return await agileService.startEpic(epicId);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to start epic'));
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const completeEpic = useCallback(async (epicId: number): Promise<Epic | null> => {
    setLoading(true);
    setError(null);
    try {
      return await agileService.completeEpic(epicId);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to complete epic'));
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const reopenEpic = useCallback(async (epicId: number): Promise<Epic | null> => {
    setLoading(true);
    setError(null);
    try {
      return await agileService.reopenEpic(epicId);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to reopen epic'));
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const addIssueToEpic = useCallback(
    async (epicId: number, issueId: number): Promise<Epic | null> => {
      setLoading(true);
      setError(null);
      try {
        return await agileService.addIssueToEpic(epicId, issueId);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to add issue to epic'));
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const removeIssueFromEpic = useCallback(
    async (epicId: number, issueId: number): Promise<Epic | null> => {
      setLoading(true);
      setError(null);
      try {
        return await agileService.removeIssueFromEpic(epicId, issueId);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to remove issue from epic'));
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
    createEpic,
    updateEpic,
    deleteEpic,
    startEpic,
    completeEpic,
    reopenEpic,
    addIssueToEpic,
    removeIssueFromEpic,
  };
}

/**
 * Hook for roadmap data
 */
export function useRoadmap(projectId: number) {
  const [roadmap, setRoadmap] = useState<
    Array<{
      epic: Epic;
      timeline: {
        start: string | null;
        end: string | null;
        duration_days: number | null;
      };
    }>
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchRoadmap = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await agileService.getRoadmap(projectId);
      setRoadmap(result);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch roadmap'));
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    fetchRoadmap();
  }, [fetchRoadmap]);

  return {
    roadmap,
    loading,
    error,
    refetch: fetchRoadmap,
  };
}

// ==================== Kanban Board Hooks ====================

/**
 * Hook for kanban boards
 */
export function useKanbanBoards(projectId: number) {
  const [boards, setBoards] = useState<KanbanBoard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchBoards = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await agileService.getBoards(projectId);
      setBoards(result);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch boards'));
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    fetchBoards();
  }, [fetchBoards]);

  return {
    boards,
    loading,
    error,
    refetch: fetchBoards,
  };
}

/**
 * Hook for a single kanban board with full data
 */
export function useKanbanBoard(boardId: number | null) {
  const [board, setBoard] = useState<KanbanBoard | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchBoard = useCallback(async () => {
    if (!boardId) return;

    setLoading(true);
    setError(null);
    try {
      const result = await agileService.getBoard(boardId);
      setBoard(result);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch board'));
    } finally {
      setLoading(false);
    }
  }, [boardId]);

  useEffect(() => {
    fetchBoard();
  }, [fetchBoard]);

  return {
    board,
    loading,
    error,
    refetch: fetchBoard,
  };
}

/**
 * Hook for kanban board mutations
 */
export function useKanbanBoardMutations() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const createBoard = useCallback(
    async (request: CreateBoardRequest): Promise<KanbanBoard | null> => {
      setLoading(true);
      setError(null);
      try {
        return await agileService.createBoard(request);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to create board'));
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const updateBoard = useCallback(
    async (boardId: number, request: UpdateBoardRequest): Promise<KanbanBoard | null> => {
      setLoading(true);
      setError(null);
      try {
        return await agileService.updateBoard(boardId, request);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to update board'));
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const deleteBoard = useCallback(async (boardId: number): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      return await agileService.deleteBoard(boardId);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to delete board'));
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const createColumn = useCallback(
    async (boardId: number, request: CreateColumnRequest): Promise<KanbanColumn | null> => {
      setLoading(true);
      setError(null);
      try {
        return await agileService.createColumn(boardId, request);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to create column'));
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const updateColumn = useCallback(
    async (columnId: number, request: UpdateColumnRequest): Promise<KanbanColumn | null> => {
      setLoading(true);
      setError(null);
      try {
        return await agileService.updateColumn(columnId, request);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to update column'));
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const deleteColumn = useCallback(async (columnId: number): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      return await agileService.deleteColumn(columnId);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to delete column'));
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const moveCard = useCallback(async (request: MoveCardRequest): Promise<KanbanCard | null> => {
    setLoading(true);
    setError(null);
    try {
      return await agileService.moveCard(request);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to move card'));
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const reorderColumns = useCallback(
    async (boardId: number, columnOrder: number[]): Promise<KanbanColumn[] | null> => {
      setLoading(true);
      setError(null);
      try {
        return await agileService.reorderColumns(boardId, columnOrder);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to reorder columns'));
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const reorderCards = useCallback(
    async (columnId: number, cardOrder: number[]): Promise<KanbanCard[] | null> => {
      setLoading(true);
      setError(null);
      try {
        return await agileService.reorderCards(columnId, cardOrder);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to reorder cards'));
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
    createBoard,
    updateBoard,
    deleteBoard,
    createColumn,
    updateColumn,
    deleteColumn,
    moveCard,
    reorderColumns,
    reorderCards,
  };
}

// ==================== Agile Metrics Hook ====================

/**
 * Hook for comprehensive agile metrics
 */
export function useAgileMetrics(projectId: number) {
  const [metrics, setMetrics] = useState<AgileMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchMetrics = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await agileService.getAgileMetrics(projectId);
      setMetrics(result);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch agile metrics'));
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    fetchMetrics();
  }, [fetchMetrics]);

  return {
    metrics,
    loading,
    error,
    refetch: fetchMetrics,
  };
}

/**
 * Hook for product backlog
 */
export function useBacklog(projectId: number) {
  const [backlog, setBacklog] = useState<{ issues: number[]; totalPoints: number } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchBacklog = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await agileService.getBacklog(projectId);
      setBacklog(result);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch backlog'));
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    fetchBacklog();
  }, [fetchBacklog]);

  const prioritizeBacklog = useCallback(
    async (issueOrder: number[]): Promise<boolean> => {
      try {
        await agileService.prioritizeBacklog(projectId, issueOrder);
        await fetchBacklog();
        return true;
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to prioritize backlog'));
        return false;
      }
    },
    [projectId, fetchBacklog]
  );

  return {
    backlog,
    loading,
    error,
    refetch: fetchBacklog,
    prioritizeBacklog,
  };
}
