// Test (v105): dashboard edits made to PAST bookings live alongside
// upcoming-only Appointly exports. Every edit is checked after:
//   A. an upcoming-only upload on the same device (booking book present),
//   B. an upcoming-only upload on a device WITHOUT the booking book,
//   C. a brand-new device that only replays the shared copy from B.
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
      const result = j.fn === 'updateShopifyCustomer' ? JSON.stringify({ ok: true }) : '{}';
      return Promise.resolve(new Response(JSON.stringify({ result })));
    }
    return real(url, opts);
  };
});
await page.goto('file:///home/user/elva-hub/darcybow-dashboard.html', { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(1500);
check('version stamp is 110', (await page.locator('#sidebar').textContent()).includes('version 110'));

const iso = d => d.toISOString().slice(0, 10);
const PAST = iso(new Date(Date.now() - 12 * 86400000));
const FUT = iso(new Date(Date.now() + 10 * 86400000));
const mdy = d => new Date(d + 'T12:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
// Real-export shape: date+time in one cell, one column per question.
const H = 'Customer Name,Email,Phone,Appointment Time,Service,Staff,Status,What is your Daughter\'s Name?,What is the name of your Daughter\'s School?,When is your Communion? (If known)';
const row = (n, e, ph, d, t, venue, staff, kid, school) => `${n},${e},${ph},"${mdy(d)} ${t}",Darcy Day Out at ${venue} Event,${staff},Confirmed,${kid},${school},May 2027`;
const exportA = [H,
  row('Aoife Byrne', 'aoife@example.com', '086 100 0001', PAST, '11:00 AM', 'The Westbury', 'Staff 1', 'Grace', 'Scoil Mhuire'),
  row('Cara Doyle', 'cara.old@example.com', '086 100 0003', PAST, '2:00 PM', 'Kildare Village', 'Staff 2', 'Ella', 'St Brigids'),
  row('Bea Nolan', 'bea@example.com', '086 100 0002', FUT, '2:00 PM', 'The Westbury', 'Staff 2', 'Lily', 'St Annes'),
].join('\n');
const exportB = [H, row('Bea Nolan', 'bea@example.com', '086 100 0002', FUT, '3:00 PM', 'The Westbury', 'Staff 2', 'Lily', 'St Annes')].join('\n');
const shop = { customers: [{ id: 2, first_name: 'Bea', last_name: 'Nolan', email: 'bea@example.com', phone: '+353861000002', created_at: '2026-08-01T10:00:00Z' }],
  orders: [], products: [], syncedAt: new Date().toISOString() };
const upload = csv => page.evaluate(t => {
  const parsed = parseCsv(t);
  ImportService.state.appointly = { name: 'bookings.csv', raw: t, headers: parsed.headers, records: parsed.records };
  ImportService.mergeAppointly();
}, csv);

await page.evaluate(p => {
  DB.customers = []; DB.orders = []; DB.orderItems = []; DB.appointments = []; DB.invoices = [];
  DB.exportInfo = null; DB.custEdits = {}; DB.schoolEdits = {}; DB.addrEdits = {}; DB.timeEdits = [];
  DB.manualCusts = []; DB.manualBookings = []; DB.custNotes = {};
  localStorage.removeItem('darcybow-bookings-book');
  LiveSync.applyPayload(p);
}, shop);
await upload(exportA);
await page.waitForTimeout(300);
check('setup: Aoife and Cara have their past bookings', await page.evaluate(d =>
  ['Aoife Byrne', 'Cara Doyle'].every(n => { const c = DB.customers.find(x => x.name === n); return c && DB.appointments.some(a => a.customerId === c.id && a.appointmentAt === d); }), PAST));

// ---- dashboard edits on the PAST bookings ----
await page.evaluate(([past]) => {
  const A = DB.customers.find(x => x.name === 'Aoife Byrne');
  const C = DB.customers.find(x => x.name === 'Cara Doyle');
  Actions._applyCustomerChanges(A, { name: 'Aoife Byrne-Kelly', phone: '087 999 0001', note: 'Bought the Rosa dress' }, false);
  Actions._applyCustomerChanges(A, { daughterName: 'Grace Anne', answers: { child: 'Grace Anne', communion: '9 May 2027' } }, false);
  Schools.setFor(A.id, 'Scoil Mhuire Gan Smal');
  DB.addrEdits = DB.addrEdits || {};
  DB.addrEdits[custEmail(A)] = { email: custEmail(A), phone: ImportService._digits(A.phone), text: '1 Main St, Naas', at: new Date().toISOString() };
  applyAddrEdits();
  // a time change made back when the booking was still upcoming
  const ap = DB.appointments.find(a => a.customerId === A.id && a.appointmentAt === past);
  DB.timeEdits.push({ id: 'te1', email: custEmail(A), phone: ImportService._digits(A.phone), date: past, from: ap.time, to: '12:30', bookedAt: ap.bookedAt, at: new Date().toISOString() });
  applyTimeEdits();
  DB.custNotes[CustNotes.key(A)] = { text: 'Lovely family', updatedAt: new Date().toISOString() };
  DB.invoices.push({ id: 'inv1', customerId: A.id, code: 'X', seq: 1, contact: { name: A.name }, lines: [] });
  // Cara's email corrected on the dashboard
  Actions._applyCustomerChanges(C, { email: 'cara.new@example.com' }, false);
  // a past walk-in booked by hand
  const W = { id: 'mw1', manual: true, name: 'Wendy Walker', daughterName: 'Mia', email: '', phone: '', address: '', notes: '', createdAt: new Date().toISOString() };
  DB.customers.push(W); DB.manualCusts.push(W);
  DB.manualBookings.push({ id: 'b1', custId: 'mw1', email: '', phone: '', name: 'Wendy Walker', eventHotel: 'Darcy Day Out — The Westbury', date: past, time: '15:00', staff: '', at: new Date().toISOString() });
  applyManualBookings();
  Store.save();
}, [PAST]);

const verify = async label => {
  const r = await page.evaluate(([past]) => {
    const A = DB.customers.find(x => /Aoife/.test(x.name));
    const C = DB.customers.find(x => /Cara/.test(x.name));
    const W = DB.customers.find(x => x.id === 'mw1');
    const apA = A && DB.appointments.find(a => a.customerId === A.id && a.appointmentAt === past);
    const apC = C && DB.appointments.find(a => a.customerId === C.id && a.appointmentAt === past);
    const ans = A ? custAnswers(A) : {};
    return {
      aoifeOnce: DB.customers.filter(x => /Aoife/.test(x.name)).length === 1,
      caraOnce: DB.customers.filter(x => /Cara/.test(x.name)).length === 1,
      booking: !!apA && /Westbury/.test(apA.eventHotel), time: apA && apA.time,
      name: A && A.name, phone: A && A.phone, notes: A && A.notes, addr: A && A.address,
      ans, school: A && Schools.of(A.id), staffNote: A && CustNotes.get(A),
      invoice: !!A && DB.invoices.some(i => i.id === 'inv1' && i.customerId === A.id),
      cara: !!apC && C.email === 'cara.new@example.com' && /Kildare/.test(apC.eventHotel),
      walkin: !!W && DB.appointments.some(a => a.customerId === 'mw1' && a.appointmentAt === past && a.time === '15:00'),
      bea: DB.appointments.some(a => a.customerId === 'sc2' && a.time === '15:00') && !DB.appointments.some(a => a.customerId === 'sc2' && a.time === '14:00'),
      notes2: Object.keys(DB.apptChanges || {}).filter(k => (DB.apptChanges[k] || []).some(x => x.gone)).length,
    };
  }, [PAST]);
  check(label + ': past booking kept, one record each', r.booking && r.aoifeOnce && r.caraOnce);
  check(label + ': name, phone, notes edits kept', r.name === 'Aoife Byrne-Kelly' && r.phone === '087 999 0001' && r.notes === 'Bought the Rosa dress');
  check(label + ': edited answers kept (child, communion, school)', r.ans.child === 'Grace Anne' && r.ans.communion === '9 May 2027' && r.school === 'Scoil Mhuire Gan Smal');
  check(label + ': address edit kept', r.addr === '1 Main St, Naas');
  check(label + ': time change on the past booking kept (12:30)', r.time === '12:30');
  check(label + ': staff note + invoice still attached', r.staffNote === 'Lovely family' && r.invoice);
  check(label + ': Cara (email changed on dashboard) keeps her past booking', r.cara);
  check(label + ': past walk-in booking kept', r.walkin);
  check(label + ': upcoming booking follows the new export', r.bea);
  check(label + ': no false "cancelled" notes', r.notes2 === 0);
};

// A. same device, booking book present
await upload(exportB);
await page.waitForTimeout(300);
await verify('A same device');

// B. a device without the booking book (never synced since the update)
await page.evaluate(() => { localStorage.removeItem('darcybow-bookings-book'); window.__posts = []; });
await upload(exportB);
await page.waitForTimeout(300);
await verify('B no book');
const shared = await page.evaluate(() => { const s = window.__posts.filter(x => x.fn === 'saveBookingsCsv').pop(); return s ? s.args[1] : ''; });
check('B: shared copy was rebuilt with the past bookings', /Aoife/.test(shared) && /Cara/.test(shared) && /Bea/.test(shared));

// C. brand-new device: only the shop + shared copy + staff edits
const staffJson = await page.evaluate(() => Staff.payload());
const extra = await page.evaluate(() => ({ schoolEdits: DB.schoolEdits, custNotes: DB.custNotes, invoices: DB.invoices, timeEdits: DB.timeEdits }));
await page.evaluate(([p, csv, sj, ex]) => {
  DB.customers = []; DB.orders = []; DB.orderItems = []; DB.appointments = []; DB.invoices = ex.invoices;
  DB.custEdits = {}; DB.addrEdits = {}; DB.timeEdits = []; DB.manualCusts = []; DB.manualBookings = []; DB.apptChanges = {};
  DB.schoolEdits = ex.schoolEdits; DB.custNotes = ex.custNotes;
  localStorage.removeItem('darcybow-bookings-book');
  Staff.merge(sj);
  LiveSync.applyPayload(Object.assign({}, p, { bookingsCsv: csv }));
}, [shop, shared, staffJson, extra]);
await page.waitForTimeout(400);
await verify('C new device');
// ...and an upcoming-only upload made on that new device
await upload(exportB);
await page.waitForTimeout(300);
await verify('C then uploads');

// Address typed on a SHOPIFY customer survives repeated syncs that carry
// the booking export (it used to be retired by mistake on the 2nd pass).
const shopAddr = Object.assign({}, shop, { bookingsCsv: shared, customers: [Object.assign({}, shop.customers[0],
  { default_address: { address1: '5 Old Road', city: 'Bray' } })] });
await page.evaluate(p => {
  LiveSync.applyPayload(p);
  const B = Domain.customer('sc2');
  DB.addrEdits[custEmail(B)] = { email: custEmail(B), phone: ImportService._digits(B.phone), text: '9 New Lane, Dalkey', at: new Date().toISOString() };
  applyAddrEdits(); Store.save();
  LiveSync.applyPayload(p); LiveSync.applyPayload(p);
}, shopAddr);
await page.waitForTimeout(300);
check('Shopify customer: typed address survives repeated syncs and stays shared', await page.evaluate(() => {
  const B = Domain.customer('sc2');
  return B.address === '9 New Lane, Dalkey' && !!JSON.parse(Staff.payload()).addrEdits[custEmail(B)];
}));

check('no JS errors', errors.length === 0);
if (errors.length) console.log(errors.slice(0, 5));
await browser.close();
const passed = results.filter(r => r[1]).length;
console.log(`\n${passed}/${results.length} checks passed`);
process.exit(passed === results.length ? 0 : 1);
