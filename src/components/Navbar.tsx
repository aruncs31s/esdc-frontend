import { useState } from 'react';
import { Link } from 'react-router-dom';
import { MdLightMode, MdDarkMode } from 'react-icons/md';
import { FiUser, FiShield, FiMenu, FiX, FiShoppingCart, FiMessageSquare, FiBell, FiSearch } from 'react-icons/fi';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../contexts/ThemeContext';
import { useShop } from '../contexts/ShopContext';
import { useSettings } from '../contexts/SettingsContext';
import ProfilePopup from './ProfilePopup';
import Chatroom from './Chatroom';
import './navbar.css';

export function Header() {
  const { user, isAuthenticated } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { cartCount } = useShop();
  const { isFeatureEnabled } = useSettings();
  const [showProfilePopup, setShowProfilePopup] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showChatroom, setShowChatroom] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <>
      <header className="header">
        <div className="header-container">
          <div className="hamburger" onClick={toggleMobileMenu}>
            {mobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </div>

          <nav className={mobileMenuOpen ? 'nav-menu active' : 'nav-menu'}>
            {isFeatureEnabled('lms') && (
              <Link to="/lms" onClick={() => setMobileMenuOpen(false)}>Courses</Link>
            )}
            {isFeatureEnabled('projects') && (
              <Link to="/projects" onClick={() => setMobileMenuOpen(false)}>Projects</Link>
            )}
            {isFeatureEnabled('blog') && (
              <Link to="/blog" onClick={() => setMobileMenuOpen(false)}>Blog</Link>
            )}
            {isFeatureEnabled('shop') && (
              <Link to="/shop" onClick={() => setMobileMenuOpen(false)}>Shop</Link>
            )}
            <Link to="/search" onClick={() => setMobileMenuOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <FiSearch size={20} />
              <span>Search</span>
            </Link>

            {isFeatureEnabled('chatroom') && (
              <button
                onClick={() => {
                  setShowChatroom(true);
                  setMobileMenuOpen(false);
                }}
                className="chat-button"
                aria-label="Open chatroom"
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
              >
                <FiMessageSquare size={20} />
                <span>Chat</span>
              </button>
            )}

            {isFeatureEnabled('notifications') && (
              <Link to="/notifications" onClick={() => setMobileMenuOpen(false)} style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <FiBell size={20} />
              </Link>
            )}

            {isFeatureEnabled('shop') && (
              <Link to="/shop-cart" onClick={() => setMobileMenuOpen(false)} style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <FiShoppingCart size={20} />
                {cartCount > 0 && (
                  <span style={{
                    position: 'absolute',
                    top: '-8px',
                    right: '-8px',
                    background: 'var(--red)',
                    color: 'white',
                    borderRadius: '50%',
                    width: '20px',
                    height: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.75rem',
                    fontWeight: '700'
                  }}>
                    {cartCount}
                  </span>
                )}
              </Link>
            )}

            {isAuthenticated && user?.role === 'admin' && (
              <Link to="/admin" className="admin-link" onClick={() => setMobileMenuOpen(false)}>
                <FiShield size={16} />
                <span>Admin</span>
              </Link>
            )}

            <button onClick={toggleTheme} className="theme-toggle" aria-label="Toggle theme">
              {theme === 'light' ? <MdDarkMode size={20} /> : <MdLightMode size={20} />}
            </button>
          </nav>

          <div className={`header-actions ${mobileMenuOpen ? 'hidden' : ''}`}>
            {isAuthenticated ? (
              <button
                onClick={() => {
                  setShowProfilePopup(true);
                  setMobileMenuOpen(false);
                }}
                className="profile-button"
                aria-label="Open profile menu"
              >
                <FiUser size={20} />
                <span className="desktop-only">{user?.name || 'User'}</span>
              </button>
            ) : (
              <Link to="/login" className="btn-login">
                Login
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

      {showChatroom && isFeatureEnabled('chatroom') && (
        <Chatroom onClose={() => setShowChatroom(false)} />
      )}
    </>
  );
}

export default Header;