import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { AuthProvider } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './components/Login';
import Register from './components/Register';
import UserProfile from './components/UserProfile';
import Footer from './components/Footer';
import './index.css';

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Initialize theme
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const storedTheme = localStorage.getItem('theme');
    
    if (storedTheme === 'dark') {
      setIsDarkMode(true);
      document.body.classList.add('dark-mode');
    } else if (storedTheme === 'light') {
      setIsDarkMode(false);
      document.body.classList.remove('dark-mode');
    } else if (prefersDark) {
      setIsDarkMode(true);
      document.body.classList.add('dark-mode');
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    
    if (newTheme) {
      document.body.classList.add('dark-mode');
      localStorage.setItem('theme', 'dark');
    } else {
      document.body.classList.remove('dark-mode');
      localStorage.setItem('theme', 'light');
    }
  };

  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={
              <>
                <Navbar isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
                <Home />
                <h1>Hi</h1>
                <Footer />
              </>
            } />
            <Route path="/login" element={
              <Login isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
            } />
            <Route path="/register" element={
              <Register isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
            } />
            <Route path="/profile" element={
              <>
                <Navbar isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
                <UserProfile isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
                <Footer />
              </>
            } />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;