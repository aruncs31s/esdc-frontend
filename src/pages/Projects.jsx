import { useState } from 'react';
import { FaGithub, FaExternalLinkAlt } from 'react-icons/fa';

const Projects = () => {
  const [projects] = useState([
    {
      id: 1,
      title: 'Smart Home Automation',
      description: 'IoT-based home automation system using ESP32 and MQTT protocol',
      technologies: ['ESP32', 'Arduino', 'MQTT', 'IoT'],
      githubUrl: 'https://github.com/esdc/smart-home',
      liveUrl: 'https://smarthome-demo.com',
      image: 'https://images.unsplash.com/photo-1558002038-1055907df827?w=400&h=300&fit=crop'
    },
    {
      id: 2,
      title: 'LED Matrix Display',
      description: 'Programmable LED matrix with custom animations and patterns',
      technologies: ['Arduino', 'C++', 'LED'],
      githubUrl: 'https://github.com/esdc/led-matrix',
      image: 'https://images.unsplash.com/photo-1519558260268-cde7e03a0152?w=400&h=300&fit=crop'
    },
    {
      id: 3,
      title: 'Weather Station',
      description: 'Real-time weather monitoring system with cloud integration',
      technologies: ['Raspberry Pi', 'Python', 'Sensors'],
      githubUrl: 'https://github.com/esdc/weather-station',
      liveUrl: 'https://weather.esdc.com',
      image: 'https://images.unsplash.com/photo-1592210454359-9043f067919b?w=400&h=300&fit=crop'
    },
    {
      id: 4,
      title: 'Robot Arm Controller',
      description: 'Precision robotic arm with gesture control interface',
      technologies: ['Arduino', 'Servo', 'ML'],
      githubUrl: 'https://github.com/esdc/robot-arm',
      image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400&h=300&fit=crop'
    },
    {
      id: 5,
      title: 'Smart Garden System',
      description: 'Automated plant watering and monitoring system',
      technologies: ['ESP8266', 'Sensors', 'IoT'],
      githubUrl: 'https://github.com/esdc/smart-garden',
      image: 'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?w=400&h=300&fit=crop'
    },
    {
      id: 6,
      title: 'Drone Flight Controller',
      description: 'Custom flight controller for quadcopter drones',
      technologies: ['STM32', 'C', 'IMU'],
      githubUrl: 'https://github.com/esdc/drone-controller',
      image: 'https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=400&h=300&fit=crop'
    }
  ]);

  return (
    <section className="projects-section" style={{ minHeight: '100vh', paddingTop: '100px', paddingBottom: '60px' }}>
      <div className="container">
        <div className="section-header">
          <h2>Community Projects</h2>
          <p>Explore amazing projects built by our community members</p>
        </div>

        <div className="projects-grid">
          {projects.map((project) => (
            <div key={project.id} className="project-card">
              <div className="project-image">
                <img 
                  src={project.image} 
                  alt={project.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
              <div className="project-content">
                <h3>{project.title}</h3>
                <p>{project.description}</p>
                <div className="project-tags">
                  {project.technologies.map((tech, index) => (
                    <span key={index} className="tag">{tech}</span>
                  ))}
                </div>
                <div style={{ 
                  display: 'flex', 
                  gap: '1rem',
                  marginTop: '1rem',
                  paddingTop: '1rem',
                  borderTop: '1px solid var(--surface0)'
                }}>
                  {project.githubUrl && (
                    <a 
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-secondary"
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
                  {project.liveUrl && (
                    <a 
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-primary"
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
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;
