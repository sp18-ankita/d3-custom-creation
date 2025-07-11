import { expect, test } from '@playwright/test';

test.describe('Contact Form', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.getByText('Contact Us').click();
  });

  test('displays contact form fields', async ({ page }) => {
    await expect(page.getByLabel(/Full Name/i)).toBeVisible();
    await expect(page.getByLabel(/Email/i)).toBeVisible();
    await expect(page.getByLabel(/Phone/i)).toBeVisible();
    await expect(page.getByLabel(/Subject/i)).toBeVisible();
    await expect(page.getByLabel(/Message/i)).toBeVisible();
    await expect(page.getByText(/I agree to be contacted/i)).toBeVisible();
    await expect(page.getByRole('button', { name: /Submit Message/i })).toBeVisible();
  });

  test('submits form with valid data and shows success message', async ({ page }) => {
    await page.getByLabel(/Full Name/i).fill('John Doe');
    await page.getByLabel(/Email/i).fill('john@example.com');
    await page.getByLabel(/Phone/i).fill('+911234567890');
    await page.getByLabel(/Subject/i).fill('Support Needed');
    await page.getByLabel(/Message/i).fill('I need help with the application.');
    await page.getByTestId('consent').check();

    await page.getByRole('button', { name: /Submit Message/i }).click();

    await expect(page.locator('text=Thank you for contacting us!')).toBeVisible();
  });

  test('shows validation errors when required fields are missing or invalid', async ({ page }) => {
    await page.getByRole('button', { name: /Submit Message/i }).click();

    await expect(page.locator('text=Full name is required')).toBeVisible();
    await expect(page.locator('text=Email is required')).toBeVisible();
    await expect(page.locator('text=Subject is required')).toBeVisible();
    await expect(page.locator('text=Message is required')).toBeVisible();
    await expect(page.locator('text=Consent is required')).toBeVisible();
  });
});
