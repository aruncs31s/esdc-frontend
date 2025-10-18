import { FiBriefcase, FiMapPin, FiDollarSign, FiClock } from 'react-icons/fi';
import '../styles/job-board.css';

export default function JobBoard() {
  return (
    <div className="job-board-page">
      <div className="container">
        <h1>Job Board</h1>
        <p>Find opportunities in embedded systems and IoT</p>

        <div className="jobs-list">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="job-card">
              <div className="job-header">
                <div className="company-logo">
                  <FiBriefcase size={32} />
                </div>
                <div className="job-info">
                  <h3>Embedded Systems Engineer</h3>
                  <p className="company">Tech Company Inc.</p>
                </div>
                <span className="job-type">Full-time</span>
              </div>
              <p className="job-description">
                Looking for an experienced embedded systems engineer...
              </p>
              <div className="job-meta">
                <span>
                  <FiMapPin /> Remote
                </span>
                <span>
                  <FiDollarSign /> $80k - $120k
                </span>
                <span>
                  <FiClock /> Posted 2 days ago
                </span>
              </div>
              <div className="job-tags">
                <span>C/C++</span>
                <span>RTOS</span>
                <span>ARM</span>
              </div>
              <button className="btn-primary">Apply Now</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
