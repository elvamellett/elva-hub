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
check('version stamp is 111', (await page.content()).includes('version 111'));
const names = await page.evaluate(() => ['Jean/Thomas O\'Reilly', 'Jean:Thomas O\'Reilly', 'Ann \\ Bob', 'Mary "May" Byrne?', 'Plain Name']
  .map(n => Invoices.pdfName({ code: 'MER1', seq: 54, contact: { name: n } })));
console.log(names);
check('slash becomes "&": MER1 - Jean & Thomas O\'Reilly - 54', names[0] === "MER1 - Jean & Thomas O'Reilly - 54");
check('no forbidden characters in any name', names.every(n => !/[\/\\:*?"<>|]/.test(n)));
check('ordinary names unchanged', names[4] === 'MER1 - Plain Name - 54');
const titles = await page.evaluate(() => {
  const inv = { code: 'MER1', seq: 54, issueDate: '2026-11-01', contact: { name: "Jean/Thomas O'Reilly", address: '', phone: '', email: '' },
    lines: [{ title: 'Rosa', qty: 1, priceCents: 65000 }], depositCents: 0, otherPaidCents: 0, sterling: {} };
  const t = k => (/<title>([^<]*)<\/title>/.exec(Invoices.docHtml(inv, false, k)) || [])[1];
  return [t(''), t('balance')];
});
const title = titles[0] === 'MER1 - Jean &amp; Thomas O&#39;Reilly - 54' && titles[1] === 'MER1 - Jean &amp; Thomas O&#39;Reilly - 54R';
check('the printable invoice page is titled with the safe name (Save as PDF uses it)', title);
check('no JS errors', errors.length === 0);
await browser.close();
const passed = results.filter(r => r[1]).length;
console.log(`\n${passed}/${results.length} checks passed`);
process.exit(passed === results.length ? 0 : 1);
