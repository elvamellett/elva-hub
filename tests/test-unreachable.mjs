// Test (v114): when the Google server can't be reached ("Failed to fetch"),
// the dashboard says so in plain words and offers "Test the Google server".
import { chromium } from 'playwright';
const results = [];
const check = (name, ok) => { results.push([name, ok]); if (!ok) console.log('FAIL:', name); };
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell', args: ['--no-sandbox'] });
const page = await browser.newPage();
const errors = [];
page.on('pageerror', e => errors.push(String(e)));
await page.addInitScript(() => {
  try { localStorage.setItem('darcybow-server', 'https://script.google.com/macros/s/TEST/exec'); localStorage.setItem('darcybow-site-token', 't'); } catch (e) {}
  window.__opened = [];
  window.open = u => { window.__opened.push(u); return null; };
  const real = window.fetch.bind(window);
  // Google answering with one of its own error pages looks like this to the browser:
  window.fetch = (url, opts) => String(url).includes('script.google.com') ? Promise.reject(new TypeError('Failed to fetch')) : real(url, opts);
});
await page.goto('file:///home/user/elva-hub/darcybow-dashboard.html', { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(1500);
check('version stamp is 114', (await page.content()).includes('version 114'));
// First try fails, the automatic retry is 12s later - force the final failure now.
await page.evaluate(() => { LiveSync._retried = true; LiveSync.syncing = false; LiveSync.sync(); });
await page.waitForTimeout(800);
const err = await page.evaluate(() => LiveSync.lastError);
check('plain-words reason instead of "Failed to fetch"', /Couldn.t reach the Google server/.test(err) && !/Failed to fetch/.test(err));
await page.evaluate(() => { location.hash = '#/import'; });
await page.waitForTimeout(400);
check('Connect data has "Test the Google server"', (await page.textContent('#main')).includes('Test the Google server'));
await page.evaluate(() => LiveSync.testServer());
await page.waitForTimeout(200);
check('the test opens the Google web app link', await page.evaluate(() => window.__opened[0] === 'https://script.google.com/macros/s/TEST/exec'));
const box = await page.textContent('#modalbox');
check('and explains what each Google page means', /Script function not found/.test(box) && /Who has access/.test(box) && /archived/.test(box));
check('no JS errors', errors.length === 0);
if (errors.length) console.log(errors.slice(0, 5));
await browser.close();
const passed = results.filter(r => r[1]).length;
console.log(`\n${passed}/${results.length} checks passed`);
process.exit(passed === results.length ? 0 : 1);
