import { FaEdit, FaTrash, FaClipboardList } from 'react-icons/fa';

const ChallengesTable = ({ challenges, onDelete }) => {
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
                Title
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
                Difficulty
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
                Points
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
            {challenges.map((challenge, index) => (
              <tr 
                key={challenge.id} 
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
                  {challenge.title}
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
                    background: 
                      challenge.difficulty === 'Easy' ? 'rgba(166, 227, 161, 0.15)' :
                      challenge.difficulty === 'Medium' ? 'rgba(249, 226, 175, 0.15)' :
                      'rgba(243, 139, 168, 0.15)',
                    color: 
                      challenge.difficulty === 'Easy' ? 'var(--green)' :
                      challenge.difficulty === 'Medium' ? 'var(--yellow)' :
                      'var(--red)',
                    border: `1px solid ${
                      challenge.difficulty === 'Easy' ? 'var(--green)' :
                      challenge.difficulty === 'Medium' ? 'var(--yellow)' :
                      'var(--red)'
                    }`
                  }}>
                    {challenge.difficulty}
                  </span>
                </td>
                <td style={{ 
                  padding: '1.25rem 1.5rem', 
                  color: 'var(--text)',
                  fontSize: '0.95rem',
                  fontWeight: '600',
                  borderBottom: '1px solid var(--surface0)'
                }}>
                  <span style={{
                    background: 'var(--blue)',
                    color: 'var(--crust)',
                    padding: '0.3rem 0.8rem',
                    borderRadius: '8px',
                    fontSize: '0.875rem',
                    fontWeight: '700'
                  }}>
                    {challenge.points} pts
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
                    background: challenge.status === 'active' ? 'rgba(166, 227, 161, 0.15)' : 'rgba(249, 226, 175, 0.15)',
                    color: challenge.status === 'active' ? 'var(--green)' : 'var(--yellow)',
                    border: `1px solid ${challenge.status === 'active' ? 'var(--green)' : 'var(--yellow)'}`,
                    textTransform: 'capitalize'
                  }}>
                    {challenge.status}
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
                      onClick={() => onDelete(challenge.id)}
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
      {challenges.length === 0 && (
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
            <FaClipboardList />
          </div>
          No challenges found
        </div>
      )}
    </div>
  );
};

export default ChallengesTable;