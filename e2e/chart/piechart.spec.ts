import { expect, test } from '@playwright/test';

test('renders pie chart with valid data', async ({ page }) => {
  await page.goto('/');

  // Select "Pie" from chart type dropdown
  await page.getByRole('combobox').selectOption('pie');

  const pieData = JSON.stringify(
    [
      { label: 'Apple', value: 30 },
      { label: 'Banana', value: 70 },
      { label: 'Cherry', value: 45 },
    ],
    null,
    2,
  );

  await page.getByLabel(/Data \(JSON\)/i).fill(pieData);
  await page.getByRole('button', { name: /Render Chart/i }).click();

  const paths = page.locator('svg path');

  await expect(paths).toHaveCount(3);
  await expect(paths.nth(0)).toHaveAttribute('fill', /.+/); // has fill color
});

test('alerts on invalid JSON input for pie chart', async ({ page }) => {
  await page.goto('/');

  await page.getByRole('combobox').selectOption('pie');

  await page.getByLabel(/Data \(JSON\)/i).fill('invalid json');

  page.once('dialog', async dialog => {
    expect(dialog.message()).toMatch(/Invalid JSON data/);
    await dialog.dismiss();
  });

  await page.getByRole('button', { name: /Render Chart/i }).click();
});
