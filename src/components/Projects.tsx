// Projects.tsx , used in home page.

import { useEffect, useState } from 'react';
import { ProjectRepository } from '@/infrastructure/repositories/ProjectRepository';
import ProjectCard from '@/shared/components/ui/ProjectCard';
import { container } from '@/application';
import { Project } from '@/domain/entities/Project';
import { FaSpinner, FaExclamationTriangle } from 'react-icons/fa';

const Projects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const projectRepository = container.get('projectRepository') as ProjectRepository;
        const projectsData = await projectRepository.findAll();
        setProjects(projectsData);
      } catch (err) {
        console.error('Error fetching projects:', err);
        setError('Failed to load projects');
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  if (loading) {
    return (
      <section id="projects" className="projects projects-section">
        <div className="container">
          <div className="section-header">
            <h2>Our Projects</h2>
            <p>Explore our innovative embedded systems projects</p>
          </div>
          <div className="loading-container">
            <FaSpinner className="spinner-icon" />
            <p>Loading amazing projects...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="projects" className="projects projects-section">
        <div className="container">
          <div className="section-header">
            <h2>Our Projects</h2>
            <p>Explore our innovative embedded systems projects</p>
          </div>
          <div className="error-container">
            <FaExclamationTriangle className="error-icon" />
            <p>{error}</p>
            <button onClick={() => window.location.reload()} className="btn btn-primary">
              Try Again
            </button>
          </div>
        </div>
      </section>
    );
  }

  if (!projects || projects.length === 0) {
    return (
      <section id="projects" className="projects projects-section">
        <div className="container">
          <div className="section-header">
            <h2>Our Projects</h2>
            <p>Explore our innovative embedded systems projects</p>
          </div>
          <div className="empty-state">
            <p>No projects available yet. Check back soon!</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="projects" className="projects projects-section">
      <div className="projects-background"></div>
      <div className="container">
        <div className="section-header">
          <h2>Our Projects</h2>
          <p>Explore our innovative embedded systems projects</p>
          <div className="project-count">
            <span className="badge">{projects.length} Projects</span>
          </div>
        </div>
        <div className="projects-grid">
          {projects.map((project: Project, index: number) => (
            <ProjectCard key={project.id} project={project} index={index} />
          ))}
        </div>

        <div className="projects-footer">
          <div className="projects-buttons">
            <a
              href="https://github.com/orgs/Embedded-Systems-GCEK/repositories"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary btn-large"
            >
              <span>→</span> Check out our repos
            </a>
            <a
              href="https://github.com/orgs/Embedded-Systems-GCEK/projects?query=is%3Aopen"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-secondary btn-large"
            >
              <span>→</span> Currently working projects
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Projects;
