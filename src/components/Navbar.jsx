import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiSun, FiMoon, FiMenu, FiX } from 'react-icons/fi';
import { useAuth } from '../contexts/AuthContext';

const Navbar = ({ isDarkMode, toggleTheme }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated, logout } = useAuth();
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
    <nav className="fixed top-0 left-0 right-0 bg-[#eff1f5]/95 dark:bg-[#1e1e2e]/95 backdrop-blur-md border-b border-[#ccd0da] dark:border-[#313244] z-[1000] py-4 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-5 flex justify-between items-center">
        <div className="nav-logo">
          <h2 className="text-[#1e66f5] dark:text-[#89b4fa] font-bold text-2xl">ESDC</h2>
        </div>
        
        {/* Desktop Menu */}
        <ul className={`fixed md:static left-0 top-[70px] md:top-0 w-full md:w-auto flex-col md:flex-row bg-[#eff1f5] dark:bg-[#1e1e2e] md:bg-transparent text-center md:text-left transition-all duration-300 shadow-lg md:shadow-none border-t md:border-t-0 border-[#ccd0da] dark:border-[#313244] py-8 md:py-0 flex gap-8 list-none ${isMenuOpen ? 'left-0' : '-left-full'}`}>
          <li>
            <Link 
              to="/" 
              className="relative text-[#4c4f69] dark:text-[#cdd6f4] font-medium transition-colors duration-300 hover:text-[#1e66f5] dark:hover:text-[#89b4fa] group" 
              onClick={() => setIsMenuOpen(false)}
            >
              Home
              <span className="absolute left-0 bottom-[-5px] w-0 h-0.5 bg-[#1e66f5] dark:bg-[#89b4fa] transition-all duration-300 group-hover:w-full"></span>
            </Link>
          </li>
          <li>
            <a 
              href="#about" 
              className="relative text-[#4c4f69] dark:text-[#cdd6f4] font-medium transition-colors duration-300 hover:text-[#1e66f5] dark:hover:text-[#89b4fa] group" 
              onClick={() => { navigate('/'); setTimeout(() => window.location.hash = 'about', 100); setIsMenuOpen(false); }}
            >
              About
              <span className="absolute left-0 bottom-[-5px] w-0 h-0.5 bg-[#1e66f5] dark:bg-[#89b4fa] transition-all duration-300 group-hover:w-full"></span>
            </a>
          </li>
          <li>
            <a 
              href="#projects" 
              className="relative text-[#4c4f69] dark:text-[#cdd6f4] font-medium transition-colors duration-300 hover:text-[#1e66f5] dark:hover:text-[#89b4fa] group" 
              onClick={() => { navigate('/'); setTimeout(() => window.location.hash = 'projects', 100); setIsMenuOpen(false); }}
            >
              Projects
              <span className="absolute left-0 bottom-[-5px] w-0 h-0.5 bg-[#1e66f5] dark:bg-[#89b4fa] transition-all duration-300 group-hover:w-full"></span>
            </a>
          </li>
          <li>
            <a 
              href="#team" 
              className="relative text-[#4c4f69] dark:text-[#cdd6f4] font-medium transition-colors duration-300 hover:text-[#1e66f5] dark:hover:text-[#89b4fa] group" 
              onClick={() => { navigate('/'); setTimeout(() => window.location.hash = 'team', 100); setIsMenuOpen(false); }}
            >
              Team
              <span className="absolute left-0 bottom-[-5px] w-0 h-0.5 bg-[#1e66f5] dark:bg-[#89b4fa] transition-all duration-300 group-hover:w-full"></span>
            </a>
          </li>
          <li>
            <Link 
              to="/events" 
              className="relative text-[#4c4f69] dark:text-[#cdd6f4] font-medium transition-colors duration-300 hover:text-[#1e66f5] dark:hover:text-[#89b4fa] group" 
              onClick={() => setIsMenuOpen(false)}
            >
              Events
              <span className="absolute left-0 bottom-[-5px] w-0 h-0.5 bg-[#1e66f5] dark:bg-[#89b4fa] transition-all duration-300 group-hover:w-full"></span>
            </Link>
          </li>
          <li>
            <Link 
              to="/challenges" 
              className="relative text-[#4c4f69] dark:text-[#cdd6f4] font-medium transition-colors duration-300 hover:text-[#1e66f5] dark:hover:text-[#89b4fa] group" 
              onClick={() => setIsMenuOpen(false)}
            >
              Challenges
              <span className="absolute left-0 bottom-[-5px] w-0 h-0.5 bg-[#1e66f5] dark:bg-[#89b4fa] transition-all duration-300 group-hover:w-full"></span>
            </Link>
          </li>
          <li>
            <Link 
              to="/resources" 
              className="relative text-[#4c4f69] dark:text-[#cdd6f4] font-medium transition-colors duration-300 hover:text-[#1e66f5] dark:hover:text-[#89b4fa] group" 
              onClick={() => setIsMenuOpen(false)}
            >
              Resources
              <span className="absolute left-0 bottom-[-5px] w-0 h-0.5 bg-[#1e66f5] dark:bg-[#89b4fa] transition-all duration-300 group-hover:w-full"></span>
            </Link>
          </li>
          {isAuthenticated && (
            <>
              <li>
                <Link 
                  to="/dashboard" 
                  className="relative text-[#4c4f69] dark:text-[#cdd6f4] font-medium transition-colors duration-300 hover:text-[#1e66f5] dark:hover:text-[#89b4fa] group" 
                  onClick={() => setIsMenuOpen(false)}
                >
                  Dashboard
                  <span className="absolute left-0 bottom-[-5px] w-0 h-0.5 bg-[#1e66f5] dark:bg-[#89b4fa] transition-all duration-300 group-hover:w-full"></span>
                </Link>
              </li>
              <li>
                <Link 
                  to="/leaderboard" 
                  className="relative text-[#4c4f69] dark:text-[#cdd6f4] font-medium transition-colors duration-300 hover:text-[#1e66f5] dark:hover:text-[#89b4fa] group" 
                  onClick={() => setIsMenuOpen(false)}
                >
                  Leaderboard
                  <span className="absolute left-0 bottom-[-5px] w-0 h-0.5 bg-[#1e66f5] dark:bg-[#89b4fa] transition-all duration-300 group-hover:w-full"></span>
                </Link>
              </li>
            </>
          )}
          <li>
            <a 
              href="#contact" 
              className="relative text-[#4c4f69] dark:text-[#cdd6f4] font-medium transition-colors duration-300 hover:text-[#1e66f5] dark:hover:text-[#89b4fa] group" 
              onClick={() => { navigate('/'); setTimeout(() => window.location.hash = 'contact', 100); setIsMenuOpen(false); }}
            >
              Contact
              <span className="absolute left-0 bottom-[-5px] w-0 h-0.5 bg-[#1e66f5] dark:bg-[#89b4fa] transition-all duration-300 group-hover:w-full"></span>
            </a>
          </li>
          
          {/* Auth Links */}
          <li className="md:ml-4">
            {!isAuthenticated ? (
              <Link 
                to="/login" 
                className="relative text-[#4c4f69] dark:text-[#cdd6f4] font-medium transition-colors duration-300 hover:text-[#1e66f5] dark:hover:text-[#89b4fa] group"
              >
                Login
                <span className="absolute left-0 bottom-[-5px] w-0 h-0.5 bg-[#1e66f5] dark:bg-[#89b4fa] transition-all duration-300 group-hover:w-full"></span>
              </Link>
            ) : (
              <>
                <Link 
                  to="/profile" 
                  className="relative text-[#4c4f69] dark:text-[#cdd6f4] font-medium transition-colors duration-300 hover:text-[#1e66f5] dark:hover:text-[#89b4fa] group mr-6"
                >
                  Profile
                  <span className="absolute left-0 bottom-[-5px] w-0 h-0.5 bg-[#1e66f5] dark:bg-[#89b4fa] transition-all duration-300 group-hover:w-full"></span>
                </Link>
                <a 
                  href="#" 
                  className="relative text-[#4c4f69] dark:text-[#cdd6f4] font-medium transition-colors duration-300 hover:text-[#1e66f5] dark:hover:text-[#89b4fa] group" 
                  onClick={handleLogout}
                >
                  Logout
                  <span className="absolute left-0 bottom-[-5px] w-0 h-0.5 bg-[#1e66f5] dark:bg-[#89b4fa] transition-all duration-300 group-hover:w-full"></span>
                </a>
              </>
            )}
          </li>
          
          {/* Theme Toggle */}
          <li className="md:ml-0">
            <button 
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="p-2 rounded-full transition-colors duration-300 hover:bg-[#ccd0da] dark:hover:bg-[#313244] flex items-center justify-center text-[#4c4f69] dark:text-[#cdd6f4]"
            >
              {isDarkMode ? <FiSun className="text-xl transition-transform duration-300" /> : <FiMoon className="text-xl transition-transform duration-300" />}
            </button>
          </li>
        </ul>
       
        {/* Hamburger Menu */}
        <button 
          className="md:hidden flex flex-col cursor-pointer z-[1001] text-[#4c4f69] dark:text-[#cdd6f4]"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;