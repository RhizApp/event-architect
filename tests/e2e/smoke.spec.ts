import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
  await page.goto('/');

  // Expect a title "to contain" a substring.
  // Adjust based on actual app title if known, usually defined in layout or page
  await expect(page).toHaveTitle(/Rhiz|Event/);
});

test('redirects to sign-in from create page', async ({ page }) => {
  await page.goto('/create');
  // Expect redirect to sign-in
  await expect(page).toHaveURL(/sign-in/);
});
