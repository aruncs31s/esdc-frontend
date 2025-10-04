import { useState, useEffect, useCallback } from 'react';
import { BsGithub, BsArrowClockwise } from 'react-icons/bs';
import { useAuth } from '../hooks/useAuth';
import { userAPI } from '../services/api';

const UserProfile = () => {
  const [loading, setLoading] = useState(true);
  const [challenges, setChallenges] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const { user, isAuthenticated } = useAuth();

  const loadChallenges = useCallback(async () => {
    try {
      const response = await userAPI.getChallenges();
      if (response.success) {
        setChallenges(response.challenges || []);
      } else {
        // Fallback to mock data if API fails
        const mockChallenges = [
          { id: 1, title: 'Basic LED Control', difficulty: 'Beginner', status: 'completed' },
          { id: 2, title: 'Motor Control System', difficulty: 'Intermediate', status: 'in-progress' },
          { id: 3, title: 'Advanced Robotics', difficulty: 'Advanced', status: 'not-started' }
        ];
        setChallenges(mockChallenges);
      }
    } catch (error) {
      console.error('Error loading challenges:', error);
      // Fallback to mock data
      const mockChallenges = [
        { id: 1, title: 'Basic LED Control', difficulty: 'Beginner', status: 'completed' },
        { id: 2, title: 'Motor Control System', difficulty: 'Intermediate', status: 'in-progress' },
        { id: 3, title: 'Advanced Robotics', difficulty: 'Advanced', status: 'not-started' }
      ];
      setChallenges(mockChallenges);
    }
  }, []);

  const loadSubmissions = useCallback(async () => {
    try {
      const response = await userAPI.getSubmissions();
      if (response.success) {
        setSubmissions(response.submissions || []);
      }
    } catch (error) {
      console.error('Error loading submissions:', error);
    }
  }, []);

  useEffect(() => {
    if (!isAuthenticated || !user) {
      setLoading(false);
      return;
    }

    const loadUserData = async () => {
      try {
        await Promise.all([
          loadChallenges(),
          loadSubmissions()
        ]);
      } catch (error) {
        console.error('Error loading user data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, [isAuthenticated, user, loadChallenges, loadSubmissions]);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      const response = await userAPI.syncRepository();
      if (response.success) {
        alert(`Successfully synchronized with repository! Found ${response.newSubmissions || 0} new submissions.`);
        await Promise.all([loadChallenges(), loadSubmissions()]);
      } else {
        alert('Failed to synchronize with repository: ' + (response.message || 'Unknown error'));
      }
    } catch (error) {
      alert('Failed to synchronize with repository: ' + error.message);
    } finally {
      setRefreshing(false);
    }
  };

  const handleLogin = () => {
    window.location.href = '/login';
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'completed': return 'Completed';
      case 'in-progress': return 'Attempted';
      case 'not-started': return 'Not Started';
      default: return 'Not Started';
    }
  };

  const solved = challenges.filter(c => c.status === 'completed').length;
  const beginner = challenges.filter(c => c.difficulty === 'Beginner' && c.status === 'completed').length;
  const advanced = challenges.filter(c => c.difficulty === 'Advanced' && c.status === 'completed').length;
  const progressPercent = challenges.length > 0 ? (solved / challenges.length) * 100 : 0;

  if (loading) {
    return (
      <section className="hero" style={{ minHeight: 'calc(100vh - 200px)', padding: '2rem 0' }}>
        <div className="container">
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3">Loading profile...</p>
          </div>
        </div>
      </section>
    );
  }

  if (!user) {
    return (
      <section className="hero" style={{ minHeight: 'calc(100vh - 200px)', padding: '2rem 0' }}>
        <div className="container">
          <div className="about-card text-center py-5 d-block" style={{ maxWidth: '500px', margin: '0 auto' }}>
            <div className="card-icon" style={{ fontSize: '4rem' }}>👤</div>
            <h3 className="mt-3">Login Required</h3>
            <p>Please log in to view your profile and challenge progress.</p>
            <button className="btn btn-primary" onClick={handleLogin}>
              Login with GitHub
            </button>
          </div>
        </div>
      </section>
    );
  }

  const username = user.login || user.name || 'User';
  const displayName = user.name || user.login || 'User';

  return (
    <section className="profile-page">
      <div className="container">

        <div className="section-header">
          <h2>{displayName}'s Profile</h2>
          <p>Track your progress and challenge achievements</p>
        </div>

        <div className="profile-content">
          <div className="profile-sidebar">
            <div className="profile-info-card">
              <div className="profile-avatar-section">
                <img 
                  src={user.avatar_url || `https://github.com/${username}.png`}
                  alt="Profile"
                  className="profile-avatar"
                />
                <h3 className="profile-name">{displayName}</h3>
                <a 
                  href={user.html_url || `https://github.com/${username}`}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="profile-github-link"
                >
                  <BsGithub /> GitHub Profile
                </a>
              </div>

              <button 
                className="btn btn-secondary sync-btn"
                onClick={handleRefresh}
                disabled={refreshing}
              >
                {refreshing ? (
                  <>
                    <span className="spinner-border spinner-border-sm"></span>
                    Syncing...
                  </>
                ) : (
                  <>
                    <BsArrowClockwise /> Sync with Repo
                  </>
                )}
              </button>

              <div className="profile-progress">
                <div className="progress-label">
                  <span>Progress</span>
                  <span>{solved}/{challenges.length}</span>
                </div>
                <div className="progress-bar-wrapper">
                  <div className="progress-bar-fill" style={{ width: `${progressPercent}%` }}></div>
                </div>
              </div>

              <div className="profile-stats">
                <div className="stat-item">
                  <div className="stat-value">{solved}</div>
                  <div className="stat-label">Solved</div>
                </div>
                <div className="stat-item">
                  <div className="stat-value beginner">{beginner}</div>
                  <div className="stat-label">Beginner</div>
                </div>
                <div className="stat-item">
                  <div className="stat-value advanced">{advanced}</div>
                  <div className="stat-label">Advanced</div>
                </div>
              </div>
            </div>
          </div>

          <div className="profile-main">
            <div className="profile-challenges-card">
              <h3><span className="card-icon">🏆</span> Challenge Progress</h3>
              <div className="table-responsive">
                <table className="profile-table">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Challenge</th>
                        <th>Difficulty</th>
                        <th>Status</th>
                        <th>Last Attempt</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {challenges.map(challenge => (
                        <tr key={challenge.id} className={challenge.status === 'completed' ? 'completed' : ''}>
                          <td>{challenge.id}</td>
                          <td>{challenge.title}</td>
                          <td>
                            <span className={`difficulty-badge ${challenge.difficulty.toLowerCase()}`}>
                              {challenge.difficulty}
                            </span>
                          </td>
                          <td>
                            <span className={`status-badge ${challenge.status}`}>
                              {getStatusText(challenge.status)}
                            </span>
                          </td>
                          <td>-</td>
                          <td>
                            <a href="#" className="btn btn-primary btn-sm">Start</a>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
            </div>

            <div className="profile-submissions-card">
              <h3><span className="card-icon">📝</span> Recent Submissions</h3>
              {submissions.length > 0 ? (
                <div className="submissions-list">
                  {submissions.slice(0, 5).map((submission, index) => (
                    <div key={index} className="submission-item">
                      <div>
                        <h6>{submission.challenge_title}</h6>
                        <small>{new Date(submission.submitted_at).toLocaleDateString()}</small>
                      </div>
                      <span className={`status-badge ${submission.status}`}>
                        {submission.status}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="empty-state">
                  <p>No submissions yet.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default UserProfile;