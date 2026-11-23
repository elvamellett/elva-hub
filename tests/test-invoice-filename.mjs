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
check('version stamp is 114', (await page.content()).includes('version 114'));
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
// v113: no dots either - "Mrs. Byrne" made the Mac read ". Byrne - 54" as the
// file type, so the PDF got no .pdf ending and wouldn't open.
const dotted = await page.evaluate(() => ['Mrs. Byrne', 'J.P. Murphy', 'Ann O’Brien · twins', '...']
  .map(n => Invoices.pdfName({ code: 'MER1', seq: 54, contact: { name: n } })));
console.log(dotted);
check('no dots or "·" in any PDF name', dotted.every(n => !/[.·]/.test(n)));
check('"Mrs. Byrne" -> "MER1 - Mrs Byrne - 54"', dotted[0] === 'MER1 - Mrs Byrne - 54');
check('a name of only dots still gives a sensible name', dotted[3] === 'MER1 - 54');
// What each print button actually names the PDF: capture the titles at the
// moment print() is called.
const printed = await page.evaluate(async () => {
  const caught = [];
  const grab = id => new Promise(res => {
    const f = document.getElementById(id);
    f.onload = () => {
      f.contentWindow.print = () => caught.push({ id, frame: f.contentDocument.title, main: document.title });
      printFrame(id);
      res();
    };
  });
  // invoice
  const inv = { id: 'x', customerId: 'none', code: 'MER1', seq: 54, issueDate: '2026-11-01', contact: { name: 'Mrs. Byrne', address: '', phone: '', email: '' },
    lines: [{ title: 'Rosa', qty: 1, priceCents: 65000 }], depositCents: 0, otherPaidCents: 0, sterling: {} };
  const s = Invoices.settings(); s.passHash = Invoices._hash('1'); localStorage.setItem('darcybow-inv-unlock', s.passHash);
  let w = grab.bind(null, 'invframe');
  Invoices._previewModal(inv); await w();
  UI.closeModal();
  Actions._sheetModal('x', 'y', '<!DOCTYPE html><html><head><title>Customer sheets — The Westbury · Sat 3 Oct</title></head><body>hi</body></html>', 1);
  await grab('csframe');
  UI.closeModal();
  await new Promise(r => setTimeout(r, 50));
  return { caught, after: document.title };
});
console.log(printed);
check('invoice Download PDF: file named "MER1 - Mrs Byrne - 54" (frame AND main page)', printed.caught[0] && printed.caught[0].frame === 'MER1 - Mrs Byrne - 54' && printed.caught[0].main === 'MER1 - Mrs Byrne - 54');
check('customer sheets: "·" removed -> "Customer sheets - The Westbury Sat 3 Oct"', printed.caught[1] && printed.caught[1].frame === 'Customer sheets - The Westbury Sat 3 Oct');
check('no JS errors', errors.length === 0);
await browser.close();
const passed = results.filter(r => r[1]).length;
console.log(`\n${passed}/${results.length} checks passed`);
process.exit(passed === results.length ? 0 : 1);
