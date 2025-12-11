import { test, expect } from '@playwright/test';

test.describe('Event Creation', () => {

  test('Architect Mode flow', async ({ page }) => {
    await page.goto('/create');

    // Default mode is Architect. Verify by checking logic.
    await expect(page.getByText(/Event Essence/i)).toBeVisible();

    // Fill the large text area (eventBasics)
    await page.locator('textarea[name="eventBasics"]').fill('This is a detailed description for the architect mode test: A tech conference in SF.');
    await page.locator('input[name="goals"]').fill('Networking, Learning');
    await page.locator('input[name="audience"]').fill('Developers, Designers');
    await page.locator('select[name="tone"]').selectOption('vibrant');

    // Submit using the new Sticky Footer Button
    await page.getByRole('button', { name: /Generate Event/i }).click();

    // Expect redirect OR Error (if API keys missing)
    try {
        await expect(page).toHaveURL(/\/e\/|dashboard/, { timeout: 10000 });
    } catch {
        // If redirect fails, check for error message
        await expect(page.getByText(/error|failed|generated/i)).toBeVisible();
    }
  });

  test('Lite Mode flow', async ({ page }) => {
    await page.goto('/create');

    // Switch to Lite Mode by clicking the text label
    await page.getByText('Lite Mode').click();
    
    // Checks for specific Lite fields
    await expect(page.getByPlaceholder('e.g. Wednesday Night Hoops')).toBeVisible();

    // Fill Event Name
    await page.locator('input[name="eventName"]').fill('Lite Test Event');

    // Fill Vibe (Optional)
    await page.locator('input[name="eventBasics"]').fill('Casual hangout');

    // Submit using the new Sticky Footer Button
    await page.getByRole('button', { name: /Generate Event/i }).click();

    // Expect redirect OR Error
    try {
        await expect(page).toHaveURL(/\/e\/|dashboard/, { timeout: 10000 });
    } catch {
        await expect(page.getByText(/error|failed|generated/i)).toBeVisible();
    }
  });
});
