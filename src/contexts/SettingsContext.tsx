import { createContext, useState, useEffect, ReactNode, useContext } from 'react';

// Interface for feature settings
interface FeatureSettings {
  chatbot: boolean;
  chatroom: boolean;
  games: boolean;
  shop: boolean;
  blog: boolean;
  events: boolean;
  challenges: boolean;
  resources: boolean;
  leaderboard: boolean;
  projects: boolean;
  lms: boolean;
  notifications: boolean;
  products: boolean;
}

// Interface for Settings Context
interface SettingsContextType {
  settings: FeatureSettings;
  updateSetting: (feature: keyof FeatureSettings, enabled: boolean) => void;
  resetSettings: () => void;
  isFeatureEnabled: (feature: keyof FeatureSettings) => boolean;
}

// Interface for Provider Props
interface SettingsProviderProps {
  children: ReactNode;
}

// Default settings
const defaultSettings: FeatureSettings = {
  chatbot: true,
  chatroom: true,
  games: true,
  shop: true,
  blog: true,
  events: true,
  challenges: true,
  resources: true,
  leaderboard: true,
  projects: true,
  lms: true,
  notifications: true,
  products: true,
};

// Create Context
const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

// Provider Component
export const SettingsProvider: React.FC<SettingsProviderProps> = ({ children }) => {
  const [settings, setSettings] = useState<FeatureSettings>(() => {
    // Load settings from localStorage on initialization
    const savedSettings = localStorage.getItem('appSettings');
    if (savedSettings) {
      try {
        return JSON.parse(savedSettings);
      } catch (error) {
        console.error('Error parsing saved settings:', error);
        return defaultSettings;
      }
    }
    return defaultSettings;
  });

  // Save settings to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('appSettings', JSON.stringify(settings));
  }, [settings]);

  // Update a specific setting
  const updateSetting = (feature: keyof FeatureSettings, enabled: boolean) => {
    setSettings(prev => ({
      ...prev,
      [feature]: enabled
    }));
  };

  // Reset all settings to default
  const resetSettings = () => {
    setSettings(defaultSettings);
  };

  // Check if a feature is enabled
  const isFeatureEnabled = (feature: keyof FeatureSettings): boolean => {
    return settings[feature];
  };

  const value: SettingsContextType = {
    settings,
    updateSetting,
    resetSettings,
    isFeatureEnabled,
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
};

// Custom hook to use settings
export const useSettings = (): SettingsContextType => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};

export default SettingsContext;
