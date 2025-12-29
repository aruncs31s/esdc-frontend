import { useEffect, useState } from 'react';
import { FiTrendingUp, FiEye, FiHeart, FiMessageCircle, FiStar } from 'react-icons/fi';
import { projectAdvancedApi } from '@/infrastructure/api/projectAdvancedApi';
import type { ProjectAnalytics } from '@/types/project-advanced';

interface Props {
  projectId: number;
}

export const ProjectAnalyticsDashboard = ({ projectId }: Props) => {
  const [analytics, setAnalytics] = useState<ProjectAnalytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    projectAdvancedApi
      .getProjectAnalytics(projectId)
      .then(setAnalytics)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [projectId]);

  if (loading) return <div className="text-center py-8">Loading analytics...</div>;
  if (!analytics) return null;

  return (
    <div className="project-analytics">
      <h2 className="text-2xl font-bold mb-6">Project Analytics</h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="glass-card p-4 text-center">
          <FiEye className="text-3xl text-primary mx-auto mb-2" />
          <div className="text-2xl font-bold">{analytics.total_views}</div>
          <div className="text-sm text-muted">Total Views</div>
        </div>
        <div className="glass-card p-4 text-center">
          <FiHeart className="text-3xl text-danger mx-auto mb-2" />
          <div className="text-2xl font-bold">{analytics.total_likes}</div>
          <div className="text-sm text-muted">Total Likes</div>
        </div>
        <div className="glass-card p-4 text-center">
          <FiMessageCircle className="text-3xl text-info mx-auto mb-2" />
          <div className="text-2xl font-bold">{analytics.total_comments}</div>
          <div className="text-sm text-muted">Comments</div>
        </div>
        <div className="glass-card p-4 text-center">
          <FiStar className="text-3xl text-warning mx-auto mb-2" />
          <div className="text-2xl font-bold">{analytics.average_rating.toFixed(1)}</div>
          <div className="text-sm text-muted">Avg Rating</div>
        </div>
      </div>

      <div className="glass-card p-4 mb-6">
        <h3 className="font-semibold mb-3 flex items-center gap-2">
          <FiTrendingUp /> Views Trend
        </h3>
        <div className="space-y-2">
          {analytics.views_trend.slice(0, 7).map((trend) => (
            <div key={trend.date} className="flex justify-between items-center">
              <span className="text-sm">{new Date(trend.date).toLocaleDateString()}</span>
              <div className="flex items-center gap-2">
                <span className="font-semibold">{trend.count}</span>
                <span
                  className={`text-xs ${trend.change_percent >= 0 ? 'text-success' : 'text-danger'}`}
                >
                  {trend.change_percent >= 0 ? '+' : ''}
                  {trend.change_percent.toFixed(1)}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="glass-card p-4">
        <h3 className="font-semibold mb-3">Popular Technologies</h3>
        <div className="flex flex-wrap gap-2">
          {analytics.popular_technologies.map((tech) => (
            <span key={tech.name} className="tag">
              {tech.name} ({tech.count})
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};
