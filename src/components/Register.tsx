import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaGithub,
  FaTrophy,
  FaCode,
  FaComments,
} from 'react-icons/fa';
import { useAuth } from '../hooks/useAuth';
import { RegisterRequest } from '../types';
import './Login.css';
import { RegisterResponse } from '@/types/auth';
const Register = () => {
  const [formData, setFormData] = useState<RegisterRequest>({
    name: '',
    username: '',
    email: '',
    password: '',
    github_username: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [focusedField, setFocusedField] = useState('');

  const { register, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/profile');
    }
  }, [isAuthenticated, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const result: RegisterResponse = await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        username: formData.username,
        github_username: formData.github_username,
        confirmPassword: formData.confirmPassword,
      });

      if (!result.success) {
        setError(result.message || 'Registration failed');
      }
    } catch (err) {
      console.error('Registration error:', err);
      setError('Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page">
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
                    <h1 className="login-title">Join ESDC</h1>
                    <p className="login-subtitle">Create your account to start your journey</p>
                  </div>

                  <form onSubmit={handleSubmit} className="login-form">
                    <div
                      className={`login-input-group ${focusedField === 'name' || formData.name ? 'focused' : ''}`}
                    >
                      <FaUser className="login-input-icon" />
                      <input
                        type="text"
                        className="login-input"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        onFocus={() => setFocusedField('name')}
                        onBlur={() => setFocusedField('')}
                        required
                        placeholder=" "
                      />
                      <label htmlFor="name" className="login-label">
                        Full Name
                      </label>
                    </div>

                    <div
                      className={`login-input-group ${focusedField === 'username' || formData.username ? 'focused' : ''}`}
                    >
                      <FaUser className="login-input-icon" />
                      <input
                        type="text"
                        className="login-input"
                        id="username"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        onFocus={() => setFocusedField('username')}
                        onBlur={() => setFocusedField('')}
                        required
                        placeholder=" "
                      />
                      <label htmlFor="username" className="login-label">
                        Username
                      </label>
                    </div>

                    <div
                      className={`login-input-group ${focusedField === 'email' || formData.email ? 'focused' : ''}`}
                    >
                      <FaEnvelope className="login-input-icon" />
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
                      <label htmlFor="email" className="login-label">
                        Email Address
                      </label>
                    </div>

                    <div
                      className={`login-input-group ${focusedField === 'github_username' || formData.github_username ? 'focused' : ''}`}
                    >
                      <FaGithub className="login-input-icon" />
                      <input
                        type="text"
                        className="login-input"
                        id="github_username"
                        name="github_username"
                        value={formData.github_username}
                        onChange={handleChange}
                        onFocus={() => setFocusedField('github_username')}
                        onBlur={() => setFocusedField('')}
                        placeholder=" "
                      />
                      <label htmlFor="github_username" className="login-label">
                        GitHub Username (Optional)
                      </label>
                    </div>

                    <div
                      className={`login-input-group ${focusedField === 'password' || formData.password ? 'focused' : ''}`}
                    >
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
                      <label htmlFor="password" className="login-label">
                        Password
                      </label>
                      <button
                        type="button"
                        className="login-toggle-password"
                        onClick={() => setShowPassword(!showPassword)}
                        tabIndex={-1}
                      >
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                      </button>
                    </div>

                    <div
                      className={`login-input-group ${focusedField === 'confirmPassword' || formData.confirmPassword ? 'focused' : ''}`}
                    >
                      <FaLock className="login-input-icon" />
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        className="login-input"
                        id="confirmPassword"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        onFocus={() => setFocusedField('confirmPassword')}
                        onBlur={() => setFocusedField('')}
                        required
                        placeholder=" "
                      />
                      <label htmlFor="confirmPassword" className="login-label">
                        Confirm Password
                      </label>
                      <button
                        type="button"
                        className="login-toggle-password"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        tabIndex={-1}
                      >
                        {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
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
                          Creating Account...
                        </>
                      ) : (
                        'Create Account'
                      )}
                    </button>

                    <div className="login-footer-text">
                      Already have an account?{' '}
                      <Link to="/login" className="login-link">
                        Sign in
                      </Link>
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

export default Register;
