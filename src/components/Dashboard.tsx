import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { FaTrophy, FaCalendar, FaCode, FaUsers } from 'react-icons/fa';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({});
  const [recentActivity, setRecentActivity] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    // Mock data - replace with API calls
    setStats({
      totalPoints: 450,
      completedChallenges: 3,
      upcomingEvents: 2,
      rank: 15
    });

    setRecentActivity([
      { id: 1, type: 'challenge', title: 'LED Matrix Display completed', date: '2025-01-20' },
      { id: 2, type: 'event', title: 'Registered for Arduino Workshop', date: '2025-01-18' },
      { id: 3, type: 'achievement', title: 'Earned Beginner Badge', date: '2025-01-15' }
    ]);
  };

  return (
    <div className="dashboard">
      <div className="container">
        <h1>Welcome back, {user?.username}!</h1>
        
        <div className="stats-grid">
          <div className="stat-card">
            <FaTrophy />
            <div>
              <h3>{stats.totalPoints}</h3>
              <p>Total Points</p>
            </div>
          </div>
          
          <div className="stat-card">
            <FaCode />
            <div>
              <h3>{stats.completedChallenges}</h3>
              <p>Challenges Completed</p>
            </div>
          </div>
          
          <div className="stat-card">
            <FaCalendar />
            <div>
              <h3>{stats.upcomingEvents}</h3>
              <p>Upcoming Events</p>
            </div>
          </div>
          
          <div className="stat-card">
            <FaUsers />
            <div>
              <h3>#{stats.rank}</h3>
              <p>Club Ranking</p>
            </div>
          </div>
        </div>

        <div className="recent-activity">
          <h2>Recent Activity</h2>
          <div className="activity-list">
            {recentActivity.map(activity => (
              <div key={activity.id} className="activity-item">
                <span className={`activity-type ${activity.type}`}></span>
                <div>
                  <p>{activity.title}</p>
                  <small>{activity.date}</small>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;