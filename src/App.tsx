import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { ShopProvider } from './contexts/ShopContext';
import { SettingsProvider, useSettings } from './contexts/SettingsContext';
import ProtectedRoute from './components/ProtectedRoute';
import ErrorBoundary from './components/ErrorBoundary';
import { MainLayout } from './components/Layout';
import Home from './pages/Home';
import Events from './pages/Events';
import Resources from './pages/Resources';
import Products from './pages/Products';
import ProductDetailsPage from './pages/ProductDetail';
import Shop from './pages/Shop';
import ShopCart from './pages/ShopCart';
import LMS from './pages/LMS';
import CourseDetail from './pages/CourseDetail';
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
import ProjectPlanningPage from './pages/ProjectPlanning';
import Mentorship from './pages/Mentorship';
import Hackathons from './pages/Hackathons';
import Workshops from './pages/Workshops';
import Certifications from './pages/Certifications';
import JobBoard from './pages/JobBoard';
import Forum from './pages/Forum';
import Documentation from './pages/Documentation';
import CodeReview from './pages/CodeReview';
import Analytics from './pages/Analytics';
import Teams from './pages/Teams';
import Integrations from './pages/Integrations';
import Roadmap from './pages/Roadmap';
import Build from './pages/Build';
import ProjectTrending from './pages/ProjectTrending';
import ProjectTemplatesPage from './pages/ProjectTemplatesPage';
import ProjectNotificationsPage from './pages/ProjectNotificationsPage';
import DockSidebar from './components/DockSidebar';
import { DemoModeToggle, DemoBanner, useDemoMode } from './modules/demo';
import './index.css';

const AppRoutes = () => {
  const { isFeatureEnabled } = useSettings();
  const { isDemoMode } = useDemoMode();

  return (
    <div className="App">
      <DockSidebar />
      {isFeatureEnabled('chatbot') && <Chatbot />}
      <DemoModeToggle />
      {isDemoMode && <DemoBanner />}
      <Routes>
        <Route
          path="/"
          element={
            <MainLayout>
              <Home />
            </MainLayout>
          }
        />
        <Route
          path="/login"
          element={
            <MainLayout>
              <Login />
            </MainLayout>
          }
        />
        <Route
          path="/register"
          element={
            <MainLayout>
              <Register />
            </MainLayout>
          }
        />

        {isFeatureEnabled('events') && (
          <Route
            path="/events"
            element={
              <MainLayout>
                <Events />
              </MainLayout>
            }
          />
        )}

        {isFeatureEnabled('resources') && (
          <Route
            path="/resources"
            element={
              <MainLayout>
                <Resources />
              </MainLayout>
            }
          />
        )}

        {isFeatureEnabled('products') && (
          <>
            <Route
              path="/products"
              element={
                <MainLayout>
                  <Products />
                </MainLayout>
              }
            />
            <Route
              path="/product/:id"
              element={
                <MainLayout>
                  <ProductDetailsPage />
                </MainLayout>
              }
            />
            <Route
              path="/my-products"
              element={
                <MainLayout>
                  <MyProducts />
                </MainLayout>
              }
            />
          </>
        )}

        {isFeatureEnabled('shop') && (
          <>
            <Route
              path="/shop"
              element={
                <MainLayout>
                  <Shop />
                </MainLayout>
              }
            />
            <Route
              path="/shop-cart"
              element={
                <MainLayout>
                  <ShopCart />
                </MainLayout>
              }
            />
          </>
        )}

        {isFeatureEnabled('lms') && (
          <>
            <Route
              path="/lms"
              element={
                <MainLayout>
                  <LMS />
                </MainLayout>
              }
            />
            <Route
              path="/lms/:id"
              element={
                <MainLayout>
                  <CourseDetail />
                </MainLayout>
              }
            />
          </>
        )}

        {isFeatureEnabled('projects') && (
          <>
            <Route
              path="/projects"
              element={
                <MainLayout>
                  <Projects />
                </MainLayout>
              }
            />
            <Route
              path="/my-projects"
              element={
                <MainLayout>
                  <UserProjects />
                </MainLayout>
              }
            />
            <Route
              path="/projects/:id"
              element={
                <MainLayout>
                  <ProjectDetail />
                </MainLayout>
              }
            />
            <Route
              path="/projects/trending"
              element={
                <MainLayout>
                  <ProjectTrending />
                </MainLayout>
              }
            />
            <Route
              path="/projects/templates"
              element={
                <MainLayout>
                  <ProjectTemplatesPage />
                </MainLayout>
              }
            />
            <Route
              path="/projects/notifications"
              element={
                <MainLayout>
                  <ProjectNotificationsPage />
                </MainLayout>
              }
            />
          </>
        )}

        {isFeatureEnabled('games') && (
          <>
            <Route
              path="/games"
              element={
                <MainLayout>
                  <Games />
                </MainLayout>
              }
            />
            <Route
              path="/games/snake"
              element={
                <MainLayout>
                  <SnakeGame />
                </MainLayout>
              }
            />
            <Route
              path="/games/tetris"
              element={
                <MainLayout>
                  <TetrisGame />
                </MainLayout>
              }
            />
            <Route
              path="/games/pong"
              element={
                <MainLayout>
                  <PongGame />
                </MainLayout>
              }
            />
            <Route
              path="/games/breakout"
              element={
                <MainLayout>
                  <BreakoutGame />
                </MainLayout>
              }
            />
            <Route
              path="/games/memory"
              element={
                <MainLayout>
                  <MemoryGame />
                </MainLayout>
              }
            />
            <Route
              path="/games/simon"
              element={
                <MainLayout>
                  <SimonGame />
                </MainLayout>
              }
            />
          </>
        )}

        <Route
          path="/dashboard"
          element={
            <MainLayout>
              <Dashboard />
            </MainLayout>
          }
        />

        {isFeatureEnabled('leaderboard') && (
          <Route
            path="/leaderboard"
            element={
              <MainLayout>
                <Leaderboard />
              </MainLayout>
            }
          />
        )}

        <Route
          path="/profile"
          element={
            <MainLayout>
              <UserProfile />
            </MainLayout>
          }
        />
        <Route
          path="/profile-card-demo"
          element={
            <MainLayout>
              <ProfileCardPage />
            </MainLayout>
          }
        />
        <Route
          path="/users"
          element={
            <MainLayout>
              <Users />
            </MainLayout>
          }
        />

        {isFeatureEnabled('notifications') && (
          <Route
            path="/notifications"
            element={
              <MainLayout showHeader={false}>
                <Notifications />
              </MainLayout>
            }
          />
        )}

        {isFeatureEnabled('blog') && (
          <Route
            path="/blog"
            element={
              <MainLayout>
                <Blog />
              </MainLayout>
            }
          />
        )}

        <Route
          path="/search"
          element={
            <MainLayout>
              <Search />
            </MainLayout>
          }
        />
        <Route
          path="/settings"
          element={
            <MainLayout>
              <Settings />
            </MainLayout>
          }
        />
        <Route
          path="/planning"
          element={
            <MainLayout>
              <ProjectPlanningPage />
            </MainLayout>
          }
        />
        <Route
          path="/mentorship"
          element={
            <MainLayout>
              <Mentorship />
            </MainLayout>
          }
        />
        <Route
          path="/hackathons"
          element={
            <MainLayout>
              <Hackathons />
            </MainLayout>
          }
        />
        <Route
          path="/workshops"
          element={
            <MainLayout>
              <Workshops />
            </MainLayout>
          }
        />
        <Route
          path="/certifications"
          element={
            <MainLayout>
              <Certifications />
            </MainLayout>
          }
        />
        <Route
          path="/jobs"
          element={
            <MainLayout>
              <JobBoard />
            </MainLayout>
          }
        />
        <Route
          path="/forum"
          element={
            <MainLayout>
              <Forum />
            </MainLayout>
          }
        />
        <Route
          path="/docs"
          element={
            <MainLayout>
              <Documentation />
            </MainLayout>
          }
        />
        <Route
          path="/code-review"
          element={
            <MainLayout>
              <CodeReview />
            </MainLayout>
          }
        />
        <Route
          path="/analytics"
          element={
            <MainLayout>
              <Analytics />
            </MainLayout>
          }
        />
        <Route
          path="/teams"
          element={
            <MainLayout>
              <Teams />
            </MainLayout>
          }
        />
        <Route
          path="/integrations"
          element={
            <MainLayout>
              <Integrations />
            </MainLayout>
          }
        />
        <Route
          path="/roadmap"
          element={
            <MainLayout>
              <Roadmap />
            </MainLayout>
          }
        />
        <Route
          path="/build"
          element={
            <MainLayout>
              <Build />
            </MainLayout>
          }
        />

        <Route
          path="/admin"
          element={
            <ProtectedRoute requiredRole="admin">
              <MainLayout>
                <AdminPanel />
              </MainLayout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
};

function App() {
  return (
    <ErrorBoundary>
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
    </ErrorBoundary>
  );
}

export default App;
