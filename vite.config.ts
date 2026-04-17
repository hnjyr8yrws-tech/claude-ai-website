import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],

  base: '/',

  resolve: {
    alias: { '@': path.resolve(__dirname, './src') },
  },

  build: {
    // Minify with esbuild (default — fast and effective)
    minify: 'esbuild',

    // Warn when a chunk exceeds 600 kB before gzip
    chunkSizeWarningLimit: 600,

    rollupOptions: {
      output: {
        // Split vendor libraries into a separate chunk so the browser can
        // cache React/Framer Motion independently from app code.
        manualChunks: {
          react:   ['react', 'react-dom', 'react-router-dom'],
          motion:  ['framer-motion'],
          helmet:  ['react-helmet-async'],
        },
      },
    },
  },
});
