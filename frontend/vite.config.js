import 'dotenv/config';

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(() => {
  const { env } = process;

  return {
    plugins: [react()],
    build: {
      outDir: './dist',
      emptyOutDir: true,
    },
    server: {
      port: env.VITE_FRONTEND_PORT,
      proxy: {
        '^/(login|api|arquivo)': {
          target: [env.VITE_BACKEND_URL, env.VITE_BACKEND_PORT].join(':'),
          changeOrigin: true,
          secure: false,
        },
      },
    },
  }
});