// Test (v104): editing a customer's email / phone / notes on her page -
// sticks through Shopify syncs and Appointly imports, nothing detaches
// when the email changes, and the change is sent to Shopify.
import { chromium } from 'playwright';
const results = [];
const check = (name, ok) => { results.push([name, ok]); if (!ok) console.log('FAIL:', name); };
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell', args: ['--no-sandbox'] });
const page = await browser.newPage();
const errors = [];
page.on('pageerror', e => errors.push(String(e)));
await page.addInitScript(() => {
  try {
    localStorage.setItem('darcybow-server', 'https://script.google.com/macros/s/TEST/exec');
    localStorage.setItem('darcybow-site-token', 't');
  } catch (e) {}
  window.__posts = [];
  const real = window.fetch.bind(window);
  window.fetch = (url, opts) => {
    if (String(url).includes('script.google.com')) {
      const j = JSON.parse(opts.body);
      window.__posts.push(j);
      const result = j.fn === 'syncShopify' ? JSON.stringify(window.__nextSync || { customers: [], orders: [], products: [] })
        : j.fn === 'updateShopifyCustomer' ? JSON.stringify({ ok: true }) : '{}';
      return Promise.resolve(new Response(JSON.stringify({ result })));
    }
    return real(url, opts);
  };
});
await page.goto('file:///home/user/elva-hub/darcybow-dashboard.html', { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(1500);
check('version stamp is 106', (await page.locator('#sidebar').textContent()).includes('version 106'));

const future = new Date(Date.now() + 9 * 86400000).toISOString().slice(0, 10);
const shop = (email, phone, note) => ({
  customers: [{ id: 5, first_name: 'Linda', last_name: 'Dalton', email, phone, note, created_at: '2026-06-01T10:00:00Z' }],
  orders: [{ id: 50, name: '#5650', email, created_at: '2026-06-01T10:00:00Z', customer: { id: 5 },
    line_items: [{ title: 'Darcy Day Out at Kildare Village', properties: [] }], note_attributes: [] }],
  products: [], syncedAt: new Date().toISOString(),
});
await page.evaluate(p => {
  DB.invoices = []; DB.custEdits = {}; DB.schoolEdits = {}; DB.custNotes = {};
  LiveSync.applyPayload(p);
  const c = DB.customers.find(x => x.id === 'sc5');
  DB.custNotes[CustNotes.key(c)] = { text: 'Prefers Saturdays', updatedAt: new Date().toISOString() };
  Schools.setFor('sc5', 'St Pius GNS');
  Store.save();
}, shop('lindyclegg@gmail.com', '+353861111111', 'old note'));
const before = await page.evaluate(() => ({ photoKey: Photos.key(Domain.customer('sc5')) }));

// Edit on her page
await page.evaluate(() => { location.hash = '#/customer/sc5'; });
await page.waitForTimeout(400);
await page.evaluate(() => Actions.editCustomer('sc5'));
await page.waitForTimeout(200);
check('edit form has email, phone and notes', await page.evaluate(() =>
  !!document.getElementById('ec-email') && !!document.getElementById('ec-phone') && !!document.getElementById('ec-note')));
check('"Also update Shopify" ticked for a Shopify customer', await page.evaluate(() => document.getElementById('ec-shopify').checked));
await page.fill('#ec-email', 'linda.dalton@example.com');
await page.fill('#ec-phone', '086 222 3333');
await page.fill('#ec-note', 'Two girls - Zara and Lucy');
await page.evaluate(() => { window.__posts = []; Actions._saveCustomerEdit('sc5'); });
await page.waitForTimeout(800);

const push = await page.evaluate(() => window.__posts.find(x => x.fn === 'updateShopifyCustomer'));
const pl = push ? JSON.parse(push.args[1]) : {};
check('sent to Shopify with the new email, phone and note', !!push && pl.id === 'sc5'
  && pl.email === 'linda.dalton@example.com' && pl.phone === '086 222 3333' && pl.note === 'Two girls - Zara and Lucy');
check('name not sent when it did not change', !('first_name' in pl));

const attached = () => page.evaluate(() => {
  const c = Domain.customer('sc5') || DB.customers.find(x => /Dalton/.test(x.name));
  return { email: c.email, phone: c.phone, notes: c.notes, staffNote: CustNotes.get(c), school: Schools.of(c.id), photoKey: Photos.key(c) };
});
let a = await attached();
check('new details show at once', a.email === 'linda.dalton@example.com' && a.phone === '086 222 3333' && a.notes === 'Two girls - Zara and Lucy');
check('staff note, school correction and photos stay attached', a.staffNote === 'Prefers Saturdays' && a.school === 'St Pius GNS' && a.photoKey === before.photoKey);

// Sync while Shopify still has the OLD details: the edit must win
await page.evaluate(p => LiveSync.applyPayload(p), shop('lindyclegg@gmail.com', '+353861111111', 'old note'));
await page.waitForTimeout(300);
a = await attached();
check('after a sync with old Shopify data, the edit still wins', a.email === 'linda.dalton@example.com' && a.phone === '086 222 3333' && a.notes === 'Two girls - Zara and Lucy');
check('...and everything is still attached', a.staffNote === 'Prefers Saturdays' && a.school === 'St Pius GNS' && a.photoKey === before.photoKey);

// Sync once Shopify HAS the new details
await page.evaluate(p => LiveSync.applyPayload(p), shop('linda.dalton@example.com', '+353862223333', 'Two girls - Zara and Lucy'));
await page.waitForTimeout(300);
a = await attached();
check('after Shopify catches up: still one record, all attached', a.email === 'linda.dalton@example.com'
  && a.staffNote === 'Prefers Saturdays' && a.school === 'St Pius GNS' && a.photoKey === before.photoKey);
check('no duplicate record created', await page.evaluate(() => DB.customers.filter(c => /Dalton/.test(c.name)).length === 1));

// Appointly import still under her OLD email finds her
await page.evaluate(([p, d]) => {
  p.bookingsCsv = 'Customer name,Email,Appointment date,Start time,Service\nlinda dalton,lindyclegg@gmail.com,' + d + ',10:00 AM,Darcy Day Out at Kildare Village';
  LiveSync.applyPayload(p);
}, [shop('linda.dalton@example.com', '+353862223333', 'Two girls - Zara and Lucy'), future]);
await page.waitForTimeout(300);
check('Appointly booking under the OLD email lands on her record', await page.evaluate(d =>
  DB.appointments.some(x => x.customerId === 'sc5' && x.appointmentAt === d) && DB.customers.filter(c => /dalton/i.test(c.name)).length === 1, future));

check('no JS errors', errors.length === 0);
if (errors.length) console.log(errors.slice(0, 5));
await browser.close();
const passed = results.filter(r => r[1]).length;
console.log(`\n${passed}/${results.length} checks passed`);
process.exit(passed === results.length ? 0 : 1);
