import { FiCalendar, FiMapPin, FiUsers, FiClock } from 'react-icons/fi';
import '../styles/workshops.css';

export default function Workshops() {
  return (
    <div className="workshops-page">
      <div className="container">
        <h1>Workshops & Training</h1>
        <p>Hands-on learning experiences with industry experts</p>

        <div className="workshops-grid">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="workshop-card">
              <div className="workshop-image">
                <img src="https://via.placeholder.com/400x200" alt="Workshop" />
              </div>
              <div className="workshop-content">
                <span className="workshop-category">Hardware</span>
                <h3>PCB Design Fundamentals</h3>
                <p>Learn to design professional PCBs using KiCad</p>
                <div className="workshop-details">
                  <span>
                    <FiCalendar /> Jan 25, 2025
                  </span>
                  <span>
                    <FiClock /> 3 hours
                  </span>
                  <span>
                    <FiMapPin /> Online
                  </span>
                  <span>
                    <FiUsers /> 20 seats
                  </span>
                </div>
                <button className="btn-primary">Enroll Now</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
