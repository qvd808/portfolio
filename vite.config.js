import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { domain } from './domain';

export default defineConfig({
  plugins: [react()],
  base: `/${domain}/`,
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        404: resolve(__dirname, '404.html'),
      },
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
