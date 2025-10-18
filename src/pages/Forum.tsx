import { FiMessageSquare, FiThumbsUp, FiEye, FiClock } from 'react-icons/fi';
import '../styles/forum.css';

export default function Forum() {
  return (
    <div className="forum-page">
      <div className="container">
        <div className="forum-header">
          <h1>Community Forum</h1>
          <button className="btn-primary">New Discussion</button>
        </div>

        <div className="forum-categories">
          {['General', 'Hardware', 'Software', 'Projects', 'Help'].map((cat) => (
            <button key={cat} className="category-btn">
              {cat}
            </button>
          ))}
        </div>

        <div className="discussions-list">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="discussion-card">
              <div className="discussion-avatar">
                <img src="https://via.placeholder.com/50" alt="User" />
              </div>
              <div className="discussion-content">
                <h3>How to interface LCD with Arduino?</h3>
                <p className="discussion-meta">
                  Posted by <strong>John Doe</strong> in <span>Hardware</span>
                </p>
                <p className="discussion-excerpt">
                  I'm trying to connect a 16x2 LCD display to my Arduino...
                </p>
              </div>
              <div className="discussion-stats">
                <span>
                  <FiMessageSquare /> 12
                </span>
                <span>
                  <FiThumbsUp /> 8
                </span>
                <span>
                  <FiEye /> 145
                </span>
                <span>
                  <FiClock /> 2h ago
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
