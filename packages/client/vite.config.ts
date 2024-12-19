import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import svgLoader from 'vite-svg-loader';
import glsl from 'vite-plugin-glsl';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), svgLoader(), glsl()],
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
