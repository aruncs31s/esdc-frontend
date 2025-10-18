import { useNavigate } from 'react-router-dom';
import {
  FiGrid,
  FiEdit3,
  FiUsers,
  FiAward,
  FiBook,
  FiBriefcase,
  FiMessageSquare,
  FiFileText,
  FiGitPullRequest,
  FiBarChart2,
  FiSettings,
  FiMap,
  FiCalendar,
  FiTarget,
  FiShoppingCart,
  FiLayers,
  FiTrendingUp,
  FiZap,
  FiGlobe,
  FiCode,
} from 'react-icons/fi';
import '../styles/features.css';

const Features = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: FiGrid,
      title: 'Project Planning',
      description: 'GitHub-style kanban boards & task management',
      path: '/planning',
      color: '#89b4fa',
    },
    {
      icon: FiEdit3,
      title: 'Blog',
      description: 'Share insights and tutorials',
      path: '/blog',
      color: '#f38ba8',
    },
    {
      icon: FiUsers,
      title: 'Mentorship',
      description: 'Connect with experienced mentors',
      path: '/mentorship',
      color: '#a6e3a1',
    },
    {
      icon: FiAward,
      title: 'Hackathons',
      description: 'Participate in coding competitions',
      path: '/hackathons',
      color: '#f9e2af',
    },
    {
      icon: FiBook,
      title: 'Workshops',
      description: 'Hands-on training sessions',
      path: '/workshops',
      color: '#89dceb',
    },
    {
      icon: FiTarget,
      title: 'Certifications',
      description: 'Earn industry certificates',
      path: '/certifications',
      color: '#cba6f7',
    },
    {
      icon: FiBriefcase,
      title: 'Job Board',
      description: 'Find opportunities in IoT & embedded',
      path: '/jobs',
      color: '#fab387',
    },
    {
      icon: FiMessageSquare,
      title: 'Forum',
      description: 'Community discussions & Q&A',
      path: '/forum',
      color: '#94e2d5',
    },
    {
      icon: FiFileText,
      title: 'Documentation',
      description: 'Comprehensive guides & tutorials',
      path: '/docs',
      color: '#b4befe',
    },
    {
      icon: FiGitPullRequest,
      title: 'Code Review',
      description: 'Review and approve pull requests',
      path: '/code-review',
      color: '#eba0ac',
    },
    {
      icon: FiBarChart2,
      title: 'Analytics',
      description: 'Track progress and metrics',
      path: '/analytics',
      color: '#a6e3a1',
    },
    {
      icon: FiUsers,
      title: 'Teams',
      description: 'Manage teams and collaboration',
      path: '/teams',
      color: '#89b4fa',
    },
    {
      icon: FiSettings,
      title: 'Integrations',
      description: 'Connect with GitHub, Slack & more',
      path: '/integrations',
      color: '#f38ba8',
    },
    {
      icon: FiMap,
      title: 'Roadmap',
      description: 'Product timeline and features',
      path: '/roadmap',
      color: '#f9e2af',
    },
    {
      icon: FiCalendar,
      title: 'Events',
      description: 'Upcoming events and meetups',
      path: '/events',
      color: '#89dceb',
    },
    {
      icon: FiLayers,
      title: 'Resources',
      description: 'Downloadable learning materials',
      path: '/resources',
      color: '#cba6f7',
    },
    {
      icon: FiShoppingCart,
      title: 'Shop',
      description: 'Electronics components & kits',
      path: '/shop',
      color: '#fab387',
    },
    {
      icon: FiTrendingUp,
      title: 'Leaderboard',
      description: 'Rankings and achievements',
      path: '/leaderboard',
      color: '#94e2d5',
    },
    {
      icon: FiZap,
      title: 'Games',
      description: 'Fun coding challenges',
      path: '/games',
      color: '#b4befe',
    },
    {
      icon: FiGlobe,
      title: 'Community',
      description: 'Connect with members worldwide',
      path: '/users',
      color: '#eba0ac',
    },
    {
      icon: FiCode,
      title: 'Projects',
      description: 'Showcase your work',
      path: '/projects',
      color: '#a6e3a1',
    },
  ];

  return (
    <section className="features-section">
      <div className="container">
        <div className="section-header">
          <h2>Explore Our Platform</h2>
          <p>Everything you need to learn, build, and grow in embedded systems</p>
        </div>

        <div className="features-grid">
          {features.map((feature, index) => (
            <div
              key={index}
              className="feature-card"
              onClick={() => navigate(feature.path)}
              style={{ '--feature-color': feature.color } as React.CSSProperties}
            >
              <div className="feature-icon">
                <feature.icon size={28} />
              </div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
