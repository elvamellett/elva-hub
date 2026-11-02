// Smoke test: export-freshness stamps (v96) — the venue page warns when the
// Appointly booking export is stale, and printed sheets carry its date.
import { chromium } from 'playwright';

const results = [];
const check = (name, ok) => { results.push([name, ok]); if (!ok) console.log('FAIL:', name); };

const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell', args: ['--no-sandbox'] });
const page = await browser.newPage();
const errors = [];
page.on('pageerror', e => errors.push(String(e)));
await page.goto('file:///home/user/elva-hub/darcybow-dashboard.html', { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(600);

check('version stamp is 103', (await page.locator('#sidebar').textContent()).includes('version 103'));

const future = new Date(Date.now() + 10 * 86400000).toISOString().slice(0, 10);
await page.evaluate(d => {
  DB.customers = [{ id: 'A', name: 'Mairead Sheridan', daughterName: 'Aoibh', email: 'm@example.com',
    phone: '0851', address: '', notes: '', createdAt: '2026-09-01T10:00:00Z' }];
  DB.orders = [{ id: 'oA', customerId: 'A', reference: '#901', sourceId: '', status: 'confirmed',
    createdAt: '2026-09-01T10:00:00Z', eventHotel: 'Darcy Day Out — The Westbury, Dublin',
    eventDate: d, planType: null, staffNotes: '' }];
  DB.appointments = [{ id: 'aA', customerId: 'A', source: 'appointly_csv',
    service: 'Darcy Day Out — The Westbury, Dublin', eventHotel: 'Darcy Day Out — The Westbury, Dublin',
    appointmentAt: d, time: '13:00', staffName: 'Staff 1', bookedAt: '2026-09-01T10:00:00Z',
    syncedAt: '', status: 'upcoming', questions: [] }];
  DB.orderItems = []; DB.invoices = [];
  for (const k of ['payments', 'instalments', 'allocations', 'adjustments', 'reminderTasks', 'customerReminders', 'contactLog', 'outbox'])
    if (Array.isArray(DB[k])) DB[k] = [];
  DB.exportInfo = { at: new Date(Date.now() - 5 * 86400000).toISOString() }; // 5 days stale
  Store.save(); Domain.refreshAll();
}, future);

await page.goto('file:///home/user/elva-hub/darcybow-dashboard.html#/venue/' + encodeURIComponent('The Westbury, Dublin'), { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(400);
await page.click(`.chip:has-text("${new Date(future + 'T00:00').toLocaleDateString('en-IE', { weekday: 'long' })}")`).catch(() => {});
await page.waitForTimeout(400);
let main = await page.locator('#main').textContent();
check('stale export: venue page shows the Reschedule risk warning',
  main.includes('Reschedule risk') && main.includes('Booking times from the Appointly export'));

const sheet = await page.evaluate(d => {
  Actions.printRunSheet(encodeURIComponent('The Westbury, Dublin'), d);
  return new Promise(res => setTimeout(() => res(document.getElementById('runframe').srcdoc), 400));
}, future);
check('run sheet is stamped with the export date', String(sheet).includes('Booking times from the Appointly export'));
check('run sheet still lists the customer at her slot', String(sheet).includes('Mairead Sheridan') && String(sheet).includes('13:00'));
await page.evaluate(() => UI.closeModal());

const watchSheet = await page.evaluate(d => {
  Actions.printSchoolWatch(encodeURIComponent('The Westbury, Dublin'), d);
  return new Promise(res => setTimeout(() => res(document.getElementById('csframe').srcdoc), 400));
}, future);
check('school watch sheet carries the stamp too', String(watchSheet).includes('Booking times from the Appointly export'));
await page.evaluate(() => UI.closeModal());

await page.evaluate(() => { DB.exportInfo = { at: new Date().toISOString() }; Store.save(); App.route(); });
await page.waitForTimeout(300);
check('fresh export: calm stamp, no warning', !(await page.locator('#main').textContent()).includes('Reschedule risk'));

check('no JS errors', errors.length === 0);
if (errors.length) console.log(errors.slice(0, 5));
await browser.close();
const passed = results.filter(r => r[1]).length;
console.log(`\n${passed}/${results.length} checks passed`);
process.exit(passed === results.length ? 0 : 1);
