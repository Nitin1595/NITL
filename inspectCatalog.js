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
  const info = await page.evaluate(() => {
    const query = selector => Array.from(document.querySelectorAll(selector)).map(el => ({ text: el.textContent.trim(), html: el.outerHTML.slice(0, 1200) }));
    return {
      selectAll: query('#edit-select-all'),
      selectAllLabels: query('label[for="edit-select-all"]'),
      checkboxes: query('input[type="checkbox"]'),
      downloadSelected: query('button[data-action-id="vbo_nitr_pdh_bulk_assets_download"]'),
      downloadAll: query('a[href*="download"], a[href*="Download"]'),
      productCards: query('article.catalog-pdh-product-teaser'),
      productCardCount: document.querySelectorAll('article.catalog-pdh-product-teaser').length,
      breadcrumbItems: query('nav[aria-label="breadcrumb"] .breadcrumb-item'),
      filterForm: query('#views-exposed-form-catalog-pdh-solr-page-1'),
      overlay: query('.onetrust-pc-dark-filter')
    };
  });
  console.log(JSON.stringify(info, null, 2));
  await browser.close();
})();
