import { useState, useEffect } from 'react';
import { FaPlus } from 'react-icons/fa';
import { container } from '@/application';
import { ProjectRepository } from '@/infrastructure/repositories/ProjectRepository';
import { Project } from '@/domain/entities/Project';
import AddProjectModal from '@/shared/components/ui/modals/AddProjectModal';
import ProjectCard from '@/shared/components/ui/ProjectCard';
import '../styles/projects-enhanced.css';

const UserProjects = () => {
  const repo = container.get('projectRepository') as ProjectRepository;

  const [projects, setProjects] = useState<Project[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchProjects();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchProjects = async () => {
    const projects = await repo.findAll();
    setProjects(projects);
  };

  const handleProjectAdded = (newProject: Project) => {
    setProjects([...projects, newProject]);
    setIsModalOpen(false);
  };

  return (
    <div className="user-projects-page">
      <div className="container">
        <div className="page-header">
          <h1>My Projects</h1>
          <p>Showcase of embedded systems and hardware projects</p>
          <button className="btn-add-project" onClick={() => setIsModalOpen(true)}>
            <FaPlus /> Add New Project
          </button>
        </div>

        <div className="projects-grid">
          {projects.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} />
          ))}
        </div>
      </div>

      <AddProjectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onProjectAdded={handleProjectAdded}
      />
    </div>
  );
};

export default UserProjects;
