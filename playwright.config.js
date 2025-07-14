import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  timeout: 30_000,
  retries: 1,
  use: {
    baseURL: 'http://localhost:5173', // Replace with your dev server port
    headless: true,
    viewport: { width: 1280, height: 720 },
    actionTimeout: 10_000,
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  webServer: {
    command: 'npm run dev',
    port: 5173,
    timeout: 60 * 1000,
    reuseExistingServer: !process.env.CI,
  },
});
