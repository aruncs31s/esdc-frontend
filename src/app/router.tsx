import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider, ProtectedRoute, Login, Register } from '@/features/auth';
import { ThemeProvider } from './providers/ThemeProvider';
import { ShopProvider } from './providers/ShopProvider';
import { SettingsProvider, useSettings } from './providers/SettingsProvider';
import { ErrorBoundary, MainLayout } from '@/shared/components';

// Feature-based imports
import { Home, Notifications } from '@/features/home';
import { Events } from '@/features/events';
import { Resources } from '@/features/resources';
import { Products, ProductDetail as ProductDetailsPage, MyProducts } from '@/features/products';
import { Shop, ShopCart } from '@/features/shop';
import { LMS, CourseDetail } from '@/features/lms';
import {
  Projects,
  ProjectDetail,
  UserProjects,
  ProjectPlanning as ProjectPlanningPage,
  ProjectNotificationsPage,
  ProjectTemplatesPage,
  ProjectTrending,
} from '@/features/projects';
import { Games } from '@/features/games';
import { AdminPanel } from '@/features/admin';
import { ProfileCardPage, Users, AllUsers } from '@/features/users';
import { Blog } from '@/features/blog';
import { Search } from '@/features/search';
import { Settings } from '@/features/settings';
import { Mentorship } from '@/features/mentorship';
import { Hackathons } from '@/features/hackathons';
import { Workshops } from '@/features/workshops';
import { Certifications } from '@/features/certifications';
import { JobBoard } from '@/features/jobs';
import { Forum } from '@/features/forum';
import { Documentation } from '@/features/docs';
import { CodeReview } from '@/features/code-review';
import { Analytics } from '@/features/analytics';
import { Teams } from '@/features/teams';
import { Integrations } from '@/features/integrations';
import { Roadmap } from '@/features/roadmap';
import { Build } from '@/features/build';

// Component imports (to be migrated later)
import UserProfile from '../components/UserProfile';
import Dashboard from '../components/Dashboard';
import Leaderboard from '../components/Leaderboard';
import Chatbot from '../components/Chatbot';
import DockSidebar from '../components/DockSidebar';

// Game components
import SnakeGame from '@/features/games/components/SnakeGame';
import TetrisGame from '@/features/games/components/TetrisGame';
import PongGame from '@/features/games/components/PongGame';
import BreakoutGame from '@/features/games/components/BreakoutGame';
import MemoryGame from '@/features/games/components/MemoryGame';
import SimonGame from '@/features/games/components/SimonGame';

import { DemoModeToggle, DemoBanner, useDemoMode } from '../modules/demo';
import '../index.css';

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
        <Route
          path="/all-users"
          element={
            <MainLayout>
              <AllUsers />
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
