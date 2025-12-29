import { useState, useEffect } from 'react';
import { FiCalendar } from 'react-icons/fi';
import { projectPlanningApi } from '@/infrastructure/api/projectPlanningApi';
import type { ProjectTimeline as TimelineType } from '@/types/project-planning';

interface Props {
  projectId: number;
}

export const ProjectTimeline = ({ projectId }: Props) => {
  const [timeline, setTimeline] = useState<TimelineType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    projectPlanningApi
      .getTimeline(projectId)
      .then(setTimeline)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [projectId]);

  if (loading) return <div className="text-center py-8">Loading timeline...</div>;
  if (!timeline) return null;

  return (
    <div className="project-timeline">
      <h2 className="text-2xl font-bold flex items-center gap-2 mb-6">
        <FiCalendar /> Project Timeline
      </h2>
      <div className="glass-card p-6 mb-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          <div>
            <div className="text-sm text-muted">Start Date</div>
            <div className="font-semibold">
              {new Date(timeline.start_date).toLocaleDateString()}
            </div>
          </div>
          <div>
            <div className="text-sm text-muted">End Date</div>
            <div className="font-semibold">
              {timeline.end_date ? new Date(timeline.end_date).toLocaleDateString() : 'Ongoing'}
            </div>
          </div>
          <div>
            <div className="text-sm text-muted">Duration</div>
            <div className="font-semibold">{timeline.total_duration_days} days</div>
          </div>
          <div>
            <div className="text-sm text-muted">Progress</div>
            <div className="font-semibold">{timeline.progress_percentage}%</div>
          </div>
        </div>
        <div className="w-full bg-surface0 rounded-full h-3">
          <div
            className="bg-gradient-to-r from-primary to-secondary h-3 rounded-full transition-all"
            style={{ width: `${timeline.progress_percentage}%` }}
          />
        </div>
      </div>
      <div className="relative">
        {timeline.milestones.map((milestone, index) => (
          <div key={milestone.id} className="flex gap-4 mb-6">
            <div className="flex flex-col items-center">
              <div
                className={`w-4 h-4 rounded-full ${milestone.status === 'completed' ? 'bg-success' : 'bg-primary'}`}
              />
              {index < timeline.milestones.length - 1 && (
                <div className="w-0.5 h-full bg-surface0 flex-1" />
              )}
            </div>
            <div className="glass-card p-4 flex-1 mb-4">
              <h3 className="font-semibold">{milestone.title}</h3>
              <p className="text-sm text-muted">{milestone.description}</p>
              <div className="text-xs text-muted mt-2">
                Target: {new Date(milestone.target_date).toLocaleDateString()}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
