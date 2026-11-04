// Smoke test: every page renders on the built-in sample data with no JS errors.
import { chromium } from 'playwright';
const results = [];
const check = (name, ok) => { results.push([name, ok]); if (!ok) console.log('FAIL:', name); };
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell', args: ['--no-sandbox'] });
const page = await browser.newPage();
const errors = [];
page.on('pageerror', e => errors.push(String(e)));
await page.goto('file:///home/user/elva-hub/darcybow-dashboard.html', { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(600);
for (const r of ['dashboard', 'customers', 'venues', 'schools', 'production', 'invoices', 'import']) {
  await page.evaluate(h => { location.hash = '#/' + h; }, r);
  await page.waitForTimeout(250);
  const txt = await page.evaluate(() => document.getElementById('main').textContent.length);
  check(r + ' page renders', txt > 50);
}
const firstVenue = await page.evaluate(() => (venueGroups()[0] || {}).venue || '');
if (firstVenue) {
  await page.evaluate(v => { location.hash = '#/venue/' + encodeURIComponent(v); }, firstVenue);
  await page.waitForTimeout(300);
  check('venue page renders', (await page.evaluate(() => document.getElementById('main').textContent)).includes(firstVenue));
}
const firstCust = await page.evaluate(() => (DB.customers[0] || {}).id || '');
if (firstCust) {
  await page.evaluate(id => { location.hash = '#/customer/' + id; }, firstCust);
  await page.waitForTimeout(300);
  check('customer page renders', (await page.evaluate(() => document.getElementById('main').textContent.length)) > 50);
}
check('no JS errors anywhere', errors.length === 0);
if (errors.length) console.log(errors.slice(0, 5));
await browser.close();
const passed = results.filter(r => r[1]).length;
console.log(`\n${passed}/${results.length} checks passed`);
process.exit(passed === results.length ? 0 : 1);
