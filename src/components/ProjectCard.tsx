import { FaGithub, FaExternalLinkAlt, FaArrowRight } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { Project } from '../domain';

interface ProjectCardProps {
  project: Project;
  index?: number;
}

const ProjectCard = ({ project, index = 0 }: ProjectCardProps) => {
  const navigate = useNavigate();

  const handleCardClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest('a[target="_blank"]') || target.closest('a')) {
      return;
    }
    navigate(`/projects/${project.id}`);
  };

  return (
    <div className="group" style={{ animation: `slideUp 0.6s ease-out ${index * 0.1}s both` }}>
      <div
        className="bg-gradient-to-br from-slate-900/80 to-slate-800 border border-slate-700/50 rounded-xl overflow-hidden cursor-pointer transition-all duration-500 hover:border-blue-500/50 hover:shadow-2xl hover:shadow-blue-500/20 hover:-translate-y-1"
        onClick={handleCardClick}
      >
        {/* Image Section */}
        <div className="relative h-44 overflow-hidden bg-slate-950">
          <img
            src={
              project.image ||
              'https://images.unsplash.com/photo-1589254065878-42c9da997008?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0'
            }
            alt={project.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/20 to-transparent" />

          {/* Status Badge */}
          {project.status && (
            <div className="absolute top-3 left-3">
              <span className="inline-block px-3 py-1 text-xs font-bold bg-blue-500 text-white rounded-full shadow-lg">
                {project.status.replace(/_/g, ' ')}
              </span>
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className="p-4 flex flex-col gap-3 min-h-48">
          {/* Title */}
          <div>
            <h3 className="text-base font-bold text-white line-clamp-2 group-hover:text-blue-300 transition-colors">
              {project.title}
            </h3>
            {project.category && (
              <p className="text-xs text-blue-400 mt-1 font-semibold uppercase tracking-wide">
                {project.category}
              </p>
            )}
          </div>

          {/* Description */}
          {project.description && (
            <p className="text-sm text-gray-300 line-clamp-2 flex-grow">{project.description}</p>
          )}

          {/* Technologies */}
          {project.technologies && project.technologies.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {project.technologies.slice(0, 3).map((tech, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 text-xs font-semibold bg-blue-500/20 text-blue-300 border border-blue-500/40 rounded-lg"
                >
                  {tech.name}
                </span>
              ))}
              {project.technologies.length > 3 && (
                <span className="px-2.5 py-1 text-xs font-semibold bg-purple-500/20 text-purple-300 border border-purple-500/40 rounded-lg">
                  +{project.technologies.length - 3}
                </span>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2 mt-auto pt-2">
            {project.github_link && (
              <a
                href={project.github_link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold rounded-lg bg-slate-700 text-white hover:bg-slate-600 border border-slate-600 hover:border-slate-500 transition-all no-underline shadow-sm hover:shadow-md"
                onClick={(e) => e.stopPropagation()}
                style={{ textDecoration: 'none' }}
              >
                <FaGithub size={13} />
                Code
              </a>
            )}
            {project.live_url && (
              <a
                href={project.live_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold rounded-lg bg-gradient-to-r from-blue-600 to-blue-500 text-white hover:from-blue-500 hover:to-blue-400 transition-all no-underline shadow-sm hover:shadow-md hover:shadow-blue-500/50"
                onClick={(e) => e.stopPropagation()}
                style={{ textDecoration: 'none' }}
              >
                <FaExternalLinkAlt size={13} />
                Demo
              </a>
            )}
            {!project.github_link && !project.live_url && (
              <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold rounded-lg bg-gradient-to-r from-blue-600 to-blue-500 text-white hover:from-blue-500 hover:to-blue-400 transition-all shadow-sm hover:shadow-md hover:shadow-blue-500/50">
                Details
                <FaArrowRight size={12} />
              </button>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default ProjectCard;
