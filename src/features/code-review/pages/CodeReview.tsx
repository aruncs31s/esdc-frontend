import { FiGitPullRequest, FiCheckCircle, FiClock } from 'react-icons/fi';
import '../styles/code-review.css';

export default function CodeReview() {
  return (
    <div className="code-review-page">
      <div className="container">
        <h1>Code Review</h1>
        <p>Review and approve pull requests</p>

        <div className="review-stats">
          <div className="stat-card">
            <FiGitPullRequest size={32} />
            <h3>15</h3>
            <p>Open PRs</p>
          </div>
          <div className="stat-card">
            <FiCheckCircle size={32} />
            <h3>45</h3>
            <p>Approved</p>
          </div>
          <div className="stat-card">
            <FiClock size={32} />
            <h3>8</h3>
            <p>Pending</p>
          </div>
        </div>

        <div className="pr-list">
          {[1, 2, 3].map((i) => (
            <div key={i} className="pr-card">
              <div className="pr-header">
                <h3>Add authentication feature</h3>
                <span className="pr-status open">Open</span>
              </div>
              <p>Implements JWT-based authentication system</p>
              <div className="pr-meta">
                <span>by John Doe</span>
                <span>2 hours ago</span>
                <span>+150 -20</span>
              </div>
              <button className="btn-primary">Review</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
