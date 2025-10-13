/**
 * App Router
 * Main routing component with layout and suspense
 */
import { Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useSettings } from '@/app/providers';
import { routes } from './routes';
import ProtectedRoute from '@/components/ProtectedRoute';
import Header from '@/components/Navbar';
import Footer from '@/components/Footer';
import Chatbot from '@/components/Chatbot';
import { LoadingSpinner } from '@/shared/components/ui';
import { FEATURE_FLAGS } from '@/shared/constants';

const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center">
    <LoadingSpinner size="lg" />
  </div>
);

export const AppRouter = () => {
  const { isFeatureEnabled } = useSettings();

  return (
    <div className="App">
      {FEATURE_FLAGS.CHATBOT && isFeatureEnabled('chatbot') && <Chatbot />}
      
      <Routes>
        {routes.map((route) => {
          // Skip if feature flag is disabled
          if (route.featureFlag && !isFeatureEnabled(route.featureFlag.toLowerCase())) {
            return null;
          }

          const element = (
            <>
              <Header />
              <Suspense fallback={<PageLoader />}>
                {route.protected ? (
                  <ProtectedRoute>{route.element}</ProtectedRoute>
                ) : (
                  route.element
                )}
              </Suspense>
              <Footer />
            </>
          );

          return <Route key={route.path} path={route.path} element={element} />;
        })}
      </Routes>
    </div>
  );
};
