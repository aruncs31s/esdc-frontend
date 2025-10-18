import { useState } from 'react';
import { FiBook, FiSearch, FiChevronRight } from 'react-icons/fi';
import '../styles/documentation.css';

export default function Documentation() {
  const [searchQuery, setSearchQuery] = useState('');

  const sections = [
    { title: 'Getting Started', items: ['Installation', 'Quick Start', 'Configuration'] },
    { title: 'Hardware', items: ['Arduino', 'Raspberry Pi', 'ESP32', 'Sensors'] },
    { title: 'Software', items: ['Programming', 'Libraries', 'Tools', 'IDEs'] },
    { title: 'Projects', items: ['Beginner', 'Intermediate', 'Advanced'] },
  ];

  return (
    <div className="documentation-page">
      <div className="docs-sidebar">
        <div className="sidebar-search">
          <FiSearch />
          <input
            type="text"
            placeholder="Search docs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <nav className="docs-nav">
          {sections.map((section) => (
            <div key={section.title} className="nav-section">
              <h4>{section.title}</h4>
              <ul>
                {section.items.map((item) => (
                  <li key={item}>
                    <a href={`#${item}`}>
                      <FiChevronRight size={14} />
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </div>

      <div className="docs-content">
        <div className="docs-header">
          <FiBook size={32} />
          <h1>Documentation</h1>
        </div>
        <div className="docs-article">
          <h2>Getting Started</h2>
          <p>
            Welcome to the ESDC documentation. Here you'll find guides, tutorials, and references.
          </p>
          <h3>Installation</h3>
          <p>Follow these steps to get started...</p>
        </div>
      </div>
    </div>
  );
}
