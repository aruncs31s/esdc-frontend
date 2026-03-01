import { useState, useEffect, useCallback } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiUser } from 'react-icons/fi';
import { projectPlanningApi } from '@/infrastructure/api/projectPlanningApi';
import type { Task, TaskStatus } from '@/types/project-planning';

interface Props {
  projectId: number;
}

const statusColumns: { status: TaskStatus; label: string; color: string }[] = [
  { status: 'todo', label: 'To Do', color: 'bg-gray-500' },
  { status: 'in_progress', label: 'In Progress', color: 'bg-blue-500' },
  { status: 'review', label: 'Review', color: 'bg-yellow-500' },
  { status: 'completed', label: 'Completed', color: 'bg-green-500' },
];

export const TaskBoard = ({ projectId }: Props) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  const loadTasks = useCallback(async () => {
    try {
      const data = await projectPlanningApi.getTasks(projectId);
      setTasks(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  const handleStatusChange = async (taskId: number, status: TaskStatus) => {
    try {
      await projectPlanningApi.updateTask(projectId, taskId, { status });
      setTasks((prev) => prev.map((t) => (t.id === taskId ? { ...t, status } : t)));
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (taskId: number) => {
    if (!confirm('Delete this task?')) return;
    try {
      await projectPlanningApi.deleteTask(projectId, taskId);
      setTasks((prev) => prev.filter((t) => t.id !== taskId));
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) return <div className="text-center py-8">Loading tasks...</div>;

  return (
    <div className="task-board">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Task Board</h2>
        <button className="btn btn-primary btn-sm flex items-center gap-2">
          <FiPlus /> Add Task
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {statusColumns.map((column) => (
          <div key={column.status} className="glass-card p-4">
            <div className="flex items-center gap-2 mb-4">
              <div className={`w-3 h-3 rounded-full ${column.color}`} />
              <h3 className="font-semibold">{column.label}</h3>
              <span className="text-sm text-muted">
                ({tasks.filter((t) => t.status === column.status).length})
              </span>
            </div>
            <div className="space-y-3">
              {tasks
                .filter((t) => t.status === column.status)
                .map((task) => (
                  <div key={task.id} className="bg-base p-3 rounded-lg border border-surface0">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium text-sm">{task.title}</h4>
                      <div className="flex gap-1">
                        <button className="text-primary hover:text-primary-dark">
                          <FiEdit2 size={14} />
                        </button>
                        <button
                          onClick={() => handleDelete(task.id)}
                          className="text-danger hover:text-danger-dark"
                        >
                          <FiTrash2 size={14} />
                        </button>
                      </div>
                    </div>
                    <p className="text-xs text-muted mb-2">{task.description}</p>
                    {task.assigned_user && (
                      <div className="flex items-center gap-1 text-xs text-muted">
                        <FiUser size={12} />
                        {task.assigned_user.name}
                      </div>
                    )}
                    <div className="flex gap-2 mt-2">
                      {statusColumns
                        .filter((s) => s.status !== task.status)
                        .map((s) => (
                          <button
                            key={s.status}
                            onClick={() => handleStatusChange(task.id, s.status)}
                            className="text-xs px-2 py-1 rounded bg-surface0 hover:bg-surface1"
                          >
                            → {s.label}
                          </button>
                        ))}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
