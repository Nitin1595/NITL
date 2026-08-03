import { chromium } from 'playwright';
 
(async () => {
  const browser = await chromium.launch({
    headless: false
  });
 
  const context = await browser.newContext({
    httpCredentials: {
      username: 'nnystaging2024',
      password: '2w%b#0M+H%v?t'
    },
    ignoreHTTPSErrors: true
  });
 
  const page = await context.newPage();
 
  await page.goto(
    'https://staging.nestleyouthentrepreneurship.com/',
    {
      waitUntil: 'networkidle',
      timeout: 120000
    }
  );
 
  console.log('Page loaded successfully');
  console.log('Current URL:', page.url());
 
  // Wait for the "Accept all cookies" button
  await page.getByRole('button', {
    name: /accept all cookies/i
  }).waitFor({
    state: 'visible',
    timeout: 30000
  });
 
  // Click the button
  await page.getByRole('button', {
    name: /accept all cookies/i
  }).click();
 
  // Wait for the page to stabilize after clicking
  await page.waitForLoadState('networkidle');
 
  // Check if the word "Academy" exists on the page
  const academy = page.getByText('Academy', { exact: false });
 
  if (await academy.count() > 0) {
    console.log('Pass');
  } else {
    console.log('Fail');
  }
 
  // Keep browser open for debugging
  await page.pause();
 
  // await browser.close();
})();