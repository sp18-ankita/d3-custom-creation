import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom', // Simulate browser for tests
    globals: true, // Allows `expect` and other globals without imports
    coverage: {
      reporter: ['text', 'html'],
    },
  },
});
