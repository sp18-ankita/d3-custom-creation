import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { configDefaults } from 'vitest/config';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './vitest.setup.ts',
    exclude: [...configDefaults.exclude, 'vitest.setup.ts', 'src/main.ts', 'e2e/**'],
    coverage: {
      exclude: ['vitest.setup.ts', 'src/main.tsx'],
    },
  },
});
