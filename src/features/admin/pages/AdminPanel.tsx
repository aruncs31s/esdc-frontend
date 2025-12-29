import { useState, useEffect } from 'react';
import { useAuth } from '../modules/auth/useAuth';
import applicationService from '../application/ApplicationService';
import UsersTable from '../components/table_views/UserTable';
import ProjectsTable from '../components/table_views/ProjectsTable';

import CreateModal from '@/shared/components/ui/modals/CreateModal';
import { FaUsers, FaProjectDiagram, FaTasks, FaChartLine, FaPlus, FaSearch } from 'react-icons/fa';
import { statsForAdmin, UserDataForAdmin } from '@/types';

/**
 * Admin Panel - Updated to use DDD Architecture
 * Uses ApplicationService instead of direct API calls
 */
const AdminPanel = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('users');
  const [users, setUsers] = useState<UserDataForAdmin[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [stats, setStats] = useState<statsForAdmin>({
    total_users: 0,
    total_projects: 0,
    active_users: 0,
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
      const [statsData, usersResult, projectsData] = await Promise.all([
        applicationService.getAdminStats(),
        applicationService.getAllUsersForAdmin(),
        applicationService.getAllProjectForAdmin(),
      ]);

      setStats(statsData);
      // ApplicationService returns {success, data, ...}
      setUsers(Array.isArray(usersResult) ? usersResult : (usersResult as any)?.data || []);
      setProjects(Array.isArray(projectsData) ? projectsData : (projectsData as any)?.data || []);
    } catch (error) {
      console.error('Error loading admin data:', error);
      // Set empty arrays on error
      setUsers([]);
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateNew = (type: string) => {
    setModalType(type);
    setShowCreateModal(true);
  };

  const handleDeleteUser = async (userId: number | string) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        const result = await applicationService.deleteUser(String(userId));
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

  const handleDeleteProject = async (projectId: number) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        await applicationService.deleteProject(String(projectId));
        alert('Project deleted successfully');
        await loadAdminData();
      } catch (error) {
        console.error('Error deleting project:', error);
        alert('Failed to delete project');
      }
    }
  };

  // Filter logic using domain entity methods
  // const filteredUsers = (users || []).filter(user => {
  //   const searchLower = searchTerm.toLowerCase();
  //   // Use domain entity methods if available
  //   if (typeof user.getDisplayName === 'function') {
  //     return user.username?.toLowerCase().includes(searchLower) ||
  //       user.email?.value?.toLowerCase().includes(searchLower) ||
  //       user.email?.toString()?.toLowerCase().includes(searchLower) ||
  //       user.getDisplayName().toLowerCase().includes(searchLower);
  //   }
  //   // Fallback for plain objects
  //   return user.username?.toLowerCase().includes(searchLower) ||
  //     user.email?.toLowerCase().includes(searchLower);
  // });

  if (loading) {
    return (
      <div className="admin-panel-loading">
        <div className="container">
          <div className="text-center py-5">
            <div
              className="spinner-border text-primary"
              role="status"
              style={{ width: '3rem', height: '3rem' }}
            >
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
              <h3>{stats.total_users}</h3>
              <p>Total Users</p>
              <span className="stat-subtext">{stats.active_users} active</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              <FaProjectDiagram />
            </div>
            <div className="stat-content">
              <h3>{stats.total_projects}</h3>
              <p>Total Projects</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              <FaChartLine />
            </div>
            <div className="stat-content">
              <h3>{Math.round((stats.active_users / stats.total_users) * 100) || 0}%</h3>
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
          <button onClick={() => handleCreateNew(activeTab)} className="btn-create">
            <FaPlus /> Create {activeTab.slice(0, -1)}
          </button>
        </div>

        {/* Content */}
        <div className="admin-content">
          {activeTab === 'users' && <UsersTable users={users} onDelete={handleDeleteUser} />}

          {activeTab === 'projects' && (
            <ProjectsTable projects={projects} onDelete={handleDeleteProject} />
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
