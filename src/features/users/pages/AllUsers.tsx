import { useState, useEffect } from 'react';
import { BsSearch, BsArrowRepeat } from 'react-icons/bs';
import { API_ENDPOINTS, getApiUrl } from '@/config/api.config';
import '../styles/allUsers.css';

interface UserResponse {
  id: number;
  name: string;
  email: string;
}

const AllUsers = () => {
  const [users, setUsers] = useState<UserResponse[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'email' | 'id'>('name');

  const log = (message: any, ...optionalParams: any[]) => {
    console.log('[AllUsers]', message, ...optionalParams);
  };
  // Fetch users from API
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(getApiUrl(API_ENDPOINTS.USERS.ALL));
        log(response);
        if (!response.ok) {
          throw new Error('Failed to fetch users');
        }
        const data = await response.json();
        log('Raw API response:', data);

        // Handle different response formats
        let users: UserResponse[] = [];
        if (Array.isArray(data)) {
          users = data;
        } else if (data.data && Array.isArray(data.data)) {
          users = data.data;
        } else if (data.users && Array.isArray(data.users)) {
          users = data.users;
        } else {
          throw new Error('Unexpected API response format');
        }

        setUsers(users);
        setFilteredUsers(users);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        console.error('Error fetching users:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Filter users based on search term
  useEffect(() => {
    let filtered = users.filter(
      (user) =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.id.toString().includes(searchTerm)
    );

    // Sort filtered results
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'email':
          return a.email.localeCompare(b.email);
        case 'id':
          return a.id - b.id;
        default:
          return 0;
      }
    });

    setFilteredUsers(filtered);
  }, [searchTerm, sortBy, users]);

  return (
    <div className="all-users-container">
      <div className="all-users-header">
        <h1>Registered Users</h1>
        <p className="user-count">{filteredUsers.length} users found</p>
      </div>

      {/* Search and Filter Section */}
      <div className="all-users-controls">
        <div className="search-wrapper">
          <BsSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search by name, email, or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="sort-wrapper">
          <label htmlFor="sort-select">Sort by:</label>
          <select
            id="sort-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'name' | 'email' | 'id')}
            className="sort-select"
          >
            <option value="name">Name</option>
            <option value="email">Email</option>
            <option value="id">ID</option>
          </select>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="loading-container">
          <BsArrowRepeat className="loading-spinner" />
          <p>Loading users...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="error-container">
          <p className="error-message">Error: {error}</p>
        </div>
      )}

      {/* Users Table */}
      {!loading && !error && filteredUsers.length > 0 && (
        <div className="users-table-wrapper">
          <table className="users-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id} className="user-row">
                  <td className="user-id">{user.id}</td>
                  <td className="user-name">{user.name}</td>
                  <td className="user-email">{user.email}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && filteredUsers.length === 0 && (
        <div className="empty-state">
          <p>No users found matching your search.</p>
        </div>
      )}
    </div>
  );
};

export default AllUsers;
