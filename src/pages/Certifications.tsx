import { FiAward, FiCheckCircle, FiClock, FiBook } from 'react-icons/fi';
import '../styles/certifications.css';

export default function Certifications() {
  return (
    <div className="certifications-page">
      <div className="container">
        <h1>Certifications</h1>
        <p>Earn industry-recognized certificates</p>

        <div className="cert-grid">
          {[1, 2, 3].map((i) => (
            <div key={i} className="cert-card">
              <div className="cert-icon">
                <FiAward size={48} />
              </div>
              <h3>Embedded Systems Professional</h3>
              <p>Master embedded systems development</p>
              <div className="cert-info">
                <span>
                  <FiBook /> 12 modules
                </span>
                <span>
                  <FiClock /> 40 hours
                </span>
                <span>
                  <FiCheckCircle /> Certificate
                </span>
              </div>
              <div className="cert-progress">
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: '60%' }}></div>
                </div>
                <span>60% Complete</span>
              </div>
              <button className="btn-primary">Continue Learning</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
