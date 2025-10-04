import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FiMenu, FiX, FiUser, FiChevronDown } from 'react-icons/fi';
import { useAuth } from '../hooks/useAuth';
import ProfilePopup from './ProfilePopup';

const Navbar = ({ isDarkMode, toggleTheme }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showProfilePopup, setShowProfilePopup] = useState(false);
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Home' },
    { path: '#projects', label: 'Projects' },
    { path: '#team', label: 'Team' },
    { path: '#about', label: 'About' },
    { path: '/events', label: 'Events' },
    { path: '/resources', label: 'Resources' },
    { path: '/users', label: 'Users' },
  ];

  useEffect(() => {
    const handleResize = () => window.innerWidth > 768 && setIsMenuOpen(false);
    const handleScroll = () => setScrolled(window.scrollY > 20);

    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => setIsMenuOpen(false), [location]);

  const closeMenu = () => setIsMenuOpen(false);
  const isActive = (path) => location.pathname === path;

  const handleHashClick = (hash) => {
    navigate('/');
    setTimeout(() => (window.location.hash = hash), 100);
    closeMenu();
  };

  const renderNavLink = ({ path, label }) => {
    const isHash = path.startsWith('#');
    return (
      <li key={path}>
        {isHash ? (
          <a href={path} className="nav-link" onClick={() => handleHashClick(path.substring(1))}>
            {label}
          </a>
        ) : (
          <Link to={path} className={`nav-link ${isActive(path) ? 'active' : ''}`} onClick={closeMenu}>
            {label}
          </Link>
        )}
      </li>
    );
  };

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="nav-container">
        <Link to="/" className="nav-logo" onClick={closeMenu}>
          <div className="logo-icon">E</div>
          <span className="logo-text">ESDC</span>
        </Link>

        <ul className={`nav-menu ${isMenuOpen ? 'active' : ''}`}>
          {navItems.map(renderNavLink)}
          {isAuthenticated && user?.role === 'admin' && (
            <li>
              <Link to="/admin" className={`nav-link nav-link-admin ${isActive('/admin') ? 'active' : ''}`} onClick={closeMenu}>
                Admin Panel
              </Link>
            </li>
          )}
          <li>
            <a href="#contact" className="nav-link" onClick={() => handleHashClick('contact')}>
              Contact
            </a>
          </li>
        </ul>

        <div className="nav-controls">
          <div className="nav-auth">
            {!isAuthenticated ? (
              <Link to="/login" className="btn-login" onClick={closeMenu}>
                Login
              </Link>
            ) : (
              <button onClick={() => setShowProfilePopup(!showProfilePopup)} className="btn-profile-trigger" title="Open profile menu">
                <div className="profile-avatar-small">
                  {user?.avatar_url || user?.avatarUrl || user?.avatar ? (
                    <img src={user.avatar_url || user.avatarUrl || user.avatar} alt={user.name || 'Profile'} />
                  ) : (
                    <FiUser />
                  )}
                </div>
                <span className="profile-name">{user?.name || 'Profile'}</span>
                <FiChevronDown className={`profile-chevron ${showProfilePopup ? 'open' : ''}`} />
              </button>
            )}
          </div>

          <button className={`hamburger ${isMenuOpen ? 'active' : ''}`} onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Toggle menu" aria-expanded={isMenuOpen}>
            {isMenuOpen ? <FiX className="hamburger-icon" /> : <FiMenu className="hamburger-icon" />}
          </button>
        </div>
      </div>

      {isAuthenticated && showProfilePopup && (
        <ProfilePopup isDarkMode={isDarkMode} toggleTheme={toggleTheme} onClose={() => setShowProfilePopup(false)} />
      )}
    </nav>
  );
};

export default Navbar;