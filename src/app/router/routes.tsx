/**
 * Router Configuration
 * Centralized route definitions with lazy loading
 */
import { lazy } from 'react';
import { RouteObject } from 'react-router-dom';
import Home from '@/pages/Home';
import { ROUTES } from '@/shared/constants';

// Lazy load pages for code splitting
const Login = lazy(() => import('@/pages/Login'));
const Register = lazy(() => import('@/pages/Register'));
const Events = lazy(() => import('@/pages/Events'));
const Challenges = lazy(() => import('@/pages/Challenges'));
const Resources = lazy(() => import('@/pages/Resources'));
const Products = lazy(() => import('@/pages/Products'));
const Shop = lazy(() => import('@/pages/Shop'));
const ShopCart = lazy(() => import('@/pages/ShopCart'));
const LMS = lazy(() => import('@/pages/LMS'));
const Projects = lazy(() => import('@/pages/Projects'));
const ProjectDetail = lazy(() => import('@/pages/ProjectDetail'));
const MyProducts = lazy(() => import('@/pages/MyProducts'));
const Games = lazy(() => import('@/pages/Games'));
const AdminPanel = lazy(() => import('@/pages/AdminPanel'));
const ProfileCardPage = lazy(() => import('@/pages/ProfileCardPage'));
const Users = lazy(() => import('@/pages/Users'));
const UserProjects = lazy(() => import('@/pages/UserProjects'));
const Notifications = lazy(() => import('@/pages/Notifications'));
const Blog = lazy(() => import('@/pages/Blog'));
const Search = lazy(() => import('@/pages/Search'));
const Settings = lazy(() => import('@/pages/Settings'));

// Layout Components
const Dashboard = lazy(() => import('@/components/Dashboard'));
const Leaderboard = lazy(() => import('@/components/Leaderboard'));
const UserProfile = lazy(() => import('@/components/UserProfile'));

// Game Components
const SnakeGame = lazy(() => import('@/components/games/SnakeGame'));
const TetrisGame = lazy(() => import('@/components/games/TetrisGame'));
const PongGame = lazy(() => import('@/components/games/PongGame'));
const BreakoutGame = lazy(() => import('@/components/games/BreakoutGame'));
const MemoryGame = lazy(() => import('@/components/games/MemoryGame'));
const SimonGame = lazy(() => import('@/components/games/SimonGame'));

export interface AppRoute extends RouteObject {
  path: string;
  element: React.ReactNode;
  protected?: boolean;
  featureFlag?: string;
}

export const routes: AppRoute[] = [
  {
    path: ROUTES.HOME,
    element: <Home />,
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/register',
    element: <Register />,
  },
  {
    path: '/events',
    element: <Events />,
    featureFlag: 'EVENTS',
  },
  {
    path: '/challenges',
    element: <Challenges />,
    featureFlag: 'CHALLENGES',
  },
  {
    path: '/resources',
    element: <Resources />,
    featureFlag: 'RESOURCES',
  },
  {
    path: '/products',
    element: <Products />,
  },
  {
    path: '/shop',
    element: <Shop />,
  },
  {
    path: '/cart',
    element: <ShopCart />,
  },
  {
    path: '/lms',
    element: <LMS />,
  },
  {
    path: '/projects',
    element: <Projects />,
  },
  {
    path: '/projects/:id',
    element: <ProjectDetail />,
  },
  {
    path: '/my-products',
    element: <MyProducts />,
    protected: true,
  },
  {
    path: '/games',
    element: <Games />,
  },
  {
    path: '/games/snake',
    element: <SnakeGame />,
  },
  {
    path: '/games/tetris',
    element: <TetrisGame />,
  },
  {
    path: '/games/pong',
    element: <PongGame />,
  },
  {
    path: '/games/breakout',
    element: <BreakoutGame />,
  },
  {
    path: '/games/memory',
    element: <MemoryGame />,
  },
  {
    path: '/games/simon',
    element: <SimonGame />,
  },
  {
    path: '/admin',
    element: <AdminPanel />,
    protected: true,
  },
  {
    path: '/profile-card',
    element: <ProfileCardPage />,
  },
  {
    path: '/users',
    element: <Users />,
  },
  {
    path: '/dashboard',
    element: <Dashboard />,
    protected: true,
  },
  {
    path: '/leaderboard',
    element: <Leaderboard />,
  },
  {
    path: '/profile',
    element: <UserProfile />,
    protected: true,
  },
  {
    path: '/user-projects',
    element: <UserProjects />,
    protected: true,
  },
  {
    path: '/notifications',
    element: <Notifications />,
  },
  {
    path: '/blog',
    element: <Blog />,
  },
  {
    path: '/search',
    element: <Search />,
  },
  {
    path: '/settings',
    element: <Settings />,
    protected: true,
  },
];
