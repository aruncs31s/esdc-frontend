import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  FaGithub, 
  FaExternalLinkAlt, 
  FaHeart, 
  FaRegHeart,
  FaEye,
  FaCalendar,
  FaClock,
  FaUser,
  FaTag,
  FaCode,
  FaArrowLeft,
  FaCheckCircle,
  FaSpinner,
  FaArchive
} from 'react-icons/fa';
import { Project, ProjectStatus } from '../domain/entities/Project';
import '../styles/ProjectDetail.css';
import { applicationService } from '../application';
import { DEFAULT_PROJECT_IMAGE } from '../data/project_images';
const ProjectDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        setLoading(true);
        const projectData: Project = await applicationService.getProjectById(id || '');

        // const projectData = Project.fromAPI(mockProjectData);
        setProject(projectData);
        // Increment views
        projectData.incrementViews();
        
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load project');
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [id]);

  const handleLike = () => {
    if (!project) return;
    
    if (isLiked) {
      project.removeLike();
    } else {
      project.addLike();
    }
    setIsLiked(!isLiked);
    setProject(new Project(project));
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case ProjectStatus.COMPLETED:
        return <FaCheckCircle className="status-icon completed" />;
      case ProjectStatus.IN_PROGRESS:
        return <FaSpinner className="status-icon in-progress" />;
      case ProjectStatus.ARCHIVED:
        return <FaArchive className="status-icon archived" />;
      default:
        return null;
    }
  };

  const getStatusLabel = (status: string) => {
    return status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  if (loading) {
    return (
      <div className="project-detail-container">
        <div className="loading-spinner">
          <FaSpinner className="spin" />
          <p>Loading project details...</p>
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="project-detail-container">
        <div className="error-message">
          <h2>Error</h2>
          <p>{error || 'Project not found'}</p>
          <button onClick={() => navigate(-1)} className="btn btn-primary">
            <FaArrowLeft /> Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="project-detail-container">
      <div className="project-detail-header">
        <button onClick={() => navigate(-1)} className="back-button">
          <FaArrowLeft /> Back to Projects
        </button>
      </div>

      <div className="project-detail-content">
        {/* Hero Section */}
        <div className="project-hero">
          <div className="project-hero-image">
            <img 
              src={project.image || DEFAULT_PROJECT_IMAGE} 
              alt={project.title} 
            />
            <div className="project-status-badge">
              {getStatusIcon(project.status)}
              <span>{getStatusLabel(project.status)}</span>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="project-main">
          <div className="project-content-section">
            {/* Title and Actions */}
            <div className="project-header-section">
              <h1 className="project-title">{project.title}</h1>
              <div className="project-actions">
                <button 
                  onClick={handleLike} 
                  className={`action-btn ${isLiked ? 'liked' : ''}`}
                  aria-label="Like project"
                >
                  {isLiked ? <FaHeart /> : <FaRegHeart />}
                  <span>{project.likes}</span>
                </button>
                <div className="action-btn views">
                  <FaEye />
                  <span>{project.views}</span>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div className="project-links">
              {project.github_link && (
                <a 
                  href={project.github_link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="btn btn-secondary"
                >
                  <FaGithub /> View on GitHub
                </a>
              )}
              {project.live_url && (
                <a 
                  href={project.live_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="btn btn-primary"
                >
                  <FaExternalLinkAlt /> Live Demo
                </a>
              )}
            </div>

            {/* Description */}
            <div className="project-section">
              <h2>About This Project</h2>
              <p className="project-description">{project.description}</p>
            </div>

            {/* Technologies */}
            {project.technologies && project.technologies.length > 0 && (
              <div className="project-section">
                <h2><FaCode /> Technologies Used</h2>
                <div className="technologies-grid">
                  {project.technologies.map((tech) => (
                    <div key={tech.id} className="technology-badge">
                      {tech.name}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tags */}
            {project.tags && project.tags.length > 0 && (
              <div className="project-section">
                <h2><FaTag /> Tags</h2>
                <div className="tags-container">
                  {project.tags.map((tag) => (
                    <span key={tag.id} className="tag">
                      {tag.name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Contributors */}
            {project.contributors && project.contributors.length > 0 && (
              <div className="project-section">
                <h2><FaUser /> Contributors</h2>
                <div className="contributors-list">
                  {project.contributors.map((contributor) => (
                    <div key={contributor.id} className="contributor-card">
                      <div className="contributor-avatar">
                        {contributor.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="contributor-info">
                        <h4>{contributor.name}</h4>
                        <p>{contributor.email}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside className="project-sidebar">
            <div className="sidebar-card">
              <h3>Project Information</h3>
              
              <div className="info-item">
                <FaCalendar className="info-icon" />
                <div>
                  <label>Created</label>
                  <p>{new Date(project.created_at || '').toLocaleDateString()}</p>
                </div>
              </div>

              <div className="info-item">
                <FaClock className="info-icon" />
                <div>
                  <label>Last Updated</label>
                  <p>{new Date(project.updated_at || '').toLocaleDateString()}</p>
                </div>
              </div>

              {project.completed_at && (
                <div className="info-item">
                  <FaCheckCircle className="info-icon" />
                  <div>
                    <label>Completed</label>
                    <p>{new Date(project.completed_at).toLocaleDateString()}</p>
                  </div>
                </div>
              )}

              <div className="info-item">
                <FaTag className="info-icon" />
                <div>
                  <label>Category</label>
                  <p>{project.category}</p>
                </div>
              </div>

              {project.cost !== undefined && project.cost > 0 && (
                <div className="info-item">
                  <div className="info-icon">💰</div>
                  <div>
                    <label>Project Cost</label>
                    <p>${project.cost.toLocaleString()}</p>
                  </div>
                </div>
              )}

              <div className="info-item">
                <div className="info-icon">📅</div>
                <div>
                  <label>Project Age</label>
                  <p>{project.getAgeInDays()} days</p>
                </div>
              </div>
            </div>

            <div className="sidebar-card">
              <h3>Project Stats</h3>
              <div className="stats-grid">
                <div className="stat-item">
                  <FaHeart className="stat-icon" />
                  <div>
                    <p className="stat-value">{project.likes}</p>
                    <p className="stat-label">Likes</p>
                  </div>
                </div>
                <div className="stat-item">
                  <FaEye className="stat-icon" />
                  <div>
                    <p className="stat-value">{project.views}</p>
                    <p className="stat-label">Views</p>
                  </div>
                </div>
                <div className="stat-item">
                  <FaUser className="stat-icon" />
                  <div>
                    <p className="stat-value">{project.contributors?.length || 0}</p>
                    <p className="stat-label">Contributors</p>
                  </div>
                </div>
                <div className="stat-item">
                  <FaCode className="stat-icon" />
                  <div>
                    <p className="stat-value">{project.technologies?.length || 0}</p>
                    <p className="stat-label">Technologies</p>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;
