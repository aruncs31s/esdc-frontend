import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '../infrastructure/api/demoAxiosSetup';
import '../index.css';
import App from './router';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
