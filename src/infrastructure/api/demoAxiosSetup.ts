import axios from 'axios';
import { demoApiInterceptor } from '@/modules/demo';

// Setup axios interceptor for demo mode
axios.interceptors.request.use(
  async (config) => {
    const isDemoMode = localStorage.getItem('esdc_demo_mode') === 'true';

    if (isDemoMode && config.url) {
      try {
        const demoData = await demoApiInterceptor.intercept(
          config.url,
          config.method?.toUpperCase() || 'GET',
          config.data
        );

        if (demoData !== null) {
          // Cancel the real request and return demo data
          const cancelToken = axios.CancelToken.source();
          config.cancelToken = cancelToken.token;
          cancelToken.cancel(JSON.stringify({ isDemoResponse: true, data: demoData }));
        }
      } catch {
        // Continue with real request if demo fails
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (axios.isCancel(error)) {
      try {
        const demoResponse = JSON.parse(error.message);
        if (demoResponse.isDemoResponse) {
          return Promise.resolve({ data: demoResponse.data });
        }
      } catch {
        // Not a demo response, continue with error
      }
    }
    return Promise.reject(error);
  }
);
