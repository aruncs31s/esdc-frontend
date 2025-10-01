import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaUser, FaLock, FaEye, FaEyeSlash, FaTrophy, FaCode, FaComments } from 'react-icons/fa';
import { FiSun, FiMoon } from 'react-icons/fi';
import { useAuth } from '../contexts/AuthContext';

const Login = ({ isDarkMode, toggleTheme }) => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { login, logout, isAuthenticated, user, loading } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/profile');
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
    } catch (error) {
      setError('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const headerHeight = document.querySelector('.navbar')?.offsetHeight || 0;
      const targetPosition = element.offsetTop - headerHeight;

      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    }
  };

  if (loading) {
    return (
      <div className="login-page">
        <nav className="navbar">
          <div className="nav-container">
            <div className="nav-logo">
              <h2>ESDC</h2>
            </div>
            <ul className="nav-menu">
              <li><a href="#home" className="nav-link" onClick={() => scrollToSection('home')}>Home</a></li>
              <li><a href="#about" className="nav-link" onClick={() => scrollToSection('about')}>About</a></li>
              <li><a href="#projects" className="nav-link" onClick={() => scrollToSection('projects')}>Projects</a></li>
              <li><a href="#team" className="nav-link" onClick={() => scrollToSection('team')}>Team</a></li>
              <li><a href="#contact" className="nav-link" onClick={() => scrollToSection('contact')}>Contact</a></li>
            </ul>
            <div className="theme-toggle">
              <button className="theme-btn" onClick={toggleTheme} aria-label="Toggle theme">
                {isDarkMode ? <FiSun className="theme-icon" /> : <FiMoon className="theme-icon" />}
              </button>
            </div>
          </div>
        </nav>

        <section className="hero" style={{ minHeight: 'calc(100vh - 200px)', display: 'flex', alignItems: 'center' }}>
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-md-6 col-lg-5">
                <div className="about-card" style={{ padding: '3rem', textAlign: 'center' }}>
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  <p className="mt-3 text-muted">Checking authentication...</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="login-page">
      <nav className="navbar">
        <div className="nav-container">
          <div className="nav-logo">
            <h2>ESDC</h2>
          </div>
          <ul className="nav-menu">
            <li><a href="#home" className="nav-link" onClick={() => scrollToSection('home')}>Home</a></li>
            <li><a href="#about" className="nav-link" onClick={() => scrollToSection('about')}>About</a></li>
            <li><a href="#projects" className="nav-link" onClick={() => scrollToSection('projects')}>Projects</a></li>
            <li><a href="#team" className="nav-link" onClick={() => scrollToSection('team')}>Team</a></li>
            <li><a href="#contact" className="nav-link" onClick={() => scrollToSection('contact')}>Contact</a></li>
            {!isAuthenticated && (
              <li><span className="nav-link active">Login</span></li>
            )}
            {isAuthenticated && (
              <>
                <li><a href="#profile" className="nav-link">Profile</a></li>
                <li><button className="nav-link btn-link" onClick={handleLogout}>Logout</button></li>
              </>
            )}
          </ul>
          <div className="theme-toggle">
            <button className="theme-btn" onClick={toggleTheme} aria-label="Toggle theme">
              {isDarkMode ? <FiSun className="theme-icon" /> : <FiMoon className="theme-icon" />}
            </button>
          </div>
        </div>
      </nav>

      <section className="hero" style={{ minHeight: 'calc(100vh - 200px)', display: 'flex', alignItems: 'center' }}>
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-6 col-lg-5">
              <div className="about-card" style={{ padding: '3rem', textAlign: 'center' }}>
                <div className="text-center mb-4">
                  <img src="/icons/logo.png" alt="ESDC Logo" width="80" height="80" className="mb-3" />
                  <h2 className="fw-bold">Welcome Back</h2>
                  <p className="text-muted">Sign in to access your ESDC profile and challenges</p>
                </div>

                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email</label>
                    <div className="input-group">
                      <span className="input-group-text"><FaUser /></span>
                      <input
                        type="email"
                        className="form-control"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        placeholder="Enter your email"
                      />
                    </div>
                  </div>

                  <div className="mb-3">
                    <label htmlFor="password" className="form-label">Password</label>
                    <div className="input-group">
                      <span className="input-group-text"><FaLock /></span>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        className="form-control"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        placeholder="Enter your password"
                      />
                      <button
                        type="button"
                        className="btn btn-outline-secondary"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                      </button>
                    </div>
                  </div>

                  {error && (
                    <div className="alert alert-danger">{error}</div>
                  )}

                  <div className="d-grid gap-2">
                    <button type="submit" className="btn btn-primary btn-lg" disabled={isLoading}>
                      {isLoading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                          Signing in...
                        </>
                      ) : (
                        'Sign In'
                      )}
                    </button>
                  </div>

                  <div className="text-center mt-3">
                    <small className="text-muted">
                      Don't have an account? <Link to="/register" className="text-decoration-none">Register here</Link>
                    </small>
                  </div>
                </form>

                <div className="mt-5 pt-4 border-top">
                  <h6 className="text-center mb-3">What you can do when logged in:</h6>
                  <div className="row g-3">
                    <div className="col-6">
                      <div className="text-center">
                        <FaUser className="text-primary fs-4 mb-2" />
                        <small className="d-block">View Profile</small>
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="text-center">
                        <FaTrophy className="text-warning fs-4 mb-2" />
                        <small className="d-block">Track Progress</small>
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="text-center">
                        <FaCode className="text-success fs-4 mb-2" />
                        <small className="d-block">Access Challenges</small>
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="text-center">
                        <FaComments className="text-info fs-4 mb-2" />
                        <small className="d-block">Join Community</small>
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