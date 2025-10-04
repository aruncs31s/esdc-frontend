import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiSun, FiMoon, FiMenu, FiX } from 'react-icons/fi';
import { useAuth } from '../contexts/AuthContext';

const Navbar = ({ isDarkMode, toggleTheme }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handleLogout = async () => {
    await logout();
    window.location.href = '/';
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <div className="nav-logo">
          <h2>ESDC</h2>
        </div>
        
        {/* Desktop Menu */}
        <ul className={`nav-menu ${isMenuOpen ? 'active' : ''}`}>
          <li>
            <Link 
              to="/" 
              className="nav-link"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
          </li>
          <li>
            <a 
              href="#about" 
              className="nav-link"
              onClick={() => { navigate('/'); setTimeout(() => window.location.hash = 'about', 100); setIsMenuOpen(false); }}
            >
              About
            </a>
          </li>
          <li>
            <a 
              href="#projects" 
              className="nav-link"
              onClick={() => { navigate('/'); setTimeout(() => window.location.hash = 'projects', 100); setIsMenuOpen(false); }}
            >
              Projects
            </a>
          </li>
          <li>
            <a 
              href="#team" 
              className="nav-link"
              onClick={() => { navigate('/'); setTimeout(() => window.location.hash = 'team', 100); setIsMenuOpen(false); }}
            >
              Team
            </a>
          </li>
          <li>
            <Link 
              to="/events" 
              className="nav-link"
              onClick={() => setIsMenuOpen(false)}
            >
              Events
            </Link>
          </li>
          <li>
            <Link 
              to="/challenges" 
              className="nav-link"
              onClick={() => setIsMenuOpen(false)}
            >
              Challenges
            </Link>
          </li>
          <li>
            <Link 
              to="/resources" 
              className="nav-link"
              onClick={() => setIsMenuOpen(false)}
            >
              Resources
            </Link>
          </li>
          {isAuthenticated && (
            <>
              <li>
                <Link 
                  to="/dashboard" 
                  className="nav-link"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Dashboard
                </Link>
              </li>
              <li>
                <Link 
                  to="/leaderboard" 
                  className="nav-link"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Leaderboard
                </Link>
              </li>
              {user?.role === 'admin' && (
                <li>
                  <Link 
                    to="/admin" 
                    className="nav-link"
                    onClick={() => setIsMenuOpen(false)}
                    style={{ color: 'var(--red)', fontWeight: '700' }}
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
              onClick={() => { navigate('/'); setTimeout(() => window.location.hash = 'contact', 100); setIsMenuOpen(false); }}
            >
              Contact
            </a>
          </li>
          
          {/* Auth Links */}
          <li>
            {!isAuthenticated ? (
              <Link 
                to="/login" 
                className="nav-link"
              >
                Login
              </Link>
            ) : (
              <>
                <Link 
                  to="/profile" 
                  className="nav-link"
                >
                  Profile
                </Link>
                <a 
                  href="#" 
                  className="nav-link"
                  onClick={handleLogout}
                >
                  Logout
                </a>
              </>
            )}
          </li>
        </ul>
       
        <div className="theme-toggle">
          <button 
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="theme-btn"
          >
            {isDarkMode ? <FiSun className="theme-icon" /> : <FiMoon className="theme-icon" />}
          </button>
        </div>

        {/* Hamburger Menu */}
        <div 
          className={`hamburger ${isMenuOpen ? 'active' : ''}`}
          onClick={toggleMenu}
        >
          <span className="bar"></span>
          <span className="bar"></span>
          <span className="bar"></span>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;