const { test, expect } = require('@playwright/test');

test('Basic Playwright test', async ({ page }) => {
    const response = await page.goto('/', {
        waitUntil: 'domcontentloaded',
        timeout: 60000
    });

    expect(response).not.toBeNull();

    const statusCode = response.status();

    expect(
        statusCode,
        `Website returned HTTP status ${statusCode}`
    ).toBeLessThan(500);

    await expect(page).toHaveURL(/platformsh\.site/);
});
