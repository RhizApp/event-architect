import { test, expect } from '@playwright/test';

test.describe('Event Creation', () => {

  test('Architect Mode flow (Protected)', async ({ page }) => {
    await page.goto('/create');
    // Page is protected, expect redirect to sign-in
    await expect(page).toHaveURL(/sign-in/);
  });

  test('Lite Mode flow (Protected)', async ({ page }) => {
    await page.goto('/create');
    // Page is protected, expect redirect to sign-in
    await expect(page).toHaveURL(/sign-in/);
  });
});
