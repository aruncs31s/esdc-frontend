import { useState, useEffect } from 'react';
import {
  FiGithub,
  FiAward,
  FiTrendingUp,
  FiCalendar,
  FiMapPin,
  FiLink,
  FiShoppingCart,
  FiHeart,
  FiPackage,
  FiCode,
  FiTarget,
  FiZap,
} from 'react-icons/fi';
import { FaCode, FaTrophy, FaFire, FaStar } from 'react-icons/fa';
import { useAuth } from '../modules/auth/useAuth';
import { useShop } from '../contexts/ShopContext';
import { Link } from 'react-router-dom';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

interface Activity {
  id: number;
  type: string;
  title: string;
  date: string;
}

interface Achievement {
  id: number;
  icon: string;
  title: string;
  desc: string;
  color: string;
}

interface Project {
  id: number;
  title: string;
  description: string;
  image: string;
  tags: string[];
  status: string;
}

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  stock: number;
}

const UserProfile = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ solved: 0, rank: 0, points: 0, streak: 0 });
  const [recentActivity, setRecentActivity] = useState<Activity[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [userProjects, setUserProjects] = useState<Project[]>([]);
  const [userProducts, setUserProducts] = useState<Product[]>([]);
  const { user, isAuthenticated } = useAuth();
  const { cart, wishlist, cartTotal } = useShop();

  // Helper function to render achievement icons
  const renderAchievementIcon = (iconName: string, color: string) => {
    const iconProps = { size: 24, style: { color } };
    switch (iconName) {
      case 'target':
        return <FiTarget {...iconProps} />;
      case 'fire':
        return <FaFire {...iconProps} />;
      case 'star':
        return <FaStar {...iconProps} />;
      default:
        return <FiAward {...iconProps} />;
    }
  };

  useEffect(() => {
    if (isAuthenticated && user) {
      setLoading(true);
      // Simulate API call
      setTimeout(() => {
        // Mock stats - replace with API call
        setStats({
          solved: 12,
          rank: 45,
          points: 850,
          streak: 7,
        });

        setRecentActivity([
          { id: 1, type: 'solved', title: 'LED Blink Challenge', date: '2 hours ago' },
          { id: 2, type: 'attempted', title: 'Motor Control', date: '1 day ago' },
          { id: 3, type: 'solved', title: 'Sensor Reading', date: '3 days ago' },
        ]);

        setAchievements([
          {
            id: 1,
            icon: 'target',
            title: 'First Steps',
            desc: 'Completed first challenge',
            color: 'var(--blue)',
          },
          { id: 2, icon: 'fire', title: 'On Fire', desc: '7 day streak', color: 'var(--peach)' },
          {
            id: 3,
            icon: 'star',
            title: 'Rising Star',
            desc: 'Earned 500 points',
            color: 'var(--yellow)',
          },
        ]);

        // Mock user projects - replace with API call
        setUserProjects([
          {
            id: 1,
            title: 'Smart Home Automation',
            description: 'IoT-based home automation system using ESP32',
            image: 'https://images.unsplash.com/photo-1558002038-1055907df827?q=80&w=1170',
            tags: ['IoT', 'ESP32', 'Home Automation'],
            status: 'completed',
          },
          {
            id: 2,
            title: 'Weather Station',
            description: 'Real-time weather monitoring with sensor array',
            image: 'https://images.unsplash.com/photo-1592210454359-9043f067919b?q=80&w=1170',
            tags: ['Sensors', 'Arduino', 'Data'],
            status: 'in-progress',
          },
        ]);

        // Mock user products - replace with API call
        setUserProducts([
          {
            id: 1,
            name: 'Custom PCB Design',
            description: 'Professional PCB design service',
            price: 99.99,
            image: 'https://images.unsplash.com/photo-1635514569146-9a9607ecf303?q=80&w=1170',
            category: 'Services',
            stock: 10,
          },
        ]);
        setLoading(false);
      }, 1500);
    } else {
      setLoading(false);
    }
  }, [isAuthenticated, user]);

  if (loading) {
    return (
      <section className="profile-page">
        <div className="container" style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <div
            className="profile-content"
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1.618fr',
              gap: '30px',
              alignItems: 'start',
            }}
          >
            {/* Left Profile Card Skeleton */}
            <div
              className="profile-card"
              style={{ maxWidth: '100%', position: 'sticky', top: '100px' }}
            >
              <Skeleton
                height={150}
                style={{ borderTopLeftRadius: '12px', borderTopRightRadius: '12px' }}
              />
              <div className="profile-card-avatar-wrapper">
                <Skeleton
                  circle
                  height={120}
                  width={120}
                  style={{ marginTop: '-60px', border: '4px solid var(--base)' }}
                />
              </div>
              <div className="profile-card-content">
                <Skeleton height={30} width="60%" style={{ margin: '10px auto' }} />
                <Skeleton height={20} width="40%" style={{ margin: '0 auto 10px' }} />
                <Skeleton count={3} />
                <Skeleton height={40} style={{ marginTop: '20px' }} />
              </div>
            </div>

            {/* Right Content Skeleton */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {/* Statistics Skeleton */}
              <div className="profile-info-card">
                <Skeleton height={30} width={200} style={{ marginBottom: '24px' }} />
                <div
                  style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}
                >
                  <Skeleton height={100} />
                  <Skeleton height={100} />
                </div>
              </div>

              {/* Achievements Skeleton */}
              <div className="profile-info-card">
                <Skeleton height={30} width={200} style={{ marginBottom: '24px' }} />
                <Skeleton height={70} count={3} style={{ marginBottom: '12px' }} />
              </div>

              {/* Recent Activity Skeleton */}
              <div className="profile-info-card">
                <Skeleton height={30} width={200} style={{ marginBottom: '24px' }} />
                <Skeleton height={50} count={3} style={{ marginBottom: '10px' }} />
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <section className="profile-page">
        <div className="container">
          <div className="profile-card profile-card-empty">
            <div>
              <div className="profile-card-icon">🔒</div>
              <h3>Login Required</h3>
              <p className="profile-card-empty-text">Please log in to view your profile</p>
              <Link to="/login" className="btn btn-primary" style={{ marginTop: '20px' }}>
                Login with GitHub
              </Link>
            </div>
          </div>
        </div>
      </section>
    );
  }

  const joinDate = user.created_at
    ? new Date(user.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
    : 'Recently';

  return (
    <section className="profile-page">
      <div className="container" style={{ maxWidth: '1400px', margin: '0 auto' }}>
        <div
          className="profile-content"
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1.618fr',
            gap: '30px',
            alignItems: 'start',
          }}
        >
          <div
            className="profile-card"
            style={{ maxWidth: '100%', position: 'sticky', top: '100px' }}
          >
            <div className="profile-card-header">
              <div className="profile-card-gradient"></div>
            </div>

            <div className="profile-card-avatar-wrapper">
              <div className="profile-card-avatar">
                {user.avatar_url || user.avatarUrl || user.avatar ? (
                  <img
                    src={user.avatar_url || user.avatarUrl || user.avatar}
                    alt={user.name || 'Profile'}
                    className="profile-card-avatar-img"
                  />
                ) : (
                  <div className="profile-card-avatar-placeholder">
                    {(user.name || user.login || 'U')[0].toUpperCase()}
                  </div>
                )}
              </div>
              {user.role === 'admin' && (
                <div className="profile-card-badge profile-card-badge-admin">
                  <FaTrophy /> Admin
                </div>
              )}
            </div>

            <div className="profile-card-content">
              <h2 className="profile-card-name">{user.name || user.login || 'User'}</h2>
              {user.login && <p className="profile-card-username">@{user.login}</p>}
              {user.email && <p className="profile-card-email">{user.email}</p>}
              {user.bio && <p className="profile-card-bio">{user.bio}</p>}

              {user.html_url && (
                <a
                  href={user.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="profile-card-github-link"
                >
                  <FiGithub /> View GitHub Profile
                </a>
              )}

              <div className="profile-card-join-date">
                <FiCalendar /> Joined {joinDate}
              </div>

              {(user.location || user.company || user.blog) && (
                <div
                  style={{
                    marginTop: '15px',
                    paddingTop: '15px',
                    borderTop: '2px solid var(--surface0)',
                  }}
                >
                  {user.location && (
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        marginBottom: '8px',
                        color: 'var(--subtext1)',
                        fontSize: '0.9rem',
                      }}
                    >
                      <FiMapPin /> {user.location}
                    </div>
                  )}
                  {user.company && (
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        marginBottom: '8px',
                        color: 'var(--subtext1)',
                        fontSize: '0.9rem',
                      }}
                    >
                      🏢 {user.company}
                    </div>
                  )}
                  {user.blog && (
                    <a
                      href={user.blog}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        color: 'var(--blue)',
                        textDecoration: 'none',
                        fontSize: '0.9rem',
                      }}
                    >
                      <FiLink /> Website
                    </a>
                  )}
                </div>
              )}

              <div className="profile-card-stats">
                <div className="profile-card-stat">
                  <div className="profile-card-stat-icon">
                    <FaCode />
                  </div>
                  <div className="profile-card-stat-content">
                    <div className="profile-card-stat-value">{stats.solved}</div>
                    <div className="profile-card-stat-label">Solved</div>
                  </div>
                </div>

                <div className="profile-card-stat-divider"></div>

                <div className="profile-card-stat">
                  <div className="profile-card-stat-icon">
                    <FiAward />
                  </div>
                  <div className="profile-card-stat-content">
                    <div className="profile-card-stat-value">{stats.points}</div>
                    <div className="profile-card-stat-label">Points</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Additional Stats */}
            <div className="profile-info-card">
              <h3
                style={{
                  fontSize: '1.3rem',
                  marginBottom: '24px',
                  color: 'var(--text)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                }}
              >
                <FiTrendingUp style={{ color: 'var(--blue)' }} /> Statistics
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
                <div
                  className="stat-item"
                  style={{
                    padding: '20px',
                    background: 'var(--surface0)',
                    borderRadius: '12px',
                    textAlign: 'center',
                    transition: 'all 0.3s ease',
                  }}
                >
                  <div
                    className="stat-value"
                    style={{
                      fontSize: '2rem',
                      fontWeight: '700',
                      color: 'var(--blue)',
                      marginBottom: '8px',
                    }}
                  >
                    {stats.rank}
                  </div>
                  <div
                    className="stat-label"
                    style={{
                      fontSize: '0.9rem',
                      color: 'var(--subtext0)',
                      fontWeight: '500',
                    }}
                  >
                    Global Rank
                  </div>
                </div>
                <div
                  className="stat-item"
                  style={{
                    padding: '20px',
                    background: 'var(--surface0)',
                    borderRadius: '12px',
                    textAlign: 'center',
                    transition: 'all 0.3s ease',
                  }}
                >
                  <div
                    className="stat-value"
                    style={{
                      fontSize: '2rem',
                      fontWeight: '700',
                      color: 'var(--peach)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      marginBottom: '8px',
                    }}
                  >
                    <FaFire size={24} /> {stats.streak}
                  </div>
                  <div
                    className="stat-label"
                    style={{
                      fontSize: '0.9rem',
                      color: 'var(--subtext0)',
                      fontWeight: '500',
                    }}
                  >
                    Day Streak
                  </div>
                </div>
              </div>
            </div>

            {/* Achievements */}
            <div className="profile-info-card">
              <h3
                style={{
                  fontSize: '1.3rem',
                  marginBottom: '24px',
                  color: 'var(--text)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  fontWeight: '600',
                }}
              >
                <FiAward style={{ color: 'var(--yellow)' }} /> Achievements
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {achievements.map((achievement: any) => (
                  <div
                    key={achievement.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '12px',
                      background: 'rgba(255, 255, 255, 0.03)',
                      borderRadius: '10px',
                      border: '1px solid var(--surface0)',
                      transition: 'all 0.3s ease',
                    }}
                  >
                    <div
                      style={{
                        width: '48px',
                        height: '48px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: 'var(--surface0)',
                        borderRadius: '12px',
                      }}
                    >
                      {renderAchievementIcon(achievement.icon, achievement.color)}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: '600', color: 'var(--text)', marginBottom: '2px' }}>
                        {achievement.title}
                      </div>
                      <div style={{ fontSize: '0.85rem', color: 'var(--subtext0)' }}>
                        {achievement.desc}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="profile-info-card">
              <h3
                style={{
                  fontSize: '1.3rem',
                  marginBottom: '24px',
                  color: 'var(--text)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  fontWeight: '600',
                }}
              >
                <FiZap style={{ color: 'var(--peach)' }} /> Recent Activity
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {recentActivity.map((activity) => (
                  <div
                    key={activity.id}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '12px',
                      background: 'rgba(255, 255, 255, 0.03)',
                      borderRadius: '10px',
                      border: '1px solid var(--surface0)',
                    }}
                  >
                    <div>
                      <span
                        className={`status-badge ${activity.type === 'solved' ? 'completed' : 'in-progress'}`}
                        style={{ marginRight: '10px' }}
                      >
                        {activity.type}
                      </span>
                      <span style={{ color: 'var(--text)', fontWeight: '500' }}>
                        {activity.title}
                      </span>
                    </div>
                    <span style={{ fontSize: '0.85rem', color: 'var(--subtext0)' }}>
                      {activity.date}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Shopping Cart */}
            <div className="profile-info-card">
              <h3
                style={{
                  fontSize: '1.3rem',
                  marginBottom: '24px',
                  color: 'var(--text)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  justifyContent: 'space-between',
                  fontWeight: '600',
                }}
              >
                <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <FiShoppingCart style={{ color: 'var(--blue)' }} /> Shopping Cart
                </span>
                <Link
                  to="/cart"
                  style={{ fontSize: '0.9rem', color: 'var(--blue)', textDecoration: 'none' }}
                >
                  View All
                </Link>
              </h3>
              {cart.length > 0 ? (
                <>
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '12px',
                      marginBottom: '15px',
                    }}
                  >
                    {cart.slice(0, 3).map((item) => (
                      <div
                        key={item.id}
                        style={{
                          display: 'flex',
                          gap: '12px',
                          padding: '12px',
                          background: 'rgba(255, 255, 255, 0.03)',
                          borderRadius: '10px',
                          border: '1px solid var(--surface0)',
                        }}
                      >
                        <img
                          src={item.image}
                          alt={item.name}
                          style={{
                            width: '60px',
                            height: '60px',
                            objectFit: 'cover',
                            borderRadius: '8px',
                          }}
                        />
                        <div style={{ flex: 1 }}>
                          <div
                            style={{ fontWeight: '600', color: 'var(--text)', marginBottom: '4px' }}
                          >
                            {item.name}
                          </div>
                          <div
                            style={{
                              fontSize: '0.85rem',
                              color: 'var(--subtext0)',
                              marginBottom: '4px',
                            }}
                          >
                            Qty: {item.quantity}
                          </div>
                          <div
                            style={{ fontSize: '0.9rem', color: 'var(--blue)', fontWeight: '600' }}
                          >
                            ${(item.price * item.quantity).toFixed(2)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div
                    style={{
                      padding: '12px',
                      background: 'var(--surface0)',
                      borderRadius: '10px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      fontWeight: '600',
                    }}
                  >
                    <span style={{ color: 'var(--text)' }}>Total:</span>
                    <span style={{ color: 'var(--blue)', fontSize: '1.2rem' }}>
                      ${cartTotal.toFixed(2)}
                    </span>
                  </div>
                </>
              ) : (
                <p style={{ color: 'var(--subtext0)', textAlign: 'center', padding: '20px' }}>
                  Your cart is empty
                </p>
              )}
            </div>

            {/* Wishlist */}
            <div className="profile-info-card">
              <h3
                style={{
                  fontSize: '1.3rem',
                  marginBottom: '24px',
                  color: 'var(--text)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  justifyContent: 'space-between',
                  fontWeight: '600',
                }}
              >
                <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <FiHeart style={{ color: 'var(--pink)' }} /> Wishlist
                </span>
                <Link
                  to="/wishlist"
                  style={{ fontSize: '0.9rem', color: 'var(--blue)', textDecoration: 'none' }}
                >
                  View All
                </Link>
              </h3>
              {wishlist.length > 0 ? (
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
                    gap: '12px',
                  }}
                >
                  {wishlist.slice(0, 4).map((item) => (
                    <div
                      key={item.id}
                      style={{
                        position: 'relative',
                        borderRadius: '10px',
                        overflow: 'hidden',
                        border: '1px solid var(--surface0)',
                      }}
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        style={{ width: '100%', height: '120px', objectFit: 'cover' }}
                      />
                      <div style={{ padding: '8px', background: 'var(--mantle)' }}>
                        <div
                          style={{
                            fontSize: '0.85rem',
                            fontWeight: '600',
                            color: 'var(--text)',
                            marginBottom: '4px',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {item.name}
                        </div>
                        <div
                          style={{ fontSize: '0.9rem', color: 'var(--blue)', fontWeight: '600' }}
                        >
                          ${item.price}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{ color: 'var(--subtext0)', textAlign: 'center', padding: '20px' }}>
                  Your wishlist is empty
                </p>
              )}
            </div>

            {/* User Projects */}
            <div className="profile-info-card">
              <h3
                style={{
                  fontSize: '1.3rem',
                  marginBottom: '24px',
                  color: 'var(--text)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  justifyContent: 'space-between',
                  fontWeight: '600',
                }}
              >
                <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <FiCode style={{ color: 'var(--lavender)' }} /> My Projects
                </span>
                <Link
                  to="/projects"
                  style={{ fontSize: '0.9rem', color: 'var(--blue)', textDecoration: 'none' }}
                >
                  View All
                </Link>
              </h3>
              {userProjects.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {userProjects.map((project: any) => (
                    <div
                      key={project.id}
                      style={{
                        display: 'flex',
                        gap: '12px',
                        padding: '12px',
                        background: 'rgba(255, 255, 255, 0.03)',
                        borderRadius: '10px',
                        border: '1px solid var(--surface0)',
                      }}
                    >
                      <img
                        src={project.image}
                        alt={project.title}
                        style={{
                          width: '80px',
                          height: '80px',
                          objectFit: 'cover',
                          borderRadius: '8px',
                        }}
                      />
                      <div style={{ flex: 1 }}>
                        <div
                          style={{
                            fontWeight: '600',
                            color: 'var(--text)',
                            marginBottom: '4px',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'start',
                          }}
                        >
                          <span>{project.title}</span>
                          <span
                            className={`status-badge ${project.status === 'completed' ? 'completed' : 'in-progress'}`}
                            style={{ fontSize: '0.75rem' }}
                          >
                            {project.status}
                          </span>
                        </div>
                        <div
                          style={{
                            fontSize: '0.85rem',
                            color: 'var(--subtext0)',
                            marginBottom: '8px',
                          }}
                        >
                          {project.description}
                        </div>
                        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                          {project.tags.map((tag: string, idx: number) => (
                            <span key={idx} className="tag" style={{ fontSize: '0.75rem' }}>
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{ color: 'var(--subtext0)', textAlign: 'center', padding: '20px' }}>
                  No projects yet
                </p>
              )}
            </div>

            {/* User Products */}
            <div className="profile-info-card">
              <h3
                style={{
                  fontSize: '1.3rem',
                  marginBottom: '24px',
                  color: 'var(--text)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  justifyContent: 'space-between',
                  fontWeight: '600',
                }}
              >
                <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <FiPackage style={{ color: 'var(--green)' }} /> My Products
                </span>
                <Link
                  to="/my-products"
                  style={{ fontSize: '0.9rem', color: 'var(--blue)', textDecoration: 'none' }}
                >
                  View All
                </Link>
              </h3>
              {userProducts.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {userProducts.map((product: any) => (
                    <div
                      key={product.id}
                      style={{
                        display: 'flex',
                        gap: '12px',
                        padding: '12px',
                        background: 'rgba(255, 255, 255, 0.03)',
                        borderRadius: '10px',
                        border: '1px solid var(--surface0)',
                      }}
                    >
                      <img
                        src={product.image}
                        alt={product.name}
                        style={{
                          width: '80px',
                          height: '80px',
                          objectFit: 'cover',
                          borderRadius: '8px',
                        }}
                      />
                      <div style={{ flex: 1 }}>
                        <div
                          style={{ fontWeight: '600', color: 'var(--text)', marginBottom: '4px' }}
                        >
                          {product.name}
                        </div>
                        <div
                          style={{
                            fontSize: '0.85rem',
                            color: 'var(--subtext0)',
                            marginBottom: '8px',
                          }}
                        >
                          {product.description}
                        </div>
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                          }}
                        >
                          <span
                            style={{ fontSize: '1rem', color: 'var(--blue)', fontWeight: '600' }}
                          >
                            ${product.price}
                          </span>
                          <span style={{ fontSize: '0.85rem', color: 'var(--subtext0)' }}>
                            Stock: {product.stock}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{ color: 'var(--subtext0)', textAlign: 'center', padding: '20px' }}>
                  No products listed
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default UserProfile;
