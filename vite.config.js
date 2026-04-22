import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { domain } from './domain';

export default defineConfig({
  plugins: [react()],
  base: `https://qvd808.github.io/${domain}`,
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom'],
          'vendor-d3': ['d3-delaunay'],
        },
      },
    },
  },
});
