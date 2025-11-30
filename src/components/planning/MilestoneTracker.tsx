import { useState, useEffect } from 'react';
import { FiFlag, FiPlus } from 'react-icons/fi';
import { projectPlanningApi } from '@/infrastructure/api/projectPlanningApi';
import type { Milestone } from '@/types/project-planning';

interface Props {
  projectId: number;
}

export const MilestoneTracker = ({ projectId }: Props) => {
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    projectPlanningApi
      .getMilestones(projectId)
      .then(setMilestones)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [projectId]);

  if (loading) return <div className="text-center py-8">Loading milestones...</div>;

  return (
    <div className="milestone-tracker">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <FiFlag /> Milestones
        </h2>
        <button className="btn btn-primary btn-sm flex items-center gap-2">
          <FiPlus /> Add Milestone
        </button>
      </div>
      <div className="space-y-4">
        {milestones.map((milestone) => (
          <div key={milestone.id} className="glass-card p-4">
            <div className="flex justify-between items-start mb-3">
              <div className="flex-1">
                <h3 className="font-semibold text-lg">{milestone.title}</h3>
                <p className="text-sm text-muted">{milestone.description}</p>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  milestone.status === 'completed'
                    ? 'bg-success text-white'
                    : milestone.status === 'delayed'
                      ? 'bg-danger text-white'
                      : 'bg-warning text-white'
                }`}
              >
                {milestone.status}
              </span>
            </div>
            <div className="mb-3">
              <div className="flex justify-between text-sm mb-1">
                <span>Progress</span>
                <span className="font-semibold">{milestone.progress_percentage}%</span>
              </div>
              <div className="w-full bg-surface0 rounded-full h-2">
                <div
                  className="bg-primary h-2 rounded-full transition-all"
                  style={{ width: `${milestone.progress_percentage}%` }}
                />
              </div>
            </div>
            <div className="flex justify-between text-sm text-muted">
              <span>
                {milestone.completed_tasks_count} / {milestone.tasks_count} tasks
              </span>
              <span>Due: {new Date(milestone.target_date).toLocaleDateString()}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
