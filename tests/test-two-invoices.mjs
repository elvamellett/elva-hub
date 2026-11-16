// Test (v111): two invoices per sale - Invoice 1 and the Remainder invoice -
// with a "Fully paid" / "EUR300 remaining" tag bubble everywhere.
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
      const result = j.fn === 'sendInvoiceEmail' ? JSON.stringify({ ok: true, sentTo: 'x' })
        : j.fn === 'emailHealth' ? JSON.stringify({ canSend: true, account: 'edelle@darcybow.ie' }) : '{}';
      return Promise.resolve(new Response(JSON.stringify({ result })));
    }
    return real(url, opts);
  };
});
await page.goto('file:///home/user/elva-hub/darcybow-dashboard.html', { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(1200);
check('version stamp is 111', (await page.content()).includes('version 111'));

await page.evaluate(() => {
  LiveSync.applyPayload({
    customers: [{ id: 7, first_name: 'Jean', last_name: "O'Reilly", email: 'jean@example.com', phone: '+353861234567', created_at: '2026-09-01T10:00:00Z' }],
    orders: [{ id: 9007, name: '#9007', email: 'jean@example.com', created_at: '2026-09-02T10:00:00Z', customer: { id: 7 },
      line_items: [{ title: 'Darcy Day Out at The Merrion Hotel Event', properties: [] }], note_attributes: [] }],
    products: [], syncedAt: new Date().toISOString(),
  });
  const st = Invoices.settings();
  st.passHash = Invoices._hash('1234');
  localStorage.setItem('darcybow-inv-unlock', st.passHash);
  const inv = Invoices.blank('sc7');
  Object.assign(inv, { code: 'MER1', seq: 54, issueDate: '2026-11-01',
    contact: { name: "Jean/Thomas O'Reilly", address: '1 Main St', phone: '0861234567', email: 'jean@example.com' },
    lines: [{ title: 'Rosa Communion Dress', colour: 'Ivory', size: 'Age 8', qty: 1, priceCents: 65000 }],
    depositCents: 35000, depositMethod: 'SumUp', depositDate: '2026-11-01' });
  DB.invoices = [inv];
  Store.save();
});

const tagText = () => page.evaluate(() => { const d = document.createElement('div'); d.innerHTML = Invoices.tag(Invoices.invFor('sc7')); return d.textContent; });
check('tag bubble: "€300 remaining" after a €350 deposit on €650', (await tagText()) === '€300 remaining');

const doc1 = await page.evaluate(() => Invoices.docHtml(Invoices.invFor('sc7'), false, ''));
check('Invoice 1: title INVOICE, bubble "€300 REMAINING", "remainder €300"', /class="invttl">INVOICE</.test(doc1) && doc1.includes('€300 REMAINING') && doc1.includes('remainder €300'));
const doc2 = await page.evaluate(() => Invoices.docHtml(Invoices.invFor('sc7'), false, 'balance'));
check('Remainder invoice: own title + number ending R + link to the original', /REMAINDER INVOICE/.test(doc2) && doc2.includes("MER1 - Jean/Thomas O&#39;Reilly - 54R") && /Original invoice: MER1/.test(doc2));
check('Remainder invoice: total, deposit, and REMAINING TO PAY €300', doc2.includes('Invoice total €650') && doc2.includes('Deposit paid €350') && doc2.includes('REMAINING TO PAY €300'));
check('Remainder PDF file name: safe and ends in R', await page.evaluate(() => Invoices.pdfName(Invoices.invFor('sc7'), 'balance')) === "MER1 - Jean & Thomas O'Reilly - 54R");

// customer page
await page.evaluate(() => { location.hash = '#/customer/sc7'; });
await page.waitForTimeout(400);
const cp = await page.textContent('#main');
check('customer page: tag + Invoice 1 / Remainder invoice / Send remainder buttons', cp.includes('€300 remaining') && cp.includes('Invoice 1') && cp.includes('Remainder invoice') && cp.includes('Send remainder'));

// preview the remainder: number + date fixed from now on
await page.evaluate(() => Invoices.previewFor('sc7', 'balance'));
await page.waitForTimeout(300);
check('previewing the remainder invoice fixes its date', await page.evaluate(() => !!(Invoices.invFor('sc7').balance && Invoices.invFor('sc7').balance.issueDate)));
check('preview window offers both invoices + email', (await page.textContent('#modalbox')).includes('Show invoice 1') && (await page.textContent('#modalbox')).includes('Email this one'));
await page.evaluate(() => UI.closeModal());

// send the remainder invoice
await page.evaluate(() => { window.__posts = []; Invoices.sendModal('balance', 'sc7'); });
await page.waitForTimeout(300);
check('send window: remainder subject + €300 still to pay', (await page.inputValue('#em-subject')).includes('remainder invoice') && (await page.textContent('#modalbox')).includes('€300 still to pay'));
await page.evaluate(() => Invoices.sendEmail(false));
await page.waitForTimeout(600);
const sent = await page.evaluate(() => { const p = window.__posts.find(x => x.fn === 'sendInvoiceEmail'); return p ? JSON.parse(p.args[1]) : null; });
check('emailed with the REMAINDER PDF attached (…54R)', !!sent && sent.filename.endsWith('54R') && /REMAINDER INVOICE/.test(sent.pdfHtml) && sent.textBody.includes('€300'));
check('recorded as "Remainder sent"; Invoice 1 untouched', await page.evaluate(() => { const i = Invoices.invFor('sc7'); return !!i.balance.sentAt && !i.sentAt; }));

// the editor must not undo things done elsewhere
await page.evaluate(() => { location.hash = '#/invoice/sc7'; });
await page.waitForTimeout(400);
await page.evaluate(() => Invoices.markPaid('sc7', true)); // e.g. ticked on the invoice book while the editor is open
await page.waitForTimeout(200);
await page.evaluate(() => Invoices.save());
await page.waitForTimeout(300);
check('Save in an open editor keeps "paid in full" and "remainder sent"', await page.evaluate(() => { const i = Invoices.invFor('sc7'); return i.paidInFull && !!i.balance.sentAt; }));

check('tag bubble: "✓ Fully paid"', (await tagText()) === '✓ Fully paid');
const doc3 = await page.evaluate(() => Invoices.docHtml(Invoices.invFor('sc7'), false, 'balance'));
check('paid remainder invoice: "Balance paid €300" + PAID IN FULL + FULLY PAID bubble', doc3.includes('Balance paid €300') && doc3.includes('PAID IN FULL') && doc3.includes('FULLY PAID'));

// invoice book
await page.evaluate(() => { location.hash = '#/invoices'; });
await page.waitForTimeout(400);
const book = await page.textContent('#main');
check('invoice book: both numbers (MER1-54 and MER1-54R) + tag', book.includes('MER1-54') && book.includes('MER1-54R') && book.includes('✓ Fully paid'));
await page.evaluate(() => Invoices.unmarkPaid(Invoices.invFor('sc7').id));
await page.waitForTimeout(300);
check('unpaid row: "€300 remaining" + "Resend remainder" button', (await page.textContent('#main')).includes('€300 remaining') && (await page.textContent('#main')).includes('Resend remainder'));

// customer list tag
await page.evaluate(() => { customerQuery = ''; location.hash = '#/customers'; });
await page.waitForTimeout(400);
check('customer list shows the tag bubble', (await page.textContent('#custresults')).includes('€300 remaining'));

check('no JS errors', errors.length === 0);
if (errors.length) console.log(errors.slice(0, 5));
await browser.close();
const passed = results.filter(r => r[1]).length;
console.log(`\n${passed}/${results.length} checks passed`);
process.exit(passed === results.length ? 0 : 1);
