import { useState, ReactElement } from 'react';
import { useSettings } from '../contexts/SettingsContext';
import { 
  FaRobot, 
  FaComments, 
  FaGamepad, 
  FaShoppingCart, 
  FaBlog, 
  FaCalendarAlt, 
  FaTrophy, 
  FaBook, 
  FaChartLine, 
  FaProjectDiagram, 
  FaGraduationCap, 
  FaBell, 
  FaBox 
} from 'react-icons/fa';

// Interface for feature item
interface FeatureItem {
  key: keyof typeof defaultSettings;
  label: string;
  description: string;
  icon: ReactElement;
  category: 'core' | 'content' | 'commerce' | 'community';
}

// Import default settings type
const defaultSettings = {
  chatbot: true,
  chatroom: true,
  games: true,
  shop: true,
  blog: true,
  events: true,
  challenges: true,
  resources: true,
  leaderboard: true,
  projects: true,
  lms: true,
  notifications: true,
  products: true,
};

const Settings = () => {
  const { settings, updateSetting, resetSettings } = useSettings();
  const [activeTab, setActiveTab] = useState<'all' | 'core' | 'content' | 'commerce' | 'community'>('all');

  // Define all features with metadata
  const features: FeatureItem[] = [
    {
      key: 'chatbot',
      label: 'Chatbot',
      description: 'AI-powered assistant for instant help',
      icon: <FaRobot />,
      category: 'core'
    },
    {
      key: 'chatroom',
      label: 'Chat Room',
      description: 'Real-time messaging with other users',
      icon: <FaComments />,
      category: 'community'
    },
    {
      key: 'games',
      label: 'Games',
      description: 'Interactive games and entertainment',
      icon: <FaGamepad />,
      category: 'content'
    },
    {
      key: 'shop',
      label: 'Shop',
      description: 'Browse and purchase items',
      icon: <FaShoppingCart />,
      category: 'commerce'
    },
    {
      key: 'blog',
      label: 'Blog',
      description: 'Read articles and updates',
      icon: <FaBlog />,
      category: 'content'
    },
    {
      key: 'events',
      label: 'Events',
      description: 'Discover and join events',
      icon: <FaCalendarAlt />,
      category: 'community'
    },
    {
      key: 'challenges',
      label: 'Challenges',
      description: 'Participate in coding challenges',
      icon: <FaTrophy />,
      category: 'community'
    },
    {
      key: 'resources',
      label: 'Resources',
      description: 'Access learning materials',
      icon: <FaBook />,
      category: 'content'
    },
    {
      key: 'leaderboard',
      label: 'Leaderboard',
      description: 'View rankings and compete',
      icon: <FaChartLine />,
      category: 'community'
    },
    {
      key: 'projects',
      label: 'Projects',
      description: 'Showcase and explore projects',
      icon: <FaProjectDiagram />,
      category: 'community'
    },
    {
      key: 'lms',
      label: 'Learning Management',
      description: 'Course management system',
      icon: <FaGraduationCap />,
      category: 'content'
    },
    {
      key: 'notifications',
      label: 'Notifications',
      description: 'Stay updated with alerts',
      icon: <FaBell />,
      category: 'core'
    },
    {
      key: 'products',
      label: 'Products',
      description: 'Manage your products',
      icon: <FaBox />,
      category: 'commerce'
    }
  ];

  // Filter features by category
  const filteredFeatures = activeTab === 'all' 
    ? features 
    : features.filter(f => f.category === activeTab);

  // Handle toggle
  const handleToggle = (feature: keyof typeof defaultSettings) => {
    updateSetting(feature, !settings[feature]);
  };

  // Handle reset
  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset all settings to default?')) {
      resetSettings();
    }
  };

  // Category tabs
  const categories = [
    { value: 'all' as const, label: 'All Features' },
    { value: 'core' as const, label: 'Core' },
    { value: 'content' as const, label: 'Content' },
    { value: 'commerce' as const, label: 'Commerce' },
    { value: 'community' as const, label: 'Community' }
  ];

  return (
    <section className="products-section" style={{ minHeight: '100vh', paddingTop: '100px', paddingBottom: '60px' }}>
      <div className="container">
        {/* Header */}
        <div className="section-header">
          <h2>Settings</h2>
          <p>Customize your experience by enabling or disabling features</p>
        </div>

        {/* Category Tabs */}
        <div style={{ 
          marginBottom: '2rem', 
          display: 'flex', 
          flexWrap: 'wrap', 
          justifyContent: 'center', 
          gap: '0.75rem' 
        }}>
          {categories.map(cat => (
            <button
              key={cat.value}
              onClick={() => setActiveTab(cat.value)}
              className="btn"
              style={{
                padding: '0.75rem 1.5rem',
                fontSize: '0.95rem',
                fontWeight: '600',
                borderRadius: '8px',
                border: activeTab === cat.value ? '2px solid var(--blue)' : '2px solid var(--surface0)',
                background: activeTab === cat.value ? 'var(--blue)' : 'var(--surface0)',
                color: activeTab === cat.value ? 'var(--crust)' : 'var(--text)',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Features Grid */}
        <div className="projects-grid">
          {filteredFeatures.map(feature => (
            <div
              key={feature.key}
              className="project-card"
              style={{
                opacity: settings[feature.key] ? 1 : 0.7,
                transition: 'all 0.3s ease'
              }}
            >
              <div className="project-image" style={{ 
                background: settings[feature.key] 
                  ? 'linear-gradient(135deg, var(--blue) 0%, var(--mauve) 100%)'
                  : 'linear-gradient(135deg, var(--surface0) 0%, var(--surface1) 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '200px'
              }}>
                <div style={{ 
                  fontSize: '4rem',
                  color: settings[feature.key] ? 'var(--crust)' : 'var(--overlay0)',
                  transition: 'all 0.3s ease'
                }}>
                  {feature.icon}
                </div>
              </div>
              <div className="project-content">
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'flex-start',
                  marginBottom: '0.75rem' 
                }}>
                  <div>
                    <h3 style={{ marginBottom: '0.25rem' }}>{feature.label}</h3>
                    <span className="tag" style={{ 
                      fontSize: '0.75rem',
                      textTransform: 'capitalize'
                    }}>
                      {feature.category}
                    </span>
                  </div>
                  <button
                    onClick={() => handleToggle(feature.key)}
                    style={{
                      position: 'relative',
                      display: 'inline-flex',
                      height: '28px',
                      width: '52px',
                      alignItems: 'center',
                      borderRadius: '9999px',
                      transition: 'background-color 0.3s',
                      background: settings[feature.key] ? 'var(--green)' : 'var(--overlay0)',
                      border: 'none',
                      cursor: 'pointer'
                    }}
                    role="switch"
                    aria-checked={settings[feature.key]}
                  >
                    <span
                      style={{
                        display: 'inline-block',
                        height: '20px',
                        width: '20px',
                        transform: settings[feature.key] ? 'translateX(28px)' : 'translateX(4px)',
                        borderRadius: '50%',
                        background: 'white',
                        transition: 'transform 0.3s',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                      }}
                    />
                  </button>
                </div>
                <p style={{ 
                  fontSize: '0.9rem',
                  color: 'var(--subtext0)',
                  marginBottom: '1rem',
                  lineHeight: '1.5'
                }}>
                  {feature.description}
                </p>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  paddingTop: '1rem',
                  borderTop: '1px solid var(--surface0)'
                }}>
                  <span style={{
                    fontSize: '0.85rem',
                    fontWeight: '600',
                    padding: '0.25rem 0.75rem',
                    borderRadius: '12px',
                    background: settings[feature.key] ? 'var(--green)' : 'var(--surface0)',
                    color: settings[feature.key] ? 'var(--crust)' : 'var(--subtext0)'
                  }}>
                    {settings[feature.key] ? '✓ Enabled' : '✗ Disabled'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          gap: '1rem',
          marginTop: '3rem',
          flexWrap: 'wrap'
        }}>
          <button
            onClick={handleReset}
            className="btn btn-primary"
            style={{
              padding: '1rem 2rem',
              fontSize: '1rem',
              background: 'var(--red)',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontWeight: '600'
            }}
          >
            🔄 Reset to Defaults
          </button>
          <button
            onClick={() => window.location.reload()}
            className="btn btn-primary"
            style={{
              padding: '1rem 2rem',
              fontSize: '1rem',
              background: 'var(--green)',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontWeight: '600'
            }}
          >
            ✓ Apply & Reload
          </button>
        </div>

        {/* Info Card */}
        <div style={{
          marginTop: '3rem',
          background: 'var(--surface0)',
          border: `2px solid var(--blue)`,
          borderRadius: '12px',
          padding: '1.5rem',
          maxWidth: '800px',
          margin: '3rem auto 0'
        }}>
          <h3 style={{ 
            fontSize: '1.1rem',
            fontWeight: '600',
            color: 'var(--blue)',
            marginBottom: '0.75rem'
          }}>
            ℹ️ About Settings
          </h3>
          <p style={{ 
            fontSize: '0.9rem',
            color: 'var(--subtext0)',
            lineHeight: '1.6'
          }}>
            Your settings are automatically saved to your browser's local storage. 
            Disabling features will hide them from navigation and prevent access to those pages. 
            Some features may require a page reload to take effect.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Settings;
