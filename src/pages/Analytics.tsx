import { FiTrendingUp, FiUsers, FiActivity, FiTarget } from 'react-icons/fi';
import '../styles/analytics.css';

export default function Analytics() {
  return (
    <div className="analytics-page">
      <div className="container">
        <h1>Analytics Dashboard</h1>
        <p>Track your progress and performance</p>

        <div className="analytics-grid">
          <div className="analytics-card">
            <div className="card-header">
              <h3>User Growth</h3>
              <FiTrendingUp />
            </div>
            <div className="card-value">+24%</div>
            <p>vs last month</p>
          </div>

          <div className="analytics-card">
            <div className="card-header">
              <h3>Active Users</h3>
              <FiUsers />
            </div>
            <div className="card-value">1,234</div>
            <p>this week</p>
          </div>

          <div className="analytics-card">
            <div className="card-header">
              <h3>Engagement</h3>
              <FiActivity />
            </div>
            <div className="card-value">87%</div>
            <p>average rate</p>
          </div>

          <div className="analytics-card">
            <div className="card-header">
              <h3>Goals Completed</h3>
              <FiTarget />
            </div>
            <div className="card-value">45/50</div>
            <p>this quarter</p>
          </div>
        </div>

        <div className="chart-section">
          <h2>Activity Overview</h2>
          <div className="chart-placeholder">
            <p>Chart visualization here</p>
          </div>
        </div>
      </div>
    </div>
  );
}
