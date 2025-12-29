import React from 'react';
import { FaGithub, FaExternalLinkAlt, FaHeart, FaEye } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { Project } from '@/domain';
import './ProjectCard.css';

interface ProjectCardProps {
  project: Project;
  index?: number;
}

const ProjectCard = ({ project, index = 0 }: ProjectCardProps) => {
  const navigate = useNavigate();

  const handleCardClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    // Prevent navigation if clicking links or buttons
    if (target.closest('a') || target.closest('button')) return;
    navigate(`/projects/${project.id}`);
  };

  const handleViewProject = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/projects/${project.id}`);
  };

  const formatStatus = (status: string) => {
    return status?.replace(/_/g, ' ').toLowerCase();
  };

  return (
    <article
      className="pcard"
      style={{ animationDelay: `${index * 0.1}s` }}
      onClick={handleCardClick}
    >
      {/* Image Section */}
      <div className="pcard-image">
        <img
          src={
            project.image ||
            'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&auto=format&fit=crop'
          }
          alt={project.title}
          loading="lazy"
        />

        {/* Status Badge */}
        {project.status && (
          <span
            className={`pcard-status pcard-status--${formatStatus(project.status).replace(' ', '-')}`}
          >
            {formatStatus(project.status)}
          </span>
        )}

        {/* Metrics Overlay */}
        <div className="pcard-metrics">
          {project.likes > 0 && (
            <span className="pcard-metric">
              <FaHeart />
              {project.likes}
            </span>
          )}
          {project.views > 0 && (
            <span className="pcard-metric">
              <FaEye />
              {project.views}
            </span>
          )}
        </div>
      </div>

      {/* Content Section */}
      <div className="pcard-body">
        <h3 className="pcard-title" onClick={handleViewProject}>
          {project.title}
        </h3>

        {project.description && <p className="pcard-desc">{project.description}</p>}

        {/* Technologies & Category - GitHub style footer metadata */}
        <div className="pcard-techs">
          {project.category && <span className="pcard-category">{project.category}</span>}

          {project.technologies &&
            project.technologies.slice(0, 3).map((tech, i) => (
              <span key={i} className="pcard-tech">
                {tech.name}
              </span>
            ))}

          {project.technologies && project.technologies.length > 3 && (
            <span className="pcard-tech pcard-tech--more">+{project.technologies.length - 3}</span>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="pcard-footer">
        <div className="pcard-links">
          {project.github_link && (
            <a
              href={project.github_link}
              target="_blank"
              rel="noopener noreferrer"
              className="pcard-link"
              onClick={(e) => e.stopPropagation()}
              aria-label="View source code"
            >
              <FaGithub />
            </a>
          )}
          {project.live_url && (
            <a
              href={project.live_url}
              target="_blank"
              rel="noopener noreferrer"
              className="pcard-link"
              onClick={(e) => e.stopPropagation()}
              aria-label="View live demo"
            >
              <FaExternalLinkAlt />
            </a>
          )}
        </div>

        <button className="pcard-btn" onClick={handleViewProject}>
          View Project
        </button>
      </div>
    </article>
  );
};

export default ProjectCard;
