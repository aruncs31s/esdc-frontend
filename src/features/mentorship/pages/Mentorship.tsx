import { useState } from 'react';
import { FiUser, FiCalendar, FiClock, FiVideo, FiMessageCircle } from 'react-icons/fi';
import '../styles/mentorship.css';

export default function Mentorship() {
  const [activeTab, setActiveTab] = useState<'find' | 'sessions' | 'become'>('find');

  return (
    <div className="mentorship-page">
      <div className="container">
        <div className="page-header">
          <h1>Mentorship Program</h1>
          <p>Connect with experienced mentors or share your knowledge</p>
        </div>

        <div className="tabs">
          <button
            className={activeTab === 'find' ? 'active' : ''}
            onClick={() => setActiveTab('find')}
          >
            Find Mentors
          </button>
          <button
            className={activeTab === 'sessions' ? 'active' : ''}
            onClick={() => setActiveTab('sessions')}
          >
            My Sessions
          </button>
          <button
            className={activeTab === 'become' ? 'active' : ''}
            onClick={() => setActiveTab('become')}
          >
            Become a Mentor
          </button>
        </div>

        {activeTab === 'find' && (
          <div className="mentors-grid">
            {[1, 2, 3].map((i) => (
              <div key={i} className="mentor-card">
                <div className="mentor-avatar">
                  <FiUser size={40} />
                </div>
                <h3>Mentor Name</h3>
                <p className="expertise">Arduino, IoT, Embedded Systems</p>
                <div className="mentor-stats">
                  <span>
                    <FiCalendar /> 50+ sessions
                  </span>
                  <span>
                    <FiClock /> Available
                  </span>
                </div>
                <button className="btn-primary">Book Session</button>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'sessions' && (
          <div className="sessions-list">
            <div className="session-card">
              <div className="session-info">
                <h4>Arduino Basics Session</h4>
                <p>With John Doe</p>
                <span className="session-time">
                  <FiCalendar /> Jan 20, 2025 at 3:00 PM
                </span>
              </div>
              <div className="session-actions">
                <button className="btn-icon">
                  <FiVideo />
                </button>
                <button className="btn-icon">
                  <FiMessageCircle />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
