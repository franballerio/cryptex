// vite.config.ts
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, process.cwd(), '');

  // Provide a fallback in case API_URL isn't set, defaulting to docker service name or localhost
  const apiUrl = env.API_URL || 'http://backend:3000';
  const appPort = env.APP_PORT || '5173'

  return {
    plugins: [react()],
    server: {
      host: true, // Needed for Docker to expose the port outside the container
      port: appPort,
      proxy: {
        '/api': {
          target: apiUrl,
          changeOrigin: true,
          secure: false,
        },
        '/auth/login': {
          target: apiUrl,
          changeOrigin: true,
          secure: false,
        },
        '/auth/me': {
          target: apiUrl,
          changeOrigin: true,
          secure: false,
        },
        '/auth/token': {
          target: apiUrl,
          changeOrigin: true,
          secure: false,
        },
        '/users/getUsers': {
          target: apiUrl,
          changeOrigin: true,
          secure: false,
        },
        '/chat/getChatHistory': {
          target: apiUrl,
          changeOrigin: true,
          secure: false,
        },
        '/media/upload': {
          target: apiUrl,
          changeOrigin: true,
          secure: false,
        },
      },
    },
  };
});
