import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaUser, FaLock, FaEye, FaEyeSlash, FaTrophy, FaCode, FaComments } from 'react-icons/fa';
import { useAuth } from '../hooks/useAuth';
import './Login.css';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [focusedField, setFocusedField] = useState('');
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const result = await login(formData);
      if (!result.success) {
        setError(result.message);
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="login-page">
      {/* <Header /> */}
      <div className="login-background">
        <div className="login-gradient-orb login-orb-1"></div>
        <div className="login-gradient-orb login-orb-2"></div>
        <div className="login-gradient-orb login-orb-3"></div>
      </div>

      <section className="login-hero">
        <div className="container">
          <div className="row justify-content-center align-items-center">
            <div className="col-md-10 col-lg-9">
              <div className="login-container">
                <div className="login-card">
                  <div className="login-header">
                    <div className="login-logo-wrapper">
                      <img src="/icons/logo.png" alt="ESDC Logo" className="login-logo" />
                    </div>
                    <h1 className="login-title">Welcome Back</h1>
                    <p className="login-subtitle">Sign in to continue your journey</p>
                  </div>

                  <form onSubmit={handleSubmit} className="login-form">
                    <div className={`login-input-group ${focusedField === 'email' || formData.email ? 'focused' : ''}`}>
                      <FaUser className="login-input-icon" />
                      <input
                        type="email"
                        className="login-input"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        onFocus={() => setFocusedField('email')}
                        onBlur={() => setFocusedField('')}
                        required
                        placeholder=" "
                      />
                      <label htmlFor="email" className="login-label">Email Address</label>
                    </div>

                    <div className={`login-input-group ${focusedField === 'password' || formData.password ? 'focused' : ''}`}>
                      <FaLock className="login-input-icon" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        className="login-input"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        onFocus={() => setFocusedField('password')}
                        onBlur={() => setFocusedField('')}
                        required
                        placeholder=" "
                      />
                      <label htmlFor="password" className="login-label">Password</label>
                      <button
                        type="button"
                        className="login-toggle-password"
                        onClick={() => setShowPassword(!showPassword)}
                        tabIndex={-1}
                      >
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                      </button>
                    </div>

                    {error && (
                      <div className="login-error">
                        <span>⚠</span> {error}
                      </div>
                    )}

                    <button type="submit" className="login-submit-btn" disabled={isLoading}>
                      {isLoading ? (
                        <>
                          <span className="login-spinner"></span>
                          Signing in...
                        </>
                      ) : (
                        'Sign In'
                      )}
                    </button>

                    <div className="login-footer-text">
                      Don't have an account? <Link to="/register" className="login-link">Create one</Link>
                    </div>
                  </form>
                </div>

                <div className="login-features">
                  <h3 className="login-features-title">Member Benefits</h3>
                  <div className="login-features-grid">
                    <div className="login-feature-item">
                      <div className="login-feature-icon">
                        <FaUser />
                      </div>
                      <div className="login-feature-content">
                        <h4>Personal Profile</h4>
                        <p>Showcase your achievements</p>
                      </div>
                    </div>
                    <div className="login-feature-item">
                      <div className="login-feature-icon">
                        <FaTrophy />
                      </div>
                      <div className="login-feature-content">
                        <h4>Track Progress</h4>
                        <p>Monitor your learning journey</p>
                      </div>
                    </div>
                    <div className="login-feature-item">
                      <div className="login-feature-icon">
                        <FaCode />
                      </div>
                      <div className="login-feature-content">
                        <h4>Coding Challenges</h4>
                        <p>Solve real-world problems</p>
                      </div>
                    </div>
                    <div className="login-feature-item">
                      <div className="login-feature-icon">
                        <FaComments />
                      </div>
                      <div className="login-feature-content">
                        <h4>Community Access</h4>
                        <p>Connect with fellow developers</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Login;