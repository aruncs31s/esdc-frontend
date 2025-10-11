import { FaGithub, FaExternalLinkAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { Project } from '../domain';

interface ProjectCardProps {
  project: Project;
}

// FUTURE NOTE: This card is using only less amount of data from the Project entity.
// Consider creating a lighter interface or DTO for project listings if performance becomes an issue.

const ProjectCard = ({ project }: ProjectCardProps) => {
  const navigate = useNavigate();
  
  const handleCardClick = (e: React.MouseEvent) => {
    // Don't navigate if clicking on external links
    const target = e.target as HTMLElement;
    if (target.closest('a[target="_blank"]')) {
      return;
    }
    navigate(`/projects/${project.id}`);
  };

  const cardContent = (
    <div className="project-card" onClick={handleCardClick} style={{ cursor: 'pointer' }}>
      <div className="project-image">
        <img
          src={project.image || "https://images.unsplash.com/photo-1589254065878-42c9da997008?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0"}
          alt={project.title}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </div>
      <div className="project-content">
        <h3>{project.title}</h3>
        <p>{project.description}</p>
        <div className="project-tags">
          {project.technologies?.map((tech, index) => (
            <span key={index} className="tag">{tech.name}</span>
          ))}
        </div>
        <div style={{
          display: 'flex',
          gap: '1rem',
          marginTop: '1rem',
          paddingTop: '1rem',
          borderTop: '1px solid var(--surface0)'
        }}>
          {project.github_link && (
            <a
              href={project.github_link}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-secondary"
              onClick={(e) => e.stopPropagation()}
              style={{
                padding: '8px 16px',
                fontSize: '0.85rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                flex: 1
              }}
            >
              <FaGithub /> GitHub
            </a>
          )}
          {project.live_url && (
            <a
              href={project.live_url}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary"
              onClick={(e) => e.stopPropagation()}
              style={{
                padding: '8px 16px',
                fontSize: '0.85rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                flex: 1
              }}
            >
              <FaExternalLinkAlt /> Live Demo
            </a>
          )}
        </div>
      </div>
    </div>
  );
  
  return cardContent;
};

export default ProjectCard;
