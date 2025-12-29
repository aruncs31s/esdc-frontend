import { useState } from 'react';
import { UserRole, UserStatus } from '@/domain/entities/User';
import {
  FaTimes,
  FaFileAlt,
  FaLink,
  FaHourglassHalf,
  FaPlus,
  FaUser,
  FaEnvelope,
  FaUserShield,
  FaToggleOn,
} from 'react-icons/fa';
import { FiLock, FiShield, FiFileText } from 'react-icons/fi';
import { ProjectData } from '@/types';
// TODO: aruncs31s , fix this projects creation part
import { applicationService } from '@/application';

import { UserRegisterDataByAdmin } from '@/types';

const CreateModal = ({
  type,
  onClose,
  onSuccess,
}: {
  type: string;
  onClose: () => void;
  onSuccess: () => void;
}) => {
  const [formData, setFormData] = useState<UserRegisterDataByAdmin>({} as UserRegisterDataByAdmin);
  const [projectData, setProjectData] = useState<ProjectData | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (type === 'users') {
        if (formData.password !== formData.confirmPassword) {
          alert('Passwords do not match!');
          setLoading(false);
          return;
        }

        // Validate password length
        if (formData.password && formData.password.length < 8) {
          alert('Password must be at least 8 characters long!');
          setLoading(false);
          return;
        }
        // Create and validate user using Application Service
        // const createUserUseCase = new CreateUserUseCase(null); // No dependencies needed for createUserByAdmin
        const newUser = applicationService.createUserByAdmin({
          name: formData.name,
          username: formData.username,
          email: formData.email,
          role: formData.role || UserRole.USER,
          github_username: formData.github_username,
          password: formData.password,
        });
        console.log('New User to create:', newUser);
        // Send to backend API
      } else if (type === 'projects') {
        await applicationService.createProject('admin-user-id', formData);
      }
      onSuccess();
    } catch (error) {
      console.error('Error creating:', error);
      alert('Failed to create ' + type.slice(0, -1));
    } finally {
      setLoading(false);
    }
  };
  const inputStyle = {
    width: '100%',
    padding: '0.875rem 1rem',
    borderRadius: '12px',
    border: '2px solid var(--surface0)',
    background: 'var(--mantle) !important',
    color: 'var(--text) !important',
    fontSize: '0.95rem',
    transition: 'all 0.3s ease',
    outline: 'none',
    WebkitBoxShadow: '0 0 0 1000px var(--mantle) inset !important',
    WebkitTextFillColor: 'var(--text) !important',
  } as React.CSSProperties;

  const labelStyle = {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '0.6rem',
    color: 'var(--text)',
    fontWeight: '600',
    fontSize: '0.9rem',
    letterSpacing: '0.02em',
    gap: '0.5rem',
  } as React.CSSProperties;

  return (
    <>
      <style>{`
        .modal-content input:-webkit-autofill,
        .modal-content input:-webkit-autofill:hover,
        .modal-content input:-webkit-autofill:focus,
        .modal-content input:-webkit-autofill:active {
          -webkit-box-shadow: 0 0 0 1000px var(--mantle) inset !important;
          -webkit-text-fill-color: var(--text) !important;
          transition: background-color 5000s ease-in-out 0s;
        }

        .modal-content select option {
          background: var(--mantle);
          color: var(--text);
          padding: 0.5rem;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (max-width: 640px) {
          .modal-content {
            width: 95% !important;
            padding: 1.5rem !important;
            max-height: 95vh !important;
          }
        }
      `}</style>
      <div
        className="modal-overlay"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.75)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          animation: 'fadeIn 0.3s ease',
        }}
        onClick={onClose}
      >
        <div
          className="modal-content glass-card"
          style={{
            maxWidth: '600px',
            width: '90%',
            maxHeight: '90vh',
            overflow: 'auto',
            padding: 'clamp(1.5rem, 4vw, 2.5rem)',
            borderRadius: '24px',
            background: 'var(--base)',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
            border: '1px solid var(--surface0)',
            animation: 'slideUp 0.3s ease',
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '2rem',
              paddingBottom: '1rem',
              borderBottom: '2px solid var(--surface0)',
            }}
          >
            <h2
              style={{
                margin: 0,
                color: 'var(--text)',
                fontSize: '1.75rem',
                fontWeight: '700',
                background: 'linear-gradient(135deg, var(--blue) 0%, var(--mauve) 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Create New {type.slice(0, -1).charAt(0).toUpperCase() + type.slice(1, -1)}
            </h2>
            <button
              onClick={onClose}
              style={{
                background: 'var(--surface0)',
                border: 'none',
                borderRadius: '50%',
                width: '36px',
                height: '36px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: 'var(--text)',
                fontSize: '1rem',
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'var(--red)';
                e.currentTarget.style.transform = 'rotate(90deg)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'var(--surface0)';
                e.currentTarget.style.transform = 'rotate(0deg)';
              }}
            >
              <FaTimes />
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            {type === 'users' && (
              <>
                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={labelStyle}>
                    <FaUser style={{ color: 'var(--blue)' }} />
                    <span>Name</span>
                  </label>
                  <input
                    type="text"
                    required
                    minLength={3}
                    placeholder="Enter Name (min 3 characters)"
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    style={{ ...inputStyle }}
                    onFocus={(e) => (e.currentTarget.style.borderColor = 'var(--blue)')}
                    onBlur={(e) => (e.currentTarget.style.borderColor = 'var(--surface0)')}
                  />
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={labelStyle}>
                    <FaUser style={{ color: 'var(--mauve)' }} />
                    <span>Username</span>
                  </label>
                  <input
                    type="text"
                    required
                    minLength={3}
                    placeholder="Enter username (min 3 characters)"
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    style={{ ...inputStyle }}
                    onFocus={(e) => (e.currentTarget.style.borderColor = 'var(--blue)')}
                    onBlur={(e) => (e.currentTarget.style.borderColor = 'var(--surface0)')}
                  />
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={labelStyle}>
                    <FaEnvelope style={{ color: 'var(--green)' }} />
                    <span>Email</span>
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="user@example.com"
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    style={{ ...inputStyle }}
                    onFocus={(e) => (e.currentTarget.style.borderColor = 'var(--blue)')}
                    onBlur={(e) => (e.currentTarget.style.borderColor = 'var(--surface0)')}
                  />
                </div>

                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '1rem',
                    marginBottom: '1.5rem',
                  }}
                >
                  <div>
                    <label style={labelStyle}>
                      <FiLock style={{ color: 'var(--red)' }} />
                      <span>Password</span>
                    </label>
                    <input
                      type="password"
                      required
                      minLength={8}
                      placeholder="Min 8 characters"
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      style={{ ...inputStyle }}
                      onFocus={(e) => (e.currentTarget.style.borderColor = 'var(--blue)')}
                      onBlur={(e) => (e.currentTarget.style.borderColor = 'var(--surface0)')}
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>
                      <FiShield style={{ color: 'var(--peach)' }} />
                      <span>Confirm Password</span>
                    </label>
                    <input
                      type="password"
                      required
                      minLength={8}
                      placeholder="Repeat password"
                      onChange={(e) =>
                        setFormData({ ...formData, confirmPassword: e.target.value })
                      }
                      style={{
                        ...inputStyle,
                        borderColor:
                          formData.password &&
                          formData.confirmPassword &&
                          formData.password !== formData.confirmPassword
                            ? 'var(--red)'
                            : 'var(--surface0)',
                      }}
                      onFocus={(e) => (e.currentTarget.style.borderColor = 'var(--blue)')}
                      onBlur={(e) => {
                        if (
                          formData.password &&
                          formData.confirmPassword &&
                          formData.password !== formData.confirmPassword
                        ) {
                          e.currentTarget.style.borderColor = 'var(--red)';
                        } else {
                          e.currentTarget.style.borderColor = 'var(--surface0)';
                        }
                      }}
                    />
                    {formData.password &&
                      formData.confirmPassword &&
                      formData.password !== formData.confirmPassword && (
                        <span
                          style={{
                            fontSize: '0.8rem',
                            color: 'var(--red)',
                            marginTop: '0.25rem',
                            display: 'block',
                            fontWeight: '500',
                          }}
                        >
                          ⚠️ Passwords don't match
                        </span>
                      )}
                  </div>
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={labelStyle}>
                    <FaLink style={{ color: 'var(--sky)' }} />
                    <span>GitHub Username (Optional)</span>
                  </label>
                  <input
                    type="text"
                    placeholder="github-username"
                    onChange={(e) => setFormData({ ...formData, github_username: e.target.value })}
                    style={{ ...inputStyle }}
                    onFocus={(e) => (e.currentTarget.style.borderColor = 'var(--blue)')}
                    onBlur={(e) => (e.currentTarget.style.borderColor = 'var(--surface0)')}
                  />
                </div>

                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '1rem',
                    marginBottom: '1.5rem',
                  }}
                >
                  <div>
                    <label style={labelStyle}>
                      <FaUserShield style={{ color: 'var(--lavender)' }} />
                      <span>Role</span>
                    </label>
                    <select
                      required
                      defaultValue={UserRole.USER}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                      style={{
                        ...inputStyle,
                        cursor: 'pointer',
                      }}
                      onFocus={(e) => (e.currentTarget.style.borderColor = 'var(--blue)')}
                      onBlur={(e) => (e.currentTarget.style.borderColor = 'var(--surface0)')}
                    >
                      <option value={UserRole.USER}>User</option>
                      <option value={UserRole.MODERATOR}>Moderator</option>
                      <option value={UserRole.ADMIN}>Admin</option>
                    </select>
                  </div>

                  <div>
                    <label style={labelStyle}>
                      <FaToggleOn style={{ color: 'var(--teal)' }} />
                      <span>Status</span>
                    </label>
                    <select
                      required
                      defaultValue={UserStatus.ACTIVE}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      style={{
                        ...inputStyle,
                        cursor: 'pointer',
                      }}
                      onFocus={(e) => (e.currentTarget.style.borderColor = 'var(--blue)')}
                      onBlur={(e) => (e.currentTarget.style.borderColor = 'var(--surface0)')}
                    >
                      <option value={UserStatus.ACTIVE}>Active</option>
                      <option value={UserStatus.INACTIVE}>Inactive</option>
                      <option value={UserStatus.PENDING}>Pending</option>
                      <option value={UserStatus.SUSPENDED}>Suspended</option>
                    </select>
                  </div>
                </div>
              </>
            )}

            {type === 'projects' && (
              <>
                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={labelStyle}>
                    <FaFileAlt style={{ color: 'var(--blue)' }} />
                    <span>Title</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Enter project title"
                    onChange={(e) => setProjectData({ ...projectData, title: e.target.value })}
                    style={inputStyle}
                    onFocus={(e) => (e.currentTarget.style.borderColor = 'var(--blue)')}
                    onBlur={(e) => (e.currentTarget.style.borderColor = 'var(--surface0)')}
                  />
                </div>
                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={labelStyle}>
                    <FiFileText style={{ color: 'var(--mauve)' }} />
                    <span>Description</span>
                  </label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Describe your project"
                    onChange={(e) =>
                      setProjectData({ ...projectData, description: e.target.value })
                    }
                    style={{
                      ...inputStyle,
                      resize: 'vertical',
                      minHeight: '120px',
                      fontFamily: 'inherit',
                    }}
                    onFocus={(e) => (e.currentTarget.style.borderColor = 'var(--blue)')}
                    onBlur={(e) => (e.currentTarget.style.borderColor = 'var(--surface0)')}
                  />
                </div>
                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={labelStyle}>
                    <FaLink style={{ color: 'var(--green)' }} />
                    <span>GitHub URL</span>
                  </label>
                  <input
                    type="url"
                    placeholder="https://github.com/username/repo"
                    onChange={(e) =>
                      setProjectData({ ...projectData, github_link: e.target.value })
                    }
                    style={inputStyle}
                    onFocus={(e) => (e.currentTarget.style.borderColor = 'var(--blue)')}
                    onBlur={(e) => (e.currentTarget.style.borderColor = 'var(--surface0)')}
                  />
                </div>
              </>
            )}

            <div
              style={{
                display: 'flex',
                gap: '1rem',
                marginTop: '2.5rem',
                paddingTop: '1.5rem',
                borderTop: '1px solid var(--surface0)',
                flexWrap: 'wrap',
              }}
            >
              <button
                type="submit"
                disabled={loading}
                style={{
                  flex: 1,
                  minWidth: '120px',
                  padding: '1rem 2rem',
                  borderRadius: '12px',
                  border: 'none',
                  background: loading
                    ? 'var(--surface0)'
                    : 'linear-gradient(135deg, var(--blue) 0%, var(--mauve) 100%)',
                  color: loading ? 'var(--subtext0)' : 'var(--crust)',
                  fontSize: '1rem',
                  fontWeight: '700',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: loading ? 'none' : '0 4px 12px rgba(137, 180, 250, 0.3)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                }}
                onMouseEnter={(e) => {
                  if (!loading) {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 6px 20px rgba(137, 180, 250, 0.4)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!loading) {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(137, 180, 250, 0.3)';
                  }
                }}
              >
                {loading ? (
                  <>
                    <FaHourglassHalf />
                    <span>Creating...</span>
                  </>
                ) : (
                  <>
                    <FaPlus />
                    <span>Create</span>
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={onClose}
                style={{
                  flex: 1,
                  minWidth: '120px',
                  padding: '1rem 2rem',
                  borderRadius: '12px',
                  border: '2px solid var(--surface0)',
                  background: 'var(--mantle)',
                  color: 'var(--text)',
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'var(--surface0)';
                  e.currentTarget.style.borderColor = 'var(--red)';
                  e.currentTarget.style.color = 'var(--red)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'var(--mantle)';
                  e.currentTarget.style.borderColor = 'var(--surface0)';
                  e.currentTarget.style.color = 'var(--text)';
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default CreateModal;
