import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Events from './pages/Events';
import Challenges from './pages/Challenges';
import Resources from './pages/Resources';
import Products from './pages/Products';
import Projects from './pages/Projects';
import MyProducts from './pages/MyProducts';
import Games from './pages/Games';
import AdminPanel from './pages/AdminPanel';
import ProfileCardPage from './pages/ProfileCardPage';
import Users from './pages/Users';
import Login from './components/Login';
import Register from './components/Register';
import UserProfile from './components/UserProfile';
import Dashboard from './components/Dashboard';
import Leaderboard from './components/Leaderboard';
import UserProjects from './pages/UserProjects';
import Footer from './components/Footer';
import Chatbot from './components/Chatbot';
import SnakeGame from './components/games/SnakeGame';
import TetrisGame from './components/games/TetrisGame';
import PongGame from './components/games/PongGame';
import BreakoutGame from './components/games/BreakoutGame';
import MemoryGame from './components/games/MemoryGame';
import SimonGame from './components/games/SimonGame';
import './index.css';

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Initialize theme
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const storedTheme = localStorage.getItem('theme');
    
    if (storedTheme === 'dark') {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark-mode');
    } else if (storedTheme === 'light') {
      setIsDarkMode(false);
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark-mode');
    } else if (prefersDark) {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark-mode');
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    
    if (newTheme) {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark-mode');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark-mode');
      localStorage.setItem('theme', 'light');
    }
  };

  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Chatbot />
          <Routes>
            <Route path="/" element={
              <>
                <Navbar isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
                <Home />
                <Footer />
              </>
            } />
            <Route path="/login" element={
              <Login isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
            } />
            <Route path="/register" element={
              <Register isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
            } />
            <Route path="/events" element={
              <>
                <Navbar isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
                <Events />
                <Footer />
              </>
            } />
            <Route path="/challenges" element={
              <>
                <Navbar isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
                <Challenges />
                <Footer />
              </>
            } />
            <Route path="/resources" element={
              <>
                <Navbar isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
                <Resources />
                <Footer />
              </>
            } />
            <Route path="/products" element={
              <>
                <Navbar isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
                <Products />
                <Footer />
              </>
            } />
            <Route path="/my-products" element={
              <>
                <Navbar isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
                <MyProducts />
                <Footer />
              </>
            } />
            <Route path="/community-projects" element={
              <>
                <Navbar isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
                <Projects />
                <Footer />
              </>
            } />
            <Route path="/games" element={
              <>
                <Navbar isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
                <Games />
                <Footer />
              </>
            } />
            <Route path="/games/snake" element={
              <>
                <Navbar isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
                <SnakeGame />
                <Footer />
              </>
            } />
            <Route path="/games/tetris" element={
              <>
                <Navbar isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
                <TetrisGame />
                <Footer />
              </>
            } />
            <Route path="/games/pong" element={
              <>
                <Navbar isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
                <PongGame />
                <Footer />
              </>
            } />
            <Route path="/games/breakout" element={
              <>
                <Navbar isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
                <BreakoutGame />
                <Footer />
              </>
            } />
            <Route path="/games/memory" element={
              <>
                <Navbar isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
                <MemoryGame />
                <Footer />
              </>
            } />
            <Route path="/games/simon" element={
              <>
                <Navbar isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
                <SimonGame />
                <Footer />
              </>
            } />
            <Route path="/dashboard" element={
              <>
                <Navbar isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
                <Dashboard />
                <Footer />
              </>
            } />
            <Route path="/leaderboard" element={
              <>
                <Navbar isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
                <Leaderboard />
                <Footer />
              </>
            } />
            <Route path="/projects" element={
              <>
                <Navbar isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
                <UserProjects />
                <Footer />
              </>
            } />
            <Route path="/profile" element={
              <>
                <Navbar isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
                <UserProfile isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
                <Footer />
              </>
            } />
            <Route path="/profile-card-demo" element={
              <>
                <Navbar isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
                <ProfileCardPage />
                <Footer />
              </>
            } />
            <Route path="/users" element={
              <>
                <Navbar isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
                <Users />
                <Footer />
              </>
            } />
            <Route path="/admin" element={
              <ProtectedRoute requiredRole="admin">
                <>
                  <Navbar isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
                  <AdminPanel />
                  <Footer />
                </>
              </ProtectedRoute>
            } />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;