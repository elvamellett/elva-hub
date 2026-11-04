// Test (v106): handed-on bookings - "who booked it, who has it now".
//  1. Appointly, original email + phone kept, new name  (Ann -> Pat)
//  2. Appointly, original ORDER NUMBER kept, new person (Beth -> Cara)
//  3. Dashboard "Hand on" to a new person, synced, shared, undone (Dee -> Erin)
//  4. Appointly, same slot + staff, new name AND email   (Fay -> Gina)
import { chromium } from 'playwright';
const results = [];
const check = (name, ok) => { results.push([name, ok]); if (!ok) console.log('FAIL:', name); };
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell', args: ['--no-sandbox'] });
const page = await browser.newPage();
const errors = [];
page.on('pageerror', e => errors.push(String(e)));
page.on('dialog', d => d.accept());
await page.goto('file:///home/user/elva-hub/darcybow-dashboard.html', { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(600);
check('version stamp is 110', (await page.locator('#sidebar').textContent()).includes('version 110'));

const day = new Date(Date.now() + 10 * 86400000);
const ISO = day.toISOString().slice(0, 10);
const MDY = day.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
const H = 'Appointment Time,Service,Team Member,Order,Customer Name,Customer Email,Customer Phone,Custom Questions,CreatedAt';
const q = kid => '"Ques: What is your Daughter\'s Name?\nAns: ' + kid + '"';
const r = (t, staff, order, name, email, phone, kid) => `"${MDY} ${t}",Darcy Day Out at The Test Hotel Event,${staff},${order},${name},${email},${phone},${q(kid)},"Oct 19, 2026 2:38 PM"`;
const people = [
  [1, 'Ann', 'Original', 'ann@example.com', '+353861110001', '9:00 AM'],
  [2, 'Beth', 'Booker', 'beth@example.com', '+353861110002', '10:00 AM'],
  [3, 'Dee', 'Daly', 'dee@example.com', '+353861110003', '11:00 AM'],
  [6, 'Fay', 'Flynn', 'fay@example.com', '+353861110006', '12:00 PM'],
];
const shop = csv => ({
  customers: people.map(([id, f, l, e, ph]) => ({ id, first_name: f, last_name: l, email: e, phone: ph, created_at: '2026-06-01T10:00:00Z' })),
  orders: people.map(([id, f, l, e, ph, t]) => ({ id: 7000 + id, name: '#700' + id, email: e, created_at: '2026-06-01T10:00:00Z', customer: { id },
    line_items: [{ title: 'Darcy Day Out at The Test Hotel Event', properties: [{ name: '_booking_by', value: 'Appointly' },
      { name: 'Booking', value: 'Date: ' + MDY + ' Time: ' + t + ' - x' }] }], note_attributes: [] })),
  products: [], syncedAt: new Date().toISOString(), bookingsCsv: csv,
});
const rowsA = [
  r('9:00 AM', 'Staff 1', '', 'Pat Newman', 'ann@example.com', '086 111 0001', 'Rosa'),       // 1: handed on, Ann's email + phone
  r('10:00 AM', 'Staff 2', '#7002', 'Cara Quinn', 'cara@example.com', '086 222 0000', 'Ivy'), // 2: Beth's order number
  r('11:00 AM', 'Staff 1', '#7003', 'Dee Daly', 'dee@example.com', '086 111 0003', 'Nell'),
  r('12:00 PM', 'Staff 3', '#7006', 'Fay Flynn', 'fay@example.com', '086 111 0006', 'Ruby'),
];
const exportA = [H, ...rowsA].join('\n');
const exportB = [H, rowsA[0], rowsA[1], rowsA[2],
  r('12:00 PM', 'Staff 3', '', 'Gina Hall', 'gina@example.com', '086 333 0000', 'Maya'),       // 4: same slot, new person entirely
].join('\n');

await page.evaluate(() => {
  DB.customers = []; DB.orders = []; DB.orderItems = []; DB.appointments = []; DB.invoices = []; DB.transfers = [];
  DB.exportInfo = null; DB.custMerges = []; DB.manualCusts = []; DB.manualBookings = []; DB.apptChanges = {};
  localStorage.removeItem('darcybow-bookings-book');
});
await page.evaluate(p => LiveSync.applyPayload(p), shop(exportA));
await page.waitForTimeout(300);

const state = () => page.evaluate(d => {
  const by = n => DB.customers.filter(c => c.name === n);
  const holds = (n, t) => { const c = by(n)[0]; return !!c && DB.appointments.some(a => a.customerId === c.id && a.appointmentAt === d && (!t || a.time === t)); };
  const v = venueGroups().find(x => /Test Hotel/.test(x.venue));
  const rows = v ? v.orders.map(o => (Domain.customer(o.customerId) || {}).name) : [];
  const tr = (DB.transfers || []).filter(t => !t.removed).map(t => t.from.name + '>' + t.to.name + '>' + t.via);
  return { holds: { pat: holds('Pat Newman', '09:00'), ann: holds('Ann Original'), cara: holds('Cara Quinn', '10:00'), beth: holds('Beth Booker'),
      erin: holds('Erin New', '11:00'), dee: holds('Dee Daly'), gina: holds('Gina Hall', '12:00'), fay: holds('Fay Flynn') },
    rows, tr, one: ['Ann Original', 'Pat Newman', 'Beth Booker', 'Cara Quinn'].every(n => by(n).length === 1),
    bethOrder: DB.orders.some(o => o.reference === '#7002' && (Domain.customer(o.customerId) || {}).name === 'Beth Booker'),
    gone: Object.values(DB.apptChanges || {}).flat().filter(x => x.gone && !x.hidden).map(x => x.from) };
}, ISO);

let s = await state();
check('1. Pat holds the 9:00 (not merged into Ann, though she has Ann\'s email and phone)', s.holds.pat && !s.holds.ann && s.one);
check('1. recorded: Ann Original -> Pat Newman (Appointly)', s.tr.includes('Ann Original>Pat Newman>appointly'));
check('2. Cara holds the 10:00 booked on Beth\'s order', s.holds.cara && !s.holds.beth);
check('2. Beth is not folded into Cara - she keeps her order', s.bethOrder);
check('2. recorded: Beth Booker -> Cara Quinn', s.tr.includes('Beth Booker>Cara Quinn>appointly'));
check('venue page lists the new holders, not the originals', s.rows.includes('Pat Newman') && s.rows.includes('Cara Quinn') && !s.rows.includes('Ann Original') && !s.rows.includes('Beth Booker'));

// Pages
const html = async hash => { await page.evaluate(h => { location.hash = h; }, hash); await page.waitForTimeout(300); return page.evaluate(() => document.getElementById('app') ? document.getElementById('app').innerText : document.body.innerText); };
const id = n => page.evaluate(n2 => (DB.customers.find(c => c.name === n2) || {}).id, n);
let t = await html('#/customer/' + await id('Ann Original'));
check('Ann\'s page: BOOKING HANDED ON, WAS Ann -> NOW Pat', /BOOKING HANDED ON/.test(t) && /WAS\s+Ann Original\s+→\s+NOW\s+Pat Newman/.test(t));
t = await html('#/customer/' + await id('Pat Newman'));
check('Pat\'s page: TAKEN-OVER BOOKING, WAS Ann -> NOW Pat, originally booked by Ann', /TAKEN-OVER BOOKING/.test(t) && /WAS\s+Ann Original/.test(t) && /originally booked by Ann Original/.test(t));
check('Pat\'s booking card says "was Ann Original\'s"', /was Ann Original’s/.test(t));
t = await html('#/venue/' + encodeURIComponent(await page.evaluate(() => venueGroups().find(x => /Test Hotel/.test(x.venue)).venue)));
check('venue page: "Handed-on bookings (2)" list + row badge', /Handed-on bookings \(2\)/.test(t) && /was Ann Original’s booking/.test(t));
const sheets = await page.evaluate(async d => {
  const v = venueGroups().find(x => /Test Hotel/.test(x.venue));
  Actions.printRunSheet(encodeURIComponent(v.venue), d);
  await new Promise(res => setTimeout(res, 400));
  const run = document.getElementById('runframe').srcdoc;
  UI.closeModal();
  const cs = Actions._sheetHtml([Actions._customerRow(DB.customers.find(c => c.name === 'Pat Newman'))], 'x');
  return { run, cs };
}, ISO);
check('run sheet: Pat Newman marked "was Ann Original\'s booking"', /Pat Newman<div[^>]*>⇄ was Ann Original’s booking/.test(sheets.run) || /Pat Newman<div[^>]*>&#8644; was/.test(sheets.run) || (sheets.run.includes('Pat Newman') && sheets.run.includes('was Ann Original')));
check('customer sheet: HANDED-ON BOOKING banner names the original', /HANDED-ON BOOKING — originally booked by Ann Original/.test(sheets.cs));

// 3. dashboard hand-on
await page.evaluate(d => {
  const c = DB.customers.find(x => x.name === 'Dee Daly');
  const a = DB.appointments.find(x => x.customerId === c.id && x.appointmentAt === d && x.time === '11:00');
  Actions.transferBooking(a.id);
}, ISO);
await page.waitForTimeout(150);
await page.fill('#tr-who', 'Erin New');
await page.fill('#tr-phone', '087 444 0000');
await page.evaluate(() => Actions._saveTransfer());
await page.waitForTimeout(300);
s = await state();
check('3. dashboard hand-on: Erin holds the 11:00, Dee doesn\'t', s.holds.erin && !s.holds.dee && s.tr.includes('Dee Daly>Erin New>dashboard'));
await page.evaluate(p => LiveSync.applyPayload(p), shop(exportA));
await page.waitForTimeout(300);
s = await state();
check('3. ...still Erin\'s after a sync replaying the export', s.holds.erin && !s.holds.dee && !s.rows.includes('Dee Daly') && s.rows.includes('Erin New'));
const sj = await page.evaluate(() => Staff.payload());
await page.evaluate(([p, j]) => { // another device
  DB.transfers = []; DB.manualCusts = []; DB.customers = DB.customers.filter(c => c.name !== 'Erin New');
  Staff.merge(j); LiveSync.applyPayload(p);
}, [shop(exportA), sj]);
await page.waitForTimeout(300);
s = await state();
check('3. another device gets Erin + the hand-on', s.holds.erin && !s.holds.dee);

// 4. same slot, same staff, completely new person in a newer export
await page.evaluate(p => LiveSync.applyPayload(p), shop(exportB));
await page.waitForTimeout(300);
s = await state();
check('4. Gina holds Fay\'s 12:00 slot', s.holds.gina && !s.holds.fay);
check('4. recorded as a likely hand-on: Fay Flynn -> Gina Hall', s.tr.includes('Fay Flynn>Gina Hall>slot'));
check('no "booking cancelled" notes for handed-on bookings', s.gone.length === 0);
t = await html('#/customer/' + await id('Fay Flynn'));
check('Fay\'s page: WAS Fay -> NOW Gina, "looks like it was handed on in Appointly"', /WAS\s+Fay Flynn\s+→\s+NOW\s+Gina Hall/.test(t) && /looks like it was handed on/.test(t));

// Undo the dashboard one
await page.evaluate(() => { const tr = DB.transfers.find(x => x.via === 'dashboard'); Actions.undoTransfer(encodeURIComponent(tr.id)); });
await page.waitForTimeout(200);
await page.evaluate(p => LiveSync.applyPayload(p), shop(exportB));
await page.waitForTimeout(300);
s = await state();
check('undo: the 11:00 is Dee\'s again, and stays that way after a sync', s.holds.dee && !s.holds.erin && !s.tr.some(x => /Erin/.test(x)));

check('after every sync: originals and new holders stay separate people, Beth keeps her order', s.one && s.bethOrder && s.holds.pat && s.holds.cara);
check('no JS errors', errors.length === 0);
if (errors.length) console.log(errors.slice(0, 5));
await browser.close();
const passed = results.filter(r2 => r2[1]).length;
console.log(`\n${passed}/${results.length} checks passed`);
process.exit(passed === results.length ? 0 : 1);
