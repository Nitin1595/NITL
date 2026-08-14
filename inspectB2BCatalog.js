const { chromium } = require('playwright');
require('dotenv').config({ silent: true });
(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    httpCredentials: {
      username: process.env.AUTH_USERNAME || '',
      password: process.env.AUTH_PASSWORD || ''
    },
    ignoreHTTPSErrors: true
  });
  const page = await context.newPage();
  const base = process.env.BASE_URL || 'https://master-copy-h5hl5dy-fcsle4rj4pg7c.eu-5.platformsh.site';
  console.log('Navigating to home page...');
  await page.goto(base + '/', { waitUntil: 'domcontentloaded', timeout: 60000 });
  const acceptCookies = page.locator('#onetrust-accept-btn-handler');
  const overlay = page.locator('.onetrust-pc-dark-filter');
  const overlayVisible = await overlay.isVisible().catch(() => false);
  const acceptVisible = await acceptCookies.isVisible().catch(() => false);
  console.log('Cookie overlay visible:', overlayVisible);
  console.log('Cookie accept visible:', acceptVisible);
  if (acceptVisible) {
    console.log('Accepting cookie banner...');
    await acceptCookies.click();
    await page.waitForSelector('.onetrust-pc-dark-filter', {
      state: 'hidden',
      timeout: 15000
    }).catch(() => {});
  }
  await page.waitForSelector('a.nav-link--login-modal', {
    state: 'visible',
    timeout: 15000
  });
  await page.evaluate(() => {
    const overlays = document.querySelectorAll('.onetrust-pc-dark-filter');
    overlays.forEach(overlay => {
      overlay.style.display = 'none';
      overlay.style.pointerEvents = 'none';
      overlay.style.visibility = 'hidden';
    });
  });
  await page.click('a.nav-link--login-modal', { timeout: 15000 });
  await page.waitForSelector('div.ui-dialog[role="dialog"]', { timeout: 15000 });
  await page.fill('input[name="name"][data-drupal-selector="edit-name"]', process.env.B2B_USERNAME || '');
  await page.fill('input[name="pass"][data-drupal-selector="edit-pass"]', process.env.B2B_PASSWORD || '');
  await page.evaluate(() => {
    const overlays = document.querySelectorAll('.onetrust-pc-dark-filter');
    overlays.forEach(overlay => {
      overlay.style.display = 'none';
      overlay.style.pointerEvents = 'none';
      overlay.style.visibility = 'hidden';
    });
  });
  await page.click('form#custom-popup-login-form button[type="submit"]', {
    timeout: 15000,
    force: true
  });
  await page.waitForLoadState('domcontentloaded');
  await page.waitForURL('**/dashboard', { timeout: 30000 });
  console.log('Logged in, navigating to catalog...');
  await page.goto(base + '/catalog', { waitUntil: 'domcontentloaded', timeout: 60000 });
  const title = await page.title();
  console.log('URL:', page.url());
  console.log('TITLE:', title);
  const selectors = [
    'h1',
    'h2',
    '.view-catalog',
    'article',
    '.catalog-item',
    '.card',
    'nav[aria-label="breadcrumb"]',
    'form',
    '.product-card',
    '.view-content',
    '.view-products-search',
    '.view-catalog-search',
    'table',
    '.search-bar',
    'a.link-text',
    'a.card__btn'
  ];
  for (const sel of selectors) {
    const count = await page.locator(sel).count();
    if (count > 0) {
      const text = await page.locator(sel).first().textContent();
      console.log(`SEL:${sel}: ${count} | ${text?.trim().slice(0,160)}`);
    }
  }
  const bodyHTML = await page.locator('body').innerHTML();
  console.log('BODYHTMLSTART');
  console.log(bodyHTML.slice(0, 6000));
  console.log('BODYHTMLEND');
  await browser.close();
})();
