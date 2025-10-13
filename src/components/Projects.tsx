// Projects.tsx , used in home page.

import { ProjectRepository } from "@/infrastructure/repositories/ProjectRepository";
import ProjectCard from "./ProjectCard";
import { container } from "@/application";
import { Project } from "@/domain/entities/Project";

const projectRepository = container.get("projectRepository") as ProjectRepository;
const projectsData = await projectRepository.findAll();

const Projects = () => {
  const projects = [
    ...projectsData
  ];

  return (
    <section id="projects" className="projects">
      <div className="container">
        <div className="section-header">
          <h2>Our Projects</h2>
          <p>Explore our innovative embedded systems projects</p>
        </div>
        <div className="projects-grid">
          {projects.map((project: Project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>

        <div className="projects-buttons">
          <a
            href="https://github.com/orgs/Embedded-Systems-GCEK/repositories"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary"
          >
            Check out our repos
          </a>
          <a
            href="https://github.com/orgs/Embedded-Systems-GCEK/projects?query=is%3Aopen"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-secondary"
          >
            Check out our currently working projects
          </a>
        </div>
      </div>
    </section>
  );
};

export default Projects;