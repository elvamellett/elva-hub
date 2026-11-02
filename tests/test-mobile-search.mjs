// Test (v107): searching customers on a phone.
//  - typing keeps the SAME search box (so the phone keyboard stays open)
//  - results narrow as you type; phone numbers match in any format
//  - the phone layout has no sideways scrolling; the Find button works
import { chromium, devices } from 'playwright';
const results = [];
const check = (name, ok) => { results.push([name, ok]); if (!ok) console.log('FAIL:', name); };
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell', args: ['--no-sandbox'] });
const ctx = await browser.newContext({ ...devices['iPhone 13'] });
const page = await ctx.newPage();
const errors = [];
page.on('pageerror', e => errors.push(String(e)));
await page.goto('file:///home/user/elva-hub/darcybow-dashboard.html', { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(600);
check('version stamp is 108', (await page.content()).includes('version 108'));

const shop = {
  customers: [
    { id: 1, first_name: 'Mairead', last_name: 'Sheridan', email: 'mairead@example.com', phone: '+353868480001', created_at: '2026-09-01T10:00:00Z' },
    { id: 2, first_name: 'Linda', last_name: 'Dalton', email: 'linda@example.com', phone: '+353861234567', created_at: '2026-09-01T10:00:00Z' },
    { id: 3, first_name: 'Kate', last_name: 'Kennedy', email: 'kate@example.com', phone: '+353879990000', created_at: '2026-09-01T10:00:00Z' },
  ],
  orders: [1, 2, 3].map(i => ({ id: 9000 + i, name: '#900' + i, email: ['', 'mairead@example.com', 'linda@example.com', 'kate@example.com'][i],
    created_at: '2026-09-02T10:00:00Z', customer: { id: i }, line_items: [{ title: 'Darcy Day Out at The Westbury Event', properties: [] }], note_attributes: [] })),
  products: [], syncedAt: new Date().toISOString(),
};
await page.evaluate(p => {
  DB.customers = []; DB.orders = []; DB.orderItems = []; DB.appointments = []; DB.invoices = []; DB.schoolEdits = {};
  LiveSync.applyPayload(p);
  Schools.setFor('sc3', 'Scoil Mhuire');
  customerQuery = ''; location.hash = '#/customers';
}, shop);
await page.waitForTimeout(500);
const names = () => page.evaluate(() => [...document.querySelectorAll('#custresults .cname')].map(x => x.textContent));
check('all 3 customers listed', (await names()).length === 3);

await page.evaluate(() => { window.__box = document.getElementById('pagesearch'); });
await page.tap('#pagesearch');
await page.keyboard.type('lin', { delay: 60 });
await page.waitForTimeout(300);
check('typing narrows the list (lin -> Linda)', JSON.stringify(await names()) === '["Linda Dalton"]');
check('the search box is the SAME element (keyboard stays open)', await page.evaluate(() => document.getElementById('pagesearch') === window.__box && document.activeElement === window.__box));
check('count updates', (await page.textContent('#custcount')).trim() === '1');

const search = async v => { await page.fill('#pagesearch', v); await page.waitForTimeout(250); return names(); };
check('phone in local format finds her (086 123 4567)', JSON.stringify(await search('086 123 4567')) === '["Linda Dalton"]');
check('phone in +353 format finds her', JSON.stringify(await search('+353 86 848 0001')) === '["Mairead Sheridan"]');
check('part of a number works (4567)', JSON.stringify(await search('34567')) === '["Linda Dalton"]');
check('school finds her (mhuire)', JSON.stringify(await search('mhuire')) === '["Kate Kennedy"]');
check('order number finds her (#9003)', JSON.stringify(await search('#9003')) === '["Kate Kennedy"]');
check('email finds her', JSON.stringify(await search('mairead@')) === '["Mairead Sheridan"]');
check('no match says so', (await search('zzzz')).length === 0 && (await page.textContent('#custresults')).includes('No customers match'));
check('clear button shows while searching', await page.evaluate(() => document.getElementById('custclear').style.display !== 'none'));
await page.tap('#custclear');
await page.waitForTimeout(300);
check('clear brings everyone back', (await names()).length === 3);

check('no sideways scrolling on the phone', await page.evaluate(() => {
  const m = document.getElementById('main');
  return m.scrollWidth <= m.clientWidth + 1 && document.querySelector('#custresults .tablewrap').scrollWidth <= document.querySelector('#custresults .tablewrap').clientWidth + 1;
}));
check('phone number shows under the name on the phone', await page.evaluate(() => [...document.querySelectorAll('#custresults .show-m')].some(x => getComputedStyle(x).display !== 'none' && /\d{6}/.test(x.textContent))));

// Find button from another page
await page.evaluate(() => { location.hash = '#/venues'; });
await page.waitForTimeout(300);
check('Find button visible in the top bar', await page.isVisible('#findbtn'));
await page.tap('#findbtn');
await page.waitForTimeout(300);
check('Find opens Customers with the search box focused', await page.evaluate(() => location.hash === '#/customers' && document.activeElement && document.activeElement.id === 'pagesearch'));
await page.keyboard.type('kate', { delay: 40 });
await page.waitForTimeout(300);
check('...and typing straight away finds her', JSON.stringify(await names()) === '["Kate Kennedy"]');
await page.tap('#custresults tr.click');
await page.waitForTimeout(300);
check('tapping a result opens her page', await page.evaluate(() => location.hash === '#/customer/sc3'));

// Sizing: the search box gets its own full row at every width - never
// squeezed or covered by the event / dress dropdowns.
await page.evaluate(() => { location.hash = '#/customers'; });
await page.waitForTimeout(300);
for (const w of [320, 375, 390, 430, 768, 834, 1024, 1366]) {
  await page.setViewportSize({ width: w, height: 800 });
  await page.waitForTimeout(150);
  const g = await page.evaluate(() => {
    const r = el => el.getBoundingClientRect();
    const s = r(document.getElementById('pagesearch')), e = r(document.getElementById('ev-filter')), d = r(document.getElementById('dress-filter'));
    const row = r(document.querySelector('.custsearch'));
    const overlap = (a, b) => !(a.right <= b.left || b.right <= a.left || a.bottom <= b.top || b.bottom <= a.top);
    return { sw: s.width, rowW: row.width, below: e.top >= s.bottom - 1 && d.top >= s.bottom - 1, overlap: overlap(s, e) || overlap(s, d) };
  });
  check(`width ${w}: search box is full-width (${Math.round(g.sw)}px) with the dropdowns underneath, not over it`,
    !g.overlap && g.below && g.sw >= Math.min(g.rowW, 640) - 2);
}
check('no JS errors', errors.length === 0);
if (errors.length) console.log(errors.slice(0, 5));
await page.screenshot({ path: 'mobile-search.png' });
await browser.close();
const passed = results.filter(r => r[1]).length;
console.log(`\n${passed}/${results.length} checks passed`);
process.exit(passed === results.length ? 0 : 1);
