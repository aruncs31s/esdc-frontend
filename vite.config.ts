import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@/app': path.resolve(__dirname, './src/app'),
      '@/features': path.resolve(__dirname, './src/features'),
      '@/shared': path.resolve(__dirname, './src/shared'),
      '@/domain': path.resolve(__dirname, './src/domain'),
      '@/infrastructure': path.resolve(__dirname, './src/infrastructure'),
      '@/application': path.resolve(__dirname, './src/application'),
      '@/types': path.resolve(__dirname, './src/types'),
      '@/pages': path.resolve(__dirname, './src/pages'),
      // '@/api': path.resolve(__dirname, './src/services/api'),
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'https://esdc-backend.onrender.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'three-vendor': ['three', '@react-three/fiber', '@react-three/drei'],
        },
      },
    },
  },
});
