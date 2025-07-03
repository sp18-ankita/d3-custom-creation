import { expect, test } from '@playwright/test';

test('renders a generic chart with valid JSON data', async ({ page }) => {
  await page.goto('/');
  const json = JSON.stringify(
    [
      { label: 'A', value: 10 },
      { label: 'B', value: 30 },
    ],
    null,
    2,
  );

  await page.getByLabel('Data (JSON)').fill(json);
  await page.getByRole('button', { name: /Render Chart/i }).click();
  await expect(page.locator('svg')).toBeVisible();
});

test('renders speedometer chart with valid inputs', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('combobox').selectOption('speedometer');

  await page.getByLabel('Min').fill('0');
  await page.getByLabel('Value').fill('50');
  await page.getByLabel('Major Ticks').fill('5');

  const zones = [
    { from: 0, to: 60, color: 'green' },
    { from: 60, to: 100, color: 'red' },
  ];

  await page.getByLabel('Zones (JSON)').fill(JSON.stringify(zones));
  await page.getByRole('button', { name: /Validate JSON/i }).click();

  await expect(page.locator('svg')).toBeVisible();
});

test('alerts on invalid JSON input', async ({ page }) => {
  await page.goto('/');
  await page.getByLabel('Data (JSON)').fill('invalid json');

  page.once('dialog', async dialog => {
    expect(dialog.message()).toMatch(/Invalid JSON data/);
    await dialog.dismiss();
  });

  await page.getByRole('button', { name: /Render Chart/i }).click();
});
