import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  FaHome,
  FaProjectDiagram,
  FaCalendarAlt,
  FaGamepad,
  FaShoppingCart,
  FaGraduationCap,
  FaTrophy,
  FaUsers,
  FaCog,
  FaGripVertical,
} from 'react-icons/fa';
import '../styles/dock-sidebar.css';

interface DockItem {
  id: string;
  icon: React.ReactNode;
  label: string;
  path: string;
}

const DockSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (!isMobile) {
      setIsVisible(true);
      return;
    }

    setIsVisible(true);
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, [isMobile]);

  const handleToggle = () => {
    setIsVisible(!isVisible);
  };

  const dockItems: DockItem[] = [
    { id: 'home', icon: <FaHome />, label: 'Home', path: '/' },
    { id: 'projects', icon: <FaProjectDiagram />, label: 'Projects', path: '/projects' },
    { id: 'events', icon: <FaCalendarAlt />, label: 'Events', path: '/events' },
    { id: 'games', icon: <FaGamepad />, label: 'Games', path: '/games' },
    { id: 'shop', icon: <FaShoppingCart />, label: 'Shop', path: '/shop' },
    { id: 'lms', icon: <FaGraduationCap />, label: 'LMS', path: '/lms' },
    { id: 'leaderboard', icon: <FaTrophy />, label: 'Leaderboard', path: '/leaderboard' },
    { id: 'users', icon: <FaUsers />, label: 'Users', path: '/users' },
    { id: 'settings', icon: <FaCog />, label: 'Settings', path: '/settings' },
  ];

  const handleItemClick = (path: string) => {
    navigate(path);
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      {!isVisible && isMobile && (
        <button className="dock-toggle-btn" onClick={handleToggle} aria-label="Toggle Dock">
          <FaGripVertical />
        </button>
      )}

      <div className={`dock-sidebar ${isVisible ? 'visible' : 'hidden'}`}>
        <div className="dock-container">
          {dockItems.map((item) => (
            <div
              key={item.id}
              className={`dock-item ${isActive(item.path) ? 'active' : ''} ${hoveredItem === item.id ? 'hovered' : ''}`}
              onClick={() => handleItemClick(item.path)}
              onMouseEnter={() => setHoveredItem(item.id)}
              onMouseLeave={() => setHoveredItem(null)}
            >
              <div className="dock-icon">{item.icon}</div>
              <span className="dock-tooltip">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default DockSidebar;
