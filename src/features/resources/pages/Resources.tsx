import { useState, useEffect } from 'react';
import { FaBook, FaVideo, FaExternalLinkAlt, FaCode, FaLink } from 'react-icons/fa';
import { FiInbox } from 'react-icons/fi';

interface Resource {
  id: number;
  title: string;
  type: string;
  category: string;
  url: string;
  description: string;
}

const Resources = () => {
  const [resources, setResources] = useState<Resource[]>([]);
  const [category, setCategory] = useState('all');

  useEffect(() => {
    fetchResources();
  }, []);

  const fetchResources = async () => {
    // Mock data - replace with API call
    setResources([
      {
        id: 1,
        title: 'Arduino Programming Guide',
        type: 'document',
        category: 'arduino',
        url: '/resources/arduino-guide.pdf',
        description: 'Complete guide to Arduino programming with examples and best practices',
      },
      {
        id: 2,
        title: 'PCB Design Tutorial Series',
        type: 'video',
        category: 'pcb',
        url: 'https://youtube.com/playlist',
        description: 'Step-by-step PCB design tutorials from beginner to advanced',
      },
      {
        id: 3,
        title: 'Raspberry Pi Projects',
        type: 'code',
        category: 'raspberry-pi',
        url: 'https://github.com/esdc/rpi-projects',
        description: 'Collection of Raspberry Pi project codes and documentation',
      },
      {
        id: 4,
        title: 'IoT Development Basics',
        type: 'document',
        category: 'iot',
        url: '/resources/iot-basics.pdf',
        description: 'Introduction to IoT concepts, protocols, and implementation',
      },
      {
        id: 5,
        title: 'Python for Embedded Systems',
        type: 'video',
        category: 'programming',
        url: 'https://youtube.com/watch',
        description: 'Learn Python programming for embedded systems and microcontrollers',
      },
      {
        id: 6,
        title: 'ESP32 Code Examples',
        type: 'code',
        category: 'iot',
        url: 'https://github.com/esdc/esp32-examples',
        description: 'Ready-to-use ESP32 code examples for various IoT applications',
      },
    ]);
  };

  const filteredResources = resources.filter((r) => category === 'all' || r.category === category);

  const getIcon = (type: string) => {
    switch (type) {
      case 'document':
        return <FaBook />;
      case 'video':
        return <FaVideo />;
      case 'code':
        return <FaCode />;
      case 'link':
        return <FaLink />;
      default:
        return <FaExternalLinkAlt />;
    }
  };

  return (
    <div className="resources-page">
      <div className="container">
        <h1>Learning Resources</h1>
        <p>Explore our curated collection of tutorials, guides, and tools</p>

        <div className="category-filter">
          {['all', 'arduino', 'raspberry-pi', 'pcb', 'iot', 'programming'].map((cat) => (
            <button
              key={cat}
              className={category === cat ? 'active' : ''}
              onClick={() => setCategory(cat)}
            >
              {cat.replace('-', ' ')}
            </button>
          ))}
        </div>

        {filteredResources.length > 0 ? (
          <div className="resources-grid">
            {filteredResources.map((resource) => (
              <div key={resource.id} className="resource-card">
                <span className={`resource-type ${resource.type}`}>{resource.type}</span>
                <div className="resource-icon">{getIcon(resource.type)}</div>
                <h3>{resource.title}</h3>
                <p>{resource.description}</p>
                <a href={resource.url} target="_blank" rel="noopener noreferrer">
                  Access Resource <FaExternalLinkAlt />
                </a>
              </div>
            ))}
          </div>
        ) : (
          <div className="resources-empty">
            <FiInbox />
            <h3>No Resources Found</h3>
            <p>Try selecting a different category</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Resources;
