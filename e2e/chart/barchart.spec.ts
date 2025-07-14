import { expect, test } from '@playwright/test';

test('renders bar chart with valid JSON data', async ({ page }) => {
  await page.goto('/');

  await page.getByRole('combobox').selectOption('bar');

  const validData = JSON.stringify(
    [
      { label: 'Apple', value: 10 },
      { label: 'Banana', value: 20 },
    ],
    null,
    2,
  );

  await page.getByLabel(/Data \(JSON\)/).fill(validData);
  await page.getByRole('button', { name: /Render Chart/i }).click();

  await expect(page.locator('svg')).toBeVisible();
});

test('alerts on invalid JSON input for bar chart', async ({ page }) => {
  await page.goto('/');

  await page.getByRole('combobox').selectOption('bar');

  await page.getByLabel(/Data \(JSON\)/).fill('invalid json');

  page.once('dialog', async dialog => {
    expect(dialog.message()).toMatch(/Invalid JSON data/);
    await dialog.dismiss();
  });

  await page.getByRole('button', { name: /Render Chart/i }).click();
});
