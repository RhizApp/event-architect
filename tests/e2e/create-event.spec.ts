import { test, expect } from '@playwright/test';

test.describe('Create Event Flow', () => {
  
  test('should allow user to configure and generate an event', async ({ page }) => {
    // 1. Navigate to Create Page
    await page.goto('/create');
    
    // Check for header
    await expect(page.getByRole('heading', { name: /Configure Your Event/i })).toBeVisible();

    // 2. Fill out the form
    // "Event Essence" textarea
    await page.fill('textarea[name="eventBasics"]', 'A futuristic conference about AI Agents and decentralized intelligence.');
    
    // "Event Date" input
    await page.fill('input[name="eventDate"]', 'October 12-14, 2025');
    
    // "Location" input
    await page.fill('input[name="eventLocation"]', 'San Francisco, CA');
    
    // "Goals" input
    await page.fill('input[name="goals"]', 'Networking, Knowledge Sharing');
    
    // "Audience" input
    await page.fill('input[name="audience"]', 'Developers, Founders');

    // 3. Submit
    const generateButton = page.getByRole('button', { name: /Generate Event Experience/i });
    await expect(generateButton).toBeEnabled();
    await generateButton.click();

    // 4. Expect loading state (optional, might be fast)
    // await expect(page.getByText(/Initializing Event Protocol/i)).toBeVisible();

    // 5. Expect Result (Landing Page)
    // The mock action returns "Convergence Intelligence Summit" as the event name
    // We expect the EventLandingPage to appear, which should show the event name.
    // The Landing Page usually has a key element like "Register" or the Title.
    
    // Wait for the transition to complete (actions.ts has a 1s delay)
    await expect(page.getByText('Convergence Intelligence Summit')).toBeVisible({ timeout: 10000 });
    
    // Check for other elements on the landing page
    await expect(page.getByText('Coordination replaces competition')).toBeVisible();
  });

  test('should validate required fields', async ({ page }) => {
    await page.goto('/create');
    
    // Click submit without filling anything
    // Note: HTML5 'required' attribute might block submission if browser validation is enabled.
    // Playwright by default bypasses HTML5 validation when using .click(), 
    // BUT we can check if the browser shows validation message or if our app handles it.
    // Our app has backend validation too.
    
    // Let's try to bypass client validation or fill only some fields.
    // Actually, `required` attribute prevents form submission in browser.
    // We can test that the button is there.
    // Or we can fill minimal invalid data?
    
    // Let's just check that empty submission triggers validation if we force it, 
    // or checks that the inputs have 'required' attribute.
    await expect(page.locator('textarea[name="eventBasics"]')).toHaveAttribute('required', '');
    await expect(page.locator('input[name="eventDate"]')).toHaveAttribute('required', '');
  });

});
