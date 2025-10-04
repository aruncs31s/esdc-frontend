import { useState, useEffect, useCallback } from 'react';
import { BsGithub, BsArrowClockwise, BsGit } from 'react-icons/bs';
import { useAuth } from '../contexts/AuthContext';
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

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Beginner': return 'success';
      case 'Intermediate': return 'warning';
      case 'Advanced': return 'danger';
      default: return 'secondary';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'success';
      case 'in-progress': return 'warning';
      case 'not-started': return 'secondary';
      default: return 'secondary';
    }
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
    <section className="hero" style={{ minHeight: 'calc(100vh - 200px)', padding: '2rem 0' }}>
      <div className="container">
        <div className="row mb-4">
          <div className="col">
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb">
                <li className="breadcrumb-item">
                  <a href="/">Home</a>
                </li>
                <li className="breadcrumb-item active">Profile: {displayName}</li>
              </ol>
            </nav>
          </div>
        </div>

        <div className="row mb-4">
          <div className="col-md-4">
            <div className="about-card mb-4">
              <div className="card-icon">👤</div>
              <h3>{displayName}'s Profile</h3>
              <div>
                <div className="d-flex align-items-center mb-3">
                  <img 
                    src={user.avatar_url || `https://github.com/${username}.png`}
                    alt="Profile"
                    className="rounded-circle me-3" 
                    style={{ width: '80px', height: '80px', objectFit: 'cover' }}
                  />
                  <div>
                    <h5 className="mb-1">{displayName}</h5>
                    <a 
                      href={user.html_url || `https://github.com/${username}`}
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-decoration-none"
                    >
                      <BsGithub className="me-1" /> GitHub Profile
                    </a>
                  </div>
                </div>

                <div className="d-flex justify-content-between align-items-center mb-3">
                  <span style={{ color: 'white' }}>Repository synchronization:</span>
                  <button 
                    className="btn btn-sm btn-outline-primary"
                    onClick={handleRefresh}
                    disabled={refreshing}
                  >
                    {refreshing ? (
                      <>
                        <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                        {' '}Syncing...
                      </>
                    ) : (
                      <>
                        <BsArrowClockwise className="me-1" /> Sync with Repo
                      </>
                    )}
                  </button>
                </div>

                <div className="progress mb-3" style={{ height: '25px' }}>
                  <div 
                    className="progress-bar bg-success"
                    role="progressbar" 
                    style={{ width: `${progressPercent}%` }}
                    aria-valuenow={progressPercent} 
                    aria-valuemin="0" 
                    aria-valuemax="100"
                  >
                    <span>{solved}/{challenges.length} Challenges Completed</span>
                  </div>
                </div>

                <div className="row text-center mt-4">
                  <div className="col-4">
                    <div className="p-3 border rounded mb-2">
                      <h3 className="mb-0">{solved}</h3>
                    </div>
                    <span style={{ color: 'white' }}>Solved</span>
                  </div>
                  <div className="col-4">
                    <div className="p-3 border rounded mb-2">
                      <h3 className="mb-0">{beginner}</h3>
                    </div>
                    <span style={{ color: '#a6e3a1' }}>Beginner</span>
                  </div>
                  <div className="col-4">
                    <div className="p-3 border rounded mb-2">
                      <h3 className="mb-0">{advanced}</h3>
                    </div>
                    <span style={{ color: '#f38ba8' }}>Advanced</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-md-8">
            <div className="about-card mb-4">
              <div className="card-icon">🏆</div>
              <h3>Challenge Progress</h3>
              <div>
                <div className="table-responsive">
                  <table className="table table-hover mb-0">
                    <thead className="table-light">
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
                        <tr key={challenge.id} className={challenge.status === 'completed' ? 'table-success' : ''}>
                          <td>{challenge.id}</td>
                          <td>{challenge.title}</td>
                          <td>
                            <span className={`badge rounded-pill bg-${getDifficultyColor(challenge.difficulty)}`}>
                              {challenge.difficulty}
                            </span>
                          </td>
                          <td>
                            <span className={`badge bg-${getStatusColor(challenge.status)}`}>
                              {getStatusText(challenge.status)}
                            </span>
                          </td>
                          <td>-</td>
                          <td>
                            <div className="btn-group btn-group-sm" role="group">
                              <a href="#" className="btn btn-outline-primary">Start</a>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="about-card">
              <div className="card-icon">📝</div>
              <h3>Recent Submissions</h3>
              <div>
                {submissions.length > 0 ? (
                  <div className="list-group list-group-flush">
                    {submissions.slice(0, 5).map((submission, index) => (
                      <div key={index} className="list-group-item d-flex justify-content-between align-items-center">
                        <div>
                          <h6 className="mb-1">{submission.challenge_title}</h6>
                          <small className="text-muted">{new Date(submission.submitted_at).toLocaleDateString()}</small>
                        </div>
                        <span className={`badge bg-${submission.status === 'passed' ? 'success' : submission.status === 'failed' ? 'danger' : 'warning'}`}>
                          {submission.status}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 text-center">
                    <p className="text-muted">No submissions yet.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default UserProfile;