import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FaGithub,
  FaEnvelope,
  FaMapPin,
  FaBriefcase,
  FaLink,
  FaCalendar,
  FaTimes,
  FaProjectDiagram,
  FaCalendarAlt,
  FaShoppingCart,
  FaGraduationCap,
  FaTrophy,
  FaHeart,
  FaChartLine,
  FaFire,
  FaCode,
  FaAward,
  FaExternalLinkAlt,
  FaEye,
  FaClock,
  FaCheckCircle,
} from 'react-icons/fa';
import { UserData } from '@/types/user';
import { UserProfileComplete } from '@/types/userProfile';
import { applicationService } from '@/application';
import '../../styles/UserProfileModal.css';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  initialUserData?: UserData; // Optional: Use if you already have basic user data
}

/**
 * Full User Profile Modal
 * Displays complete user history including projects, events, products, courses, etc.
 */
const UserProfileModal = ({ isOpen, onClose, userId, initialUserData }: UserProfileModalProps) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfileComplete | null>(null);
  const [activeTab, setActiveTab] = useState<
    'overview' | 'projects' | 'events' | 'products' | 'courses' | 'achievements'
  >('overview');

  // Navigation handlers
  const handleProjectClick = (projectId: number) => {
    navigate(`/projects/${projectId}`);
    onClose();
  };

  const handleEventClick = (eventId: number) => {
    navigate(`/events/${eventId}`);
    onClose();
  };

  const handleProductClick = (productId: number) => {
    navigate(`/shop/product/${productId}`);
    onClose();
  };

  const handleCourseClick = (courseId: number) => {
    navigate(`/courses/${courseId}`);
    onClose();
  };

  const loadUserProfile = async () => {
    setLoading(true);
    setError(null);
    try {
      // Try to fetch complete profile from API
      // For now, we'll use mock data if API is not ready
      const user = await applicationService.getUserById(userId);

      // TODO: Replace with actual API call when backend is ready
      // const response = await applicationService.getUserProfile(userId);

      // Mock complete profile data for demonstration
      const mockProfile: UserProfileComplete = {
        ...user,
        ...initialUserData,
        stats: {
          total_projects: 3,
          completed_projects: 2,
          total_events_attended: 4,
          total_products: 2,
          total_courses_completed: 3,
          total_challenges_completed: 15,
          total_achievements: 8,
          total_likes_given: 45,
          total_likes_received: 89,
          total_points: 1250,
          rank: 12,
          streak_days: 7,
        },
        // Mock projects data
        projects: [
          {
            id: 1,
            title: 'Smart Home Automation',
            description: 'IoT-based home automation system using ESP32',
            image: 'https://images.unsplash.com/photo-1558002038-1055907df827?q=80&w=400',
            status: 'completed',
            likes: 45,
            views: 234,
            tags: ['IoT', 'ESP32', 'Home Automation'],
            technologies: ['C++', 'MQTT', 'React'],
            github_link: 'https://github.com/example/smart-home',
            created_at: '2024-01-15',
          },
          {
            id: 2,
            title: 'Weather Monitoring Station',
            description: 'Real-time weather data collection and visualization',
            image: 'https://images.unsplash.com/photo-1592210454359-9043f067919b?q=80&w=400',
            status: 'in_progress',
            likes: 32,
            views: 156,
            tags: ['Sensors', 'Data Viz', 'Arduino'],
            technologies: ['Python', 'Arduino', 'React'],
            created_at: '2024-06-20',
          },
          {
            id: 3,
            title: 'Robotics Arm Controller',
            description: 'Precision control system for 6-DOF robotic arm',
            image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=400',
            status: 'in_progress',
            likes: 28,
            views: 98,
            tags: ['Robotics', 'Control Systems'],
            technologies: ['C++', 'ROS', 'Python'],
            created_at: '2024-08-10',
          },
        ],
        // Mock events data
        events: [
          {
            id: 1,
            event_id: 101,
            event_title: 'Arduino Workshop 2024',
            event_description: 'Hands-on Arduino programming workshop',
            event_date: '2024-03-15',
            participation_status: 'completed',
            role: 'participant',
            registration_date: '2024-02-20',
          },
          {
            id: 2,
            event_id: 102,
            event_title: 'IoT Hackathon',
            event_description: '24-hour IoT development challenge',
            event_date: '2024-05-20',
            participation_status: 'completed',
            role: 'participant',
            registration_date: '2024-04-10',
            certificate_url: 'https://example.com/cert.pdf',
          },
          {
            id: 3,
            event_id: 103,
            event_title: 'Embedded Systems Seminar',
            event_description: 'Latest trends in embedded systems',
            event_date: '2024-09-05',
            participation_status: 'attended',
            role: 'speaker',
            registration_date: '2024-07-15',
          },
        ],
        // Mock products data
        products: [
          {
            id: 1,
            name: 'Custom PCB Design Service',
            description: 'Professional PCB design and prototyping',
            price: 99.99,
            image: 'https://images.unsplash.com/photo-1635514569146-9a9607ecf303?q=80&w=400',
            category: 'Services',
            status: 'active',
            stock: 10,
            sales_count: 5,
            created_at: '2024-02-01',
          },
          {
            id: 2,
            name: 'Arduino Starter Kit',
            description: 'Complete kit for beginners with tutorials',
            price: 49.99,
            image: 'https://images.unsplash.com/photo-1553406830-ef2513450d76?q=80&w=400',
            category: 'Kits',
            status: 'active',
            stock: 25,
            sales_count: 12,
            created_at: '2024-04-10',
          },
        ],
        // Mock courses data
        courses: [
          {
            id: 1,
            course_id: 201,
            course_title: 'Advanced Embedded Systems',
            course_description: 'Deep dive into embedded programming',
            progress: 100,
            status: 'completed',
            enrolled_date: '2024-01-05',
            completed_date: '2024-03-20',
            instructor: 'Dr. Smith',
          },
          {
            id: 2,
            course_id: 202,
            course_title: 'IoT Development Fundamentals',
            course_description: 'Build IoT solutions from scratch',
            progress: 100,
            status: 'completed',
            enrolled_date: '2024-04-01',
            completed_date: '2024-06-15',
            instructor: 'Prof. Johnson',
          },
          {
            id: 3,
            course_id: 203,
            course_title: 'PCB Design Masterclass',
            course_description: 'Professional PCB design techniques',
            progress: 65,
            status: 'in_progress',
            enrolled_date: '2024-08-01',
            instructor: 'Eng. Martinez',
          },
        ],
        challenges: [],
        // Mock achievements
        achievements: [
          {
            id: 1,
            title: 'First Project',
            description: 'Created your first project',
            icon: '🎯',
            category: 'Projects',
            earned_date: '2024-01-20',
            rarity: 'common',
          },
          {
            id: 2,
            title: 'Event Enthusiast',
            description: 'Attended 3 events',
            icon: '🎪',
            category: 'Events',
            earned_date: '2024-05-25',
            rarity: 'rare',
          },
          {
            id: 3,
            title: 'Learning Champion',
            description: 'Completed 3 courses',
            icon: '🎓',
            category: 'Courses',
            earned_date: '2024-06-20',
            rarity: 'rare',
          },
          {
            id: 4,
            title: 'Week Warrior',
            description: '7 day activity streak',
            icon: '🔥',
            category: 'Activity',
            earned_date: '2024-09-10',
            rarity: 'epic',
          },
        ],
        likes: [],
        recent_activity: [],
      };

      setUserProfile(mockProfile);
    } catch (err) {
      console.error('Error loading user profile:', err);
      setError('Failed to load user profile');
      // Still show basic info if available
      if (initialUserData) {
        setUserProfile({ ...initialUserData } as UserProfileComplete);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && userId) {
      loadUserProfile();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, userId]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const getAvatarUrl = () => {
    if (!userProfile) return '';
    return (
      userProfile.avatar_url ||
      userProfile.avatarUrl ||
      userProfile.avatar ||
      `https://ui-avatars.com/api/?name=${encodeURIComponent(userProfile.name || userProfile.username)}&background=random&size=200`
    );
  };

  const getDisplayName = () => {
    if (!userProfile) return 'Loading...';
    return userProfile.name || userProfile.username || userProfile.login || 'Unknown User';
  };

  if (!isOpen) return null;

  return (
    <div className="user-profile-modal-overlay" onClick={onClose}>
      <div className="user-profile-modal-container" onClick={(e) => e.stopPropagation()}>
        {/* Close Button */}
        <button className="user-profile-modal-close" onClick={onClose}>
          <FaTimes />
        </button>

        {loading ? (
          <div className="user-profile-loading">
            <div className="spinner"></div>
            <p>Loading profile...</p>
          </div>
        ) : error && !userProfile ? (
          <div className="user-profile-error">
            <p>{error}</p>
            <button onClick={onClose} className="btn-secondary">
              Close
            </button>
          </div>
        ) : userProfile ? (
          <>
            {/* Header Section */}
            <div className="user-profile-header">
              <div className="user-profile-cover"></div>
              <div className="user-profile-main-info">
                <div className="user-profile-avatar-wrapper">
                  <img
                    src={getAvatarUrl()}
                    alt={getDisplayName()}
                    className="user-profile-avatar"
                  />
                  {userProfile.stats?.streak_days && userProfile.stats.streak_days > 0 && (
                    <div
                      className="streak-badge"
                      title={`${userProfile.stats.streak_days} day streak!`}
                    >
                      <FaFire /> {userProfile.stats.streak_days}
                    </div>
                  )}
                </div>
                <div className="user-profile-title-section">
                  <h1>{getDisplayName()}</h1>
                  <p className="user-profile-username">
                    @{userProfile.username || userProfile.login}
                  </p>
                  {userProfile.role && (
                    <span className={`role-badge role-${userProfile.role.toLowerCase()}`}>
                      {userProfile.role}
                    </span>
                  )}
                  {userProfile.stats?.rank && (
                    <span className="rank-badge">
                      <FaTrophy /> Rank #{userProfile.stats.rank}
                    </span>
                  )}
                </div>
              </div>

              {/* Bio */}
              {userProfile.bio && (
                <div className="user-profile-bio">
                  <p>{userProfile.bio}</p>
                </div>
              )}

              {/* Contact Info */}
              <div className="user-profile-contact">
                {userProfile.email && (
                  <a href={`mailto:${userProfile.email}`} className="contact-item">
                    <FaEnvelope /> {userProfile.email}
                  </a>
                )}
                {userProfile.location && (
                  <span className="contact-item">
                    <FaMapPin /> {userProfile.location}
                  </span>
                )}
                {userProfile.company && (
                  <span className="contact-item">
                    <FaBriefcase /> {userProfile.company}
                  </span>
                )}
                {userProfile.blog && (
                  <a
                    href={userProfile.blog}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="contact-item"
                  >
                    <FaLink /> Website
                  </a>
                )}
                {(userProfile.github_username || userProfile.html_url) && (
                  <a
                    href={
                      userProfile.html_url || `https://github.com/${userProfile.github_username}`
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="contact-item"
                  >
                    <FaGithub /> GitHub
                  </a>
                )}
                {(userProfile.created_at || userProfile.createdAt) && (
                  <span className="contact-item">
                    <FaCalendar /> Joined{' '}
                    {new Date(
                      userProfile.created_at || userProfile.createdAt || ''
                    ).toLocaleDateString('en-US', {
                      month: 'long',
                      year: 'numeric',
                    })}
                  </span>
                )}
              </div>

              {/* Stats Overview */}
              {userProfile.stats && (
                <div className="user-stats-grid">
                  <div className="stat-card">
                    <div className="stat-icon">
                      <FaProjectDiagram />
                    </div>
                    <div className="stat-content">
                      <div className="stat-value">{userProfile.stats.total_projects}</div>
                      <div className="stat-label">Projects</div>
                    </div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-icon">
                      <FaCalendarAlt />
                    </div>
                    <div className="stat-content">
                      <div className="stat-value">{userProfile.stats.total_events_attended}</div>
                      <div className="stat-label">Events</div>
                    </div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-icon">
                      <FaShoppingCart />
                    </div>
                    <div className="stat-content">
                      <div className="stat-value">{userProfile.stats.total_products}</div>
                      <div className="stat-label">Products</div>
                    </div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-icon">
                      <FaGraduationCap />
                    </div>
                    <div className="stat-content">
                      <div className="stat-value">{userProfile.stats.total_courses_completed}</div>
                      <div className="stat-label">Courses</div>
                    </div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-icon">
                      <FaCode />
                    </div>
                    <div className="stat-content">
                      <div className="stat-value">
                        {userProfile.stats.total_challenges_completed}
                      </div>
                      <div className="stat-label">Challenges</div>
                    </div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-icon">
                      <FaAward />
                    </div>
                    <div className="stat-content">
                      <div className="stat-value">{userProfile.stats.total_achievements}</div>
                      <div className="stat-label">Achievements</div>
                    </div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-icon">
                      <FaHeart />
                    </div>
                    <div className="stat-content">
                      <div className="stat-value">{userProfile.stats.total_likes_received}</div>
                      <div className="stat-label">Likes</div>
                    </div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-icon">
                      <FaChartLine />
                    </div>
                    <div className="stat-content">
                      <div className="stat-value">{userProfile.stats.total_points}</div>
                      <div className="stat-label">Points</div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Tabs Navigation */}
            <div className="user-profile-tabs">
              <button
                className={`tab-button ${activeTab === 'overview' ? 'active' : ''}`}
                onClick={() => setActiveTab('overview')}
              >
                <FaChartLine /> Overview
              </button>
              <button
                className={`tab-button ${activeTab === 'projects' ? 'active' : ''}`}
                onClick={() => setActiveTab('projects')}
              >
                <FaProjectDiagram /> Projects ({userProfile.stats?.total_projects || 0})
              </button>
              <button
                className={`tab-button ${activeTab === 'events' ? 'active' : ''}`}
                onClick={() => setActiveTab('events')}
              >
                <FaCalendarAlt /> Events ({userProfile.stats?.total_events_attended || 0})
              </button>
              <button
                className={`tab-button ${activeTab === 'products' ? 'active' : ''}`}
                onClick={() => setActiveTab('products')}
              >
                <FaShoppingCart /> Products ({userProfile.stats?.total_products || 0})
              </button>
              <button
                className={`tab-button ${activeTab === 'courses' ? 'active' : ''}`}
                onClick={() => setActiveTab('courses')}
              >
                <FaGraduationCap /> Courses ({userProfile.stats?.total_courses_completed || 0})
              </button>
              <button
                className={`tab-button ${activeTab === 'achievements' ? 'active' : ''}`}
                onClick={() => setActiveTab('achievements')}
              >
                <FaTrophy /> Achievements ({userProfile.stats?.total_achievements || 0})
              </button>
            </div>

            {/* Tab Content */}
            <div className="user-profile-content">
              {activeTab === 'overview' && (
                <div className="tab-content-overview">
                  <h2>Recent Activity</h2>
                  <div className="activity-timeline">
                    <div className="activity-summary">
                      <div className="summary-stat">
                        <FaProjectDiagram className="summary-icon" />
                        <div>
                          <div className="summary-value">{userProfile.projects?.length || 0}</div>
                          <div className="summary-label">Projects Created</div>
                        </div>
                      </div>
                      <div className="summary-stat">
                        <FaCalendarAlt className="summary-icon" />
                        <div>
                          <div className="summary-value">{userProfile.events?.length || 0}</div>
                          <div className="summary-label">Events Joined</div>
                        </div>
                      </div>
                      <div className="summary-stat">
                        <FaShoppingCart className="summary-icon" />
                        <div>
                          <div className="summary-value">{userProfile.products?.length || 0}</div>
                          <div className="summary-label">Products Listed</div>
                        </div>
                      </div>
                    </div>
                    <p className="empty-state" style={{ marginTop: '2rem' }}>
                      Detailed activity timeline coming soon
                    </p>
                  </div>
                </div>
              )}

              {activeTab === 'projects' && (
                <div className="tab-content-projects">
                  <h2>Projects</h2>
                  {userProfile.projects && userProfile.projects.length > 0 ? (
                    <div className="profile-projects-grid">
                      {userProfile.projects.map((project) => (
                        <div
                          key={project.id}
                          className="profile-project-card"
                          onClick={() => handleProjectClick(project.id)}
                          role="button"
                          tabIndex={0}
                          onKeyPress={(e) => e.key === 'Enter' && handleProjectClick(project.id)}
                        >
                          <div className="profile-project-image">
                            {project.image ? (
                              <img src={project.image} alt={project.title} />
                            ) : (
                              <div className="profile-project-placeholder">
                                <FaProjectDiagram />
                              </div>
                            )}
                            <div className="profile-project-status">
                              <span className={`status-badge status-${project.status}`}>
                                {project.status === 'completed' ? <FaCheckCircle /> : <FaClock />}
                                {project.status.replace('_', ' ')}
                              </span>
                            </div>
                          </div>
                          <div className="profile-project-content">
                            <h3>{project.title}</h3>
                            <p>{project.description}</p>
                            <div className="profile-project-meta">
                              <span className="meta-item">
                                <FaHeart /> {project.likes}
                              </span>
                              <span className="meta-item">
                                <FaEye /> {project.views}
                              </span>
                            </div>
                            <div className="profile-project-tags">
                              {project.tags.slice(0, 3).map((tag, idx) => (
                                <span key={idx} className="tag">
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>
                          <div className="profile-project-overlay">
                            <FaExternalLinkAlt />
                            <span>View Project</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="empty-state">No projects yet</p>
                  )}
                </div>
              )}

              {activeTab === 'events' && (
                <div className="tab-content-events">
                  <h2>Events Participated</h2>
                  {userProfile.events && userProfile.events.length > 0 ? (
                    <div className="profile-events-list">
                      {userProfile.events.map((event) => (
                        <div
                          key={event.id}
                          className="profile-event-card"
                          onClick={() => handleEventClick(event.event_id)}
                          role="button"
                          tabIndex={0}
                          onKeyPress={(e) => e.key === 'Enter' && handleEventClick(event.event_id)}
                        >
                          <div className="profile-event-icon">
                            <FaCalendarAlt />
                          </div>
                          <div className="profile-event-content">
                            <h3>{event.event_title}</h3>
                            <p>{event.event_description}</p>
                            <div className="profile-event-meta">
                              <span className="meta-badge">
                                {event.role === 'speaker' ? '🎤' : '👤'} {event.role}
                              </span>
                              <span className={`status-badge status-${event.participation_status}`}>
                                {event.participation_status}
                              </span>
                              <span className="meta-date">
                                📅 {new Date(event.event_date).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                          <div className="profile-event-arrow">
                            <FaExternalLinkAlt />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="empty-state">No events participated yet</p>
                  )}
                </div>
              )}

              {activeTab === 'products' && (
                <div className="tab-content-products">
                  <h2>Products</h2>
                  {userProfile.products && userProfile.products.length > 0 ? (
                    <div className="profile-products-grid">
                      {userProfile.products.map((product) => (
                        <div
                          key={product.id}
                          className="profile-product-card"
                          onClick={() => handleProductClick(product.id)}
                          role="button"
                          tabIndex={0}
                          onKeyPress={(e) => e.key === 'Enter' && handleProductClick(product.id)}
                        >
                          <div className="profile-product-image">
                            {product.image ? (
                              <img src={product.image} alt={product.name} />
                            ) : (
                              <div className="profile-product-placeholder">
                                <FaShoppingCart />
                              </div>
                            )}
                            <div className="profile-product-price">${product.price.toFixed(2)}</div>
                          </div>
                          <div className="profile-product-content">
                            <h3>{product.name}</h3>
                            <p>{product.description}</p>
                            <div className="profile-product-meta">
                              <span className="meta-item">📦 {product.stock} in stock</span>
                              <span className="meta-item">✅ {product.sales_count} sold</span>
                            </div>
                            <span
                              className={`category-badge category-${product.category.toLowerCase()}`}
                            >
                              {product.category}
                            </span>
                          </div>
                          <div className="profile-product-overlay">
                            <FaExternalLinkAlt />
                            <span>View Product</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="empty-state">No products listed yet</p>
                  )}
                </div>
              )}

              {activeTab === 'courses' && (
                <div className="tab-content-courses">
                  <h2>Courses</h2>
                  {userProfile.courses && userProfile.courses.length > 0 ? (
                    <div className="profile-courses-list">
                      {userProfile.courses.map((course) => (
                        <div
                          key={course.id}
                          className="profile-course-card"
                          onClick={() => handleCourseClick(course.course_id)}
                          role="button"
                          tabIndex={0}
                          onKeyPress={(e) =>
                            e.key === 'Enter' && handleCourseClick(course.course_id)
                          }
                        >
                          <div className="profile-course-icon">
                            <FaGraduationCap />
                          </div>
                          <div className="profile-course-content">
                            <h3>{course.course_title}</h3>
                            <p>{course.course_description}</p>
                            {course.instructor && (
                              <div className="profile-course-instructor">
                                👨‍🏫 {course.instructor}
                              </div>
                            )}
                            <div className="profile-course-progress">
                              <div className="progress-bar">
                                <div
                                  className="progress-fill"
                                  style={{ width: `${course.progress}%` }}
                                ></div>
                              </div>
                              <span className="progress-text">{course.progress}% Complete</span>
                            </div>
                            <div className="profile-course-meta">
                              <span className={`status-badge status-${course.status}`}>
                                {course.status === 'completed' ? '✅' : '📚'}{' '}
                                {course.status.replace('_', ' ')}
                              </span>
                            </div>
                          </div>
                          <div className="profile-course-arrow">
                            <FaExternalLinkAlt />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="empty-state">No courses enrolled yet</p>
                  )}
                </div>
              )}

              {activeTab === 'achievements' && (
                <div className="tab-content-achievements">
                  <h2>Achievements & Awards</h2>
                  {userProfile.achievements && userProfile.achievements.length > 0 ? (
                    <div className="profile-achievements-grid">
                      {userProfile.achievements.map((achievement) => (
                        <div
                          key={achievement.id}
                          className={`profile-achievement-card rarity-${achievement.rarity}`}
                        >
                          <div className="profile-achievement-icon">{achievement.icon}</div>
                          <div className="profile-achievement-content">
                            <h3>{achievement.title}</h3>
                            <p>{achievement.description}</p>
                            <div className="profile-achievement-meta">
                              <span className="category-badge">{achievement.category}</span>
                              <span className={`rarity-badge rarity-${achievement.rarity}`}>
                                {achievement.rarity}
                              </span>
                            </div>
                            <div className="profile-achievement-date">
                              Earned: {new Date(achievement.earned_date).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="empty-state">No achievements yet</p>
                  )}
                </div>
              )}
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
};

export default UserProfileModal;
