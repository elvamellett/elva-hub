// Regression test (v99): a booking handed on to someone else in Appointly
// keeps the ORIGINAL customer's email. It must show under the new person's
// name (not merge into the email's owner), and Appointly booking notes
// must print on the staff run sheet.
import { chromium } from 'playwright';
const results = [];
const check = (name, ok) => { results.push([name, ok]); if (!ok) console.log('FAIL:', name); };
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell', args: ['--no-sandbox'] });
const page = await browser.newPage();
const errors = [];
page.on('pageerror', e => errors.push(String(e)));
await page.goto('file:///home/user/elva-hub/darcybow-dashboard.html', { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(500);
check('version stamp is 101', (await page.locator('#sidebar').textContent()).includes('version 101'));

const day = (() => { const d = new Date(Date.now() + 10 * 86400000); return d; })();
const ISO = day.toISOString().slice(0, 10);
const MDY = day.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
const q = (kid) => '"Ques: What is your Daugther\'s Name?\nAns: ' + kid + '\nQues: When is your Communion? (If known)\nAns: May 2027"';
const csv = [
  'Appointment Time,Service,Variant,Team Member,Order,Customer Name,Customer Email,Custom Questions,Notes,CreatedAt',
  `"${MDY} 9:00 AM",Darcy Day Out at The Test Hotel Event,Default Title,Staff 6,,Pat Newman,original@example.com,` + q('Rosa') +
    ',"Handed on by the previous customer - please be discreet, aunt coming too.","Oct 19, 2026 2:38 PM"',
  `"${MDY} 10:00 AM",Darcy Day Out at The Test Hotel Event,Default Title,Staff 1,#7001,Mrs Beth Booker,beth@example.com,` + q('Lily') + ',,"Jun 14, 2026 9:34 PM"',
].join('\n');
const shop = {
  customers: [
    { id: 1, first_name: 'Ann', last_name: 'Original', email: 'original@example.com', phone: '', created_at: '2026-06-01T10:00:00Z' },
    { id: 2, first_name: 'Beth', last_name: 'Booker', email: 'beth@example.com', phone: '', created_at: '2026-06-01T10:00:00Z' },
  ],
  orders: [1, 2].map(i => ({ id: 7000 + i, name: '#700' + i, email: i === 1 ? 'original@example.com' : 'beth@example.com',
    created_at: '2026-06-01T10:00:00Z', customer: { id: i },
    line_items: [{ title: 'Darcy Day Out at The Test Hotel Event', properties: [{ name: '_booking_by', value: 'Appointly' },
      { name: 'Booking', value: 'Date: ' + MDY + ' Time: ' + (i === 1 ? '9:00 AM' : '10:00 AM') + ' - x' }] }], note_attributes: [] })),
  products: [], syncedAt: new Date().toISOString(), bookingsCsv: csv,
};
const look = async () => page.evaluate(async d => {
  const v = venueGroups().find(x => /Test Hotel/.test(x.venue));
  Actions.printRunSheet(encodeURIComponent(v.venue), d);
  await new Promise(res => setTimeout(res, 400));
  return { html: document.getElementById('runframe').srcdoc, booked: slotBoard(v.venue, d).booked };
}, ISO);
await page.evaluate(p => LiveSync.applyPayload(p), shop);
await page.waitForTimeout(300);
let r = await look();
check('handed-on slot prints under the NEW person (Pat Newman)', r.html.includes('Pat Newman'));
check('...and not under the email owner (Ann Original)', !r.html.includes('Ann Original'));
check('Appointly booking note prints on the run sheet', r.html.includes('please be discreet'));
check('child name prints even with the "Daugther" typo question', r.html.includes('Rosa'));
check('Variant "Default Title" is not printed as an answer', !r.html.includes('Default Title'));
check('a "Mrs" prefix still matches the same customer', r.html.includes('Beth Booker') && r.booked === 2);
await page.evaluate(() => UI.closeModal());
await page.evaluate(p => LiveSync.applyPayload(p), shop); // every device replays on each sync
await page.waitForTimeout(300);
r = await look();
check('stays right after another sync', r.html.includes('Pat Newman') && !r.html.includes('Ann Original') && r.booked === 2);
check('no JS errors', errors.length === 0);
if (errors.length) console.log(errors.slice(0, 5));
await browser.close();
const passed = results.filter(r2 => r2[1]).length;
console.log(`\n${passed}/${results.length} checks passed`);
process.exit(passed === results.length ? 0 : 1);
