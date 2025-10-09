import { FaGithub, FaExternalLinkAlt } from 'react-icons/fa';

const Projects = () => {
  const projects = [
    {
      title: "AI Voice Assistant",
      description: "An intelligent voice-controlled assistant using machine learning and natural language processing for seamless human-computer interaction.",
      image: "https://images.unsplash.com/photo-1680783954745-3249be59e527?q=80&w=764&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      tags: ["AI", "NLP", "Voice Recognition"],
      link: "#"
    },
    {
      title: "Humanoid Robot",
      description: "Line-following robot with obstacle avoidance capabilities using Arduino and various sensors.",
      image: "https://images.unsplash.com/photo-1589254065878-42c9da997008?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      tags: ["Arduino", "Robotics", "AI"],
      link: "#"
    },
    {
      title: "AI Voice Assistant UI",
      description: "Interactive user interface for AI-powered voice assistant with modern design and seamless user experience.",
      image: "/imgs/assistant_ui1.png",
      tags: ["UI/UX", "JavaScript", "React"],
      link: "#"
    }
  ];

  return (
    <section id="projects" className="projects">
      <div className="container">
        <div className="section-header">
          <h2>Our Projects</h2>
          <p>Explore our innovative embedded systems projects</p>
        </div>
        <div className="projects-grid">
          {projects.map((project, index) => (
            <a key={index} href={project.link} className="project-card">
              <div className="project-image">
                <img 
                  src={project.image} 
                  alt={project.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }}
                />
              </div>
              <div className="project-content">
                <h3>{project.title}</h3>
                <p>{project.description}</p>
                <div className="project-tags">
                  {project.tags.map((tag, tagIndex) => (
                    <span key={tagIndex} className="tag">{tag}</span>
                  ))}
                </div>
              </div>
            </a>
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