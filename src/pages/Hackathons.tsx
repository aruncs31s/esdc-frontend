import { FiCalendar, FiUsers, FiAward } from 'react-icons/fi';
import '../styles/hackathons.css';

export default function Hackathons() {
  return (
    <div className="hackathons-page">
      <div className="container">
        <h1>Hackathons</h1>
        <p>Participate in exciting coding challenges and competitions</p>

        <div className="hackathons-grid">
          {[1, 2, 3].map((i) => (
            <div key={i} className="hackathon-card">
              <div className="hackathon-badge">Upcoming</div>
              <h3>IoT Innovation Challenge</h3>
              <p>Build innovative IoT solutions for smart cities</p>
              <div className="hackathon-meta">
                <span>
                  <FiCalendar /> Feb 15-17, 2025
                </span>
                <span>
                  <FiUsers /> 50 teams
                </span>
                <span>
                  <FiAward /> $5000 prize
                </span>
              </div>
              <button className="btn-primary">Register Now</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
