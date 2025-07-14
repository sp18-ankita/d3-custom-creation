import { expect, test } from '@playwright/test';

test('loads weather widget', async ({ page }) => {
  await page.route('**/api.openweathermap.org/**', async route => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        name: 'Bhubaneshwar',
        main: { temp: 28 },
        weather: [{ description: 'clear sky', icon: '01d' }],
      }),
    });
  });

  await page.goto('/');

  await expect(page.getByText(/Bhubaneshwar/i)).toBeVisible();
  await expect(page.getByText(/28°C/i)).toBeVisible();
});
