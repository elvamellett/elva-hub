// Test (v104):
//  1. Upcoming-only Appointly exports: past bookings (and their answers)
//     are kept, on this device and on every device that replays the export.
//  2. A pencil beside each row on the customer page edits that one field;
//     name/email/phone/notes go to Shopify, the rest stays on the dashboard.
//  3. Edited booking answers (child, school, communion) print on the sheets.
//  4. A walk-in can be booked into a venue/day from her page; it survives
//     syncs and imports and reaches every device.
import { chromium } from 'playwright';
const results = [];
const check = (name, ok) => { results.push([name, ok]); if (!ok) console.log('FAIL:', name); };
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell', args: ['--no-sandbox'] });
const page = await browser.newPage();
const errors = [];
page.on('pageerror', e => errors.push(String(e)));
page.on('dialog', d => d.accept());
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
check('version stamp is 104', (await page.locator('#sidebar').textContent()).includes('version 104'));

const iso = d => d.toISOString().slice(0, 10);
const PAST = iso(new Date(Date.now() - 12 * 86400000));
const FUT = iso(new Date(Date.now() + 10 * 86400000));
const qa = (kid, school) => '"Ques: What is your Daughter\'s Name?\nAns: ' + kid + '\nQues: What is the name of your Daughter\'s School?\nAns: ' + school + '\nQues: When is your Communion? (If known)\nAns: May 2027"';
const H = 'Customer name,Email,Phone,Appointment date,Start time,Service,Staff,Status,Custom Questions';
const exportA = [H,
  `Aoife Byrne,aoife@example.com,086 100 0001,${PAST},11:00 AM,Darcy Day Out at The Westbury,Staff 1,Confirmed,` + qa('Grace', 'Scoil Mhuire'),
  `Bea Nolan,bea@example.com,086 100 0002,${FUT},2:00 PM,Darcy Day Out at The Westbury,Staff 2,Confirmed,` + qa('Lily', 'St Annes'),
].join('\n');
const exportB = [H, // upcoming only: Aoife's past booking is NOT in it
  `Bea Nolan,bea@example.com,086 100 0002,${FUT},3:00 PM,Darcy Day Out at The Westbury,Staff 2,Confirmed,` + qa('Lily', 'St Annes'),
].join('\n');
const shop = {
  customers: [
    { id: 1, first_name: 'Aoife', last_name: 'Byrne', email: 'aoife@example.com', phone: '+353861000001', created_at: '2026-08-01T10:00:00Z' },
    { id: 2, first_name: 'Bea', last_name: 'Nolan', email: 'bea@example.com', phone: '+353861000002', created_at: '2026-08-01T10:00:00Z' },
  ],
  orders: [], products: [], syncedAt: new Date().toISOString(),
};
const upload = csv => page.evaluate(t => {
  const parsed = parseCsv(t);
  ImportService.state.appointly = { name: 'bookings.csv', raw: t, headers: parsed.headers, records: parsed.records };
  ImportService.mergeAppointly();
}, csv);

await page.evaluate(p => {
  DB.customers = []; DB.orders = []; DB.orderItems = []; DB.appointments = []; DB.invoices = [];
  DB.exportInfo = null; DB.custEdits = {}; DB.schoolEdits = {}; DB.manualCusts = []; DB.manualBookings = [];
  localStorage.removeItem('darcybow-bookings-book');
  LiveSync.applyPayload(p);
}, shop);

// ---- 1. upcoming-only exports keep the past ----
await upload(exportA);
await page.waitForTimeout(300);
await upload(exportB);
await page.waitForTimeout(300);
const pastKept = () => page.evaluate(d => {
  const a = DB.appointments.find(x => x.customerId === 'sc1' && x.appointmentAt === d);
  return !!a && ImportService._expandQas(a.questions).some(z => z.a === 'Grace');
}, PAST);
check('upcoming-only export: Aoife\'s past booking + answers kept', await pastKept());
check('...and Bea\'s upcoming booking takes the new export\'s time', await page.evaluate(d =>
  DB.appointments.some(x => x.customerId === 'sc2' && x.appointmentAt === d && x.time === '15:00')
  && !DB.appointments.some(x => x.customerId === 'sc2' && x.appointmentAt === d && x.time === '14:00'), FUT));
const shared = await page.evaluate(() => { const s = window.__posts.filter(x => x.fn === 'saveBookingsCsv').pop(); return s ? s.args[1] : ''; });
check('the shared copy sent to every device carries both bookings', /Aoife/.test(shared) && /Bea/.test(shared));
// another device replays the shared copy on its next sync
await page.evaluate(([p, csv]) => {
  DB.appointments = []; localStorage.removeItem('darcybow-bookings-book');
  LiveSync.applyPayload(Object.assign({}, p, { bookingsCsv: csv }));
}, [shop, shared]);
await page.waitForTimeout(300);
check('another device syncing gets the past booking too', await pastKept());
// a third upcoming-only export uploaded on THAT device still keeps it
await upload(exportB);
await page.waitForTimeout(300);
check('a later upcoming-only export on that device still keeps it', await pastKept());

// ---- 2. per-row pencils ----
await page.evaluate(() => { location.hash = '#/customer/sc2'; });
await page.waitForTimeout(400);
const pencils = await page.evaluate(() => [...document.querySelectorAll('.dl-row button')].filter(b => b.textContent.includes('✎')).length);
check('customer page has a pencil on every detail row (>= 8)', pencils >= 8);
check('notes row shows even when empty', await page.evaluate(() => [...document.querySelectorAll('.dl-label')].some(x => x.textContent === 'Notes')));
await page.evaluate(() => { window.__posts = []; Actions.editField('sc2', 'phone'); });
await page.waitForTimeout(150);
await page.fill('#ef-val', '087 555 1234');
await page.evaluate(() => Actions._saveField('sc2', 'phone'));
await page.waitForTimeout(600);
const ph = await page.evaluate(() => window.__posts.find(x => x.fn === 'updateShopifyCustomer'));
const pl = ph ? JSON.parse(ph.args[1]) : {};
check('phone pencil: sends ONLY the phone to Shopify', !!ph && pl.phone === '087 555 1234' && !('email' in pl) && !('note' in pl) && !('first_name' in pl));
await page.evaluate(() => { window.__posts = []; Actions.editField('sc2', 'communion'); });
await page.waitForTimeout(150);
await page.fill('#ef-val', '16 May 2027');
await page.evaluate(() => Actions._saveField('sc2', 'communion'));
await page.waitForTimeout(400);
check('communion pencil: saved on the dashboard, nothing sent to Shopify', await page.evaluate(() =>
  custAnswers(Domain.customer('sc2')).communion === '16 May 2027' && !window.__posts.some(x => x.fn === 'updateShopifyCustomer')));

// ---- 3. edited answers print ----
await page.evaluate(() => Actions.editAnswers('sc2'));
await page.waitForTimeout(150);
await page.fill('#ea-child', 'Lily Rose');
await page.fill('#ea-school', 'St Anne\'s NS Milltown');
await page.evaluate(() => Actions._saveAnswers('sc2'));
await page.waitForTimeout(400);
const sheet = await page.evaluate(d => {
  const v = venueGroups().find(x => /Westbury/.test(x.venue));
  Actions.printRunSheet(encodeURIComponent(v.venue), d);
  return new Promise(res => setTimeout(() => res(document.getElementById('runframe').srcdoc), 400));
}, FUT);
check('run sheet prints the edited child, school and communion', /Lily Rose/.test(sheet) && /St Anne(&#39;|')s NS Milltown/.test(sheet) && /16 May 2027/.test(sheet));
const csheet = await page.evaluate(() => Actions._sheetHtml([Actions._customerRow(Domain.customer('sc2'))], 'x'));
check('customer sheet prints them too', /Lily Rose/.test(csheet) && /16 May 2027/.test(csheet) && !/May 2027<\/div>.*May 2027<\/div>.*May 2027/.test(csheet));
check('school page follows the new school', await page.evaluate(() => Schools.of('sc2') === 'St Anne\'s NS Milltown'));
await upload(exportB); // a fresh export with the OLD answers must not undo the edits
await page.waitForTimeout(300);
check('edits survive a new export with the old answers', await page.evaluate(() => {
  const a = custAnswers(Domain.customer('sc2'));
  return a.child === 'Lily Rose' && a.communion === '16 May 2027' && a.school === 'St Anne\'s NS Milltown';
}));

// ---- 4. walk-in booked into a venue ----
await page.evaluate(() => Actions.addCustomer());
await page.waitForTimeout(150);
await page.fill('#nc-name', 'Wendy Walker');
await page.fill('#nc-daughter', 'Ella');
await page.evaluate(() => Actions._createCustomer());
await page.waitForTimeout(500);
check('new customer: the venue picker opens straight away', await page.evaluate(() => !!document.getElementById('bk-venue')));
const wid = await page.evaluate(() => DB.customers.find(c => c.name === 'Wendy Walker').id);
await page.evaluate(d => {
  const sel = document.getElementById('bk-venue');
  sel.value = String([...sel.options].findIndex(o => /Westbury/.test(o.textContent)));
  Actions._bookDates();
  document.getElementById('bk-date').value = d;
  document.getElementById('bk-time').value = '16:00';
}, FUT);
await page.evaluate(id => Actions._saveBooking(id), wid);
await page.waitForTimeout(300);
const onVenue = () => page.evaluate(([id, d]) => {
  const v = venueGroups().find(x => /Westbury/.test(x.venue));
  return !!v && v.orders.some(o => o.customerId === id && o.eventDate === d);
}, [wid, FUT]);
check('walk-in shows on the Westbury venue for that day', await onVenue());
check('walk-in is shared (manual customer + booking in the staff payload)', await page.evaluate(id => {
  const j = JSON.parse(Staff.payload());
  return j.manualCusts.some(c => c.id === id) && j.manualBookings.some(m => m.custId === id);
}, wid));
const rs = await page.evaluate(d => {
  const v = venueGroups().find(x => /Westbury/.test(x.venue));
  Actions.printRunSheet(encodeURIComponent(v.venue), d);
  return new Promise(res => setTimeout(() => res(document.getElementById('runframe').srcdoc), 400));
}, FUT);
check('walk-in is on the run sheet at 16:00', /Wendy Walker/.test(rs) && /16:00/.test(rs));
await page.evaluate(p => LiveSync.applyPayload(p), shop);
await page.waitForTimeout(300);
check('walk-in booking survives a Shopify sync', await onVenue());
await upload(exportB);
await page.waitForTimeout(300);
check('...and a new Appointly export', await onVenue());
// another device: knows nothing, then merges the staff payload
const json = await page.evaluate(() => Staff.payload());
await page.evaluate(([id, j]) => {
  DB.manualCusts = []; DB.manualBookings = [];
  DB.customers = DB.customers.filter(c => c.id !== id);
  DB.appointments = DB.appointments.filter(a => a.customerId !== id);
  Staff.merge(j);
}, [wid, json]);
check('another device receives the walk-in and her booking', await onVenue());
// remove it
await page.evaluate(id => {
  const a = DB.appointments.find(x => x.customerId === id && x.source === 'walkin');
  Actions.removeManualBooking(a.id);
}, wid);
await page.waitForTimeout(200);
await page.evaluate(p => LiveSync.applyPayload(p), shop);
await page.waitForTimeout(300);
check('removing the walk-in booking sticks through a sync', !(await onVenue()));

check('no JS errors', errors.length === 0);
if (errors.length) console.log(errors.slice(0, 5));
await browser.close();
const passed = results.filter(r => r[1]).length;
console.log(`\n${passed}/${results.length} checks passed`);
process.exit(passed === results.length ? 0 : 1);
