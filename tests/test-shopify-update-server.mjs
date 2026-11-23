// Unit test: Code.gs updateShopifyCustomer with Shopify simulated.
import { readFileSync } from 'fs';
import vm from 'vm';
import crypto from 'crypto';
const results = [];
const check = (name, ok) => { results.push([name, ok]); if (!ok) console.log('FAIL:', name); };
const props = { SITE_PASSWORD: 'pw', SHOPIFY_STORE: 'darcybow.myshopify.com', SHOPIFY_CLIENT_ID: 'id', SHOPIFY_CLIENT_SECRET: 'sec' };
let replies = [], calls = [];
const resp = (code, body) => ({ getResponseCode: () => code, getContentText: () => JSON.stringify(body) });
const cache = {};
const ctx = {
  PropertiesService: { getScriptProperties: () => ({ getProperty: k => (k in props ? props[k] : null) }) },
  CacheService: { getScriptCache: () => ({ get: k => cache[k] || null, put: (k, v) => { cache[k] = v; }, remove: k => { delete cache[k]; } }) },
  Utilities: { sleep: () => {}, DigestAlgorithm: { SHA_256: 'sha256' },
    computeDigest: (a, s) => [...crypto.createHash('sha256').update(s).digest()],
    base64EncodeWebSafe: b => Buffer.from(b).toString('base64url') },
  UrlFetchApp: { fetch: (url, opts) => {
    if (/access_token/.test(url)) return resp(200, { access_token: 'tok' + (calls.length), expires_in: 86400 });
    calls.push({ url, opts }); return replies.shift();
  } },
  console,
};
vm.createContext(ctx);
vm.runInContext(readFileSync(new URL('../darcybow-Code.gs', import.meta.url), 'utf8'), ctx);
const tok = JSON.parse(ctx.checkSitePassword('pw')).token;

replies = [resp(200, { customer: {} })];
let r = JSON.parse(ctx.updateShopifyCustomer(tok, JSON.stringify({ id: 'sc123', email: 'new@x.ie', phone: '086 123 4567', note: 'VIP', first_name: 'Jo', last_name: 'Shannon' })));
const sent = JSON.parse(calls[0].opts.payload).customer;
check('success reported', r.ok === true);
check('PUT to the right customer', calls[0].opts.method === 'put' && /customers\/123\.json$/.test(calls[0].url));
check('Irish phone sent in international form', sent.phone === '+353861234567');
check('email, note and name sent', sent.email === 'new@x.ie' && sent.note === 'VIP' && sent.first_name === 'Jo' && sent.last_name === 'Shannon');

calls = []; replies = [resp(403, { errors: 'forbidden' }), resp(403, { errors: 'forbidden' })];
r = JSON.parse(ctx.updateShopifyCustomer(tok, JSON.stringify({ id: 'sc123', note: 'x' })));
check('403 retried once with a fresh token', calls.length === 2);
check('403 explains the write_customers permission', /write_customers/.test(r.error || ''));

calls = []; replies = [resp(422, { errors: { email: ['has already been taken'] } })];
r = JSON.parse(ctx.updateShopifyCustomer(tok, JSON.stringify({ id: 'sc123', email: 'taken@x.ie' })));
check('Shopify validation message passed back readably', r.error === 'email has already been taken');

calls = [];
r = JSON.parse(ctx.updateShopifyCustomer(tok, JSON.stringify({ id: 'a1b2-uuid', note: 'x' })));
check('Appointly-only customer: nothing sent, clear message', calls.length === 0 && /only exists in Appointly/.test(r.error || ''));

let threw = false; try { ctx.updateShopifyCustomer('forged', '{}'); } catch (e) { threw = true; }
check('locked without a valid login', threw);
check('phone formats', ctx.shopifyPhone_('+353 86 123') === '+35386123' && ctx.shopifyPhone_('00353861') === '+353861' && ctx.shopifyPhone_('') === null);
const passed = results.filter(x => x[1]).length;
console.log(`\n${passed}/${results.length} checks passed`);
process.exit(passed === results.length ? 0 : 1);
