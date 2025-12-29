import { FiUsers, FiPlus, FiSettings } from 'react-icons/fi';
import '../styles/teams.css';

export default function Teams() {
  return (
    <div className="teams-page">
      <div className="container">
        <div className="teams-header">
          <h1>Teams</h1>
          <button className="btn-primary">
            <FiPlus /> Create Team
          </button>
        </div>

        <div className="teams-grid">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="team-card">
              <div className="team-icon">
                <FiUsers size={32} />
              </div>
              <h3>Hardware Team</h3>
              <p>PCB design and prototyping</p>
              <div className="team-members">
                <div className="member-avatars">
                  {[1, 2, 3].map((j) => (
                    <div key={j} className="avatar"></div>
                  ))}
                  <span className="more">+5</span>
                </div>
              </div>
              <div className="team-actions">
                <button className="btn-secondary">View</button>
                <button className="btn-icon">
                  <FiSettings />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
