import { expect, test } from '@playwright/test';

test.describe('D3 Chart Viewer', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('loads homepage and shows chart selector', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'D3 Chart Viewer' })).toBeVisible();
    await expect(page.getByRole('combobox')).toBeVisible();
  });

  test('renders a generic chart from JSON input', async ({ page }) => {
    const dataJson = JSON.stringify(
      [
        { label: 'One', value: 10 },
        { label: 'Two', value: 20 },
      ],
      null,
      2,
    );

    const jsonInput = page.getByLabel('Data (JSON)');
    await jsonInput.fill(dataJson);

    const renderButton = page.getByRole('button', { name: /Render Chart/i });
    await renderButton.click();

    await expect(page.locator('svg')).toBeVisible();
  });

  test('alerts on invalid JSON input', async ({ page }) => {
    const jsonInput = page.getByLabel('Data (JSON)');
    await jsonInput.fill('invalid json');

    page.once('dialog', async dialog => {
      expect(dialog.message()).toMatch(/Invalid JSON data/);
      await dialog.dismiss();
    });

    await page.getByRole('button', { name: /Render Chart/i }).click();
  });

  test('renders speedometer when all inputs are valid', async ({ page }) => {
    await page.getByRole('combobox').selectOption('speedometer');

    await page.getByLabel('Min').fill('0');
    await page.getByLabel('Value').fill('45');
    await page.getByLabel('Major Ticks').fill('5');

    const zones = [
      { from: 0, to: 60, color: 'green' },
      { from: 60, to: 100, color: 'red' },
    ];

    await page.getByLabel('Zones (JSON)').fill(JSON.stringify(zones));
    await page.getByRole('button', { name: /Validate JSON/i }).click();

    await expect(page.locator('svg')).toBeVisible();
  });

  test('navigates to About page', async ({ page }) => {
    await page.getByRole('button', { name: /About App/i }).click();
    await expect(page.getByRole('heading', { name: /About D3 Chart Viewer/i })).toBeVisible();
  });

  test('renders weather widget', async ({ page }) => {
    await expect(page.getByTestId('weather-widget')).toBeVisible();
  });

  test('renders bar chart with valid JSON data', async ({ page }) => {
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
});
