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
    const textElements = Array.from(document.querySelectorAll('a,button,label,span,div')).filter(el => /download/i.test(el.textContent));
    const downloadElements = textElements.map(el => ({ tag: el.tagName.toLowerCase(), classes: el.className, id: el.id, text: el.textContent.trim().replace(/\s+/g, ' '), outerHTML: el.outerHTML.slice(0,400) }));
    const downloadHrefElements = Array.from(document.querySelectorAll('a')).filter(el => /download/i.test(el.getAttribute('href') || '')).map(el => ({ href: el.getAttribute('href'), classes: el.className, text: el.textContent.trim().replace(/\s+/g, ' '), outerHTML: el.outerHTML.slice(0,400) }));
    const allCheckboxes = Array.from(document.querySelectorAll('input[type="checkbox"]')).map(el => ({ id: el.id, classes: el.className, visible: !!(el.offsetWidth||el.offsetHeight||el.getClientRects().length), checked: el.checked }));
    return {
      selectAllInput: (() => { const el = document.querySelector('#edit-select-all'); return el ? { id: el.id, classes: el.className, visible: !!(el.offsetWidth||el.offsetHeight||el.getClientRects().length), outerHTML: el.outerHTML } : null })(),
      selectAllLabel: (() => { const el = document.querySelector('label[for="edit-select-all"]'); return el ? { text: el.textContent.trim().replace(/\s+/g,' '), outerHTML: el.outerHTML } : null })(),
      downloadSelectedButton: (() => { const el = Array.from(document.querySelectorAll('button')).find(b => /download selected/i.test(b.textContent)); return el ? { id: el.id, classes: el.className, text: el.textContent.trim().replace(/\s+/g,' '), visible: !!(el.offsetWidth||el.offsetHeight||el.getClientRects().length), outerHTML: el.outerHTML } : null })(),
      downloadAllAnchor: (() => { const el = Array.from(document.querySelectorAll('a')).find(a => /download all products data/i.test(a.textContent)); return el ? { href: el.getAttribute('href'), classes: el.className, text: el.textContent.trim().replace(/\s+/g,' '), outerHTML: el.outerHTML } : null })(),
      downloadHrefElements,
      downloadElements,
      allCheckboxes,
      productCardCount: document.querySelectorAll('article.dsu-product.catalog-pdh-product-teaser').length
    };
  });
  console.log(JSON.stringify(info, null, 2));
  await browser.close();
})();
