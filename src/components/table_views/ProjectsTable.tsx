import { FaEdit, FaTrash, FaFolder, FaCalendarAlt } from 'react-icons/fa';


// Projects Table Component
const ProjectsTable = ({ projects, onDelete }) => {
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
                letterSpacing: '0.05em',
                minWidth: '250px'
              }}>
                Description
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
                textAlign: 'left', 
                color: 'var(--crust)', 
                fontWeight: '700',
                fontSize: '0.875rem',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}>
                Created
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
            {projects.map((project, index) => (
              <tr 
                key={project.id} 
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
                  {project.title}
                </td>
                <td style={{ 
                  padding: '1.25rem 1.5rem', 
                  color: 'var(--subtext1)',
                  fontSize: '0.9rem',
                  borderBottom: '1px solid var(--surface0)',
                  maxWidth: '300px'
                }}>
                  <span style={{
                    display: 'block',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}>
                    {project.description || 'No description'}
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
                    background: project.status === 'active' 
                      ? 'rgba(166, 227, 161, 0.15)' 
                      : 'rgba(249, 226, 175, 0.15)',
                    color: project.status === 'active' ? 'var(--green)' : 'var(--yellow)',
                    border: `1px solid ${project.status === 'active' ? 'var(--green)' : 'var(--yellow)'}`,
                    textTransform: 'capitalize'
                  }}>
                    {project.status}
                  </span>
                </td>
                <td style={{ 
                  padding: '1.25rem 1.5rem', 
                  color: 'var(--subtext1)',
                  fontSize: '0.9rem',
                  borderBottom: '1px solid var(--surface0)',
                  whiteSpace: 'nowrap'
                }}>
                  <span style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}>
                    <FaCalendarAlt style={{ color: 'var(--blue)' }} /> {new Date(project.createdAt).toLocaleDateString('en-US', { 
                      month: 'short', 
                      day: 'numeric', 
                      year: 'numeric' 
                    })}
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
                      onClick={() => onDelete(project.id)}
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
      {projects.length === 0 && (
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
            <FaFolder />
          </div>
          No projects found
        </div>
      )}
    </div>
  );
};

export default ProjectsTable;