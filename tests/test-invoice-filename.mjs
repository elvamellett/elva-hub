// Test (v110): an invoice PDF's file name never contains / \ : * ? " < > |
// ("MER1 - Jean:Thomas O'Reilly - 54.pdf" broke the OneDrive attachment).
import { chromium } from 'playwright';
const results = [];
const check = (name, ok) => { results.push([name, ok]); if (!ok) console.log('FAIL:', name); };
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell', args: ['--no-sandbox'] });
const page = await browser.newPage();
const errors = [];
page.on('pageerror', e => errors.push(String(e)));
await page.goto('file:///home/user/elva-hub/darcybow-dashboard.html', { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(800);
check('version stamp is 110', (await page.content()).includes('version 110'));
const names = await page.evaluate(() => ['Jean/Thomas O\'Reilly', 'Jean:Thomas O\'Reilly', 'Ann \\ Bob', 'Mary "May" Byrne?', 'Plain Name']
  .map(n => Invoices.pdfName({ code: 'MER1', seq: 54, contact: { name: n } })));
console.log(names);
check('slash becomes "&": MER1 - Jean & Thomas O\'Reilly - 54', names[0] === "MER1 - Jean & Thomas O'Reilly - 54");
check('no forbidden characters in any name', names.every(n => !/[\/\\:*?"<>|]/.test(n)));
check('ordinary names unchanged', names[4] === 'MER1 - Plain Name - 54');
const title = await page.evaluate(() => {
  const html = Invoices.docHtml ? null : null;
  const src = Function.prototype.toString.call(Object.values(Invoices).find(f => typeof f === 'function' && /<title>\$\{esc\(Invoices\.pdfName\(inv\)\)\}<\/title>/.test(String(f))) || '');
  return !!src;
});
check('the printable invoice page is titled with the safe name (Save as PDF uses it)', title);
check('no JS errors', errors.length === 0);
await browser.close();
const passed = results.filter(r => r[1]).length;
console.log(`\n${passed}/${results.length} checks passed`);
process.exit(passed === results.length ? 0 : 1);
