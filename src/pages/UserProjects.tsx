import { useState, useEffect } from 'react';
import { FaGithub, FaExternalLinkAlt, FaUsers, FaStar, FaPlus } from 'react-icons/fa';
import { container } from '@/application';
import { ProjectRepository } from '@/infrastructure/repositories/ProjectRepository';
import { Project } from '@/domain/entities/Project';


const UserProjects = () => {
  const repo = container.get('ProjectRepository') as ProjectRepository;

  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    const projects = await repo.findAll();
    setProjects(projects);
  }

  return (
    <div className="user-projects-page">
      <div className="container">
        <div className="page-header">
          <h1>My Projects</h1>
          <p>Showcase of embedded systems and hardware projects</p>
          <button className="btn-add-project">
            <FaPlus /> Add New Project
          </button>
        </div>

        <div className="projects-grid">
          {projects.map((project) => (
            <div key={project.id} className="project-card">
              <div className="project-image">
                <img src={project.image} alt={project.title} />
                <div className={`project-status ${project.status}`}>
                  {project.status === 'completed' ? 'Completed' : 'In Progress'}
                </div>
              </div>

              <div className="project-content">
                <h3>{project.title}</h3>
                <p>{project.description}</p>

                <div className="project-tech">
                  {project.technologies?.map((tech, index) => (
                    <span key={index} className="tech-tag">{tech.name}</span>
                  ))}
                </div>

                <div className="project-stats">
                  <div className="stat-item">
                    <FaStar />
                    <span>{project.likes}</span>
                  </div>
                  <div className="stat-item">
                    <FaUsers />
                    <span>{project.contributors?.length || 0}</span>
                  </div>
                </div>

                <div className="project-links">
                  {project.github_link && (
                    <a href={project.github_link} target="_blank" rel="noopener noreferrer" className="project-link">
                      <FaGithub /> GitHub
                    </a>
                  )}
                  {project.live_url && (
                    <a href={project.live_url} target="_blank" rel="noopener noreferrer" className="project-link">
                      <FaExternalLinkAlt /> Live Demo
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserProjects;
