import { useState, useEffect } from 'react';
import { BsSearch, BsFilter, BsGrid, BsList, BsPersonPlus } from 'react-icons/bs';
import ProfileCard from '../components/ProfileCard';
import { adminAPI } from '../services/api';
import { useAuth } from '../hooks/useAuth';

/**
 * Users Page
 * Displays all users in a grid layout using ProfileCard components
 */
const Users = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [filterRole, setFilterRole] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const { user: currentUser, isAuthenticated } = useAuth();

  
  // Load users from API
  useEffect(() => {
    const loadUsers = async () => {
      setLoading(true);
      try {
        const fetchedUsers = await adminAPI.getUsers();
        setUsers(fetchedUsers);
        setFilteredUsers(fetchedUsers);
      } catch (error) {
        console.error('Error loading users:', error);
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, []);

  // Filter and search logic
  useEffect(() => {
    let result = [...users];

    // Apply search filter
    if (searchTerm) {
      result = result.filter(user => 
        user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply role filter
    if (filterRole !== 'all') {
      result = result.filter(user => user.role === filterRole);
    }

    // Apply sorting
    result.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return (a.name || '').localeCompare(b.name || '');
        case 'points':
          return (b.points || 0) - (a.points || 0);
        case 'challenges':
          return (b.completedChallenges || 0) - (a.completedChallenges || 0);
        case 'recent':
          return new Date(b.joinedDate || 0) - new Date(a.joinedDate || 0);
        default:
          return 0;
      }
    });

    setFilteredUsers(result);
  }, [searchTerm, filterRole, sortBy, users]);

  const handleUserClick = (user) => {
    console.log('User clicked:', user);
    // You can navigate to user detail page or show modal
  };

  if (loading) {
    return (
      <section className="hero" style={{ minHeight: '100vh', padding: '40px 0' }}>
        <div className="container">
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status" style={{ width: '3rem', height: '3rem' }}>
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3" style={{ color: 'var(--text)' }}>Loading users...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="hero" style={{ minHeight: '100vh', padding: '40px 0' }}>
      <div className="container">
        {/* Page Header */}
        <div className="row mb-4">
          <div className="col-12">
            <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
              <div>
                <h1 className="display-4 mb-2" style={{ color: 'var(--text)' }}>Community Members</h1>
                <p className="lead mb-0" style={{ color: 'var(--subtext0)' }}>
                  Discover and connect with {users.length} talented developers
                </p>
              </div>
              {isAuthenticated && currentUser?.role === 'admin' && (
                <button className="btn btn-primary">
                  <BsPersonPlus className="me-2" />
                  Add User
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Filters and Search Bar */}
        <div className="row mb-4">
          <div className="col-12">
            <div className="about-card">
              <div className="row g-3 align-items-center">
                {/* Search */}
                <div className="col-md-4">
                  <div className="input-group">
                    <span className="input-group-text" style={{ 
                      background: 'var(--surface0)', 
                      border: '1px solid var(--surface1)',
                      color: 'var(--text)'
                    }}>
                      <BsSearch />
                    </span>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Search users..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      style={{ 
                        background: 'var(--surface0)', 
                        border: '1px solid var(--surface1)',
                        color: 'var(--text)'
                      }}
                    />
                  </div>
                </div>

                {/* Role Filter */}
                <div className="col-md-3">
                  <div className="input-group">
                    <span className="input-group-text" style={{ 
                      background: 'var(--surface0)', 
                      border: '1px solid var(--surface1)',
                      color: 'var(--text)'
                    }}>
                      <BsFilter />
                    </span>
                    <select
                      className="form-select"
                      value={filterRole}
                      onChange={(e) => setFilterRole(e.target.value)}
                      style={{ 
                        background: 'var(--surface0)', 
                        border: '1px solid var(--surface1)',
                        color: 'var(--text)'
                      }}
                    >
                      <option value="all">All Roles</option>
                      <option value="admin">Admin</option>
                      <option value="user">User</option>
                      <option value="moderator">Moderator</option>
                    </select>
                  </div>
                </div>

                {/* Sort By */}
                <div className="col-md-3">
                  <select
                    className="form-select"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    style={{ 
                      background: 'var(--surface0)', 
                      border: '1px solid var(--surface1)',
                      color: 'var(--text)'
                    }}
                  >
                    <option value="name">Sort by Name</option>
                    <option value="points">Sort by Points</option>
                    <option value="challenges">Sort by Challenges</option>
                    <option value="recent">Most Recent</option>
                  </select>
                </div>

                {/* View Toggle */}
                <div className="col-md-2">
                  <div className="btn-group w-100" role="group">
                    <button
                      type="button"
                      className={`btn ${viewMode === 'grid' ? 'btn-primary' : 'btn-outline-primary'}`}
                      onClick={() => setViewMode('grid')}
                    >
                      <BsGrid />
                    </button>
                    <button
                      type="button"
                      className={`btn ${viewMode === 'list' ? 'btn-primary' : 'btn-outline-primary'}`}
                      onClick={() => setViewMode('list')}
                    >
                      <BsList />
                    </button>
                  </div>
                </div>
              </div>

              {/* Results Count */}
              <div className="mt-3">
                <small style={{ color: 'var(--subtext0)' }}>
                  Showing {filteredUsers.length} of {users.length} users
                  {searchTerm && ` matching "${searchTerm}"`}
                </small>
              </div>
            </div>
          </div>
        </div>

        {/* Users Grid/List */}
        {filteredUsers.length === 0 ? (
          <div className="row">
            <div className="col-12">
              <div className="about-card text-center py-5">
                <div style={{ fontSize: '4rem', marginBottom: '20px' }}>🔍</div>
                <h3 style={{ color: 'var(--text)' }}>No users found</h3>
                <p style={{ color: 'var(--subtext0)' }}>
                  Try adjusting your search or filter criteria
                </p>
                <button 
                  className="btn btn-primary mt-3"
                  onClick={() => {
                    setSearchTerm('');
                    setFilterRole('all');
                  }}
                >
                  Clear Filters
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className={viewMode === 'grid' ? 'users-grid' : 'users-list'}>
            {filteredUsers.map((user) => (
              <div 
                key={user.id} 
                onClick={() => handleUserClick(user)}
                style={{ cursor: 'pointer' }}
              >
                <ProfileCard
                  user={user}
                  showStats={true}
                  stats={{
                    points: user.points,
                    completedChallenges: user.completedChallenges || user.completed_challenges
                  }}
                />
              </div>
            ))}
          </div>
        )}

        {/* Stats Summary */}
        {filteredUsers.length > 0 && (
          <div className="row mt-5">
            <div className="col-12">
              <div className="about-card">
                <h4 className="mb-4" style={{ color: 'var(--text)' }}>Community Statistics</h4>
                <div className="row text-center g-4">
                  <div className="col-md-3 col-6">
                    <div className="p-3" style={{ background: 'var(--surface0)', borderRadius: '12px' }}>
                      <h2 className="mb-1" style={{ color: 'var(--blue)' }}>{users.length}</h2>
                      <p className="mb-0" style={{ color: 'var(--subtext0)', fontSize: '0.9rem' }}>Total Members</p>
                    </div>
                  </div>
                  <div className="col-md-3 col-6">
                    <div className="p-3" style={{ background: 'var(--surface0)', borderRadius: '12px' }}>
                      <h2 className="mb-1" style={{ color: 'var(--green)' }}>
                        {users.reduce((sum, u) => sum + (u.points || 0), 0).toLocaleString()}
                      </h2>
                      <p className="mb-0" style={{ color: 'var(--subtext0)', fontSize: '0.9rem' }}>Total Points</p>
                    </div>
                  </div>
                  <div className="col-md-3 col-6">
                    <div className="p-3" style={{ background: 'var(--surface0)', borderRadius: '12px' }}>
                      <h2 className="mb-1" style={{ color: 'var(--yellow)' }}>
                        {users.reduce((sum, u) => sum + (u.completedChallenges || 0), 0)}
                      </h2>
                      <p className="mb-0" style={{ color: 'var(--subtext0)', fontSize: '0.9rem' }}>Challenges Solved</p>
                    </div>
                  </div>
                  <div className="col-md-3 col-6">
                    <div className="p-3" style={{ background: 'var(--surface0)', borderRadius: '12px' }}>
                      <h2 className="mb-1" style={{ color: 'var(--pink)' }}>
                        {users.filter(u => u.role === 'admin').length}
                      </h2>
                      <p className="mb-0" style={{ color: 'var(--subtext0)', fontSize: '0.9rem' }}>Admins</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Users;
