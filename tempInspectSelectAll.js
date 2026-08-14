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
  await page.evaluate(() => document.querySelectorAll('.onetrust-pc-dark-filter').forEach(el => { el.style.display='none'; el.style.pointerEvents='none'; el.style.visibility='hidden'; }));
  await page.click('a.nav-link--login-modal', { timeout: 30000 });
  await page.fill('input[name="name"][data-drupal-selector="edit-name"]', process.env.B2B_USERNAME || '');
  await page.fill('input[name="pass"][data-drupal-selector="edit-pass"]', process.env.B2B_PASSWORD || '');
  await page.evaluate(() => document.querySelectorAll('.onetrust-pc-dark-filter').forEach(el => { el.style.display='none'; el.style.pointerEvents='none'; el.style.visibility='hidden'; }));
  await page.click('form#custom-popup-login-form button[type="submit"]', { force: true, timeout: 30000 });
  await page.waitForURL('**/dashboard', { timeout: 60000 });
  await page.goto(base + '/catalog', { waitUntil: 'networkidle', timeout: 60000 });
  const info = await page.evaluate(() => {
    const selectAllInput = document.querySelector('#edit-select-all');
    const selectAllLabel = document.querySelector('label[for="edit-select-all"]');
    const countStrong = selectAllLabel ? selectAllLabel.querySelector('strong') : null;
    const footer = document.querySelector('.vbo-view-form-footer');
    return {
      selectAllInput: selectAllInput ? { outerHTML: selectAllInput.outerHTML, visible: !!(selectAllInput.offsetWidth||selectAllInput.offsetHeight||selectAllInput.getClientRects().length), checked: selectAllInput.checked } : null,
      selectAllLabel: selectAllLabel ? { outerHTML: selectAllLabel.outerHTML, text: selectAllLabel.textContent.trim().replace(/\s+/g, ' '), visible: !!(selectAllLabel.offsetWidth||selectAllLabel.offsetHeight||selectAllLabel.getClientRects().length) } : null,
      countStrong: countStrong ? { outerHTML: countStrong.outerHTML, text: countStrong.textContent.trim() } : null,
      footer: footer ? { outerHTML: footer.outerHTML.slice(0, 1200), text: footer.textContent.trim().replace(/\s+/g, ' ') } : null
    };
  });
  console.log(JSON.stringify(info, null, 2));
  await browser.close();
})();