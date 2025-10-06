// Presentation: Header Component
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { MdLightMode, MdDarkMode } from 'react-icons/md';
import { FiUser, FiShield } from 'react-icons/fi';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../contexts/ThemeContext';
import ProfilePopup from './ProfilePopup';
import './Header.css';

export function Header() {
  const { user, isAuthenticated } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [showProfilePopup, setShowProfilePopup] = useState(false);

  return (
    <>
      <header className="header">
        <div className="header-container">
          <Link to="/" className="logo">
            <h1>Jyothis Electronics Lab</h1>
          </Link>
          <nav className="nav">
            <Link to="/classes">Classes</Link>
            <Link to="/projects">Projects</Link>
            <Link to="/products">Products</Link>
            
            {/* Show Admin link only for admin users */}
            {isAuthenticated && user?.role === 'admin' && (
              <Link to="/admin" className="admin-link">
                <FiShield size={16} />
                <span>Admin</span>
              </Link>
            )}
            
            <button onClick={toggleTheme} className="theme-toggle" aria-label="Toggle theme">
              {theme === 'light' ? <MdDarkMode size={20} /> : <MdLightMode size={20} />}
            </button>
            
            {isAuthenticated ? (
              <button 
                onClick={() => setShowProfilePopup(true)} 
                className="profile-button"
                aria-label="Open profile menu"
              >
                <FiUser size={20} />
                <span>{user?.name || 'User'}</span>
              </button>
            ) : (
              <Link to="/login" className="btn-login">
                Login
              </Link>
            )}
          </nav>
        </div>
      </header>
      
      {showProfilePopup && (
        <ProfilePopup
          isDarkMode={theme === 'dark'}
          toggleTheme={toggleTheme}
          onClose={() => setShowProfilePopup(false)}
        />
      )}
    </>
  );
}

export default Header;