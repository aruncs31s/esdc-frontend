import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { FiSun, FiMoon, FiUser, FiLogOut, FiSettings, FiActivity, FiAward, FiTarget, FiZap } from 'react-icons/fi';
import { FaGithub, FaExternalLinkAlt, FaStar, FaUsers, FaPlus } from 'react-icons/fa';
import { useAuth } from '../hooks/useAuth';
import PropTypes from 'prop-types';

/**
 * ProfilePopup Component
 * Android-style quick settings popup with profile info and quick tiles
 */
const ProfilePopup = ({ isDarkMode, toggleTheme, onClose }) => {
  const { user, logout } = useAuth();
  const [imageError, setImageError] = useState(false);
  const [projects, setProjects] = useState([]);
  const popupRef = useRef(null);

  // Fetch projects
  useEffect(() => {
    setProjects([
      {
        id: 1,
        title: 'Smart Home Automation',
        description: 'IoT-based home automation system using ESP32',
        technologies: ['ESP32', 'Arduino', 'MQTT'],
        githubUrl: 'https://github.com/user/smart-home',
        liveUrl: 'https://smarthome-demo.com',
        stars: 24,
        collaborators: 3,
        status: 'completed'
      },
      {
        id: 2,
        title: 'LED Matrix Display',
        description: 'Programmable LED matrix with animations',
        technologies: ['Arduino', 'C++'],
        githubUrl: 'https://github.com/user/led-matrix',
        stars: 15,
        collaborators: 1,
        status: 'in-progress'
      }
    ]);
  }, []);

  // Close popup when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        onClose();
      }
    };

    const timer = setTimeout(() => {
      document.addEventListener('mousedown', handleClickOutside);
    }, 100);

    return () => {
      clearTimeout(timer);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  const handleLogout = async () => {
    await logout();
    onClose();
    window.location.href = '/';
  };

  const handleImageError = () => {
    setImageError(true);
  };

  const displayName = user?.name || user?.username || 'User';
  const displayEmail = user?.email || '';
  const displayAvatar = user?.avatar_url || user?.avatarUrl || user?.avatar;
  const displayRole = user?.role || 'member';

  return (
    <div className="profile-popup-overlay">
      <div className="profile-popup" ref={popupRef}>
        {/* Profile Header */}
        <div className="profile-popup-header">
          <div className="profile-popup-avatar-container">
            {displayAvatar && !imageError ? (
              <img
                src={displayAvatar}
                alt={displayName}
                className="profile-popup-avatar"
                onError={handleImageError}
              />
            ) : (
              <div className="profile-popup-avatar-placeholder">
                <FiUser size={32} />
              </div>
            )}
          </div>
          <div className="profile-popup-info">
            <h3 className="profile-popup-name">{displayName}</h3>
            <p className="profile-popup-email">{displayEmail}</p>
            <span className={`profile-popup-badge profile-popup-badge-${displayRole}`}>
              {displayRole}
            </span>
          </div>
        </div>

        {/* Quick Tiles - Android Style */}
        <div className="profile-popup-tiles">
          {/* Dark Mode Tile */}
          <button
            className={`profile-popup-tile ${isDarkMode ? 'active' : ''}`}
            onClick={toggleTheme}
            title={isDarkMode ? 'Light Mode' : 'Dark Mode'}
          >
            <div className="profile-popup-tile-icon">
              {isDarkMode ? <FiSun size={22} /> : <FiMoon size={22} />}
            </div>
            <span className="profile-popup-tile-label">
              {isDarkMode ? 'Light' : 'Dark'}
            </span>
          </button>

          {/* Profile Tile */}
          <Link
            to="/profile"
            className="profile-popup-tile profile-popup-tile-wide"
            onClick={onClose}
            title="View Profile"
          >
            <div className="profile-popup-tile-icon">
              <FiUser size={22} />
            </div>
            <span className="profile-popup-tile-label">Profile</span>
          </Link>

          {/* Dashboard Tile */}
          <Link
            to="/dashboard"
            className="profile-popup-tile"
            onClick={onClose}
            title="Dashboard"
          >
            <div className="profile-popup-tile-icon">
              <FiActivity size={22} />
            </div>
            <span className="profile-popup-tile-label">Dashboard</span>
          </Link>

          {/* Leaderboard Tile */}
          <Link
            to="/leaderboard"
            className="profile-popup-tile"
            onClick={onClose}
            title="Leaderboard"
          >
            <div className="profile-popup-tile-icon">
              <FiAward size={22} />
            </div>
            <span className="profile-popup-tile-label">Leaderboard</span>
          </Link>

          {/* Challenges Tile */}
          <Link
            to="/challenges"
            className="profile-popup-tile"
            onClick={onClose}
            title="Challenges"
          >
            <div className="profile-popup-tile-icon">
              <FiTarget size={22} />
            </div>
            <span className="profile-popup-tile-label">Challenges</span>
          </Link>

          {/* Games Tile */}
          <Link
            to="/games"
            className="profile-popup-tile"
            onClick={onClose}
            title="Games"
          >
            <div className="profile-popup-tile-icon">
              <FiZap size={22} />
            </div>
            <span className="profile-popup-tile-label">Games</span>
          </Link>

          {/* Settings Tile */}
          <Link
            to="/settings"
            className="profile-popup-tile profile-popup-tile-wide"
            onClick={onClose}
            title="Settings"
          >
            <div className="profile-popup-tile-icon">
              <FiSettings size={22} />
            </div>
            <span className="profile-popup-tile-label">Settings</span>
          </Link>
        </div>

        {/* My Projects Section */}
        <div className="profile-popup-projects">
          <div className="profile-popup-projects-header">
            <h4>My Projects</h4>
            <button className="btn-add-project-small">
              <FaPlus size={14} />
            </button>
          </div>
          <div className="profile-popup-projects-list">
            {projects.map((project) => (
              <div key={project.id} className="project-card-mini">
                <div className="project-card-mini-header">
                  <h5>{project.title}</h5>
                  <span className={`project-status-mini ${project.status}`}>
                    {project.status === 'completed' ? '✓' : '⏳'}
                  </span>
                </div>
                <p className="project-card-mini-desc">{project.description}</p>
                <div className="project-tech-mini">
                  {project.technologies.slice(0, 3).map((tech, index) => (
                    <span key={index} className="tech-tag-mini">{tech}</span>
                  ))}
                </div>
                <div className="project-stats-mini">
                  <div className="stat-item-mini">
                    <FaStar size={12} />
                    <span>{project.stars}</span>
                  </div>
                  <div className="stat-item-mini">
                    <FaUsers size={12} />
                    <span>{project.collaborators}</span>
                  </div>
                  <div className="project-links-mini">
                    {project.githubUrl && (
                      <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                        <FaGithub size={14} />
                      </a>
                    )}
                    {project.liveUrl && (
                      <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                        <FaExternalLinkAlt size={12} />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="profile-popup-logout"
          title="Logout"
        >
          <FiLogOut size={18} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

ProfilePopup.propTypes = {
  isDarkMode: PropTypes.bool.isRequired,
  toggleTheme: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default ProfilePopup;
