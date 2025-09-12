import { expect, test } from '@playwright/test';

test.describe('Contact List Page', () => {
  test.beforeEach(async ({ page }) => {
    const contacts = [
      {
        id: 'test-1',
        name: 'Test User',
        email: 'test@example.com',
        phone: '1234567890',
        subject: 'Test Subject',
        message: 'Test message content',
        consent: true,
      },
    ];

    await page.goto('/');
    await page.evaluate(data => {
      localStorage.setItem('contacts', JSON.stringify(data));
    }, contacts);

    await page.goto('/contacts');
  });

  test('displays list of saved contacts', async ({ page }) => {
    await expect(page.getByText('Saved Contacts')).toBeVisible();
    await expect(page.getByText('Test User')).toBeVisible();
    await expect(page.getByText('test@example.com')).toBeVisible();
    await expect(page.getByRole('button', { name: /Edit/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /Delete/i })).toBeVisible();
  });

  test('navigates to edit contact form', async ({ page }) => {
    await page.getByRole('button', { name: /Edit/i }).click();
    await expect(page).toHaveURL(/\/contact\/test-1/);
    await expect(page.getByLabel(/Full Name/i)).toHaveValue('Test User');
  });

  test('deletes a contact', async ({ page }) => {
    await page.getByRole('button', { name: /Delete/i }).click();

    await expect(page.getByText('No contacts submitted yet.')).toBeVisible();

    // Verify localStorage is cleared
    const stored = await page.evaluate(() => localStorage.getItem('contacts'));
    const parsed = stored ? JSON.parse(stored) : [];
    expect(parsed).toEqual([]);
  });
});
