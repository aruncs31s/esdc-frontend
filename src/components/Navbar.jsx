import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FiMenu, FiX, FiUser, FiChevronDown } from 'react-icons/fi';
import { useAuth } from '../hooks/useAuth';
import ProfilePopup from './ProfilePopup';

const Navbar = ({ isDarkMode, toggleTheme }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showProfilePopup, setShowProfilePopup] = useState(false);
  const { isAuthenticated, user} = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setIsMenuOpen(false);
      }
    };

    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Close menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  const toggleProfilePopup = () => {
    setShowProfilePopup(!showProfilePopup);
  };

  const closeProfilePopup = () => {
    setShowProfilePopup(false);
  };

  const isActivePath = (path) => {
    return location.pathname === path;
  };

  const navItems = [
    { path: '/', label: 'Home', type: 'link' },
    { path: '#about', label: 'About', type: 'hash' },
    { path: '#projects', label: 'Projects', type: 'hash' },
    { path: '#team', label: 'Team', type: 'hash' },
    { path: '/events', label: 'Events', type: 'link' },
    { path: '/challenges', label: 'Challenges', type: 'link' },
    { path: '/resources', label: 'Resources', type: 'link' },
    { path: '/users', label: 'Users', type: 'link' },
  ];

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="nav-container">
        <Link to="/" className="nav-logo" onClick={() => setIsMenuOpen(false)}>
          <div className="logo-icon">E</div>
          <span className="logo-text">ESDC</span>
        </Link>

        {/* Desktop Menu */}
        <ul className={`nav-menu ${isMenuOpen ? 'active' : ''}`}>
          {navItems.map((item) => (
            <li key={item.path}>
              {item.type === 'link' ? (
                <Link
                  to={item.path}
                  className={`nav-link ${isActivePath(item.path) ? 'active' : ''}`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ) : (
                <a
                  href={item.path}
                  className="nav-link"
                  onClick={() => {
                    navigate('/');
                    setTimeout(() => (window.location.hash = item.path.substring(1)), 100);
                    setIsMenuOpen(false);
                  }}
                >
                  {item.label}
                </a>
              )}
            </li>
          ))}
          {isAuthenticated && (
            <>
              <li>
                <Link
                  to="/dashboard"
                  className={`nav-link ${isActivePath('/dashboard') ? 'active' : ''}`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Dashboard
                </Link>
              </li>
              <li>
                <Link
                  to="/leaderboard"
                  className={`nav-link ${isActivePath('/leaderboard') ? 'active' : ''}`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Leaderboard
                </Link>
              </li>
              {user?.role === 'admin' && (
                <li>
                  <Link
                    to="/admin"
                    className={`nav-link nav-link-admin ${isActivePath('/admin') ? 'active' : ''}`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Admin Panel
                  </Link>
                </li>
              )}
            </>
          )}
          <li>
            <a
              href="#contact"
              className="nav-link"
              onClick={() => {
                navigate('/');
                setTimeout(() => (window.location.hash = 'contact'), 100);
                setIsMenuOpen(false);
              }}
            >
              Contact
            </a>
          </li>
        </ul>

        {/* Right side controls */}
        <div className="nav-controls">
          {/* Auth Buttons */}
          <div className="nav-auth">
            {!isAuthenticated ? (
              <Link to="/login" className="btn-login" onClick={() => setIsMenuOpen(false)}>
                Login
              </Link>
            ) : (
              <button
                onClick={toggleProfilePopup}
                className="btn-profile-trigger"
                title="Open profile menu"
              >
                <div className="profile-avatar-small">
                  {user?.avatar_url || user?.avatarUrl || user?.avatar ? (
                    <img 
                      src={user.avatar_url || user.avatarUrl || user.avatar} 
                      alt={user.name || 'Profile'} 
                    />
                  ) : (
                    <FiUser />
                  )}
                </div>
                <span className="profile-name">{user?.name || 'Profile'}</span>
                <FiChevronDown className={`profile-chevron ${showProfilePopup ? 'open' : ''}`} />
              </button>
            )}
          </div>

          {/* Hamburger Menu */}
          <button
            className={`hamburger ${isMenuOpen ? 'active' : ''}`}
            onClick={toggleMenu}
            aria-label="Toggle menu"
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? <FiX className="hamburger-icon" /> : <FiMenu className="hamburger-icon" />}
          </button>
        </div>
      </div>

      {/* Profile Popup */}
      {isAuthenticated && showProfilePopup && (
        <ProfilePopup
          isDarkMode={isDarkMode}
          toggleTheme={toggleTheme}
          onClose={closeProfilePopup}
        />
      )}
    </nav>
  );
};

export default Navbar;