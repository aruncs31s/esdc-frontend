import { useState, useEffect } from 'react';
import { FaGithub, FaUser, FaTrophy, FaCode, FaComments } from 'react-icons/fa';
import { FiSun, FiMoon } from 'react-icons/fi';

const Login = ({ isDarkMode, toggleTheme }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  useEffect(() => {
    checkAuthState();
    checkOAuthCallback();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const checkAuthState = () => {
    const token = localStorage.getItem('github_token') ;
    const userData = localStorage.getItem('github_user');

    if (token && userData) {
      setUser(JSON.parse(userData));
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  };

  const checkOAuthCallback = async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const state = urlParams.get('state');

    if (code) {
      await handleOAuthCallback(code, state);
    }
  };

  const handleOAuthCallback = async (code, state) => {
    try {
      setIsLoading(true);
      setError('');

      // Verify state for security
      const storedState = sessionStorage.getItem('oauth_state');
      if (state !== storedState) {
        throw new Error('Invalid OAuth state - possible security issue');
      }

      // Exchange code for token
      const tokenData = await exchangeCodeForToken(code);

      // Get user info
      const userInfo = await getUserInfo(tokenData.access_token);

      // Store authentication data
      localStorage.setItem('github_token', tokenData.access_token);
      localStorage.setItem('github_user', JSON.stringify(userInfo));

      // Clear URL parameters
      window.history.replaceState({}, document.title, window.location.pathname);

      setUser(userInfo);
      setIsAuthenticated(true);

    } catch (error) {
      console.error('OAuth callback error:', error);
      setError('Authentication failed: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const exchangeCodeForToken = async (code) => { // eslint-disable-line no-unused-vars
    // For local development, use mock data
    console.log('Using mock authentication for local development');
    return {
      access_token: 'mock_token_' + Date.now(),
      token_type: 'bearer'
    };
  };

  const getUserInfo = async (token) => {
    // Try to get real GitHub user info if token looks real
    if (token && !token.startsWith('mock_token_')) {
      try {
        const response = await fetch('https://api.github.com/user', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/vnd.github.v3+json'
          }
        });

        if (response.ok) {
          const user = await response.json();
          return {
            id: user.id,
            login: user.login,
            name: user.name || user.login,
            email: user.email,
            avatar_url: user.avatar_url,
            html_url: user.html_url,
            bio: user.bio,
            company: user.company,
            location: user.location
          };
        }
      } catch (error) { // eslint-disable-line no-unused-vars
        console.log('Failed to get real user info, using mock data');
      }
    }

    // Fallback to mock data
    console.log('Using mock user info for local development');
    return {
      id: 12345,
      login: 'testuser',
      name: 'Test User',
      email: 'test@example.com',
      avatar_url: 'https://github.com/identicons/testuser.png',
      html_url: 'https://github.com/testuser',
      bio: 'Test user for local development',
      company: 'ESDC',
      location: 'Kannur'
    };
  };

  const handleGitHubLogin = () => {
    setIsAuthenticating(true);
    setError('');

    // For demo purposes, simulate OAuth flow
    setTimeout(() => {
      const mockUser = {
        id: 12345,
        login: 'demo-user',
        name: 'Demo User',
        email: 'demo@example.com',
        avatar_url: 'https://github.com/identicons/demo-user.png',
        html_url: 'https://github.com/demo-user',
        bio: 'Demo user for ESDC platform',
        company: 'ESDC',
        location: 'Kannur'
      };

      localStorage.setItem('github_token', 'demo_token_' + Date.now());
      localStorage.setItem('github_user', JSON.stringify(mockUser));

      setUser(mockUser);
      setIsAuthenticated(true);
      setIsAuthenticating(false);
    }, 2000);
  };

  const handleLogout = () => {
    localStorage.removeItem('github_token');
    localStorage.removeItem('github_user');
    sessionStorage.removeItem('oauth_state');
    setUser(null);
    setIsAuthenticated(false);
    setError('');
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

  if (isLoading) {
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
                {isAuthenticated ? (
                  // Authenticated State
                  <div className="text-center">
                    <div className="alert alert-success">
                      <FaUser className="fs-1 text-success mb-3" />
                      <h5>You are already logged in!</h5>
                      <p className="mb-3">Welcome back, <span className="fw-bold">{user?.name || 'User'}</span></p>
                      <div className="d-grid gap-2">
                        <a href="#profile" className="btn btn-primary">Go to Profile</a>
                        <button className="btn btn-outline-danger" onClick={handleLogout}>Logout</button>
                      </div>
                    </div>
                  </div>
                ) : (
                  // Login Form
                  <>
                    <div className="text-center mb-4">
                      <img src="/icons/logo.png" alt="ESDC Logo" width="80" height="80" className="mb-3" />
                      <h2 className="fw-bold">Welcome Back</h2>
                      <p className="text-muted">Sign in to access your ESDC profile and challenges</p>
                    </div>

                    <div className="d-grid gap-3">
                      <button
                        className="btn btn-dark btn-lg d-flex align-items-center justify-content-center"
                        onClick={handleGitHubLogin}
                        disabled={isAuthenticating}
                      >
                        {isAuthenticating ? (
                          <>
                            <div className="spinner-border spinner-border-sm me-2" role="status"></div>
                            Signing in...
                          </>
                        ) : (
                          <>
                            <FaGithub className="me-2" />
                            Continue with GitHub
                          </>
                        )}
                      </button>

                      <div className="text-center">
                        <small className="text-muted">
                          By signing in, you agree to our terms of service and privacy policy.
                        </small>
                      </div>
                    </div>

                    {error && (
                      <div className="alert alert-danger mt-3">
                        <i className="bi bi-exclamation-triangle me-2"></i>
                        {error}
                      </div>
                    )}

                    {/* Features Section */}
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
                  </>
                )}
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

export default Login;