import { defineConfig } from 'vite';
import svgLoader from 'vite-svg-loader';
import glsl from 'vite-plugin-glsl';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
import { TanStackRouterVite } from '@tanstack/router-plugin/vite';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    TanStackRouterVite(),
    react(),
    tsconfigPaths(),
    svgLoader(),
    glsl(),
  ],
  // plugins: [reactify(), svgLoader(), glsl()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('monaco-editor')) {
            // Put in module named `e` (for editor).
            return 'e';
          }
        },
      },
    },
  },
  server: {
    port: 3000,
  },
  envDir: '..',
});
