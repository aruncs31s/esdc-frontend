import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiTrendingUp, FiEye, FiHeart, FiMessageCircle } from 'react-icons/fi';
import { projectAdvancedApi } from '@/infrastructure/api/projectAdvancedApi';
import type { TrendingProject } from '@/types/project-advanced';

export const TrendingProjects = () => {
  const [projects, setProjects] = useState<TrendingProject[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    projectAdvancedApi
      .getTrending(6)
      .then(setProjects)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-center py-8">Loading trending projects...</div>;

  return (
    <div className="trending-projects">
      <div className="flex items-center gap-2 mb-6">
        <FiTrendingUp className="text-2xl text-primary" />
        <h2 className="text-2xl font-bold">Trending Projects</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <Link
            key={project.id}
            to={`/projects/${project.id}`}
            className="project-card glass-card p-4 hover:scale-105 transition-transform"
          >
            {project.image && (
              <img
                src={project.image}
                alt={project.title}
                className="w-full h-40 object-cover rounded-lg mb-3"
              />
            )}
            <h3 className="font-semibold text-lg mb-2">{project.title}</h3>
            <p className="text-sm text-muted mb-3">{project.category}</p>
            <div className="flex gap-4 text-sm">
              <span className="flex items-center gap-1">
                <FiEye /> {project.views}
              </span>
              <span className="flex items-center gap-1">
                <FiHeart /> {project.likes}
              </span>
              <span className="flex items-center gap-1">
                <FiMessageCircle /> {project.comment_count}
              </span>
            </div>
            <div className="mt-2 text-xs text-primary">
              Score: {project.trending_score.toFixed(1)}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};
