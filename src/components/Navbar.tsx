import { useState } from 'react';
import { Link } from 'react-router-dom';
import { MdLightMode, MdDarkMode } from 'react-icons/md';
import {
  FiUser,
  FiMenu,
  FiX,
  FiShoppingCart,
  FiBell,
  FiSearch,
  FiChevronDown,
} from 'react-icons/fi';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../contexts/ThemeContext';
import { useShop } from '../contexts/ShopContext';
import ProfilePopup from './ProfilePopup';
import './navbar.css';

export function Header() {
  const { isAuthenticated } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { cartCount } = useShop();
  const [showProfilePopup, setShowProfilePopup] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);

  return (
    <>
      <header className="github-header">
        <div className="github-header-container">
          <button className="mobile-menu-btn" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <FiX size={20} /> : <FiMenu size={20} />}
          </button>

          <Link to="/" className="github-logo">
            <span className="logo-text">ESDC</span>
          </Link>

          <nav className={`github-nav ${mobileMenuOpen ? 'mobile-open' : ''}`}>
            <Link to="/lms" onClick={() => setMobileMenuOpen(false)}>
              Courses
            </Link>
            <Link to="/projects" onClick={() => setMobileMenuOpen(false)}>
              Projects
            </Link>
            <Link to="/blog" onClick={() => setMobileMenuOpen(false)}>
              Blog
            </Link>
            <Link to="/shop" onClick={() => setMobileMenuOpen(false)}>
              Shop
            </Link>

            <div
              className="nav-dropdown"
              onMouseEnter={() => setShowMoreMenu(true)}
              onMouseLeave={() => setShowMoreMenu(false)}
            >
              <button className="nav-dropdown-btn">
                More <FiChevronDown size={14} />
              </button>
              {showMoreMenu && (
                <div className="nav-dropdown-menu">
                  <Link to="/planning" onClick={() => setMobileMenuOpen(false)}>
                    Planning
                  </Link>
                  <Link to="/mentorship" onClick={() => setMobileMenuOpen(false)}>
                    Mentorship
                  </Link>
                  <Link to="/hackathons" onClick={() => setMobileMenuOpen(false)}>
                    Hackathons
                  </Link>
                  <Link to="/workshops" onClick={() => setMobileMenuOpen(false)}>
                    Workshops
                  </Link>
                  <Link to="/forum" onClick={() => setMobileMenuOpen(false)}>
                    Forum
                  </Link>
                  <Link to="/docs" onClick={() => setMobileMenuOpen(false)}>
                    Docs
                  </Link>
                </div>
              )}
            </div>
          </nav>

          <div className="github-actions">
            <Link to="/search" className="github-icon-btn" title="Search">
              <FiSearch size={16} />
            </Link>

            <Link to="/notifications" className="github-icon-btn" title="Notifications">
              <FiBell size={16} />
            </Link>

            <Link to="/shop-cart" className="github-icon-btn" title="Cart">
              <FiShoppingCart size={16} />
              {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
            </Link>

            <button onClick={toggleTheme} className="github-icon-btn" title="Toggle theme">
              {theme === 'light' ? <MdDarkMode size={16} /> : <MdLightMode size={16} />}
            </button>

            {isAuthenticated ? (
              <button onClick={() => setShowProfilePopup(true)} className="github-profile-btn">
                <FiUser size={16} />
              </button>
            ) : (
              <Link to="/login" className="github-login-btn">
                Sign in
              </Link>
            )}
          </div>
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
