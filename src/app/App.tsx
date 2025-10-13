/**
 * Main App Component
 * Entry point for the application with all providers and routing
 */
import { BrowserRouter as Router } from 'react-router-dom';
import { AppProviders } from './providers';
import { AppRouter } from './router';
import '@/index.css';

export function App() {
  return (
    <Router>
      <AppProviders>
        <AppRouter />
      </AppProviders>
    </Router>
  );
}
