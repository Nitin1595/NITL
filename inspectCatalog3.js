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
  await page.goto(base + '/', { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.evaluate(() => {
    document.querySelectorAll('.onetrust-pc-dark-filter').forEach(el => {
      el.style.display = 'none';
      el.style.pointerEvents = 'none';
      el.style.visibility = 'hidden';
    });
  });
  await page.click('a.nav-link--login-modal', { timeout: 30000 });
  await page.fill('input[name="name"][data-drupal-selector="edit-name"]', process.env.B2B_USERNAME || '');
  await page.fill('input[name="pass"][data-drupal-selector="edit-pass"]', process.env.B2B_PASSWORD || '');
  await page.evaluate(() => {
    document.querySelectorAll('.onetrust-pc-dark-filter').forEach(el => {
      el.style.display = 'none';
      el.style.pointerEvents = 'none';
      el.style.visibility = 'hidden';
    });
  });
  await page.click('form#custom-popup-login-form button[type="submit"]', { force: true, timeout: 30000 });
  await page.waitForURL('**/dashboard', { timeout: 60000 });
  await page.goto(base + '/catalog', { waitUntil: 'domcontentloaded', timeout: 60000 });
  const result = await page.evaluate(() => {
    const sel = (s) => document.querySelector(s);
    const all = (s) => Array.from(document.querySelectorAll(s)).map(el => ({id: el.id, classes: el.className, text: el.textContent.trim().replace(/\s+/g,' '), visible: !!(el.offsetWidth||el.offsetHeight||el.getClientRects().length)}));
    return {
      selectAll: sel('#edit-select-all') ? {id: sel('#edit-select-all').id, classes: sel('#edit-select-all').className, outerHTML: sel('#edit-select-all').outerHTML, visible: !!(sel('#edit-select-all').offsetWidth||sel('#edit-select-all').offsetHeight||sel('#edit-select-all').getClientRects().length)} : null,
      selectAllLabel: sel('label[for="edit-select-all"]') ? {text: sel('label[for="edit-select-all"]').textContent.trim().replace(/\s+/g,' '), html: sel('label[for="edit-select-all"]').outerHTML} : null,
      selectAllParent: sel('#edit-select-all') ? sel('#edit-select-all').closest('form')?.outerHTML.slice(0,1400) : null,
      allButtons: all('button').slice(0,20),
      allAnchors: all('a').slice(0,20),
      allCheckboxes: all('input[type="checkbox"]').slice(0,20),
      productCards: document.querySelectorAll('article.dsu-product.catalog-pdh-product-teaser').length,
      productCardSample: document.querySelector('article.dsu-product.catalog-pdh-product-teaser') ? document.querySelector('article.dsu-product.catalog-pdh-product-teaser').outerHTML.slice(0,800) : null
    };
  });
  console.log(JSON.stringify(result, null, 2));
  await browser.close();
})();
