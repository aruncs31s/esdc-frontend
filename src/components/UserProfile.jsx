import { useState, useEffect } from 'react';
import { FiGithub, FiAward, FiTrendingUp, FiCalendar, FiMapPin, FiMail, FiLink } from 'react-icons/fi';
import { FaCode, FaTrophy, FaFire, FaStar } from 'react-icons/fa';
import { useAuth } from '../hooks/useAuth';
import { Link } from 'react-router-dom';

const UserProfile = () => {
  const [stats, setStats] = useState({ solved: 0, rank: 0, points: 0, streak: 0 });
  const [recentActivity, setRecentActivity] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated && user) {
      // Mock stats - replace with API call
      setStats({
        solved: 12,
        rank: 45,
        points: 850,
        streak: 7
      });
      
      setRecentActivity([
        { id: 1, type: 'solved', title: 'LED Blink Challenge', date: '2 hours ago' },
        { id: 2, type: 'attempted', title: 'Motor Control', date: '1 day ago' },
        { id: 3, type: 'solved', title: 'Sensor Reading', date: '3 days ago' }
      ]);
      
      setAchievements([
        { id: 1, icon: '🎯', title: 'First Steps', desc: 'Completed first challenge' },
        { id: 2, icon: '🔥', title: 'On Fire', desc: '7 day streak' },
        { id: 3, icon: '⭐', title: 'Rising Star', desc: 'Earned 500 points' }
      ]);
    }
  }, [isAuthenticated, user]);

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

  const joinDate = user.created_at ? new Date(user.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'Recently';

  return (
    <section className="profile-page">
      <div className="container">
        <div className="profile-content" style={{ gridTemplateColumns: '400px 1fr', maxWidth: '1200px', margin: '0 auto' }}>
        <div className="profile-card" style={{ maxWidth: '100%' }}>
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
              <div style={{ marginTop: '15px', paddingTop: '15px', borderTop: '2px solid var(--surface0)' }}>
                {user.location && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', color: 'var(--subtext1)', fontSize: '0.9rem' }}>
                    <FiMapPin /> {user.location}
                  </div>
                )}
                {user.company && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', color: 'var(--subtext1)', fontSize: '0.9rem' }}>
                    🏢 {user.company}
                  </div>
                )}
                {user.blog && (
                  <a href={user.blog} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--blue)', textDecoration: 'none', fontSize: '0.9rem' }}>
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

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Additional Stats */}
          <div className="profile-info-card">
            <h3 style={{ fontSize: '1.3rem', marginBottom: '20px', color: 'var(--text)', display: 'flex', alignItems: 'center', gap: '10px' }}>
              📊 Statistics
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '15px' }}>
              <div className="stat-item">
                <div className="stat-value" style={{ color: 'var(--blue)' }}>{stats.rank}</div>
                <div className="stat-label">Rank</div>
              </div>
              <div className="stat-item">
                <div className="stat-value" style={{ color: 'var(--peach)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px' }}>
                  <FaFire /> {stats.streak}
                </div>
                <div className="stat-label">Day Streak</div>
              </div>
            </div>
          </div>

          {/* Achievements */}
          <div className="profile-info-card">
            <h3 style={{ fontSize: '1.3rem', marginBottom: '20px', color: 'var(--text)', display: 'flex', alignItems: 'center', gap: '10px' }}>
              🏆 Achievements
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {achievements.map(achievement => (
                <div key={achievement.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', background: 'rgba(255, 255, 255, 0.03)', borderRadius: '10px', border: '1px solid var(--surface0)' }}>
                  <div style={{ fontSize: '2rem' }}>{achievement.icon}</div>
                  <div>
                    <div style={{ fontWeight: '600', color: 'var(--text)', marginBottom: '2px' }}>{achievement.title}</div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--subtext0)' }}>{achievement.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="profile-info-card">
            <h3 style={{ fontSize: '1.3rem', marginBottom: '20px', color: 'var(--text)', display: 'flex', alignItems: 'center', gap: '10px' }}>
              ⚡ Recent Activity
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {recentActivity.map(activity => (
                <div key={activity.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', background: 'rgba(255, 255, 255, 0.03)', borderRadius: '10px', border: '1px solid var(--surface0)' }}>
                  <div>
                    <span className={`status-badge ${activity.type === 'solved' ? 'completed' : 'in-progress'}`} style={{ marginRight: '10px' }}>
                      {activity.type}
                    </span>
                    <span style={{ color: 'var(--text)', fontWeight: '500' }}>{activity.title}</span>
                  </div>
                  <span style={{ fontSize: '0.85rem', color: 'var(--subtext0)' }}>{activity.date}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        </div>
      </div>
    </section>
  );
};

export default UserProfile;