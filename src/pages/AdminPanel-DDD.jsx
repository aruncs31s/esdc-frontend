import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import applicationService from '../application/ApplicationService';
import ChallengesTable from '../components/table_views/ChallengeTable';
import UsersTable from '../components/table_views/UserTable';
import ProjectsTable from '../components/table_views/ProjectsTable';

import CreateModal from '../components/modals/CreateModal';
import { 
  FaUsers, 
  FaProjectDiagram, 
  FaTasks, 
  FaChartLine,
  FaPlus,
  FaSearch,
} from 'react-icons/fa';

/**
 * Admin Panel - Updated to use DDD Architecture
 * Uses ApplicationService instead of direct API calls
 */
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
      // Use ApplicationService instead of direct API calls
      const [statsData, usersResult, projectsData, challengesData] = await Promise.all([
        applicationService.getAdminStats(),
        applicationService.getAllUsers(),
        applicationService.getAllProjects(),
        applicationService.getAllChallenges()
      ]);

      setStats(statsData);
      // ApplicationService returns {success, data, ...}
      setUsers(usersResult.data || []);
      setProjects(projectsData || []);
      setChallenges(challengesData || []);
    } catch (error) {
      console.error('Error loading admin data:', error);
      // Set empty arrays on error
      setUsers([]);
      setProjects([]);
      setChallenges([]);
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
        const result = await applicationService.deleteUser(userId);
        if (result.success) {
          alert('User deleted successfully');
          await loadAdminData();
        } else {
          alert(`Failed to delete user: ${result.error}`);
        }
      } catch (error) {
        console.error('Error deleting user:', error);
        alert('Failed to delete user');
      }
    }
  };

  const handleDeleteProject = async (projectId) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        await applicationService.deleteProject(projectId);
        alert('Project deleted successfully');
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
        await applicationService.deleteChallenge(challengeId);
        alert('Challenge deleted successfully');
        await loadAdminData();
      } catch (error) {
        console.error('Error deleting challenge:', error);
        alert('Failed to delete challenge');
      }
    }
  };

  // Filter logic using domain entity methods
  const filteredUsers = (users || []).filter(user => {
    const searchLower = searchTerm.toLowerCase();
    // Use domain entity methods if available
    if (typeof user.getDisplayName === 'function') {
      return user.username?.toLowerCase().includes(searchLower) ||
             user.email?.value?.toLowerCase().includes(searchLower) ||
             user.email?.toString()?.toLowerCase().includes(searchLower) ||
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
      <div className="admin-panel-loading">
        <div className="container">
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status" style={{ width: '3rem', height: '3rem' }}>
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3">Loading admin panel...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!user?.role || user.role !== 'admin') {
    return (
      <div className="admin-panel">
        <div className="container">
          <div className="alert alert-danger mt-5">
            <h4>Access Denied</h4>
            <p>You do not have permission to access the admin panel.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-panel">
      <div className="container">
        <div className="admin-header">
          <h1>Admin Panel</h1>
          <p className="text-muted">Manage users, projects, and challenges</p>
        </div>

        {/* Stats Cards */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">
              <FaUsers />
            </div>
            <div className="stat-content">
              <h3>{stats.totalUsers}</h3>
              <p>Total Users</p>
              <span className="stat-subtext">{stats.activeUsers} active</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              <FaProjectDiagram />
            </div>
            <div className="stat-content">
              <h3>{stats.totalProjects}</h3>
              <p>Total Projects</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              <FaTasks />
            </div>
            <div className="stat-content">
              <h3>{stats.totalChallenges}</h3>
              <p>Total Challenges</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              <FaChartLine />
            </div>
            <div className="stat-content">
              <h3>{Math.round((stats.activeUsers / stats.totalUsers) * 100) || 0}%</h3>
              <p>Active Rate</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="admin-tabs">
          <button
            className={`tab-button ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => setActiveTab('users')}
          >
            <FaUsers /> Users
          </button>
          <button
            className={`tab-button ${activeTab === 'projects' ? 'active' : ''}`}
            onClick={() => setActiveTab('projects')}
          >
            <FaProjectDiagram /> Projects
          </button>
          <button
            className={`tab-button ${activeTab === 'challenges' ? 'active' : ''}`}
            onClick={() => setActiveTab('challenges')}
          >
            <FaTasks /> Challenges
          </button>
        </div>

        {/* Toolbar */}
        <div className="admin-toolbar">
          <div className="search-box">
            <FaSearch />
            <input
              type="text"
              placeholder={`Search ${activeTab}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button
            onClick={() => handleCreateNew(activeTab)}
            className="btn-create"
          >
            <FaPlus /> Create {activeTab.slice(0, -1)}
          </button>
        </div>

        {/* Content */}
        <div className="admin-content">
          {activeTab === 'users' && (
            <UsersTable
              users={filteredUsers}
              onDelete={handleDeleteUser}
            />
          )}

          {activeTab === 'projects' && (
            <ProjectsTable
              projects={filteredProjects}
              onDelete={handleDeleteProject}
            />
          )}

          {activeTab === 'challenges' && (
            <ChallengesTable
              challenges={filteredChallenges}
              onDelete={handleDeleteChallenge}
            />
          )}
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
    </div>
  );
};

export default AdminPanel;
