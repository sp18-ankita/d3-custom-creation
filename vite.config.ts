import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import { configDefaults } from 'vitest/config';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
      },
    },
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: './vitest.setup.ts',
      exclude: [...configDefaults.exclude, 'vitest.setup.ts', 'src/main.tsx', 'e2e/**'],
      coverage: {
        exclude: ['vitest.setup.ts', 'src/main.tsx'],
      },
    },
    define: {
      'import.meta.env': env, // helpful for SSR or mocking envs
    },
  };
});
