import { useState, useEffect } from 'react';

const DEMO_MODE_KEY = 'esdc_demo_mode';

export const useDemoMode = () => {
  const [isDemoMode, setIsDemoMode] = useState(() => {
    return localStorage.getItem(DEMO_MODE_KEY) === 'true';
  });

  useEffect(() => {
    localStorage.setItem(DEMO_MODE_KEY, isDemoMode.toString());
  }, [isDemoMode]);

  const enableDemo = () => setIsDemoMode(true);
  const disableDemo = () => setIsDemoMode(false);
  const toggleDemo = () => setIsDemoMode((prev) => !prev);

  return { isDemoMode, enableDemo, disableDemo, toggleDemo };
};
