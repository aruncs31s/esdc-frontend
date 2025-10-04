import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { adminAPI } from '../services/api';
import ChallengesTable from '../components/table_views/ChallengeTable';
import UsersTable from '../components/table_views/UserTable';
import ProjectsTable from '../components/table_views/ProjectsTable';
import User from '../models/user.js';

import CreateModal from '../components/modals/CreateModal';
import { 
  FaUsers, 
  FaProjectDiagram, 
  FaTasks, 
  FaChartLine,
  FaPlus,
  FaSearch,
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
      setUsers(Array.isArray(usersData) ? usersData : []);
      setProjects(Array.isArray(projectsData) ? projectsData : []);
      setChallenges(Array.isArray(challengesData) ? challengesData : []);
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

  const filteredUsers = (users || []).filter(user => {
    const searchLower = searchTerm.toLowerCase();
    // Use User model methods if available
    if (user instanceof User) {
      return user.username.toLowerCase().includes(searchLower) ||
             user.email.toLowerCase().includes(searchLower) ||
             user.getDisplayName().toLowerCase().includes(searchLower);
    }
    // Fallback for plain objects
    return user.username?.toLowerCase().includes(searchLower) ||
           user.email?.toLowerCase().includes(searchLower);
  });

  const filteredProjects = (projects || []).filter(project =>
    project.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredChallenges = (challenges || []).filter(challenge =>
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




export default AdminPanel;
