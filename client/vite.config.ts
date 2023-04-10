/// <reference types="vitest" />
/// <reference types="vite/client" />

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
      mode !== 'test' &&
        checker({
          typescript: true,
          eslint: { lintCommand: 'eslint "./src/**/*.{ts,tsx}"' },
        }),
    ],
    optimizeDeps: {
      include: ['shared'],
    },
    build: {
      commonjsOptions: {
        include: [/shared/, /node_modules/],
      },
    },
    server: {
      proxy: mode === 'proxy' && {
        '/api': {
          target: ENV.VITE_API_BASE_URL || 'http://localhost:3000',
          changeOrigin: true,
        },
      },
    },
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: ['./src/setupTests.ts'],
      css: false,
      coverage: {
        reporter: ['text', 'json', 'html'],
      },
    },
  };
});
