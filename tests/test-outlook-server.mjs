// Unit test: Code.gs sends invoice emails through Outlook (Microsoft Graph)
// when the MS_* Script Properties are set, and through Gmail otherwise.
import { readFileSync } from 'fs';
import vm from 'vm';
import crypto from 'crypto';
const results = [];
const check = (name, ok) => { results.push([name, ok]); if (!ok) console.log('FAIL:', name); };
const props = { SITE_PASSWORD: 'pw', MS_TENANT_ID: 'tenant-1', MS_CLIENT_ID: 'app-1', MS_CLIENT_SECRET: 'sec', MS_SENDER: 'edelle@darcybow.ie' };
let calls = [], graphReplies = [], gmailSent = [], tokenCount = 0;
const resp = (code, body) => ({ getResponseCode: () => code, getContentText: () => (body == null ? '' : JSON.stringify(body)) });
const cache = {};
const blob = (name) => ({ _n: name, getAs() { return blob(name); }, setName(n) { this._n = n; return this; }, getName() { return this._n; }, getBytes: () => [37, 80, 68, 70] });
const ctx = {
  PropertiesService: { getScriptProperties: () => ({ getProperty: k => (k in props ? props[k] : null) }) },
  CacheService: { getScriptCache: () => ({ get: k => cache[k] || null, put: (k, v) => { cache[k] = v; }, remove: k => { delete cache[k]; } }) },
  Utilities: { sleep: () => {}, DigestAlgorithm: { SHA_256: 'sha256' },
    computeDigest: (a, s) => [...crypto.createHash('sha256').update(s).digest()],
    base64EncodeWebSafe: b => Buffer.from(b).toString('base64url'),
    base64Encode: b => Buffer.from(b).toString('base64'),
    newBlob: (data, type, name) => blob(name) },
  UrlFetchApp: { fetch: (url, opts) => {
    calls.push({ url, opts });
    if (/login\.microsoftonline\.com/.test(url)) { tokenCount++; return resp(200, { access_token: 'mstok' + tokenCount, expires_in: 3600 }); }
    if (/graph\.microsoft\.com/.test(url)) return graphReplies.shift() || resp(202, null);
    return resp(404, {});
  } },
  GmailApp: { sendEmail: (to, subj, text, opts) => { gmailSent.push({ to, subj, opts }); }, getAliases: () => [] },
  Session: { getEffectiveUser: () => ({ getEmail: () => 'owner@gmail.com' }), getActiveUser: () => ({ getEmail: () => '' }) },
  ScriptApp: { getScriptId: () => 'abc', getOAuthToken: () => 'x' },
  console,
};
vm.createContext(ctx);
vm.runInContext(readFileSync(new URL('../darcybow-Code.gs', import.meta.url), 'utf8'), ctx);
const tok = JSON.parse(ctx.checkSitePassword('pw')).token;
const payload = (extra) => JSON.stringify(Object.assign({ to: 'sinead@example.com', subject: 'Your Darcybow invoice', textBody: 'Hi',
  htmlBody: '<p>Hi</p>', pdfHtml: '<html></html>', filename: 'MER1 - Sinead Pigott - 54R', replyTo: 'edelle@darcybow.ie',
  fromAddress: 'edelle@darcybow.ie', bcc: 'edelle@darcybow.ie' }, extra || {}));

// 1. Outlook connected
let r = JSON.parse(ctx.sendInvoiceEmail(tok, payload()));
const send = calls.find(c => /sendMail$/.test(c.url));
const body = send ? JSON.parse(send.opts.payload) : {};
check('sent through Outlook, not Gmail', r.ok === true && r.via === 'outlook' && gmailSent.length === 0);
check('FROM edelle@darcybow.ie (her mailbox)', !!send && /users\/edelle%40darcybow\.ie\/sendMail$/.test(send.url) && r.from === 'edelle@darcybow.ie');
check('to the customer, saved in Sent Items', body.message.toRecipients[0].emailAddress.address === 'sinead@example.com' && body.saveToSentItems === true);
check('the PDF is attached (a real file, named …54R.pdf)', body.message.attachments.length === 1 && body.message.attachments[0].name === 'MER1 - Sinead Pigott - 54R.pdf'
  && body.message.attachments[0].contentType === 'application/pdf' && !!body.message.attachments[0].contentBytes);
check('no pointless copy to herself (it is already in Sent Items)', !body.message.bccRecipients);
check('signed in with the app credentials (client credentials)', calls.some(c => /tenant-1\/oauth2\/v2\.0\/token/.test(c.url) && c.opts.payload.grant_type === 'client_credentials'));

// 2. test send goes to her own Outlook inbox
calls = [];
r = JSON.parse(ctx.sendInvoiceEmail(tok, payload({ isTest: true })));
check('test email goes to edelle@darcybow.ie', r.ok && JSON.parse(calls.find(c => /sendMail$/.test(c.url)).opts.payload).message.toRecipients[0].emailAddress.address === 'edelle@darcybow.ie');

// 3. expired token: one retry with a fresh one
calls = []; graphReplies = [resp(401, { error: { code: 'InvalidAuthenticationToken' } }), resp(202, null)];
r = JSON.parse(ctx.sendInvoiceEmail(tok, payload()));
check('401 retried once with a fresh token, then sent', r.ok === true && calls.filter(c => /sendMail$/.test(c.url)).length === 2);

// 4. missing permission: clear instructions
calls = []; graphReplies = [resp(403, { error: { code: 'ErrorAccessDenied', message: 'Access is denied.' } })];
r = JSON.parse(ctx.sendInvoiceEmail(tok, payload()));
check('403 explains the Mail.Send permission + admin consent', /Mail\.Send/.test(r.error || '') && /admin consent/.test(r.error || ''));

// 5. health check
let h = JSON.parse(ctx.emailHealth(tok));
check('send window says: connected via Outlook as edelle@darcybow.ie', h.canSend === true && h.account === 'edelle@darcybow.ie' && /Outlook/.test(h.detail));

// 6. not configured -> Gmail as before
delete props.MS_TENANT_ID; delete props.MS_CLIENT_ID; delete props.MS_CLIENT_SECRET;
calls = []; gmailSent = [];
r = JSON.parse(ctx.sendInvoiceEmail(tok, payload()));
check('without the Outlook settings, Gmail sends exactly as before', r.ok === true && gmailSent.length === 1 && !calls.some(c => /graph|microsoftonline/.test(c.url)));

let threw = false; try { ctx.sendInvoiceEmail('forged', payload()); } catch (e) { threw = true; }
check('locked without a valid login', threw);
const passed = results.filter(x => x[1]).length;
console.log(`\n${passed}/${results.length} checks passed`);
process.exit(passed === results.length ? 0 : 1);
