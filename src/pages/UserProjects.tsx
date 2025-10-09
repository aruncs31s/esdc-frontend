import { useState, useEffect } from 'react';
import { FaGithub, FaExternalLinkAlt, FaCode, FaUsers, FaStar, FaPlus } from 'react-icons/fa';

const UserProjects = () => {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    // Mock data - replace with API call
    setProjects([
      {
        id: 1,
        title: 'Smart Home Automation',
        description: 'IoT-based home automation system using ESP32 and sensors',
        technologies: ['ESP32', 'Arduino', 'MQTT', 'Node.js'],
        githubUrl: 'https://github.com/user/smart-home',
        liveUrl: 'https://smarthome-demo.com',
        stars: 24,
        collaborators: 3,
        status: 'completed',
        image: 'https://via.placeholder.com/400x250'
      },
      {
        id: 2,
        title: 'LED Matrix Display',
        description: 'Programmable LED matrix with custom animations and text scrolling',
        technologies: ['Arduino', 'C++', 'LED Matrix'],
        githubUrl: 'https://github.com/user/led-matrix',
        stars: 15,
        collaborators: 1,
        status: 'in-progress',
        image: 'https://via.placeholder.com/400x250'
      },
      {
        id: 3,
        title: 'Weather Station',
        description: 'Real-time weather monitoring with data logging and web dashboard',
        technologies: ['Raspberry Pi', 'Python', 'Flask', 'SQLite'],
        githubUrl: 'https://github.com/user/weather-station',
        liveUrl: 'https://weather-dashboard.com',
        stars: 32,
        collaborators: 2,
        status: 'completed',
        image: 'https://via.placeholder.com/400x250'
      }
    ]);
  };

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
                  {project.technologies.map((tech, index) => (
                    <span key={index} className="tech-tag">{tech}</span>
                  ))}
                </div>

                <div className="project-stats">
                  <div className="stat-item">
                    <FaStar />
                    <span>{project.stars}</span>
                  </div>
                  <div className="stat-item">
                    <FaUsers />
                    <span>{project.collaborators}</span>
                  </div>
                </div>

                <div className="project-links">
                  {project.githubUrl && (
                    <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="project-link">
                      <FaGithub /> GitHub
                    </a>
                  )}
                  {project.liveUrl && (
                    <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="project-link">
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
