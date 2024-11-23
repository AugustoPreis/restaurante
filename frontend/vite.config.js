import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import eslint from 'vite-plugin-eslint';

export default defineConfig({
  plugins: [
    react(),
    eslint(),
  ],
  build: {
    outDir: '../backend/build/src/dist',
    emptyOutDir: true,
  },
  server: {
    port: 4000,
    proxy: {
      '^/(login|api|arquivo)': {
        target: `http://localhost:3000`,
        changeOrigin: true,
        secure: false,
      },
    },
  },
});