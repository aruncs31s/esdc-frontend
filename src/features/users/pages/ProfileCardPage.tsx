import { useNavigate } from 'react-router-dom';
import ProfileCard from '@/shared/components/ui/ProfileCard';
import { useAuth } from '../modules/auth/useAuth';

/**
 * ProfileCard Page
 * Displays the logged-in user's profile using the ProfileCard component
 */
const ProfileCardPage = () => {
  const { user: currentUser, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();

  const handleEdit = () => {
    // Navigate to profile edit page or open edit modal
    alert('Edit profile functionality would be triggered here!');
    // You can implement this by navigating to an edit page:
    // navigate('/profile/edit');
  };

  // Loading state
  if (loading) {
    return (
      <section className="hero" style={{ minHeight: '100vh', padding: '40px 0' }}>
        <div className="container">
          <div className="text-center">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3" style={{ color: 'var(--subtext0)' }}>
              Loading your profile...
            </p>
          </div>
        </div>
      </section>
    );
  }

  // Not authenticated - redirect to login
  if (!isAuthenticated || !currentUser) {
    return (
      <section className="hero" style={{ minHeight: '100vh', padding: '40px 0' }}>
        <div className="container">
          <div className="text-center">
            <div className="about-card" style={{ maxWidth: '500px', margin: '0 auto' }}>
              <h3 className="mb-3">Authentication Required</h3>
              <p style={{ color: 'var(--subtext0)' }} className="mb-4">
                Please log in to view your profile.
              </p>
              <button className="btn btn-primary btn-lg" onClick={() => navigate('/login')}>
                Go to Login
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="hero" style={{ minHeight: '100vh', padding: '40px 0' }}>
      <div className="container">
        {/* Header */}
        <div className="text-center mb-5">
          <h1 className="display-4 mb-3">My Profile</h1>
          <p className="lead" style={{ color: 'var(--subtext0)' }}>
            View and manage your profile information
          </p>
        </div>

        <div className="row justify-content-center">
          {/* Main Content - Profile Card Display */}
          <div className="col-md-8 col-lg-6 mb-4">
            <ProfileCard user={currentUser} editable={true} onEdit={handleEdit} showStats={true} />

            {/* Profile Information */}
            <div className="about-card mt-4">
              <h5 className="mb-3">Profile Information</h5>
              <div className="table-responsive">
                <table className="table table-sm" style={{ color: 'var(--text)' }}>
                  <tbody>
                    <tr>
                      <td className="fw-bold">Name:</td>
                      <td>{currentUser.name || 'Not set'}</td>
                    </tr>
                    <tr>
                      <td className="fw-bold">Email:</td>
                      <td>{currentUser.email || 'Not set'}</td>
                    </tr>
                    <tr>
                      <td className="fw-bold">Role:</td>
                      <td>
                        <span
                          className={`badge ${currentUser.role === 'admin' ? 'bg-danger' : 'bg-primary'}`}
                        >
                          {currentUser.role || 'User'}
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td className="fw-bold">GitHub:</td>
                      <td>
                        {currentUser.github_username ? (
                          <a
                            href={`https://github.com/${currentUser.github_username}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-decoration-none"
                          >
                            @{currentUser.github_username}
                          </a>
                        ) : (
                          <span style={{ color: 'var(--subtext0)' }}>Not connected</span>
                        )}
                      </td>
                    </tr>
                    <tr>
                      <td className="fw-bold">Member Since:</td>
                      <td>
                        {currentUser.createdAt
                          ? new Date(currentUser.createdAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                            })
                          : 'Unknown'}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="about-card mt-4">
              <h6 className="mb-3">Quick Actions</h6>
              <div className="d-grid gap-2">
                <button className="btn btn-outline-primary" onClick={handleEdit}>
                  ✏️ Edit Profile
                </button>
                <button
                  className="btn btn-outline-secondary"
                  onClick={() => navigate('/dashboard')}
                >
                  📊 Go to Dashboard
                </button>
                {currentUser.github_username && (
                  <a
                    href={`https://github.com/${currentUser.github_username}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-outline-info"
                  >
                    💻 View GitHub Profile
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Back Navigation */}
        <div className="text-center mt-5">
          <button className="btn btn-outline-secondary btn-lg" onClick={() => navigate(-1)}>
            ← Go Back
          </button>
        </div>
      </div>
    </section>
  );
};

export default ProfileCardPage;
