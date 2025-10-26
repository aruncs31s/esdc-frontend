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
    <div
      className="project-card-modern"
      style={{ animation: `slideUp 0.6s ease-out ${index * 0.1}s both` }}
    >
      <div className="project-card-inner" onClick={handleCardClick}>
        <div className="project-card-image">
          <img
            src={
              project.image ||
              'https://images.unsplash.com/photo-1589254065878-42c9da997008?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0'
            }
            alt={project.title}
          />
          <div className="project-card-overlay" />
          {project.status && (
            <div className="project-card-status">
              <span>{project.status.replace(/_/g, ' ')}</span>
            </div>
          )}
        </div>

        <div className="project-card-content">
          <div>
            <h3 className="project-card-title">{project.title}</h3>
            {project.category && <p className="project-card-category">{project.category}</p>}
          </div>

          {project.description && <p className="project-card-description">{project.description}</p>}

          {project.technologies && project.technologies.length > 0 && (
            <div className="project-card-tech">
              {project.technologies.slice(0, 3).map((tech, idx) => (
                <span key={idx} className="tech-badge">
                  {tech.name}
                </span>
              ))}
              {project.technologies.length > 3 && (
                <span className="tech-badge tech-badge-more">
                  +{project.technologies.length - 3}
                </span>
              )}
            </div>
          )}

          <div className="project-card-actions">
            {project.github_link && (
              <a
                href={project.github_link}
                target="_blank"
                rel="noopener noreferrer"
                className="project-btn project-btn-secondary"
                onClick={(e) => e.stopPropagation()}
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
                className="project-btn project-btn-primary"
                onClick={(e) => e.stopPropagation()}
              >
                <FaExternalLinkAlt size={13} />
                Demo
              </a>
            )}
            {!project.github_link && !project.live_url && (
              <button className="project-btn project-btn-primary">
                Details
                <FaArrowRight size={12} />
              </button>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .project-card-modern {
          height: 100%;
        }
        .project-card-inner {
          background: var(--base);
          backdrop-filter: blur(20px);
          border: 1px solid var(--surface0);
          border-radius: 16px;
          overflow: hidden;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
          height: 100%;
          display: flex;
          flex-direction: column;
        }
        .project-card-inner:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 32px rgba(0, 0, 0, 0.12);
          border-color: var(--blue);
        }
        .project-card-image {
          position: relative;
          height: 180px;
          overflow: hidden;
          background: var(--surface0);
        }
        .project-card-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s ease;
        }
        .project-card-inner:hover .project-card-image img {
          transform: scale(1.1);
        }
        .project-card-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, var(--base), transparent);
        }
        .project-card-status {
          position: absolute;
          top: 12px;
          left: 12px;
        }
        .project-card-status span {
          display: inline-block;
          padding: 6px 12px;
          font-size: 11px;
          font-weight: 600;
          background: var(--blue);
          color: white;
          border-radius: 20px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
          text-transform: uppercase;
        }
        .project-card-content {
          padding: 16px;
          display: flex;
          flex-direction: column;
          gap: 12px;
          flex: 1;
        }
        .project-card-title {
          font-size: 16px;
          font-weight: 700;
          color: var(--text-primary);
          margin: 0;
          line-height: 1.3;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          transition: color 0.3s ease;
        }
        .project-card-inner:hover .project-card-title {
          color: var(--blue);
        }
        .project-card-category {
          font-size: 11px;
          color: var(--blue);
          margin: 4px 0 0 0;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .project-card-description {
          font-size: 13px;
          color: var(--text-secondary);
          line-height: 1.5;
          margin: 0;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          flex-grow: 1;
        }
        .project-card-tech {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
        }
        .tech-badge {
          padding: 4px 10px;
          font-size: 11px;
          font-weight: 600;
          background: rgba(137, 180, 250, 0.15);
          color: var(--blue);
          border: 1px solid rgba(137, 180, 250, 0.3);
          border-radius: 8px;
        }
        .tech-badge-more {
          background: rgba(203, 166, 247, 0.15);
          color: var(--mauve);
          border-color: rgba(203, 166, 247, 0.3);
        }
        .project-card-actions {
          display: flex;
          gap: 8px;
          margin-top: auto;
          padding-top: 8px;
        }
        .project-btn {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          padding: 10px 16px;
          font-size: 12px;
          font-weight: 600;
          border-radius: 10px;
          border: none;
          cursor: pointer;
          transition: all 0.3s ease;
          text-decoration: none;
        }
        .project-btn-secondary {
          background: var(--surface0);
          color: var(--text-primary);
          border: 1px solid var(--surface1);
        }
        .project-btn-secondary:hover {
          background: var(--surface1);
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }
        .project-btn-primary {
          background: linear-gradient(135deg, var(--blue) 0%, var(--lavender) 100%);
          color: white;
          box-shadow: 0 4px 12px rgba(137, 180, 250, 0.3);
        }
        .project-btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(137, 180, 250, 0.4);
        }
      `}</style>
    </div>
  );
};

export default ProjectCard;
