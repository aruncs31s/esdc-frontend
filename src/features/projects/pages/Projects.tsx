import { useState, useEffect } from 'react';
import applicationService from '../application/ApplicationService';
import { mockProjects } from '../data/mockProjects';
import { Project } from '../domain';
import ProjectCard from '@/shared/components/ui/ProjectCard';
const Projects = () => {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await applicationService.getAllProjects();
        console.log('Fetched projects from DB:', data);
        if (data && data.length > 0) {
          setProjects(data);
        } else {
          // Fallback to mock data if no data from DB
          // setProjects(mockProjects);
          alert('No projects found in the database.');
        }
      } catch (error) {
        console.error('Error fetching projects:', error);
        // Fallback to mock data on error
        // Remove this in production
        setProjects(mockProjects);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  if (loading) {
    return (
      <section
        className="projects-section"
        style={{ minHeight: '100vh', paddingTop: '100px', paddingBottom: '60px' }}
      >
        <div className="container">
          <div className="section-header">
            <h2>Community Projects</h2>
            <p>Loading projects...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      className="projects-section"
      style={{ minHeight: '100vh', paddingTop: '100px', paddingBottom: '60px' }}
    >
      <div className="container">
        <div className="section-header">
          <h2>Community Projects</h2>
          <p>Explore amazing projects built by our community members</p>
        </div>

        <div className="projects-grid">
          {projects.map((project: Project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;
