
import { FaEdit, FaTrash, FaUsers } from 'react-icons/fa';



const UsersTable = ({ users, onDelete }) => {
  console.log(users);
  return (
    <div style={{ 
      background: 'var(--surface0)', 
      borderRadius: '16px', 
      overflow: 'hidden',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
    }}>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ 
          width: '100%', 
          borderCollapse: 'separate',
          borderSpacing: 0
        }}>
          <thead>
            <tr style={{ 
              background: 'linear-gradient(135deg, var(--blue) 0%, var(--mauve) 100%)',
            }}>
              <th style={{ 
                padding: '1.25rem 1.5rem', 
                textAlign: 'left', 
                color: 'var(--crust)', 
                fontWeight: '700',
                fontSize: '0.875rem',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}>
                Username
              </th>
              <th style={{ 
                padding: '1.25rem 1.5rem', 
                textAlign: 'left', 
                color: 'var(--crust)', 
                fontWeight: '700',
                fontSize: '0.875rem',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}>
                Email
              </th>
              <th style={{ 
                padding: '1.25rem 1.5rem', 
                textAlign: 'left', 
                color: 'var(--crust)', 
                fontWeight: '700',
                fontSize: '0.875rem',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}>
                Role
              </th>
              <th style={{ 
                padding: '1.25rem 1.5rem', 
                textAlign: 'left', 
                color: 'var(--crust)', 
                fontWeight: '700',
                fontSize: '0.875rem',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}>
                Status
              </th>
              <th style={{ 
                padding: '1.25rem 1.5rem', 
                textAlign: 'center', 
                color: 'var(--crust)', 
                fontWeight: '700',
                fontSize: '0.875rem',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}>
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr 
                key={user.id} 
                style={{ 
                  background: index % 2 === 0 ? 'var(--base)' : 'var(--mantle)',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'var(--surface1)';
                  e.currentTarget.style.transform = 'scale(1.01)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = index % 2 === 0 ? 'var(--base)' : 'var(--mantle)';
                  e.currentTarget.style.transform = 'scale(1)';
                }}
              >
                <td style={{ 
                  padding: '1.25rem 1.5rem', 
                  color: 'var(--text)', 
                  fontWeight: '600',
                  fontSize: '0.95rem',
                  borderBottom: '1px solid var(--surface0)'
                }}>
                  {user.username}
                </td>
                <td style={{ 
                  padding: '1.25rem 1.5rem', 
                  color: 'var(--subtext1)',
                  fontSize: '0.9rem',
                  borderBottom: '1px solid var(--surface0)'
                }}>
                  {user.email}
                </td>
                <td style={{ 
                  padding: '1.25rem 1.5rem',
                  borderBottom: '1px solid var(--surface0)'
                }}>
                  <span style={{ 
                    padding: '0.4rem 1rem',
                    borderRadius: '24px',
                    fontSize: '0.85rem',
                    fontWeight: '600',
                    display: 'inline-block',
                    background: user.role === 'admin' 
                      ? 'rgba(243, 139, 168, 0.15)' 
                      : 'rgba(137, 180, 250, 0.15)',
                    color: user.role === 'admin' ? 'var(--red)' : 'var(--blue)',
                    border: `1px solid ${user.role === 'admin' ? 'var(--red)' : 'var(--blue)'}`,
                    textTransform: 'capitalize'
                  }}>
                    {user.role}
                  </span>
                </td>
                <td style={{ 
                  padding: '1.25rem 1.5rem',
                  borderBottom: '1px solid var(--surface0)'
                }}>
                  <span style={{ 
                    padding: '0.4rem 1rem',
                    borderRadius: '24px',
                    fontSize: '0.85rem',
                    fontWeight: '600',
                    display: 'inline-block',
                    background: user.status === 'active' 
                      ? 'rgba(166, 227, 161, 0.15)' 
                      : 'rgba(249, 226, 175, 0.15)',
                    color: user.status === 'active' ? 'var(--green)' : 'var(--yellow)',
                    border: `1px solid ${user.status === 'active' ? 'var(--green)' : 'var(--yellow)'}`,
                    textTransform: 'capitalize'
                  }}>
                    {user.status}
                  </span>
                </td>
                <td style={{ 
                  padding: '1.25rem 1.5rem',
                  borderBottom: '1px solid var(--surface0)'
                }}>
                  <div style={{ 
                    display: 'flex', 
                    gap: '0.75rem',
                    justifyContent: 'center',
                    alignItems: 'center'
                  }}>
                    <button
                      title="Edit"
                      style={{
                        padding: '0.6rem 0.75rem',
                        borderRadius: '10px',
                        border: 'none',
                        background: 'var(--blue)',
                        color: 'var(--crust)',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1rem',
                        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.boxShadow = '0 4px 8px rgba(137, 180, 250, 0.4)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
                      }}
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => onDelete(user.id)}
                      title="Delete"
                      style={{
                        padding: '0.6rem 0.75rem',
                        borderRadius: '10px',
                        border: 'none',
                        background: 'var(--red)',
                        color: 'var(--crust)',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1rem',
                        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.boxShadow = '0 4px 8px rgba(243, 139, 168, 0.4)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
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
      </div>
      {users.length === 0 && (
        <div style={{ 
          textAlign: 'center', 
          padding: '3rem 2rem', 
          color: 'var(--subtext0)',
          fontSize: '1.1rem',
          fontWeight: '500'
        }}>
          <div style={{ 
            fontSize: '3rem', 
            marginBottom: '1rem',
            opacity: 0.5,
            color: 'var(--blue)'
          }}>
            <FaUsers />
          </div>
          No users found
        </div>
      )}
    </div>
  );
};

export default UsersTable;