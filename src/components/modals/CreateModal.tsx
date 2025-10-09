
import { useState } from 'react';
import { adminAPI } from '../../services/api';
import { createUser, USER_ROLES, USER_STATUS } from '../../models/user';
import { FaTimes, FaFileAlt, FaLink, FaBullseye, FaTrophy, FaBolt, FaHourglassHalf, FaPlus, FaUser, FaEnvelope, FaUserShield, FaToggleOn } from 'react-icons/fa';
import { FiLock, FiShield, FiInfo, FiFileText } from 'react-icons/fi';
import { RegisterRequest } from '../../types';



const CreateModal = ({ type, onClose, onSuccess }: { type: string; onClose: () => void; onSuccess: () => void }) => {
  const [formData, setFormData] = useState<RegisterRequest>({});
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (type === 'users') {
        // Validate password match
        if (formData.password !== formData.confirmPassword) {
          alert('Passwords do not match!');
          setLoading(false);
          return;
        }

        // Validate password length
        if (formData.password.length < 8) {
          alert('Password must be at least 8 characters long!');
          setLoading(false);
          return;
        }

        // Create user with User model
        const newUser = createUser({
          name: formData.name,
          username: formData.username,
          email: formData.email,
          role: (formData.role || USER_ROLES.USER) as any,
          status: (formData.status || USER_STATUS.ACTIVE) as any,
          github_username: formData.github_username || '',
          
        });
        console.log(newUser);

        // Validate user data
        const { valid, errors } = newUser.validate();
        if (!valid) {
          alert('Validation errors:\n' + errors.join('\n'));
          setLoading(false);
          return;
        }

        // Add password to the payload
        const userPayload = {
          ...newUser.toJSON(),
          password: formData.password
        };

        // Send to API
        await adminAPI.createUser(userPayload);
      } else if (type === 'projects') {
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
    WebkitTextFillColor: 'var(--text) !important'
  } as React.CSSProperties;

  const labelStyle = {
    display: 'block',
    marginBottom: '0.6rem',
    color: 'var(--text)',
    fontWeight: '600',
    fontSize: '0.9rem',
    letterSpacing: '0.02em'
  };

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
          animation: 'fadeIn 0.3s ease'
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
          padding: '2.5rem',
          borderRadius: '24px',
          background: 'var(--base)',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
          border: '1px solid var(--surface0)',
          animation: 'slideUp 0.3s ease'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '2rem',
          paddingBottom: '1rem',
          borderBottom: '2px solid var(--surface0)'
        }}>
          <h2 style={{ 
            margin: 0, 
            color: 'var(--text)',
            fontSize: '1.75rem',
            fontWeight: '700',
            background: 'linear-gradient(135deg, var(--blue) 0%, var(--mauve) 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
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
              transition: 'all 0.3s ease'
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
                <div className='flex flex-row items-center '> <FaUser style={{ marginRight: '0.5rem', color: 'var(--blue)', fontSize: '1.2rem' } } /> <span>Name</span></div>
                <input
                  type="text"
                  required
                  minLength={3}
                  placeholder="Enter Name (min 3 characters)"
                  onChange={(e) => setFormData({ ...formData,   name: e.target.value })}
                  style={{...inputStyle}}
                  onFocus={(e) => e.currentTarget.style.borderColor = 'var(--blue)'}
                  onBlur={(e) => e.currentTarget.style.borderColor = 'var(--surface0)'}
                />
              </div>
              <div style={{ marginBottom: '1.5rem' }}>
                <div className='flex flex-row items-center '> <FaUser style={{ marginRight: '0.5rem', color: 'var(--blue)', fontSize: '1.2rem' } } /> <span>Username</span></div>
                <input
                  type="text"
                  required
                  minLength={3}
                  placeholder="Enter username (min 3 characters)"
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  style={{...inputStyle}}
                  onFocus={(e) => e.currentTarget.style.borderColor = 'var(--blue)'}
                  onBlur={(e) => e.currentTarget.style.borderColor = 'var(--surface0)'}
                />
              </div>              <div style={{ marginBottom: '1.5rem' }}>
                <div className='flex flex-row items-center'> <FaEnvelope style={{ marginRight: '0.5rem', color: 'var(--green)', fontSize: '1.2rem' }} /> <span>Email</span></div>

                <input
                  type="email"
                  required
                  placeholder="user@example.com"
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  style={{...inputStyle}}
                  onFocus={(e) => e.currentTarget.style.borderColor = 'var(--blue)'}
                  onBlur={(e) => e.currentTarget.style.borderColor = 'var(--surface0)'}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                <div>
                  <div className='flex flex-row items-center'>
                    <FiLock style={{ marginRight: '0.5rem', color: 'var(--red)' , fontSize: '1.2rem'}} /> Password
                  </div>
                  <label style={labelStyle}>
                 
                  </label>
                  <input
                    type="password"
                    required
                    minLength={8}
                    placeholder="Min 8 characters"
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    style={{...inputStyle}}
                    onFocus={(e) => e.currentTarget.style.borderColor = 'var(--blue)'}
                    onBlur={(e) => e.currentTarget.style.borderColor = 'var(--surface0)'}
                  />
                </div>
                <div>
                  <div className='flex flex-row items-center'>
                    <FiShield style={{ marginRight: '0.5rem', color: 'var(--red)' , fontSize: '1.2rem'}} /> Confirm Password
                  </div>
                  <input
                    type="password"
                    required
                    minLength={8}
                    placeholder="Repeat password"
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    style={{
                      ...inputStyle,
                      borderColor: formData.password && formData.confirmPassword && formData.password !== formData.confirmPassword ? 'var(--red)' : 'var(--surface0)'
                    }}
                    onFocus={(e) => e.currentTarget.style.borderColor = 'var(--blue)'}
                    onBlur={(e) => {
                      if (formData.password && formData.confirmPassword && formData.password !== formData.confirmPassword) {
                        e.currentTarget.style.borderColor = 'var(--red)';
                      } else {
                        e.currentTarget.style.borderColor = 'var(--surface0)';
                      }
                    }}
                  />
                  {formData.password && formData.confirmPassword && formData.password !== formData.confirmPassword && (
                    <span style={{ 
                      fontSize: '0.8rem', 
                      color: 'var(--red)', 
                      marginTop: '0.25rem',
                      display: 'block' 
                    }}>
                      Passwords don't match
                    </span>
                  )}
                </div>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <div className="flex"> <FaLink  style={{ marginRight: '0.5rem', color: 'var(--mauve)', fontSize: '1.2rem' }} /> GitHub Username (Optional)</div>
                <input
                  type="text"
                  placeholder="github-username"
                  onChange={(e) => setFormData({ ...formData, github_username: e.target.value })}
                  style={{...inputStyle}}
                  onFocus={(e) => e.currentTarget.style.borderColor = 'var(--blue)'}
                  onBlur={(e) => e.currentTarget.style.borderColor = 'var(--surface0)'}
                />
              </div>

             <div className='grid grid-cols-2 gap-4 mb-6 '>
                <div>
                  <div className="flex">
                  <FaUserShield style={{ marginRight: '0.5rem', color: 'var(--red)', fontSize: '1.2rem' }} />   <span>Role</span> 
                  </div>
                  <select
                    required
                    defaultValue={USER_ROLES.USER}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    style={{
                      ...inputStyle,
                      cursor: 'pointer'
                    }}
                    onFocus={(e) => e.currentTarget.style.borderColor = 'var(--blue)'}
                    onBlur={(e) => e.currentTarget.style.borderColor = 'var(--surface0)'}
                  >
                    <option value={USER_ROLES.USER}>User</option>
                    <option value={USER_ROLES.MODERATOR}>Moderator</option>
                    <option value={USER_ROLES.ADMIN}>Admin</option>
                  </select>
                </div>
                
                <div>
                  <div className='flex flex-row items-center'>
                    <FaToggleOn style={{ marginRight: '0.5rem', color: 'var(--green)', fontSize: '1.2rem' }} /> 
                    <span>Status</span>
                  </div>
                  <select
                    required
                    defaultValue={USER_STATUS.ACTIVE}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    style={{
                      ...inputStyle,
                      cursor: 'pointer'
                    }}
                    onFocus={(e) => e.currentTarget.style.borderColor = 'var(--blue)'}
                    onBlur={(e) => e.currentTarget.style.borderColor = 'var(--surface0)'}
                  >
                    <option value={USER_STATUS.ACTIVE}>Active</option>
                    <option value={USER_STATUS.INACTIVE}>Inactive</option>
                    <option value={USER_STATUS.PENDING}>Pending</option>
                    <option value={USER_STATUS.SUSPENDED}>Suspended</option>
                  </select>
                </div>
              </div>

            </>
          )}

          {type === 'projects' && (
            <>
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={labelStyle}><FaFileAlt style={{ marginRight: '0.5rem', color: 'var(--blue)' }} /> Title</label>
                <input
                  type="text"
                  required
                  placeholder="Enter project title"
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  style={inputStyle}
                  onFocus={(e) => e.currentTarget.style.borderColor = 'var(--blue)'}
                  onBlur={(e) => e.currentTarget.style.borderColor = 'var(--surface0)'}
                />
              </div>
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={labelStyle}><FiFileText style={{ marginRight: '0.5rem', color: 'var(--mauve)' }} /> Description</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Describe your project"
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  style={{
                    ...inputStyle,
                    resize: 'vertical',
                    minHeight: '120px',
                    fontFamily: 'inherit'
                  }}
                  onFocus={(e) => e.currentTarget.style.borderColor = 'var(--blue)'}
                  onBlur={(e) => e.currentTarget.style.borderColor = 'var(--surface0)'}
                />
              </div>
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={labelStyle}><FaLink style={{ marginRight: '0.5rem', color: 'var(--green)' }} /> GitHub URL</label>
                <input
                  type="url"
                  placeholder="https://github.com/username/repo"
                  onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                  style={inputStyle}
                  onFocus={(e) => e.currentTarget.style.borderColor = 'var(--blue)'}
                  onBlur={(e) => e.currentTarget.style.borderColor = 'var(--surface0)'}
                />
              </div>
            </>
          )}

          {type === 'challenges' && (
            <>
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={labelStyle}><FaBullseye style={{ marginRight: '0.5rem', color: 'var(--blue)' }} /> Title</label>
                <input
                  type="text"
                  required
                  placeholder="Enter challenge title"
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  style={inputStyle}
                  onFocus={(e) => e.currentTarget.style.borderColor = 'var(--blue)'}
                  onBlur={(e) => e.currentTarget.style.borderColor = 'var(--surface0)'}
                />
              </div>
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={labelStyle}><FaFileAlt style={{ marginRight: '0.5rem', color: 'var(--mauve)' }} /> Description</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Describe the challenge"
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  style={{
                    ...inputStyle,
                    resize: 'vertical',
                    minHeight: '120px',
                    fontFamily: 'inherit'
                  }}
                  onFocus={(e) => e.currentTarget.style.borderColor = 'var(--blue)'}
                  onBlur={(e) => e.currentTarget.style.borderColor = 'var(--surface0)'}
                />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                <div>
                  <label style={labelStyle}><FaBolt style={{ marginRight: '0.5rem', color: 'var(--yellow)' }} /> Difficulty</label>
                  <select
                    required
                    onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                    style={{
                      ...inputStyle,
                      cursor: 'pointer'
                    }}
                    onFocus={(e) => e.currentTarget.style.borderColor = 'var(--blue)'}
                    onBlur={(e) => e.currentTarget.style.borderColor = 'var(--surface0)'}
                  >
                    <option value="">Select difficulty</option>
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>
                <div>
                  <label style={labelStyle}><FaTrophy style={{ marginRight: '0.5rem', color: 'var(--yellow)' }} /> Points</label>
                  <input
                    type="number"
                    required
                    min="0"
                    placeholder="100"
                    onChange={(e) => setFormData({ ...formData, points: parseInt(e.target.value) })}
                    style={inputStyle}
                    onFocus={(e) => e.currentTarget.style.borderColor = 'var(--blue)'}
                    onBlur={(e) => e.currentTarget.style.borderColor = 'var(--surface0)'}
                  />
                </div>
              </div>
            </>
          )}

          <div style={{ display: 'flex', gap: '1rem', marginTop: '2.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--surface0)' }}>
            <button
              type="submit"
              disabled={loading}
              style={{
                flex: 1,
                padding: '1rem 2rem',
                borderRadius: '12px',
                border: 'none',
                background: loading ? 'var(--surface0)' : 'linear-gradient(135deg, var(--blue) 0%, var(--mauve) 100%)',
                color: 'var(--crust)',
                fontSize: '1rem',
                fontWeight: '700',
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: loading ? 'none' : '0 4px 12px rgba(137, 180, 250, 0.3)',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
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
                  <FaHourglassHalf style={{ marginRight: '0.5rem' }} />
                  Creating...
                </>
              ) : (
                <>
                  <FaPlus style={{ marginRight: '0.5rem' }} />
                  Create
                </>
              )}
            </button>
            <button
              type="button"
              onClick={onClose}
              style={{
                flex: 1,
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
                letterSpacing: '0.05em'
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