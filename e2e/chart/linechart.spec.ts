import { expect, test } from '@playwright/test';

test('renders line chart with correct path styling', async ({ page }) => {
  await page.goto('/');

  await page.getByRole('combobox').selectOption('line');

  const lineData = JSON.stringify(
    [
      { label: 'Jan', value: 10 },
      { label: 'Feb', value: 20 },
      { label: 'Mar', value: 15 },
    ],
    null,
    2,
  );

  await page.getByLabel(/Data \(JSON\)/i).fill(lineData);
  await page.getByRole('button', { name: /Render Chart/i }).click();

  const path = page.locator('svg path');

  await expect(path).toHaveCount(1);
  await expect(path).toHaveAttribute('fill', 'none');
  await expect(path).toHaveAttribute('stroke', '#59a14f');
  await expect(path).toHaveAttribute('stroke-width', '2');
});

test('alerts on invalid JSON input for line chart', async ({ page }) => {
  await page.goto('/');

  await page.getByRole('combobox').selectOption('line');

  await page.getByLabel(/Data \(JSON\)/i).fill('invalid json');

  page.once('dialog', async dialog => {
    expect(dialog.message()).toMatch(/Invalid JSON data/);
    await dialog.dismiss();
  });

  await page.getByRole('button', { name: /Render Chart/i }).click();
});
