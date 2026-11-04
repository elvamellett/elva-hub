// Test (v109): "it keeps resetting to 14 customers".
//  A. The browser's quick store is full: the live data must still be kept
//     (moved to the big database) and still be there on the next open.
//  B. The live website on a brand-new laptop: never shows sample data -
//     password, then "Loading your live data", then the real customers;
//     and on the next open the customers are there straight away.
import { chromium } from 'playwright';
import http from 'node:http';
import fs from 'node:fs';
const results = [];
const check = (name, ok) => { results.push([name, ok]); if (!ok) console.log('FAIL:', name); };
const exe = '/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell';
const browser = await chromium.launch({ executablePath: exe, args: ['--no-sandbox'] });
const errors = [];

const mkShop = n => ({
  customers: Array.from({ length: n }, (_, i) => ({ id: i + 1, first_name: 'Real' + i, last_name: 'Customer', email: 'real' + i + '@example.com',
    phone: '+35386' + String(1000000 + i), note: 'x'.repeat(200), created_at: '2026-09-01T10:00:00Z' })),
  orders: Array.from({ length: n }, (_, i) => ({ id: 5000 + i, name: '#' + (5000 + i), email: 'real' + i + '@example.com', created_at: '2026-09-02T10:00:00Z',
    customer: { id: i + 1 }, line_items: [{ title: 'Darcy Day Out at The Westbury Event', properties: [] }], note_attributes: [] })),
  products: [], syncedAt: new Date().toISOString(),
});

const html = fs.readFileSync('/home/user/elva-hub/darcybow-dashboard.html');
const srv = http.createServer((req, res) => {
  if (req.url.startsWith('/version.json')) { res.writeHead(200, { 'content-type': 'application/json' }); res.end('{"version":110}'); return; }
  res.writeHead(200, { 'content-type': 'text/html' }); res.end(html);
});
await new Promise(r => srv.listen(0, '127.0.0.1', r));
const base = 'http://127.0.0.1:' + srv.address().port + '/';

// ---------- A. quick store full ----------
{
  const ctx = await browser.newContext();
  await ctx.addInitScript(() => {
    try { localStorage.setItem('darcybow-server', 'https://script.google.com/macros/s/TEST/exec'); localStorage.setItem('darcybow-site-token', 't'); } catch (e) {}
    // Simulate a full ~5MB store: anything big is refused like a real browser does.
    const real = Storage.prototype.setItem;
    Storage.prototype.setItem = function (k, v) {
      if (String(v).length > 20000) { const e = new Error('QuotaExceededError'); e.name = 'QuotaExceededError'; throw e; }
      return real.call(this, k, v);
    };
    const rf = window.fetch.bind(window);
    window.fetch = (url, opts) => String(url).includes('script.google.com')
      ? Promise.resolve(new Response(JSON.stringify({ result: JSON.parse(opts.body).fn === 'syncShopify' ? JSON.stringify(window.__nextSync || { customers: [], orders: [], products: [] }) : '{}' })))
      : rf(url, opts);
  });
  const page = await ctx.newPage();
  page.on('pageerror', e => errors.push('A: ' + e));
  await page.goto(base, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(1200);
  check('A: version stamp is 110', (await page.content()).includes('version 110'));
  const err = await page.evaluate(p => { try { LiveSync.applyPayload(p); return ''; } catch (e) { return String(e); } }, mkShop(120));
  await page.waitForTimeout(800);
  check('A: sync with a FULL quick store does not fail', err === '');
  check('A: data moved to the big database', await page.evaluate(() => localStorage.getItem('darcybow-db-where') === 'idb' && !localStorage.getItem('darcybow-db-v5')));
  await page.reload({ waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(1500);
  const after = await page.evaluate(() => ({ n: DB.customers.length, real: DB.customers.filter(c => /^Real\d+ Customer$/.test(c.name)).length }));
  check('A: reopening shows the 120 real customers, not the 14 samples', after.n === 120 && after.real === 120);
  await page.evaluate(() => { DB.customers[0].name = 'Edited Name'; Store.save(); });
  await page.waitForTimeout(400);
  await page.reload({ waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(1500);
  check('A: later changes keep saving too', await page.evaluate(() => DB.customers.some(c => c.name === 'Edited Name')));
  await page.evaluate(() => localStorage.removeItem('darcybow-db-where')); // browser lost the marker
  await page.reload({ waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(1500);
  check('A: even if the browser loses the marker, the saved copy is found', await page.evaluate(() => DB.customers.length === 120 && localStorage.getItem('darcybow-db-where') === 'idb'));
  await ctx.close();
}

// ---------- B. live website on a brand-new laptop ----------
{
  const ctx = await browser.newContext();
  let syncDelay = 1500;
  await ctx.route('https://script.google.com/**', async route => {
    const j = JSON.parse(route.request().postData() || '{}');
    let result = '{}';
    if (j.fn === 'checkSitePassword') result = JSON.stringify(j.args[0] === 'secret' ? { ok: true, token: 'tok' } : { ok: false });
    if (j.fn === 'syncShopify') { await new Promise(r => setTimeout(r, syncDelay)); result = JSON.stringify(mkShop(3)); }
    await route.fulfill({ status: 200, headers: { 'Access-Control-Allow-Origin': '*', 'content-type': 'application/json' }, body: JSON.stringify({ result }) });
  });
  const page = await ctx.newPage();
  page.on('pageerror', e => errors.push('B: ' + e));
  await page.goto(base, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(1000);
  check('B: new laptop goes straight to the password page (connected, no probing)', await page.isVisible('#gate-pw'));
  check('B: no sample customers behind it', await page.evaluate(() => DB.customers.length === 0));
  await page.fill('#gate-pw', 'secret');
  await page.click('form button');
  await page.waitForTimeout(800); // reloads, starts the sync
  check('B: "Loading your live data" while the first sync runs', (await page.textContent('#main')).includes('Loading your live data'));
  check('B: ...and still no sample customers meanwhile', await page.evaluate(() => DB.customers.length === 0));
  await page.waitForTimeout(2000);
  check('B: the real customers arrive', await page.evaluate(() => DB.customers.length === 3 && DB.customers.every(c => /^Real/.test(c.name))));
  syncDelay = 4000;
  await page.reload({ waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(700);
  check('B: next open: customers there straight away, before the sync finishes', await page.evaluate(() => LiveSync.syncing && DB.customers.length === 3));
  syncDelay = 0;
  await ctx.close();
}
srv.close();

check('no JS errors', errors.length === 0);
if (errors.length) console.log(errors.slice(0, 5));
await browser.close();
const passed = results.filter(r => r[1]).length;
console.log(`\n${passed}/${results.length} checks passed`);
process.exit(passed === results.length ? 0 : 1);
