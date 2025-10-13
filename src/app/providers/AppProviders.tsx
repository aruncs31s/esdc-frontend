/**
 * Application Providers
 * Combines all context providers in the correct order
 */
import { ReactNode } from 'react';
import { AuthProvider } from '@/features/auth/components/AuthProvider';
import { ThemeProvider } from './ThemeProvider';
import { ShopProvider } from './ShopProvider';
import { SettingsProvider } from './SettingsProvider';

interface AppProvidersProps {
  children: ReactNode;
}

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <ThemeProvider>
      <SettingsProvider>
        <AuthProvider>
          <ShopProvider>
            {children}
          </ShopProvider>
        </AuthProvider>
      </SettingsProvider>
    </ThemeProvider>
  );
}
