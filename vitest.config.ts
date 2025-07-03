import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom', // Simulate browser for tests
    globals: true, // Allows `expect` and other globals without imports
    coverage: {
      reporter: ['text', 'html'],
    },

    include: ['src/**/*.{test,spec}.{ts,tsx}'], // ✅ Only include tests inside src/
    exclude: ['e2e/**', 'node_modules/**', 'dist/**'], // ✅ Explicitly exclude e2e and other folders
  },
});
