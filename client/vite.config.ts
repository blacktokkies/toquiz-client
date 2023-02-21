import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
import checker from 'vite-plugin-checker';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const ENV = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [
      react(),
      tsconfigPaths(),
      checker({
        typescript: true,
        eslint: { lintCommand: 'eslint "./src/**/*.{ts,tsx}"' },
      }),
    ],
    server: {
      proxy: mode === 'proxy' && {
        '/api': {
          target: ENV.API_ORIGIN || 'http://localhost:3000',
          changeOrigin: true,
        },
      },
    },
  };
});
