import { useState } from 'react';
import {
  FiBook,
  FiSearch,
  FiChevronRight,
  FiCode,
  FiCpu,
  FiTool,
  FiFeather,
  FiArrowRight,
  FiChevronDown,
} from 'react-icons/fi';
import '../styles/documentation.css';

export default function Documentation() {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    'Getting Started': true,
  });

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const sections = [
    {
      title: 'Getting Started',
      icon: FiFeather,
      items: [
        {
          id: 'installation',
          name: 'Installation',
          description: 'Set up ESDC on your system',
        },
        {
          id: 'quick-start',
          name: 'Quick Start',
          description: 'Get up and running in 5 minutes',
        },
        {
          id: 'configuration',
          name: 'Configuration',
          description: 'Configure your environment',
        },
      ],
    },
    {
      title: 'Hardware',
      icon: FiCpu,
      items: [
        {
          id: 'arduino',
          name: 'Arduino',
          description: 'Working with Arduino boards',
        },
        {
          id: 'raspberry-pi',
          name: 'Raspberry Pi',
          description: 'Raspberry Pi integration guide',
        },
        { id: 'esp32', name: 'ESP32', description: 'ESP32 microcontroller guide' },
        { id: 'sensors', name: 'Sensors', description: 'Sensor integration & usage' },
      ],
    },
    {
      title: 'Software',
      icon: FiCode,
      items: [
        {
          id: 'programming',
          name: 'Programming',
          description: 'Programming fundamentals',
        },
        {
          id: 'libraries',
          name: 'Libraries',
          description: 'Available libraries and packages',
        },
        { id: 'tools', name: 'Tools', description: 'Development tools guide' },
        { id: 'ides', name: 'IDEs', description: 'Supported IDEs and editors' },
      ],
    },
    {
      title: 'Projects',
      icon: FiTool,
      items: [
        { id: 'beginner', name: 'Beginner', description: 'Start with basics' },
        {
          id: 'intermediate',
          name: 'Intermediate',
          description: 'Medium complexity projects',
        },
        { id: 'advanced', name: 'Advanced', description: 'Complex projects' },
      ],
    },
  ];

  const documentation = [
    {
      section: 'Getting Started',
      content: [
        {
          id: 'installation',
          title: 'Installation',
          content: `
            <h3>System Requirements</h3>
            <ul>
              <li>Node.js 16.0 or higher</li>
              <li>npm or yarn package manager</li>
              <li>Python 3.8+ (for hardware integration)</li>
              <li>2GB RAM minimum</li>
            </ul>
            
            <h3>Installation Steps</h3>
            <ol>
              <li>Clone the repository: <code>git clone https://github.com/esdc/esdc.git</code></li>
              <li>Navigate to directory: <code>cd esdc</code></li>
              <li>Install dependencies: <code>npm install</code></li>
              <li>Configure environment: <code>cp .env.example .env</code></li>
              <li>Start development: <code>npm run dev</code></li>
            </ol>
          `,
        },
        {
          id: 'quick-start',
          title: 'Quick Start Guide',
          content: `
            <h3>Your First Project</h3>
            <p>Follow these steps to create your first ESDC project:</p>
            <ol>
              <li>Initialize project: <code>esdc init my-project</code></li>
              <li>Navigate to project: <code>cd my-project</code></li>
              <li>Choose template or start blank</li>
              <li>Install dependencies: <code>npm install</code></li>
              <li>Start development server: <code>npm run dev</code></li>
            </ol>
          `,
        },
        {
          id: 'configuration',
          title: 'Configuration',
          content: `
            <h3>Environment Variables</h3>
            <p>Create a .env file in your project root:</p>
            <code>VITE_API_URL=http://localhost:3000
VITE_WS_URL=ws://localhost:3001
NODE_ENV=development</code>
          `,
        },
      ],
    },
    {
      section: 'Hardware',
      content: [
        {
          id: 'arduino',
          title: 'Arduino Integration',
          content: `
            <h3>Getting Started with Arduino</h3>
            <p>Arduino is a popular open-source electronics platform perfect for beginners and professionals.</p>
            <h3>Popular Boards</h3>
            <ul>
              <li>Arduino Uno - Perfect for beginners</li>
              <li>Arduino Mega - More I/O pins</li>
              <li>Arduino Leonardo - Built-in USB support</li>
              <li>Arduino Due - High performance</li>
            </ul>
          `,
        },
        {
          id: 'raspberry-pi',
          title: 'Raspberry Pi Guide',
          content: `
            <h3>Raspberry Pi Setup</h3>
            <p>Raspberry Pi is a compact single-board computer capable of running full operating systems.</p>
            <h3>Models</h3>
            <ul>
              <li>Raspberry Pi 4 - Latest with 8GB RAM option</li>
              <li>Raspberry Pi Zero - Ultra-compact</li>
              <li>Raspberry Pi Pico - Microcontroller variant</li>
            </ul>
          `,
        },
        {
          id: 'esp32',
          title: 'ESP32 Microcontroller',
          content: `
            <h3>ESP32 Features</h3>
            <ul>
              <li>Dual-core processor @ 240MHz</li>
              <li>Built-in WiFi and Bluetooth</li>
              <li>30+ GPIO pins</li>
              <li>Low power consumption</li>
            </ul>
          `,
        },
        {
          id: 'sensors',
          title: 'Sensor Integration',
          content: `
            <h3>Popular Sensors</h3>
            <ul>
              <li><strong>DHT22</strong> - Temperature & Humidity</li>
              <li><strong>BMP280</strong> - Pressure & Altitude</li>
              <li><strong>MPU6050</strong> - Accelerometer & Gyroscope</li>
              <li><strong>HC-SR04</strong> - Ultrasonic Distance</li>
              <li><strong>LDR</strong> - Light Sensor</li>
            </ul>
          `,
        },
      ],
    },
    {
      section: 'Software',
      content: [
        {
          id: 'programming',
          title: 'Programming Fundamentals',
          content: `
            <h3>Core Concepts</h3>
            <ul>
              <li>Variables and Data Types</li>
              <li>Control Flow (if/else, loops)</li>
              <li>Functions and Methods</li>
              <li>Object-Oriented Programming</li>
              <li>Asynchronous Programming</li>
            </ul>
            <h3>Best Practices</h3>
            <ul>
              <li>Write clean, readable code</li>
              <li>Use meaningful variable names</li>
              <li>Add comments and documentation</li>
              <li>Test your code regularly</li>
            </ul>
          `,
        },
        {
          id: 'libraries',
          title: 'Available Libraries',
          content: `
            <h3>Core Libraries</h3>
            <ul>
              <li><code>esdc-core</code> - Core functionality</li>
              <li><code>esdc-hardware</code> - Hardware integration</li>
              <li><code>esdc-ui</code> - UI components</li>
              <li><code>esdc-utils</code> - Utility functions</li>
            </ul>
          `,
        },
        {
          id: 'tools',
          title: 'Development Tools',
          content: `
            <h3>Essential Tools</h3>
            <ul>
              <li><strong>VS Code</strong> - Recommended editor</li>
              <li><strong>Git</strong> - Version control</li>
              <li><strong>npm/yarn</strong> - Package managers</li>
              <li><strong>ESLint</strong> - Code linting</li>
              <li><strong>Prettier</strong> - Code formatting</li>
            </ul>
          `,
        },
        {
          id: 'ides',
          title: 'Supported IDEs',
          content: `
            <h3>IDE Recommendations</h3>
            <ul>
              <li><strong>VS Code</strong> - Lightweight and powerful</li>
              <li><strong>WebStorm</strong> - Full-featured IDE</li>
              <li><strong>IntelliJ IDEA</strong> - Multi-language support</li>
              <li><strong>Arduino IDE</strong> - For Arduino development</li>
            </ul>
          `,
        },
      ],
    },
    {
      section: 'Projects',
      content: [
        {
          id: 'beginner',
          title: 'Beginner Projects',
          content: `
            <h3>Start Small</h3>
            <p>Perfect for learning the basics of electronics and programming:</p>
            <ul>
              <li>LED Blinking - Your first circuit</li>
              <li>Button Interaction - User input</li>
              <li>Temperature Display - Sensor reading</li>
              <li>Simple Web Dashboard - Data visualization</li>
            </ul>
          `,
        },
        {
          id: 'intermediate',
          title: 'Intermediate Projects',
          content: `
            <h3>Build Something Cool</h3>
            <p>Take your skills to the next level:</p>
            <ul>
              <li>Weather Station - Multiple sensors</li>
              <li>Smart Home Control - WiFi integration</li>
              <li>Data Logger - SD card storage</li>
              <li>Mobile App Control - App integration</li>
            </ul>
          `,
        },
        {
          id: 'advanced',
          title: 'Advanced Projects',
          content: `
            <h3>Master Level</h3>
            <p>Complex projects combining multiple technologies:</p>
            <ul>
              <li>IoT Network - Multiple devices</li>
              <li>Machine Learning Integration</li>
              <li>Cloud Synchronization</li>
              <li>Real-time Data Analysis</li>
            </ul>
          `,
        },
      ],
    },
  ];

  return (
    <div className="documentation-page">
      <div className="docs-background">
        <div className="docs-gradient-orb docs-orb-1"></div>
        <div className="docs-gradient-orb docs-orb-2"></div>
        <div className="docs-gradient-orb docs-orb-3"></div>
      </div>

      <div className="docs-container">
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
            {sections.map((section) => {
              const IconComponent = section.icon;
              return (
                <div key={section.title} className="nav-section">
                  <button
                    className="nav-section-header"
                    onClick={() => toggleSection(section.title)}
                  >
                    <IconComponent size={18} />
                    <span>{section.title}</span>
                    <FiChevronDown
                      size={16}
                      className={`chevron ${expandedSections[section.title] ? 'open' : ''}`}
                    />
                  </button>
                  {expandedSections[section.title] && (
                    <ul className="nav-items">
                      {section.items.map((item) => (
                        <li key={item.id}>
                          <a href={`#${item.id}`} className="nav-link">
                            <FiChevronRight size={14} />
                            <div className="link-content">
                              <div className="link-name">{item.name}</div>
                              <div className="link-desc">{item.description}</div>
                            </div>
                          </a>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              );
            })}
          </nav>
        </div>

        <div className="docs-content">
          <div className="docs-header">
            <FiBook size={40} />
            <div className="header-content">
              <h1>Documentation</h1>
              <p>Complete guide to ESDC platform and tools</p>
            </div>
          </div>

          <div className="docs-sections">
            {documentation.map((section) => (
              <div key={section.section} className="doc-section-group">
                <h2 className="section-title">{section.section}</h2>
                <div className="doc-items">
                  {section.content.map((item) => (
                    <div key={item.id} id={item.id} className="doc-item">
                      <div className="doc-item-header">
                        <h3>{item.title}</h3>
                        <FiArrowRight size={20} />
                      </div>
                      <div
                        className="doc-item-content"
                        dangerouslySetInnerHTML={{ __html: item.content }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="docs-footer">
            <div className="footer-card">
              <h3>Need Help?</h3>
              <p>Can't find what you're looking for? Check our FAQ or contact support.</p>
            </div>
            <div className="footer-card">
              <h3>Contributing</h3>
              <p>Want to improve the docs? Contribute on GitHub!</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
