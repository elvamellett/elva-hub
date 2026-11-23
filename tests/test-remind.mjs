// Test (v112): venue page "Fully paid" / "Still owing" filters, and payment
// reminders (one, or everyone who still owes) with the remainder invoice
// attached as a PDF - never a link.
import { chromium } from 'playwright';
const results = [];
const check = (name, ok) => { results.push([name, ok]); if (!ok) console.log('FAIL:', name); };
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell', args: ['--no-sandbox'] });
const page = await browser.newPage();
const errors = [];
page.on('pageerror', e => errors.push(String(e)));
page.on('dialog', d => d.accept());
await page.addInitScript(() => {
  try { localStorage.setItem('darcybow-server', 'https://script.google.com/macros/s/TEST/exec'); localStorage.setItem('darcybow-site-token', 't'); } catch (e) {}
  window.__posts = [];
  const real = window.fetch.bind(window);
  window.fetch = (url, opts) => {
    if (String(url).includes('script.google.com')) {
      const j = JSON.parse(opts.body);
      window.__posts.push(j);
      const result = j.fn === 'sendInvoiceEmail' ? JSON.stringify({ ok: true }) : j.fn === 'emailHealth' ? JSON.stringify({ canSend: true }) : '{}';
      return Promise.resolve(new Response(JSON.stringify({ result })));
    }
    return real(url, opts);
  };
});
await page.goto('file:///home/user/elva-hub/darcybow-dashboard.html', { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(1200);
check('version stamp is 114', (await page.content()).includes('version 114'));
const day = new Date(Date.now() + 9 * 86400000).toISOString().slice(0, 10);
const MDY = new Date(day + 'T12:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
await page.evaluate(([MDY]) => {
  const ppl = [[1, 'Sinead', 'Pigott'], [2, 'Paula', 'Paid'], [3, 'Olive', 'Owes'], [4, 'Nora', 'Nobuy']];
  LiveSync.applyPayload({
    customers: ppl.map(([id, f, l]) => ({ id, first_name: f, last_name: l, email: f.toLowerCase() + '@example.com', phone: '', created_at: '2026-09-01T10:00:00Z' })),
    orders: ppl.map(([id, f]) => ({ id: 8000 + id, name: '#80' + id, email: f.toLowerCase() + '@example.com', created_at: '2026-09-02T10:00:00Z', customer: { id },
      line_items: [{ title: 'Darcy Day Out at The Merrion Hotel Event', properties: [{ name: '_booking_by', value: 'Appointly' }, { name: 'Booking', value: 'Date: ' + MDY + ' Time: 10:00 AM - x' }] }], note_attributes: [] })),
    products: [], syncedAt: new Date().toISOString(),
  });
  const st = Invoices.settings(); st.passHash = Invoices._hash('1'); localStorage.setItem('darcybow-inv-unlock', st.passHash);
  let seq = 60;
  const mk = (cid, name, dep, paid) => Object.assign(Invoices.blank(cid), { code: 'MER1', seq: seq++,
    contact: { name, address: '', phone: '', email: name.split(' ')[0].toLowerCase() + '@example.com' },
    lines: [{ title: 'Rosa Communion Dress', qty: 1, priceCents: 65000 }], depositCents: dep, paidInFull: !!paid });
  DB.invoices = [mk('sc1', 'Sinead Pigott', 35000), mk('sc2', 'Paula Paid', 65000), mk('sc3', 'Olive Owes', 0)];
  Store.save();
}, [MDY]);
const venue = await page.evaluate(() => venueGroups().find(v => /Merrion/.test(v.venue)).venue);
await page.evaluate(v => { location.hash = '#/venue/' + encodeURIComponent(v); }, venue);
await page.waitForTimeout(500);
let t = await page.textContent('#main');
check('venue chips: Fully paid (1) and Still owing (2 · €950)', t.includes('Fully paid (1)') && t.includes('Still owing (2 · €950)'));
const names = () => page.evaluate(() => [...document.querySelectorAll('.vrow .cname')].map(x => x.textContent).sort());
await page.evaluate(() => { venueBoughtFilter = 'paid'; App.route(); });
await page.waitForTimeout(300);
check('Fully paid filter: only Paula', JSON.stringify(await names()) === '["Paula Paid"]');
await page.evaluate(() => { venueBoughtFilter = 'owing'; App.route(); });
await page.waitForTimeout(300);
check('Still owing filter: Olive + Sinead', JSON.stringify(await names()) === '["Olive Owes","Sinead Pigott"]');
t = await page.textContent('#main');
check('remind-all bar + a Remind button on each owing row', t.includes('Remind everyone who still owes') && (await page.$$('.vrow button[title^="Email a payment reminder"]')).length === 2);

// one reminder
await page.evaluate(() => { window.__posts = []; Invoices.reminderModal(Invoices.invFor('sc1').id); });
await page.waitForTimeout(300);
check('reminder window: owes €300, PDF attachment', (await page.textContent('#modalbox')).includes('€300') && (await page.textContent('#modalbox')).includes('PDF attachment'));
await page.evaluate(() => Invoices.sendEmail(false));
await page.waitForTimeout(500);
const p1 = await page.evaluate(() => window.__posts.filter(x => x.fn === 'sendInvoiceEmail').map(x => JSON.parse(x.args[1])));
check('reminder sent to Sinead with the remainder PDF attached (…R), no link', p1.length === 1 && p1[0].to === 'sinead@example.com' && /R$/.test(p1[0].filename) && /REMAINDER INVOICE/.test(p1[0].pdfHtml) && !/https?:/.test(p1[0].textBody));
check('reminder recorded on the invoice', await page.evaluate(() => !!Invoices.invFor('sc1').remindedAt));

// everyone who still owes
await page.evaluate(() => { window.__posts = []; App.route(); });
await page.waitForTimeout(300);
await page.click('text=Remind everyone who still owes');
await page.waitForTimeout(300);
check('bulk window lists the 2 who owe (€950)', (await page.textContent('#modalbox')).includes('Remind 2 customers') && (await page.textContent('#modalbox')).includes('€950'));
await page.evaluate(() => Invoices.bulkRemindSend(false));
await page.waitForTimeout(1200);
const p2 = await page.evaluate(() => window.__posts.filter(x => x.fn === 'sendInvoiceEmail').map(x => JSON.parse(x.args[1])));
check('bulk: one email each, each with HER remainder invoice', p2.length === 2 && p2.every(x => /REMAINDER INVOICE/.test(x.pdfHtml)) && new Set(p2.map(x => x.to)).size === 2
  && p2.some(x => x.to === 'olive@example.com' && x.textBody.includes('€650')) && p2.some(x => x.to === 'sinead@example.com' && x.textBody.includes('€300')));
check('bulk: Paula (paid) not reminded', !p2.some(x => x.to === 'paula@example.com'));
check('bulk: progress says 2 sent', (await page.textContent('#br-progress')).includes('2 reminders sent'));

// invoice book
await page.evaluate(() => { UI.closeModal(); invPaidFilter = 'unpaid'; location.hash = '#/invoices'; });
await page.waitForTimeout(400);
t = await page.textContent('#main');
check('invoice book: "Remind all 2 not paid" + "reminded" dates', t.includes('Remind all 2 not paid') && t.includes('reminded'));

check('no JS errors', errors.length === 0);
if (errors.length) console.log(errors.slice(0, 5));
await browser.close();
const passed = results.filter(r => r[1]).length;
console.log(`\n${passed}/${results.length} checks passed`);
process.exit(passed === results.length ? 0 : 1);
