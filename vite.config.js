import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { domain } from './domain';

export default defineConfig({
  plugins: [react()],
  base: `https://qvd808.github.io/${domain}`,
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/react-dom') || id.includes('node_modules/react/')) {
            return 'vendor-react';
          }
          if (id.includes('d3-delaunay') || id.includes('delaunator')) {
            return 'vendor-d3';
          }
        },
      },
    },
  },
});
