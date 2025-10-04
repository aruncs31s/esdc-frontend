import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { adminAPI } from '../services/api';
import { 
  FaUsers, 
  FaProjectDiagram, 
  FaTasks, 
  FaChartLine,
  FaEdit,
  FaTrash,
  FaPlus,
  FaSearch,
  FaFilter
} from 'react-icons/fa';

const AdminPanel = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('users');
  const [users, setUsers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [challenges, setChallenges] = useState([]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProjects: 0,
    totalChallenges: 0,
    activeUsers: 0
  });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [modalType, setModalType] = useState('');

  useEffect(() => {
    loadAdminData();
  }, [activeTab]);

  const loadAdminData = async () => {
    setLoading(true);
    try {
      const [statsData, usersData, projectsData, challengesData] = await Promise.all([
        adminAPI.getStats(),
        adminAPI.getUsers(),
        adminAPI.getProjects(),
        adminAPI.getChallenges()
      ]);

      setStats(statsData);
      setUsers(usersData);
      setProjects(projectsData);
      setChallenges(challengesData);
    } catch (error) {
      console.error('Error loading admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateNew = (type) => {
    setModalType(type);
    setShowCreateModal(true);
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await adminAPI.deleteUser(userId);
        await loadAdminData();
      } catch (error) {
        console.error('Error deleting user:', error);
        alert('Failed to delete user');
      }
    }
  };

  const handleDeleteProject = async (projectId) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        await adminAPI.deleteProject(projectId);
        await loadAdminData();
      } catch (error) {
        console.error('Error deleting project:', error);
        alert('Failed to delete project');
      }
    }
  };

  const handleDeleteChallenge = async (challengeId) => {
    if (window.confirm('Are you sure you want to delete this challenge?')) {
      try {
        await adminAPI.deleteChallenge(challengeId);
        await loadAdminData();
      } catch (error) {
        console.error('Error deleting challenge:', error);
        alert('Failed to delete challenge');
      }
    }
  };

  const filteredUsers = users.filter(user =>
    user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredProjects = projects.filter(project =>
    project.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredChallenges = challenges.filter(challenge =>
    challenge.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    challenge.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="loading-container" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-panel" style={{ minHeight: '100vh', paddingTop: '80px' }}>
      <div className="container" style={{ maxWidth: '1400px', margin: '0 auto', padding: '2rem' }}>
        {/* Header */}
        <div className="admin-header" style={{ marginBottom: '2rem' }}>
          <h1 className="gradient-text" style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '0.5rem' }}>
            Admin Panel
          </h1>
          <p style={{ color: 'var(--subtext0)', fontSize: '1.1rem' }}>
            Welcome back, {user?.username || 'Admin'}
          </p>
        </div>

        {/* Stats Cards */}
        <div className="stats-grid" style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
          gap: '1.5rem', 
          marginBottom: '2rem' 
        }}>
          <div className="stat-card glass-card" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <p style={{ color: 'var(--subtext0)', marginBottom: '0.5rem' }}>Total Users</p>
                <h3 style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--text)' }}>{stats.totalUsers}</h3>
              </div>
              <FaUsers style={{ fontSize: '2.5rem', color: 'var(--blue)' }} />
            </div>
          </div>

          <div className="stat-card glass-card" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <p style={{ color: 'var(--subtext0)', marginBottom: '0.5rem' }}>Total Projects</p>
                <h3 style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--text)' }}>{stats.totalProjects}</h3>
              </div>
              <FaProjectDiagram style={{ fontSize: '2.5rem', color: 'var(--lavender)' }} />
            </div>
          </div>

          <div className="stat-card glass-card" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <p style={{ color: 'var(--subtext0)', marginBottom: '0.5rem' }}>Total Challenges</p>
                <h3 style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--text)' }}>{stats.totalChallenges}</h3>
              </div>
              <FaTasks style={{ fontSize: '2.5rem', color: 'var(--mauve)' }} />
            </div>
          </div>

          <div className="stat-card glass-card" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <p style={{ color: 'var(--subtext0)', marginBottom: '0.5rem' }}>Active Users</p>
                <h3 style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--text)' }}>{stats.activeUsers}</h3>
              </div>
              <FaChartLine style={{ fontSize: '2.5rem', color: 'var(--green)' }} />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="admin-tabs" style={{ marginBottom: '2rem' }}>
          <div className="tabs-container" style={{ 
            display: 'flex', 
            gap: '1rem', 
            borderBottom: '2px solid var(--surface0)',
            flexWrap: 'wrap'
          }}>
            <button
              className={`tab-btn ${activeTab === 'users' ? 'active' : ''}`}
              onClick={() => setActiveTab('users')}
              style={{
                padding: '1rem 2rem',
                background: activeTab === 'users' ? 'var(--blue)' : 'transparent',
                color: activeTab === 'users' ? 'var(--base)' : 'var(--text)',
                border: 'none',
                borderRadius: '8px 8px 0 0',
                cursor: 'pointer',
                fontWeight: '600',
                transition: 'all 0.3s ease'
              }}
            >
              <FaUsers style={{ marginRight: '0.5rem' }} />
              Users
            </button>

            <button
              className={`tab-btn ${activeTab === 'projects' ? 'active' : ''}`}
              onClick={() => setActiveTab('projects')}
              style={{
                padding: '1rem 2rem',
                background: activeTab === 'projects' ? 'var(--blue)' : 'transparent',
                color: activeTab === 'projects' ? 'var(--base)' : 'var(--text)',
                border: 'none',
                borderRadius: '8px 8px 0 0',
                cursor: 'pointer',
                fontWeight: '600',
                transition: 'all 0.3s ease'
              }}
            >
              <FaProjectDiagram style={{ marginRight: '0.5rem' }} />
              Projects
            </button>

            <button
              className={`tab-btn ${activeTab === 'challenges' ? 'active' : ''}`}
              onClick={() => setActiveTab('challenges')}
              style={{
                padding: '1rem 2rem',
                background: activeTab === 'challenges' ? 'var(--blue)' : 'transparent',
                color: activeTab === 'challenges' ? 'var(--base)' : 'var(--text)',
                border: 'none',
                borderRadius: '8px 8px 0 0',
                cursor: 'pointer',
                fontWeight: '600',
                transition: 'all 0.3s ease'
              }}
            >
              <FaTasks style={{ marginRight: '0.5rem' }} />
              Challenges
            </button>
          </div>
        </div>

        {/* Search and Create Bar */}
        <div className="action-bar" style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          marginBottom: '2rem',
          gap: '1rem',
          flexWrap: 'wrap'
        }}>
          <div className="search-box" style={{ flex: '1', minWidth: '250px', position: 'relative' }}>
            <FaSearch style={{ 
              position: 'absolute', 
              left: '1rem', 
              top: '50%', 
              transform: 'translateY(-50%)',
              color: 'var(--subtext0)'
            }} />
            <input
              type="text"
              placeholder={`Search ${activeTab}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem 1rem 0.75rem 3rem',
                borderRadius: '12px',
                border: '1px solid var(--surface0)',
                background: 'var(--base)',
                color: 'var(--text)',
                fontSize: '1rem'
              }}
            />
          </div>

          <button
            onClick={() => handleCreateNew(activeTab)}
            className="btn-primary"
            style={{
              padding: '0.75rem 2rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <FaPlus />
            Create {activeTab.slice(0, -1).charAt(0).toUpperCase() + activeTab.slice(1, -1)}
          </button>
        </div>

        {/* Content */}
        <div className="admin-content glass-card" style={{ padding: '2rem', borderRadius: '20px' }}>
          {activeTab === 'users' && <UsersTable users={filteredUsers} onDelete={handleDeleteUser} />}
          {activeTab === 'projects' && <ProjectsTable projects={filteredProjects} onDelete={handleDeleteProject} />}
          {activeTab === 'challenges' && <ChallengesTable challenges={filteredChallenges} onDelete={handleDeleteChallenge} />}
        </div>
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <CreateModal
          type={modalType}
          onClose={() => setShowCreateModal(false)}
          onSuccess={() => {
            setShowCreateModal(false);
            loadAdminData();
          }}
        />
      )}
    </div>
  );
};

// Users Table Component
const UsersTable = ({ users, onDelete }) => {
  return (
    <div className="table-responsive">
      <table className="table" style={{ width: '100%' }}>
        <thead>
          <tr>
            <th style={{ padding: '1rem', textAlign: 'left', color: 'var(--subtext0)' }}>Username</th>
            <th style={{ padding: '1rem', textAlign: 'left', color: 'var(--subtext0)' }}>Email</th>
            <th style={{ padding: '1rem', textAlign: 'left', color: 'var(--subtext0)' }}>Role</th>
            <th style={{ padding: '1rem', textAlign: 'left', color: 'var(--subtext0)' }}>Status</th>
            <th style={{ padding: '1rem', textAlign: 'left', color: 'var(--subtext0)' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} style={{ borderTop: '1px solid var(--surface0)' }}>
              <td style={{ padding: '1rem', color: 'var(--text)' }}>{user.username}</td>
              <td style={{ padding: '1rem', color: 'var(--text)' }}>{user.email}</td>
              <td style={{ padding: '1rem' }}>
                <span className="badge" style={{ 
                  padding: '0.3rem 0.8rem',
                  borderRadius: '20px',
                  background: user.role === 'admin' ? 'var(--red)' : 'var(--blue)',
                  color: 'var(--base)'
                }}>
                  {user.role}
                </span>
              </td>
              <td style={{ padding: '1rem' }}>
                <span className="badge" style={{ 
                  padding: '0.3rem 0.8rem',
                  borderRadius: '20px',
                  background: user.status === 'active' ? 'var(--green)' : 'var(--yellow)',
                  color: 'var(--base)'
                }}>
                  {user.status}
                </span>
              </td>
              <td style={{ padding: '1rem' }}>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    className="btn-sm btn-outline-primary"
                    title="Edit"
                    style={{
                      padding: '0.5rem',
                      borderRadius: '8px',
                      border: '1px solid var(--blue)',
                      background: 'transparent',
                      color: 'var(--blue)',
                      cursor: 'pointer'
                    }}
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => onDelete(user.id)}
                    className="btn-sm"
                    title="Delete"
                    style={{
                      padding: '0.5rem',
                      borderRadius: '8px',
                      border: '1px solid var(--red)',
                      background: 'transparent',
                      color: 'var(--red)',
                      cursor: 'pointer'
                    }}
                  >
                    <FaTrash />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {users.length === 0 && (
        <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--subtext0)' }}>
          No users found
        </div>
      )}
    </div>
  );
};

// Projects Table Component
const ProjectsTable = ({ projects, onDelete }) => {
  return (
    <div className="table-responsive">
      <table className="table" style={{ width: '100%' }}>
        <thead>
          <tr>
            <th style={{ padding: '1rem', textAlign: 'left', color: 'var(--subtext0)' }}>Title</th>
            <th style={{ padding: '1rem', textAlign: 'left', color: 'var(--subtext0)' }}>Description</th>
            <th style={{ padding: '1rem', textAlign: 'left', color: 'var(--subtext0)' }}>Status</th>
            <th style={{ padding: '1rem', textAlign: 'left', color: 'var(--subtext0)' }}>Created</th>
            <th style={{ padding: '1rem', textAlign: 'left', color: 'var(--subtext0)' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {projects.map((project) => (
            <tr key={project.id} style={{ borderTop: '1px solid var(--surface0)' }}>
              <td style={{ padding: '1rem', color: 'var(--text)', fontWeight: '600' }}>{project.title}</td>
              <td style={{ padding: '1rem', color: 'var(--text)' }}>
                {project.description?.substring(0, 50)}...
              </td>
              <td style={{ padding: '1rem' }}>
                <span className="badge" style={{ 
                  padding: '0.3rem 0.8rem',
                  borderRadius: '20px',
                  background: project.status === 'active' ? 'var(--green)' : 'var(--yellow)',
                  color: 'var(--base)'
                }}>
                  {project.status}
                </span>
              </td>
              <td style={{ padding: '1rem', color: 'var(--text)' }}>
                {new Date(project.createdAt).toLocaleDateString()}
              </td>
              <td style={{ padding: '1rem' }}>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    className="btn-sm btn-outline-primary"
                    title="Edit"
                    style={{
                      padding: '0.5rem',
                      borderRadius: '8px',
                      border: '1px solid var(--blue)',
                      background: 'transparent',
                      color: 'var(--blue)',
                      cursor: 'pointer'
                    }}
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => onDelete(project.id)}
                    className="btn-sm"
                    title="Delete"
                    style={{
                      padding: '0.5rem',
                      borderRadius: '8px',
                      border: '1px solid var(--red)',
                      background: 'transparent',
                      color: 'var(--red)',
                      cursor: 'pointer'
                    }}
                  >
                    <FaTrash />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {projects.length === 0 && (
        <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--subtext0)' }}>
          No projects found
        </div>
      )}
    </div>
  );
};

// Challenges Table Component
const ChallengesTable = ({ challenges, onDelete }) => {
  return (
    <div className="table-responsive">
      <table className="table" style={{ width: '100%' }}>
        <thead>
          <tr>
            <th style={{ padding: '1rem', textAlign: 'left', color: 'var(--subtext0)' }}>Title</th>
            <th style={{ padding: '1rem', textAlign: 'left', color: 'var(--subtext0)' }}>Difficulty</th>
            <th style={{ padding: '1rem', textAlign: 'left', color: 'var(--subtext0)' }}>Points</th>
            <th style={{ padding: '1rem', textAlign: 'left', color: 'var(--subtext0)' }}>Status</th>
            <th style={{ padding: '1rem', textAlign: 'left', color: 'var(--subtext0)' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {challenges.map((challenge) => (
            <tr key={challenge.id} style={{ borderTop: '1px solid var(--surface0)' }}>
              <td style={{ padding: '1rem', color: 'var(--text)', fontWeight: '600' }}>{challenge.title}</td>
              <td style={{ padding: '1rem' }}>
                <span className="badge" style={{ 
                  padding: '0.3rem 0.8rem',
                  borderRadius: '20px',
                  background: 
                    challenge.difficulty === 'Easy' ? 'var(--green)' :
                    challenge.difficulty === 'Medium' ? 'var(--yellow)' :
                    'var(--red)',
                  color: 'var(--base)'
                }}>
                  {challenge.difficulty}
                </span>
              </td>
              <td style={{ padding: '1rem', color: 'var(--text)' }}>{challenge.points}</td>
              <td style={{ padding: '1rem' }}>
                <span className="badge" style={{ 
                  padding: '0.3rem 0.8rem',
                  borderRadius: '20px',
                  background: challenge.status === 'active' ? 'var(--green)' : 'var(--yellow)',
                  color: 'var(--base)'
                }}>
                  {challenge.status}
                </span>
              </td>
              <td style={{ padding: '1rem' }}>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    className="btn-sm btn-outline-primary"
                    title="Edit"
                    style={{
                      padding: '0.5rem',
                      borderRadius: '8px',
                      border: '1px solid var(--blue)',
                      background: 'transparent',
                      color: 'var(--blue)',
                      cursor: 'pointer'
                    }}
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => onDelete(challenge.id)}
                    className="btn-sm"
                    title="Delete"
                    style={{
                      padding: '0.5rem',
                      borderRadius: '8px',
                      border: '1px solid var(--red)',
                      background: 'transparent',
                      color: 'var(--red)',
                      cursor: 'pointer'
                    }}
                  >
                    <FaTrash />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {challenges.length === 0 && (
        <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--subtext0)' }}>
          No challenges found
        </div>
      )}
    </div>
  );
};

// Create Modal Component
const CreateModal = ({ type, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (type === 'projects') {
        await adminAPI.createProject(formData);
      } else if (type === 'challenges') {
        await adminAPI.createChallenge(formData);
      }
      onSuccess();
    } catch (error) {
      console.error('Error creating:', error);
      alert('Failed to create ' + type.slice(0, -1));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.7)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    }}>
      <div className="modal-content glass-card" style={{
        maxWidth: '600px',
        width: '90%',
        maxHeight: '90vh',
        overflow: 'auto',
        padding: '2rem',
        borderRadius: '20px'
      }}>
        <h2 style={{ marginBottom: '1.5rem', color: 'var(--text)' }}>
          Create New {type.slice(0, -1).charAt(0).toUpperCase() + type.slice(1, -1)}
        </h2>

        <form onSubmit={handleSubmit}>
          {type === 'projects' && (
            <>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text)' }}>Title</label>
                <input
                  type="text"
                  required
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    borderRadius: '8px',
                    border: '1px solid var(--surface0)',
                    background: 'var(--base)',
                    color: 'var(--text)'
                  }}
                />
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text)' }}>Description</label>
                <textarea
                  required
                  rows={4}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    borderRadius: '8px',
                    border: '1px solid var(--surface0)',
                    background: 'var(--base)',
                    color: 'var(--text)'
                  }}
                />
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text)' }}>GitHub URL</label>
                <input
                  type="url"
                  onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    borderRadius: '8px',
                    border: '1px solid var(--surface0)',
                    background: 'var(--base)',
                    color: 'var(--text)'
                  }}
                />
              </div>
            </>
          )}

          {type === 'challenges' && (
            <>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text)' }}>Title</label>
                <input
                  type="text"
                  required
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    borderRadius: '8px',
                    border: '1px solid var(--surface0)',
                    background: 'var(--base)',
                    color: 'var(--text)'
                  }}
                />
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text)' }}>Description</label>
                <textarea
                  required
                  rows={4}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    borderRadius: '8px',
                    border: '1px solid var(--surface0)',
                    background: 'var(--base)',
                    color: 'var(--text)'
                  }}
                />
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text)' }}>Difficulty</label>
                <select
                  required
                  onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    borderRadius: '8px',
                    border: '1px solid var(--surface0)',
                    background: 'var(--base)',
                    color: 'var(--text)'
                  }}
                >
                  <option value="">Select difficulty</option>
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text)' }}>Points</label>
                <input
                  type="number"
                  required
                  min="0"
                  onChange={(e) => setFormData({ ...formData, points: parseInt(e.target.value) })}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    borderRadius: '8px',
                    border: '1px solid var(--surface0)',
                    background: 'var(--base)',
                    color: 'var(--text)'
                  }}
                />
              </div>
            </>
          )}

          <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary"
              style={{ flex: 1 }}
            >
              {loading ? 'Creating...' : 'Create'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary"
              style={{ flex: 1 }}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminPanel;
