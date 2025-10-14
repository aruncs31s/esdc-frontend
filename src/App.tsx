import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { ShopProvider } from './contexts/ShopContext';
import { SettingsProvider, useSettings } from './contexts/SettingsContext';
import ProtectedRoute from './components/ProtectedRoute';
import Header from './components/Navbar';
import Home from './pages/Home';
import Events from './pages/Events';
import Resources from './pages/Resources';
import Products from './pages/Products';
import Shop from './pages/Shop';
import ShopCart from './pages/ShopCart';
import LMS from './pages/LMS';
import Projects from './pages/Projects';
import ProjectDetail from './pages/ProjectDetail';
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
import Notifications from './pages/Notifications';
import Blog from './pages/Blog';
import Search from './pages/Search';
import Settings from './pages/Settings';
import './index.css';

const AppRoutes = () => {
  const { isFeatureEnabled } = useSettings();

  return (
    <div className="App">
      {isFeatureEnabled('chatbot') && <Chatbot />}
      <Routes>
        <Route
          path="/"
          element={
            <>
              <Header />
              <Home />
              <Footer />
            </>
          }
        />
        <Route
          path="/login"
          element={
            <>
              <Header />
              <Login />
              <Footer />
            </>
          }
        />
        <Route
          path="/register"
          element={
            <>
              <Header />
              <Register />
              <Footer />
            </>
          }
        />
        {isFeatureEnabled('events') && (
          <Route
            path="/events"
            element={
              <>
                <Header />
                <Events />
                <Footer />
              </>
            }
          />
        )}
        {/* {isFeatureEnabled('challenges') && (
                  <Route path="/challenges" element={
                    <>
                      <Header />
                      <Challenges />
                      <Footer />
                    </>
                  } />
                )} */}
        {isFeatureEnabled('resources') && (
          <Route
            path="/resources"
            element={
              <>
                <Header />
                <Resources />
                <Footer />
              </>
            }
          />
        )}
        {isFeatureEnabled('products') && (
          <Route
            path="/products"
            element={
              <>
                <Header />
                <Products />
                <Footer />
              </>
            }
          />
        )}
        {isFeatureEnabled('shop') && (
          <>
            <Route
              path="/shop"
              element={
                <>
                  <Header />
                  <Shop />
                  <Footer />
                </>
              }
            />
            <Route
              path="/shop-cart"
              element={
                <>
                  <Header />
                  <ShopCart />
                  <Footer />
                </>
              }
            />
          </>
        )}
        {isFeatureEnabled('lms') && (
          <Route
            path="/lms"
            element={
              <>
                <Header />
                <LMS />
                <Footer />
              </>
            }
          />
        )}
        {isFeatureEnabled('products') && (
          <Route
            path="/my-products"
            element={
              <>
                <Header />
                <MyProducts />
                <Footer />
              </>
            }
          />
        )}
        {isFeatureEnabled('projects') && (
          <>
            <Route
              path="/my-projects"
              element={
                <>
                  <Header />
                  <UserProjects />
                  <Footer />
                </>
              }
            />
            <Route
              path="/projects/:id"
              element={
                <>
                  <Header />
                  <ProjectDetail />
                  <Footer />
                </>
              }
            />
          </>
        )}
        {isFeatureEnabled('games') && (
          <>
            <Route
              path="/games"
              element={
                <>
                  <Header />
                  <Games />
                  <Footer />
                </>
              }
            />
            <Route
              path="/games/snake"
              element={
                <>
                  <Header />
                  <SnakeGame />
                  <Footer />
                </>
              }
            />
            <Route
              path="/games/tetris"
              element={
                <>
                  <Header />
                  <TetrisGame />
                  <Footer />
                </>
              }
            />
            <Route
              path="/games/pong"
              element={
                <>
                  <Header />
                  <PongGame />
                  <Footer />
                </>
              }
            />
            <Route
              path="/games/breakout"
              element={
                <>
                  <Header />
                  <BreakoutGame />
                  <Footer />
                </>
              }
            />
            <Route
              path="/games/memory"
              element={
                <>
                  <Header />
                  <MemoryGame />
                  <Footer />
                </>
              }
            />
            <Route
              path="/games/simon"
              element={
                <>
                  <Header />
                  <SimonGame />
                  <Footer />
                </>
              }
            />
          </>
        )}
        <Route
          path="/dashboard"
          element={
            <>
              <Header />
              <Dashboard />
              <Footer />
            </>
          }
        />
        {isFeatureEnabled('leaderboard') && (
          <Route
            path="/leaderboard"
            element={
              <>
                <Header />
                <Leaderboard />
                <Footer />
              </>
            }
          />
        )}
        {isFeatureEnabled('projects') && (
          <Route
            path="/projects"
            element={
              <>
                <Header />
                <Projects />
                {/* <UserProjects /> */}
                <Footer />
              </>
            }
          />
        )}
        <Route
          path="/profile"
          element={
            <>
              <Header />
              <UserProfile />
              <Footer />
            </>
          }
        />
        <Route
          path="/profile-card-demo"
          element={
            <>
              <Header />
              <ProfileCardPage />
              <Footer />
            </>
          }
        />
        <Route
          path="/users"
          element={
            <>
              <Header />
              <Users />
              <Footer />
            </>
          }
        />
        {isFeatureEnabled('notifications') && (
          <Route
            path="/notifications"
            element={
              <>
                <Notifications />
                <Footer />
              </>
            }
          />
        )}
        {isFeatureEnabled('blog') && (
          <Route
            path="/blog"
            element={
              <>
                <Header />
                <Blog />
                <Footer />
              </>
            }
          />
        )}
        <Route
          path="/search"
          element={
            <>
              <Header />
              <Search />
              <Footer />
            </>
          }
        />
        <Route
          path="/settings"
          element={
            <>
              <Header />
              <Settings />
              <Footer />
            </>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute requiredRole="admin">
              <>
                <Header />
                <AdminPanel />
                <Footer />
              </>
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <ShopProvider>
          <SettingsProvider>
            <Router>
              <AppRoutes />
            </Router>
          </SettingsProvider>
        </ShopProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
