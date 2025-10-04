import { useState, useEffect } from 'react';
import { FaBook, FaVideo, FaDownload, FaExternalLinkAlt } from 'react-icons/fa';

const Resources = () => {
  const [resources, setResources] = useState([]);
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
        description: 'Complete guide to Arduino programming'
      },
      {
        id: 2,
        title: 'PCB Design Tutorial Series',
        type: 'video',
        category: 'pcb',
        url: 'https://youtube.com/playlist',
        description: 'Step-by-step PCB design tutorials'
      },
      {
        id: 3,
        title: 'Raspberry Pi Projects',
        type: 'code',
        category: 'raspberry-pi',
        url: 'https://github.com/esdc/rpi-projects',
        description: 'Collection of Raspberry Pi project codes'
      }
    ]);
  };

  const filteredResources = resources.filter(r => 
    category === 'all' || r.category === category
  );

  const getIcon = (type) => {
    switch(type) {
      case 'document': return <FaBook />;
      case 'video': return <FaVideo />;
      case 'code': return <FaDownload />;
      default: return <FaExternalLinkAlt />;
    }
  };

  return (
    <div className="resources-page">
      <div className="container">
        <h1>Learning Resources</h1>
        
        <div className="category-filter">
          {['all', 'arduino', 'raspberry-pi', 'pcb', 'iot', 'programming'].map(cat => (
            <button 
              key={cat}
              className={category === cat ? 'active' : ''}
              onClick={() => setCategory(cat)}
            >
              {cat.replace('-', ' ').toUpperCase()}
            </button>
          ))}
        </div>

        <div className="resources-grid">
          {filteredResources.map(resource => (
            <div key={resource.id} className="resource-card">
              <div className="resource-icon">
                {getIcon(resource.type)}
              </div>
              <h3>{resource.title}</h3>
              <p>{resource.description}</p>
              <a href={resource.url} target="_blank" rel="noopener noreferrer">
                Access Resource <FaExternalLinkAlt />
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Resources;