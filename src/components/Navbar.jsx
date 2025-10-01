import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiSun, FiMoon, FiMenu, FiX } from 'react-icons/fi';

const Navbar = ({ isDarkMode, toggleTheme }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const headerHeight = document.querySelector('.navbar').offsetHeight;
      const targetPosition = element.offsetTop - headerHeight;
      
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    }
    setIsMenuOpen(false);
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setIsMenuOpen(false);
      }
    };

    // Check authentication status
    const checkAuth = () => {
      const token = localStorage.getItem('github_token');
      const userData = localStorage.getItem('github_user');
      setIsLoggedIn(token && userData);
    };

    checkAuth();
    window.addEventListener('resize', handleResize);
    window.addEventListener('storage', checkAuth);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('storage', checkAuth);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('github_token');
    localStorage.removeItem('github_user');
    sessionStorage.removeItem('oauth_state');
    setIsLoggedIn(false);
    window.location.href = '/';
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <div className="nav-logo">
          <h2>ESDC</h2>
        </div>
        <ul className={`nav-menu ${isMenuOpen ? 'active' : ''}`}>
          <li><a href="#home" className="nav-link" onClick={() => scrollToSection('home')}>Home</a></li>
          <li><a href="#about" className="nav-link" onClick={() => scrollToSection('about')}>About</a></li>
          <li><a href="#projects" className="nav-link" onClick={() => scrollToSection('projects')}>Projects</a></li>
          <li><a href="#team" className="nav-link" onClick={() => scrollToSection('team')}>Team</a></li>
          <li><a href="#contact" className="nav-link" onClick={() => scrollToSection('contact')}>Contact</a></li>
          {!isLoggedIn ? (
            <li><Link to="/login" className="nav-link">Login</Link></li>
          ) : (
            <>
              <li><Link to="/profile" className="nav-link">Profile</Link></li>
              <li><a href="#" className="nav-link" onClick={handleLogout}>Logout</a></li>
            </>
          )}
        </ul>
        <div className="theme-toggle">
          <button 
            className="theme-btn" 
            onClick={toggleTheme}
            aria-label="Toggle theme"
          >
            {isDarkMode ? <FiSun className="theme-icon" /> : <FiMoon className="theme-icon" />}
          </button>
        </div>
        <div 
          className={`hamburger ${isMenuOpen ? 'active' : ''}`}
          onClick={toggleMenu}
        >
          {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;