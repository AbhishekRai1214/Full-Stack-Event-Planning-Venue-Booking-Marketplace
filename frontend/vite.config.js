import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],

  resolve: {
    alias: {
      // '@' maps to the src directory
      // Usage: import Button from '@/components/common/Button'
      '@': path.resolve(__dirname, './src'),
    },
  },

  server: {
    port: 5173,
    // Proxy API calls to backend in development
    // This avoids CORS issues and matches production behavior
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
      '/health': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },

  build: {
    outDir: 'dist',
    sourcemap: false, // Set to true for production debugging (increases bundle size)
    rollupOptions: {
      output: {
        // Split vendor bundles for better caching
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'router': ['react-router-dom'],
          'redux': ['@reduxjs/toolkit', 'react-redux'],
          'ui': ['lucide-react', 'clsx', 'tailwind-merge'],
        },
      },
    },
  },
});

