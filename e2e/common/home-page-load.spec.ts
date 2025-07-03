import { expect, test } from '@playwright/test';

test('loads homepage and shows title and chart selector', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'D3 Chart Viewer' })).toBeVisible();
  await expect(page.getByRole('combobox')).toBeVisible();
});
