import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  FiSun,
  FiMoon,
  FiUser,
  FiLogOut,
  FiSettings,
  FiActivity,
  FiAward,
  FiTarget,
  FiZap,
  FiFolder,
  FiShoppingBag,
  FiGlobe,
  FiBell,
} from 'react-icons/fi';
import { useAuth } from '../hooks/useAuth';
import './ProfilePopup.css';

/**
 * ProfilePopup Component
 * Android-style quick settings popup with profile info and quick tiles
 */
interface ProfilePopupProps {
  isDarkMode: boolean;
  toggleTheme: () => void;
  onClose: () => void;
}

const ProfilePopup = ({ isDarkMode, toggleTheme, onClose }: ProfilePopupProps) => {
  const { user, logout } = useAuth();
  const [imageError, setImageError] = useState(false);
  const popupRef = useRef<HTMLDivElement>(null);

  // Close popup when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
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
                <FiUser size={28} />
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
              {isDarkMode ? <FiSun size={20} /> : <FiMoon size={20} />}
            </div>
            <span className="profile-popup-tile-label">{isDarkMode ? 'Light' : 'Dark'}</span>
          </button>

          {/* Profile Tile */}
          <Link
            to="/profile"
            className="profile-popup-tile profile-popup-tile-wide"
            onClick={onClose}
            title="View Profile"
          >
            <div className="profile-popup-tile-icon">
              <FiUser size={20} />
            </div>
            <span className="profile-popup-tile-label">Profile</span>
          </Link>

          {/* Dashboard Tile */}
          <Link to="/dashboard" className="profile-popup-tile" onClick={onClose} title="Dashboard">
            <div className="profile-popup-tile-icon">
              <FiActivity size={20} />
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
              <FiAward size={20} />
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
              <FiTarget size={20} />
            </div>
            <span className="profile-popup-tile-label">Challenges</span>
          </Link>

          {/* Games Tile */}
          <Link to="/games" className="profile-popup-tile" onClick={onClose} title="Games">
            <div className="profile-popup-tile-icon">
              <FiZap size={20} />
            </div>
            <span className="profile-popup-tile-label">Games</span>
          </Link>

          {/* Notifications Tile */}
          <Link
            to="/notifications"
            className="profile-popup-tile"
            onClick={onClose}
            title="Notifications"
          >
            <div className="profile-popup-tile-icon">
              <FiBell size={20} />
            </div>
            <span className="profile-popup-tile-label">Notifications</span>
          </Link>

          {/* Settings Tile */}
          <Link to="/settings" className="profile-popup-tile" onClick={onClose} title="Settings">
            <div className="profile-popup-tile-icon">
              <FiSettings size={20} />
            </div>
            <span className="profile-popup-tile-label">Settings</span>
          </Link>
        </div>

        {/* Quick Links Section */}
        <div className="profile-popup-projects">
          <div className="profile-popup-projects-header">
            <h4>Quick Links</h4>
          </div>
          <div className="profile-popup-quick-links">
            <Link to="/my-projects" className="quick-link-item" onClick={onClose}>
              <div className="quick-link-icon">
                <FiFolder size={24} />
              </div>
              <div className="quick-link-text">
                <h5>My Projects</h5>
                <p>View and manage your projects</p>
              </div>
            </Link>
            <Link to="/my-products" className="quick-link-item" onClick={onClose}>
              <div className="quick-link-icon">
                <FiShoppingBag size={24} />
              </div>
              <div className="quick-link-text">
                <h5>My Products</h5>
                <p>Manage your products and sales</p>
              </div>
            </Link>
            <Link to="/community-projects" className="quick-link-item" onClick={onClose}>
              <div className="quick-link-icon">
                <FiGlobe size={24} />
              </div>
              <div className="quick-link-text">
                <h5>Community Projects</h5>
                <p>Explore community projects</p>
              </div>
            </Link>
          </div>
        </div>

        {/* Logout Button */}
        <button onClick={handleLogout} className="profile-popup-logout" title="Logout">
          <FiLogOut size={18} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default ProfilePopup;
