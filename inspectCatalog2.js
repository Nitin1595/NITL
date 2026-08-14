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
  const results = await page.evaluate(() => {
    const extract = (selector, limit = 20) => Array.from(document.querySelectorAll(selector)).slice(0, limit).map(el => {
      const text = el.textContent.trim().replace(/\s+/g, ' ');
      return { tag: el.tagName.toLowerCase(), classes: el.className, id: el.id, text };
    });
    return {
      checkboxInputs: extract('input[type="checkbox"]', 20),
      selectAllInputs: extract('#edit-select-all', 20),
      selectAllLabels: extract('label[for="edit-select-all"]', 20),
      downloadSelectedButtons: extract('button[data-action-id="vbo_nitr_pdh_bulk_assets_download"]', 20),
      downloadLinks: extract('a[href*="download"]', 20),
      productCards: extract('article.dsu-product.catalog-pdh-product-teaser', 20),
      productCardCount: document.querySelectorAll('article.dsu-product.catalog-pdh-product-teaser').length,
      bodyContainsDownload: document.body.innerText.includes('Download selected') || document.body.innerText.includes('Download all products data'),
      allButtons: extract('button', 20),
      allLinks: extract('a', 20)
    };
  });
  console.log(JSON.stringify(results, null, 2));
  await browser.close();
})();
