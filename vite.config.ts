import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import process from 'process';

export default defineConfig(({ mode }) => {
  // Load env variables based on `mode` (dev/prod)
  const env = loadEnv(mode, process.cwd(), 'VITE_'); 
  // 'VITE_' prefix is optional but explicit

  return {
    plugins: [react()],
    // Optional: Validate if critical env vars exist
    define: {
      __APP_ENV__: JSON.stringify(env.VITE_MAPBOX_TOKEN ? 'loaded' : 'missing'),
    },
  };
});