
import { useState } from 'react';
import ProfileCard from '../components/ProfileCard';
import { useAuth } from '../hooks/useAuth';

/**
 * ProfileCardDemo Page
 * A demo page to showcase the ProfileCard component with live examples
 */
const ProfileCardPage = () => {
  const { user: currentUser } = useAuth();
  const [selectedExample, setSelectedExample] = useState('current');

  // Example users data
  const exampleUsers = {
    current: currentUser,
    github: {
      login: 'octocat',
      name: 'The Octocat',
      avatar_url: 'https://github.com/octocat.png',
      html_url: 'https://github.com/octocat',
      bio: 'GitHub mascot and friendly robot',
      created_at: '2011-01-25T18:44:36Z',
      points: 2500,
      completedChallenges: 30
    },
    admin: {
      username: 'admin_user',
      name: 'Admin User',
      email: 'admin@esdc.com',
      bio: 'System administrator and platform maintainer',
      role: 'admin',
      points: 5000,
      completedChallenges: 50,
      joinedDate: '2024-01-01T00:00:00Z',
      githubUsername: 'admin_user'
    },
    minimal: {
      username: 'newuser',
      name: 'New User',
      email: 'newuser@example.com'
    },
    complete: {
      username: 'johndoe',
      name: 'John Doe',
      email: 'john.doe@example.com',
      bio: 'Full-stack developer passionate about robotics and embedded systems',
      avatar_url: 'https://github.com/johndoe.png',
      githubUsername: 'johndoe',
      role: 'user',
      points: 1750,
      completedChallenges: 22,
      joinedDate: '2024-06-15T10:30:00Z'
    }
  };

  const examples = [
    { key: 'current', label: 'Current User', description: 'Your current logged-in profile' },
    { key: 'github', label: 'GitHub User', description: 'User with GitHub integration' },
    { key: 'admin', label: 'Admin User', description: 'User with admin role badge' },
    { key: 'minimal', label: 'Minimal Data', description: 'User with basic information only' },
    { key: 'complete', label: 'Complete Profile', description: 'User with all fields populated' }
  ];

  const handleEdit = () => {
    alert('Edit profile functionality would be triggered here!');
  };

  const selectedUser = exampleUsers[selectedExample];

  return (
    <section className="hero" style={{ minHeight: '100vh', padding: '40px 0' }}>
      <div className="container">
        {/* Header */}
        <div className="text-center mb-5">
          <h1 className="display-4 mb-3">ProfileCard Component Demo</h1>
          <p className="lead" style={{ color: 'var(--subtext0)' }}>
            Interactive showcase of the ProfileCard component with various configurations
          </p>
        </div>

        <div className="row">
          {/* Sidebar - Example Selector */}
          <div className="col-md-3 mb-4">
            <div className="about-card">
              <h4 className="mb-3">Select Example</h4>
              <div className="list-group">
                {examples.map((example) => (
                  <button
                    key={example.key}
                    className={`list-group-item list-group-item-action ${
                      selectedExample === example.key ? 'active' : ''
                    }`}
                    onClick={() => setSelectedExample(example.key)}
                    style={{
                      backgroundColor: selectedExample === example.key ? 'var(--blue)' : 'var(--surface0)',
                      border: '1px solid var(--surface1)',
                      color: selectedExample === example.key ? 'white' : 'var(--text)',
                      marginBottom: '8px',
                      borderRadius: '8px'
                    }}
                  >
                    <div className="fw-bold">{example.label}</div>
                    <small style={{ 
                      color: selectedExample === example.key ? 'rgba(255,255,255,0.8)' : 'var(--subtext0)' 
                    }}>
                      {example.description}
                    </small>
                  </button>
                ))}
              </div>

              <div className="mt-4 p-3" style={{ 
                background: 'var(--surface0)', 
                borderRadius: '8px',
                fontSize: '0.9rem'
              }}>
                <h6 className="mb-2">Features Shown:</h6>
                <ul style={{ paddingLeft: '20px', margin: 0 }}>
                  <li>Gradient header</li>
                  <li>Avatar display</li>
                  <li>User information</li>
                  <li>GitHub integration</li>
                  <li>Role badges</li>
                  <li>Statistics</li>
                  <li>Responsive design</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Main Content - Profile Card Display */}
          <div className="col-md-6 mb-4">
            <div className="about-card">
              <h4 className="mb-4 text-center">Live Preview</h4>
              <ProfileCard 
                user={selectedUser}
                editable={true}
                onEdit={handleEdit}
                showStats={true}
              />
            </div>

            {/* Configuration Options */}
            <div className="about-card mt-4">
              <h5 className="mb-3">Current Configuration</h5>
              <div className="table-responsive">
                <table className="table table-sm" style={{ color: 'var(--text)' }}>
                  <tbody>
                    <tr>
                      <td className="fw-bold">Editable:</td>
                      <td>
                        <span className="badge bg-success">True</span>
                      </td>
                    </tr>
                    <tr>
                      <td className="fw-bold">Show Statistics:</td>
                      <td>
                        <span className="badge bg-success">True</span>
                      </td>
                    </tr>
                    <tr>
                      <td className="fw-bold">User Data:</td>
                      <td>
                        <span className="badge bg-info">
                          {selectedUser ? 'Loaded' : 'Empty'}
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td className="fw-bold">Avatar:</td>
                      <td>
                        <span className={`badge ${selectedUser?.avatar_url || selectedUser?.avatar ? 'bg-success' : 'bg-warning'}`}>
                          {selectedUser?.avatar_url || selectedUser?.avatar ? 'Custom' : 'Fallback'}
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Right Panel - Usage Code */}
          <div className="col-md-3 mb-4">
            <div className="about-card">
              <h5 className="mb-3">Usage Code</h5>
              <pre style={{
                background: 'var(--surface0)',
                padding: '15px',
                borderRadius: '8px',
                fontSize: '0.75rem',
                overflow: 'auto',
                maxHeight: '400px'
              }}>
                <code>{`import ProfileCard from './components/ProfileCard';

function MyComponent() {
  const user = ${JSON.stringify(selectedUser, null, 2)};

  return (
    <ProfileCard 
      user={user}
      editable={true}
      onEdit={handleEdit}
      showStats={true}
    />
  );
}`}</code>
              </pre>
            </div>

            <div className="about-card mt-4">
              <h6 className="mb-3">Quick Actions</h6>
              <div className="d-grid gap-2">
                <button 
                  className="btn btn-outline-primary btn-sm"
                  onClick={() => window.open('/docs/ProfileCard.md', '_blank')}
                >
                  📖 View Documentation
                </button>
                <button 
                  className="btn btn-outline-success btn-sm"
                  onClick={() => {
                    const code = `<ProfileCard user={user} editable={true} onEdit={handleEdit} showStats={true} />`;
                    navigator.clipboard.writeText(code);
                    alert('Code copied to clipboard!');
                  }}
                >
                  📋 Copy Code
                </button>
                <a 
                  href="https://github.com/aruncs31s/esdc-frontend/blob/main/src/components/ProfileCard.jsx"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-outline-info btn-sm"
                >
                  💻 View Source
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Multiple Cards Grid Example */}
        <div className="row mt-5">
          <div className="col-12">
            <div className="about-card">
              <h4 className="mb-4">Multiple Cards Grid Example</h4>
              <p style={{ color: 'var(--subtext0)' }} className="mb-4">
                Demonstration of multiple ProfileCards in a responsive grid layout
              </p>
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '20px'
              }}>
                {Object.values(exampleUsers).filter(u => u).slice(0, 4).map((user, index) => (
                  <ProfileCard 
                    key={index}
                    user={user}
                    showStats={true}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-5">
          <a href="/" className="btn btn-primary btn-lg">
            ← Back to Home
          </a>
        </div>
      </div>
    </section>
  );
};

export default ProfileCardPage;
