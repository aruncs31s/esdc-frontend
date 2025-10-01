import { useState } from 'react';
import { FaUser, FaEnvelope, FaLock, FaCheck } from 'react-icons/fa';
import { FiSun, FiMoon } from 'react-icons/fi';

const Register = ({ isDarkMode, toggleTheme }) => {
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear errors when user starts typing
    if (error) setError('');
  };

  const validateForm = () => {
    if (!formData.email || !formData.username || !formData.password || !formData.confirmPassword) {
      setError('All fields are required');
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      return false;
    }

    if (formData.username.length < 3) {
      setError('Username must be at least 3 characters long');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    setError('');

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      // For demo purposes, just show success
      setSuccess(true);

      // In a real app, you would make an API call here
      console.log('Registration data:', {
        email: formData.email,
        username: formData.username,
        password: formData.password
      });

    } catch (error) {
      setError('Registration failed. Please try again.');
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

  if (success) {
    return (
      <div className="register-page">
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
              <li><a href="/login" className="nav-link">Login</a></li>
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
                  <div className="text-center">
                    <FaCheck className="text-success fs-1 mb-3" />
                    <h4 className="text-success mb-3">Registration Successful!</h4>
                    <p className="text-muted mb-4">
                      Welcome to ESDC, <span className="fw-bold">{formData.username}</span>!
                      <br />
                      Your account has been created successfully.
                    </p>
                    <div className="d-grid gap-2">
                      <a href="/login" className="btn btn-primary">Go to Login</a>
                      <a href="/" className="btn btn-outline-primary">Back to Home</a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <footer className="footer">
          <div className="container">
            <div className="footer-content">
              <div className="footer-section">
                <h3>ESDC</h3>
                <p>Embedded Systems Design Club<br />Government College of Engineering Kannur</p>
              </div>
              <div className="footer-section">
                <p>&copy; 2025 ESDC. All rights reserved.</p>
              </div>
            </div>
          </div>
        </footer>
      </div>
    );
  }

  return (
    <div className="register-page">
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
            <li><a href="/login" className="nav-link">Login</a></li>
            <li><span className="nav-link active">Register</span></li>
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
              <div className="about-card" style={{ padding: '3rem' }}>
                <div className="text-center mb-4">
                  <img src="/icons/logo.png" alt="ESDC Logo" width="80" height="80" className="mb-3" />
                  <h2 className="fw-bold">Join ESDC</h2>
                  <p className="text-muted">Create your account to get started</p>
                </div>

                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label htmlFor="email" className="form-label">
                      <FaEnvelope className="me-2" />
                      Email Address
                    </label>
                    <input
                      type="email"
                      className="form-control"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Enter your email"
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="username" className="form-label">
                      <FaUser className="me-2" />
                      Username
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="username"
                      name="username"
                      value={formData.username}
                      onChange={handleInputChange}
                      placeholder="Choose a username"
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="password" className="form-label">
                      <FaLock className="me-2" />
                      Password
                    </label>
                    <input
                      type="password"
                      className="form-control"
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="Create a password"
                      required
                    />
                  </div>

                  <div className="mb-4">
                    <label htmlFor="confirmPassword" className="form-label">
                      <FaLock className="me-2" />
                      Confirm Password
                    </label>
                    <input
                      type="password"
                      className="form-control"
                      id="confirmPassword"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      placeholder="Confirm your password"
                      required
                    />
                  </div>

                  <div className="d-grid">
                    <button
                      type="submit"
                      className="btn btn-primary btn-lg"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <div className="spinner-border spinner-border-sm me-2" role="status"></div>
                          Creating Account...
                        </>
                      ) : (
                        'Create Account'
                      )}
                    </button>
                  </div>
                </form>

                <div className="text-center mt-3">
                  <small className="text-muted">
                    Already have an account? <a href="/login" className="text-decoration-none">Sign in here</a>
                  </small>
                </div>

                {error && (
                  <div className="alert alert-danger mt-3">
                    <i className="bi bi-exclamation-triangle me-2"></i>
                    {error}
                  </div>
                )}

                <div className="text-center mt-4">
                  <small className="text-muted">
                    By creating an account, you agree to our terms of service and privacy policy.
                  </small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-section">
              <h3>ESDC</h3>
              <p>Embedded Systems Design Club<br />Government College of Engineering Kannur</p>
            </div>
            <div className="footer-section">
              <p>&copy; 2025 ESDC. All rights reserved.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Register;