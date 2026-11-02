// Regression test: Appointly reschedules / venue moves / day moves must
// reach the venue page, slot counts and the printed staff run sheet (v97).
// Replays Edelle's four real cases through the REAL sync path
// (LiveSync.applyPayload with Shopify orders + the shared booking export).
//   Mairead Sheridan  - Sunday 15:00 -> Sunday 13:00 (same venue, same day)
//   Claire Finnegan   - Merrion      -> Westbury     (venue move)
//   Kate Kennedy      - Saturday     -> Sunday       (day move)
// Every case also has a different email in Appointly than on Shopify and
// the phone in the other format (+353... vs 08...), which is what split
// people into two records before.
import { chromium } from 'playwright';

const results = [];
const check = (name, ok) => { results.push([name, ok]); if (!ok) console.log('FAIL:', name); };

const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell', args: ['--no-sandbox'] });
const page = await browser.newPage();
const errors = [];
page.on('pageerror', e => errors.push(String(e)));
await page.goto('file:///home/user/elva-hub/darcybow-dashboard.html', { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(600);

check('version stamp is 104', (await page.locator('#sidebar').textContent()).includes('version 104'));

// Upcoming weekend, a fortnight out.
const sat = (() => { const d = new Date(Date.now() + 14 * 86400000); d.setDate(d.getDate() + ((6 - d.getDay() + 7) % 7)); return d; })();
const sun = new Date(sat.getTime() + 86400000);
const iso = d => d.toISOString().slice(0, 10);
const SAT = iso(sat), SUN = iso(sun);
const mdy = d => d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }); // "Dec 12, 2026"
const human = d => d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });

const order = (id, cid, first, last, email, phone, venueTitle, when, time) => ({
  id, name: '#' + id, email, created_at: '2026-08-01T10:00:00Z',
  customer: { id: cid, first_name: first, last_name: last },
  line_items: [{ title: 'Darcy Day Out at ' + venueTitle + ' Event - ' + human(sat),
    properties: [{ name: '_booking_by', value: 'Appointly' },
      { name: 'Booking', value: 'Date: ' + mdy(when) + ' Time: ' + time + ' - ' + time }] }],
  note_attributes: [],
});
const payload = csv => ({
  customers: [
    { id: 1, first_name: 'Mairead', last_name: 'Sheridan', email: 'mairead.shop@example.com', phone: '+353868480001', created_at: '2026-08-01T10:00:00Z' },
    { id: 2, first_name: 'Claire', last_name: 'Finnegan', email: 'claire.shop@example.com', phone: '+353868480002', created_at: '2026-08-01T10:00:00Z' },
    { id: 3, first_name: 'Kate', last_name: 'Kennedy', email: 'kate.shop@example.com', phone: '+353868480003', created_at: '2026-08-01T10:00:00Z' },
  ],
  orders: [
    order(9001, 1, 'Mairead', 'Sheridan', 'mairead.shop@example.com', '', 'The Westbury', sun, '3:00 PM'),
    order(9002, 2, 'Claire', 'Finnegan', 'claire.shop@example.com', '', 'The Merrion Hotel', sat, '11:00 AM'),
    order(9003, 3, 'Kate', 'Kennedy', 'kate.shop@example.com', '', 'The Westbury', sat, '10:00 AM'),
  ],
  products: [], syncedAt: new Date().toISOString(), bookingsCsv: csv,
});
// The Appointly export: NEW times/venues, different emails, local phone
// format, and NO "created at" column (the worst case for the reschedule rule).
const qa = kid => '"Ques: What is your Daughter\'s Name?\nAns: ' + kid + '\nQues: What is the name(s) of your Daughter\'s School?  (Abbreviation, Irish and/ English name, please).\nAns: Scoil ' + kid + '\nQues: When is your Communion? (If known)\nAns: May 2027"';
const csv = [
  'Customer name,Email,Phone,Appointment date,Start time,Service,Staff,Status,Custom Questions',
  `Mairead Sheridan,mairead.booking@example.com,086 848 0001,${SUN},1:00 PM,Darcy Day Out at The Westbury,Staff 1,Confirmed,` + qa('Fiadh'),
  `Claire Finnegan,claire.booking@example.com,086 848 0002,${SAT},2:00 PM,Darcy Day Out at The Westbury,Staff 2,Confirmed,` + qa('Ava'),
  `Kate Kennedy,kate.booking@example.com,086 848 0003,${SUN},10:00 AM,Darcy Day Out at The Westbury,Staff 3,Confirmed,` + qa('Chloe'),
  `Kate Kennedy,kate.booking@example.com,086 848 0003,${SAT},10:00 AM,Darcy Day Out at The Westbury,Staff 3,Rescheduled,` + qa('Chloe'),
].join('\n');

await page.evaluate(() => {
  DB.customers = []; DB.orders = []; DB.orderItems = []; DB.appointments = []; DB.invoices = [];
  DB.exportInfo = null; DB.custMerges = []; DB.timeEdits = [];
  for (const k of ['payments', 'instalments', 'allocations', 'adjustments', 'reminderTasks', 'customerReminders', 'contactLog', 'outbox'])
    if (Array.isArray(DB[k])) DB[k] = [];
  Store.save();
});

// First the shop alone (what the dashboard knew before the export) ...
await page.evaluate(p => LiveSync.applyPayload(p), payload(''));
await page.waitForTimeout(300);
check('before the export: Mairead sits at her ORIGINAL 15:00', await page.evaluate(d =>
  DB.appointments.some(a => a.appointmentAt === d && a.time === '15:00'), SUN));

// ... then the same sync WITH the export, exactly as every device replays it.
await page.evaluate(p => LiveSync.applyPayload(p), payload(csv));
await page.waitForTimeout(400);

const state = await page.evaluate(() => DB.customers.map(c => c.name));
check('no one split into two records (3 people, 3 records)', state.length === 3);

const bk = await page.evaluate(() => DB.appointments.map(a => ({ n: (DB.customers.find(c => c.id === a.customerId) || {}).name,
  d: a.appointmentAt, t: a.time, v: a.eventHotel, s: a.source })));
const of = n => bk.filter(b => b.n === n);
check('Mairead: ONE booking, at 13:00 on Sunday', of('Mairead Sheridan').length === 1
  && of('Mairead Sheridan')[0].t === '13:00' && of('Mairead Sheridan')[0].d === SUN);
check('Claire: ONE booking, at the Westbury', of('Claire Finnegan').length === 1
  && /Westbury/.test(of('Claire Finnegan')[0].v));
check('Kate: ONE booking, on Sunday (the rescheduled Saturday row ignored)', of('Kate Kennedy').length === 1
  && of('Kate Kennedy')[0].d === SUN);

const westSun = await page.evaluate(d => slotBoard('The Westbury', d), SUN);
const westSat = await page.evaluate(d => slotBoard('The Westbury', d), SAT);
check('Westbury Sunday counts 2 booked (Mairead + Kate)', westSun.booked === 2);
check('Westbury Saturday counts 1 booked (Claire)', westSat.booked === 1);

const merrion = await page.evaluate(() => (venueGroups().find(v => /Merrion/.test(v.venue)) || { orders: [] }).orders.length);
check('Merrion no longer lists Claire as a phantom "not booked"', merrion === 0);

const sheet = await page.evaluate(d => {
  const v = venueGroups().find(x => /Westbury/.test(x.venue));
  Actions.printRunSheet(encodeURIComponent(v.venue), d);
  return new Promise(res => setTimeout(() => res(document.getElementById('runframe').srcdoc), 400));
}, SUN);
const maireadLines = (String(sheet).match(/Mairead Sheridan/g) || []).length;
check('run sheet: Mairead appears once', maireadLines === 1);
check('run sheet: shows 13:00, not the old 15:00', String(sheet).includes('13:00') && !String(sheet).includes('15:00'));
check('run sheet: Kate is on the Sunday sheet', String(sheet).includes('Kate Kennedy'));
check('run sheet: carries the export stamp', String(sheet).includes('Booking times from the'));
await page.evaluate(() => UI.closeModal());

// A booking made on Shopify AFTER the export was taken must still show.
await page.evaluate(p => {
  p.customers.push({ id: 4, first_name: 'Jean', last_name: 'Tuffy', email: 'jean@example.com', phone: '+353868480004', created_at: new Date().toISOString() });
  const o = JSON.parse(JSON.stringify(p.orders[2]));
  o.id = 9004; o.name = '#9004'; o.email = 'jean@example.com'; o.created_at = new Date(Date.now() + 60000).toISOString();
  o.customer = { id: 4, first_name: 'Jean', last_name: 'Tuffy' };
  p.orders.push(o);
  LiveSync.applyPayload(p);
}, payload(csv));
await page.waitForTimeout(300);
check('a booking made after the export survives until the next export', await page.evaluate(() =>
  DB.appointments.some(a => (DB.customers.find(c => c.id === a.customerId) || {}).name === 'Jean Tuffy')));

check('phone key: +353 and 08 formats are the same phone', await page.evaluate(() =>
  ImportService._phoneKey('+353 86 848 0001') === ImportService._phoneKey('086 848 0001')
  && ImportService._phoneKey('00353868480001') === '0868480001'
  && ImportService._phoneKey('+353 (0)86 848 0001') === '0868480001'));

// A ticket-holder whose booking no longer exists in Appointly (cancelled
// / moved event): listed separately, never counted or printed (v98).
await page.evaluate(p => {
  // As in real life: the export is dated (CreatedAt column / upload moment).
  DB.exportInfo = { at: new Date().toISOString(), byUpload: true };
  p.customers.push({ id: 5, first_name: 'Ticket', last_name: 'Only', email: 'ticket@example.com', phone: '', created_at: '2026-08-01T10:00:00Z' });
  const o = JSON.parse(JSON.stringify(p.orders[0]));
  o.id = 9005; o.name = '#9005'; o.email = 'ticket@example.com'; o.customer = { id: 5, first_name: 'Ticket', last_name: 'Only' };
  p.orders.push(o);
  LiveSync.applyPayload(p);
}, payload(csv));
await page.waitForTimeout(300);
const westName = await page.evaluate(() => venueGroups().find(x => /Westbury/.test(x.venue)).venue);
await page.evaluate(v => { location.hash = '#/venue/' + encodeURIComponent(v); App.route(); }, westName);
await page.waitForTimeout(300);
const sunChip = await page.evaluate(() => [...document.querySelectorAll('#main .chip')].map(x => x.textContent).find(x => /Sunday/.test(x)) || '');
check('day total counts booked people only (2), not the ticket-only one', /\(2\)/.test(sunChip));
const cs = await page.evaluate(d => {
  Actions.printCustomerSheets(encodeURIComponent(venueGroups().find(x => /Westbury/.test(x.venue)).venue), d);
  return new Promise(res => setTimeout(() => res(document.getElementById('csframe').srcdoc), 400));
}, SUN);
check('customer sheets: no sheet for the ticket-only customer', !String(cs).includes('Ticket Only'));
check('customer sheets: no sheet says "No booking answers"', !String(cs).includes('No booking answers on file'));
check('customer sheets: all three Appointly questions print', String(cs).includes('When is your Communion')
  && String(cs).includes('Fiadh') && String(cs).includes('Scoil Fiadh') && String(cs).includes('May 2027'));
await page.evaluate(() => UI.closeModal());

check('no JS errors', errors.length === 0);
if (errors.length) console.log(errors.slice(0, 5));
await browser.close();
const passed = results.filter(r => r[1]).length;
console.log(`\n${passed}/${results.length} checks passed`);
process.exit(passed === results.length ? 0 : 1);
