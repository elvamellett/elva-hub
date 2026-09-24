/**
 * Darcybow live dashboard — Google Apps Script backend.
 *
 * This is the tiny "server" that makes the dashboard live: it serves the
 * dashboard page and calls the Shopify Admin API on Google's servers, so
 * the API token never reaches the browser.
 *
 * SETUP (once):
 *  1. In this Apps Script project, add an HTML file named "index" and
 *     paste the entire darcybow-dashboard.html file into it.
 *  2. ⚙ Project Settings → Script properties → add:
 *       SHOPIFY_STORE      = darcybow.myshopify.com  (your .myshopify.com domain)
 *     plus EITHER (from the Dev Dashboard app's Settings → Credentials):
 *       SHOPIFY_CLIENT_ID     = d7d8e8c2...
 *       SHOPIFY_CLIENT_SECRET = (click the eye icon to reveal, then copy)
 *     OR, for a legacy custom app:
 *       SHOPIFY_TOKEN      = shpat_...  (Admin API token with
 *                                        read_customers + read_orders)
 *  3. Deploy → New deployment → Web app →
 *       Execute as: Me · Who has access: Only myself → Deploy.
 *     The web app link is the live dashboard — bookmark it.
 *
 * Appointly saves each booking (date, time and the question answers) onto
 * the Shopify order as note attributes, so syncing orders brings the
 * booking answers along — no separate Appointly connection needed.
 */

/* The dashboard page is served from Google Drive when a file named like
 * DARCYBOW-VERSION-58.html sits there: updates are a drag-and-drop into
 * drive.google.com — no more pasting a 300KB file into this editor (big
 * pastes were getting corrupted mid-file on the way in). The HIGHEST
 * version number wins, so just drop the new file in; old ones can stay.
 * If Drive isn't authorised (or holds no such file), the copy pasted into
 * index.html serves as before. */
function doGet() {
  var best = null, bestN = -1;
  try {
    var files = DriveApp.searchFiles("title contains 'DARCYBOW-VERSION-'");
    while (files.hasNext()) {
      var f = files.next();
      if (f.isTrashed()) continue;
      var m = String(f.getName()).match(/^DARCYBOW-VERSION-(\d+)\.html$/i);
      if (m && parseInt(m[1], 10) > bestN) { bestN = parseInt(m[1], 10); best = f; }
    }
  } catch (eDrive) { /* Drive not authorised yet — the pasted copy serves */ }
  var out = null;
  try {
    if (best) out = HtmlService.createHtmlOutput(wrapDashboard_(best.getBlob().getDataAsString('UTF-8')));
  } catch (eRead) { out = null; }
  if (!out) out = HtmlService.createHtmlOutputFromFile('index');
  return out
    .setTitle('Darcybow — Customers & Events')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

/** The dashboard file goes to the browser as base64 (plain letters/digits
 * only) and a tiny loader unpacks it there. Google's HTML compiler mangled
 * a token in the raw file once it grew large — base64 gives it nothing
 * it can touch, no matter what future versions of the file contain. */
function wrapDashboard_(raw) {
  var b64 = Utilities.base64Encode(raw, Utilities.Charset.UTF_8);
  var parts = [];
  for (var i = 0; i < b64.length; i += 4000) parts.push('"' + b64.slice(i, i + 4000) + '"');
  return '<!DOCTYPE html><html><head><meta charset="utf-8"></head><body>' +
    '<div id="df-boot" style="font:15px sans-serif;color:#666;padding:24px">Loading the dashboard…</div>' +
    '<script id="df-loader">\n' +
    'var DF_B64 =\n' + parts.join(' +\n') + ';\n' +
    '(function () {\n' +
    '  try {\n' +
    '    var doc = new DOMParser().parseFromString(atob(DF_B64), "text/html");\n' +
    '    DF_B64 = null;\n' +
    '    if (doc.title) document.title = doc.title;\n' +
    '    var hn = doc.head.querySelectorAll("style,link,meta");\n' +
    '    for (var i = 0; i < hn.length; i++) document.head.appendChild(document.importNode(hn[i], true));\n' +
    '    var boot = document.getElementById("df-boot");\n' +
    '    var kids = Array.prototype.slice.call(doc.body.childNodes);\n' +
    '    for (var j = 0; j < kids.length; j++) document.body.appendChild(document.importNode(kids[j], true));\n' +
    '    if (boot && boot.parentNode) boot.parentNode.removeChild(boot);\n' +
    '    var ss = Array.prototype.slice.call(document.body.querySelectorAll("script"));\n' +
    '    for (var k = 0; k < ss.length; k++) {\n' +
    '      if (ss[k].id === "df-loader") continue;\n' +
    '      var s = document.createElement("script");\n' +
    '      s.textContent = ss[k].textContent;\n' +
    '      ss[k].parentNode.replaceChild(s, ss[k]);\n' +
    '    }\n' +
    '  } catch (e) {\n' +
    '    document.body.innerHTML = \'<div style="background:#b3261e;color:#fff;padding:14px 18px;font:14px/1.6 sans-serif">' +
    '<b>The dashboard could not unpack.</b> \' + String(e && e.message || e).replace(/</g, "&lt;") + \' \u2014 screenshot this and send it to Claude.</div>\';\n' +
    '  }\n' +
    '})();\n' +
    '</script></body></html>';
}

/* ================== DASHBOARD PASSWORD — CHANGE THIS ==================
 * Everyone opening the dashboard link must type this once per browser.
 * Change the text between the quotes, save (⌘S), then deploy a new
 * version — every browser is asked again after a password change.    */
var SITE_PASSWORD = 'darcy2026';
/* ====================================================================== */

// A browser that knows the password holds this token; every data call
// verifies it, so the customer data itself is locked, not just the page.
function siteToken_() {
  var d = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, 'darcybow-gate|' + SITE_PASSWORD);
  return Utilities.base64EncodeWebSafe(d);
}
function checkSitePassword(pw) {
  Utilities.sleep(400); // slows down password guessing
  if (String(pw || '').trim() === SITE_PASSWORD) return JSON.stringify({ ok: true, token: siteToken_() });
  return JSON.stringify({ ok: false });
}
function gate_(token) {
  if (String(token || '') !== siteToken_()) {
    throw new Error('Locked — refresh the page and enter the dashboard password.');
  }
}

/**
 * Called from the page via google.script.run. Returns a JSON string:
 * { customers: [...], orders: [...], bookingsCsv, syncedAt } or { error }.
 * bookingsCsv is the shared Appointly export (see saveBookingsCsv), so every
 * browser that opens the dashboard gets the imported bookings — not just the
 * browser that did the import.
 */
function syncShopify(siteTok) {
  try {
    gate_(siteTok);
    var props = PropertiesService.getScriptProperties();
    var store = (props.getProperty('SHOPIFY_STORE') || '').trim().replace(/^https?:\/\//, '').replace(/\/.*$/, '');
    if (!store) {
      return JSON.stringify({ error: 'Not configured yet — add SHOPIFY_STORE (your .myshopify.com domain) in ⚙ Project Settings → Script properties, then sync again.' });
    }
    var token = getAccessToken_(store);
    // Without the read_all_orders permission Shopify only hands an app the
    // LAST 60 DAYS of orders — older orders (and the delivery addresses on
    // them) silently never arrive. Detect that and tell the dashboard.
    var scopeWarning = '';
    try {
      var scResp = UrlFetchApp.fetch('https://' + store + '/admin/oauth/access_scopes.json',
        { headers: { 'X-Shopify-Access-Token': token }, muteHttpExceptions: true });
      if (scResp.getResponseCode() === 200) {
        var handles = (JSON.parse(scResp.getContentText()).access_scopes || [])
          .map(function (s) { return s.handle; });
        if (handles.indexOf('read_all_orders') === -1) {
          scopeWarning = 'Shopify is only showing this dashboard the last 60 days of orders — ' +
            'older orders and their delivery addresses are invisible. Fix (one tick): Shopify admin → ' +
            'Settings → Apps and sales channels → Develop apps → open the dashboard’s app → ' +
            'Configuration → Admin API integration → Edit → tick read_all_orders → Save, then sync again.';
        }
      }
    } catch (eScopes) { /* scope probe is best-effort */ }
    var base = 'https://' + store + '/admin/api/2024-10/';
    var bookingsCsv = '', schoolsJson = '', invoicesJson = '', notesJson = '', staffJson = '';
    var central = { ok: false, reason: '' };
    try {
      var files = DriveApp.getFilesByName(BOOKINGS_FILE_);
      if (files.hasNext()) bookingsCsv = files.next().getBlob().getDataAsString();
      var sFiles = DriveApp.getFilesByName(SCHOOLS_FILE_);
      if (sFiles.hasNext()) schoolsJson = sFiles.next().getBlob().getDataAsString();
      var iFiles = DriveApp.getFilesByName(INVOICES_FILE_);
      if (iFiles.hasNext()) invoicesJson = iFiles.next().getBlob().getDataAsString();
      var nFiles = DriveApp.getFilesByName(NOTES_FILE_);
      if (nFiles.hasNext()) notesJson = nFiles.next().getBlob().getDataAsString();
      var stFiles = DriveApp.getFilesByName(STAFF_FILE_);
      if (stFiles.hasNext()) staffJson = stFiles.next().getBlob().getDataAsString();
      central.ok = true; // Drive answered — central sharing is live
    } catch (eDrive) {
      // Drive not authorised yet — sync still works, each device on its own
      central.reason = String((eDrive && eDrive.message) || eDrive);
    }
    // Which sheet photos exist (names + dates only — the bytes are fetched
    // one by one when a customer's page opens).
    var photosIdx = [];
    try {
      var pFold = DriveApp.getFoldersByName(PHOTOS_FOLDER_);
      if (pFold.hasNext()) {
        var pFiles = pFold.next().getFiles();
        while (pFiles.hasNext()) {
          var pf = pFiles.next();
          if (pf.isTrashed()) continue;
          photosIdx.push({ name: pf.getName(), at: pf.getDateCreated().toISOString() });
        }
      }
    } catch (ePhotos) { /* photos are best-effort */ }
    return JSON.stringify({
      customers: fetchAll_(base, token, 'customers', ''),
      orders: fetchAll_(base, token, 'orders', '&status=any'),
      products: fetchCatalogue_(store),
      store: store,
      bookingsCsv: bookingsCsv,
      schoolsJson: schoolsJson,
      invoicesJson: invoicesJson,
      notesJson: notesJson,
      staffJson: staffJson,
      photosIdx: photosIdx,
      central: central,
      scopeWarning: scopeWarning,
      syncedAt: new Date().toISOString(),
    });
  } catch (e) {
    return JSON.stringify({ error: String((e && e.message) || e) });
  }
}

/**
 * The public product catalogue of the online store — every published
 * product with its variant options (colours, sizes) and prices. Read from
 * the storefront's public products.json, so it needs NO extra Shopify
 * scopes and always mirrors what's on the website. Non-fatal: an empty
 * list is returned on any error and the dress dropdowns fall back to
 * titles seen on past orders.
 */
function fetchCatalogue_(store) {
  var out = [];
  try {
    for (var page = 1; page <= 8; page++) {
      var resp = UrlFetchApp.fetch('https://' + store + '/products.json?limit=250&page=' + page,
        { muteHttpExceptions: true, followRedirects: true });
      if (resp.getResponseCode() !== 200) break;
      var prods = (JSON.parse(resp.getContentText()) || {}).products || [];
      for (var i = 0; i < prods.length; i++) {
        var p = prods[i];
        out.push({
          title: p.title,
          product_type: p.product_type || '',
          options: (p.options || []).map(function (o) { return { name: o.name, values: o.values || [] }; }),
          variants: (p.variants || []).map(function (v) {
            return { option1: v.option1, option2: v.option2, option3: v.option3, price: v.price };
          }),
        });
      }
      if (prods.length < 250) break;
    }
  } catch (e) { /* storefront unreachable — dropdowns fall back gracefully */ }
  return out;
}

var BOOKINGS_FILE_ = 'darcybow-bookings.csv';

/**
 * Stores the Appointly bookings export centrally (a small file in the
 * owner's Google Drive), so syncShopify can hand it to every browser that
 * opens the dashboard. Called automatically when an export is imported.
 */
function saveBookingsCsv(siteTok, text) {
  gate_(siteTok);
  try {
    var files = DriveApp.getFilesByName(BOOKINGS_FILE_);
    if (files.hasNext()) files.next().setContent(text);
    else DriveApp.createFile(BOOKINGS_FILE_, text, 'text/csv');
    return JSON.stringify({ ok: true });
  } catch (e) {
    return JSON.stringify({ error: String((e && e.message) || e) });
  }
}

var PHOTOS_FOLDER_ = 'darcybow-photos';

/** The Drive folder holding the staff sheet photos (created on first use). */
function photosFolder_() {
  var it = DriveApp.getFoldersByName(PHOTOS_FOLDER_);
  return it.hasNext() ? it.next() : DriveApp.createFolder(PHOTOS_FOLDER_);
}

/** Stores one sheet photo (JPEG) in the photos folder.
 * json: { name: '<customer-key>__<id>.jpg', b64: '<base64 jpeg bytes>' } */
function savePhoto(siteTok, json) {
  gate_(siteTok);
  try {
    var p = JSON.parse(json);
    if (!p.name || !p.b64) return JSON.stringify({ error: 'Missing photo data.' });
    photosFolder_().createFile(Utilities.newBlob(Utilities.base64Decode(p.b64), 'image/jpeg', String(p.name)));
    return JSON.stringify({ ok: true });
  } catch (e) {
    return JSON.stringify({ error: String((e && e.message) || e) });
  }
}

/** Returns one sheet photo's bytes (base64) by file name. */
function getPhoto(siteTok, name) {
  gate_(siteTok);
  try {
    var it = photosFolder_().getFilesByName(String(name));
    if (!it.hasNext()) return JSON.stringify({ error: 'Photo not found.' });
    return JSON.stringify({ ok: true, b64: Utilities.base64Encode(it.next().getBlob().getBytes()) });
  } catch (e) {
    return JSON.stringify({ error: String((e && e.message) || e) });
  }
}

/** Trashes one sheet photo by file name. */
function deletePhoto(siteTok, name) {
  gate_(siteTok);
  try {
    var it = photosFolder_().getFilesByName(String(name));
    while (it.hasNext()) it.next().setTrashed(true);
    return JSON.stringify({ ok: true });
  } catch (e) {
    return JSON.stringify({ error: String((e && e.message) || e) });
  }
}

var SCHOOLS_FILE_ = 'darcybow-schools.json';
var INVOICES_FILE_ = 'darcybow-invoices.json';
var NOTES_FILE_ = 'darcybow-notes.json';
var STAFF_FILE_ = 'darcybow-staff.json';

/**
 * Stores the staff-made corrections centrally (time changes, address and
 * detail edits, cancellations, merges, override log) so every phone and
 * laptop opening the dashboard stays in step on event day.
 */
function saveStaff(siteTok, json) {
  gate_(siteTok);
  try {
    var files = DriveApp.getFilesByName(STAFF_FILE_);
    if (files.hasNext()) files.next().setContent(json);
    else DriveApp.createFile(STAFF_FILE_, json, 'application/json');
    return JSON.stringify({ ok: true });
  } catch (e) {
    return JSON.stringify({ error: String((e && e.message) || e) });
  }
}

/**
 * Stores per-customer email notes centrally (keyed by customer email), so
 * every browser shares the same notes across re-syncs.
 */
function saveNotes(siteTok, json) {
  gate_(siteTok);
  try {
    var files = DriveApp.getFilesByName(NOTES_FILE_);
    if (files.hasNext()) files.next().setContent(json);
    else DriveApp.createFile(NOTES_FILE_, json, 'application/json');
    return JSON.stringify({ ok: true });
  } catch (e) {
    return JSON.stringify({ error: String((e && e.message) || e) });
  }
}

/**
 * Recent email threads between this mailbox and one customer, newest first.
 * Powers the live Emails module on the customer page. Each thread comes back
 * with the latest message's date, sender and a one-line summary (the opening
 * of its text, quoted reply history stripped).
 */
function fetchCustomerEmails(siteTok, email) {
  gate_(siteTok);
  try {
    var em = String(email || '').trim();
    if (!em || em.indexOf('@') < 0) return JSON.stringify({ threads: [] });
    var threads = GmailApp.search('from:' + em + ' OR to:' + em + ' OR cc:' + em, 0, 10);
    var out = [];
    for (var i = 0; i < threads.length; i++) {
      var t = threads[i];
      var msgs = t.getMessages();
      var last = msgs[msgs.length - 1];
      var body = String(last.getPlainBody() || '');
      // Cut quoted history so the summary is only the newest words.
      body = body.split(/\r?\n\s*(?:On .{0,120}wrote:|-{3,}\s*Original Message|From:\s)/i)[0];
      body = body.replace(/\s+/g, ' ').trim();
      out.push({
        subject: t.getFirstMessageSubject() || '(no subject)',
        count: t.getMessageCount(),
        lastAt: last.getDate().toISOString(),
        lastFrom: String(last.getFrom() || ''),
        summary: body.slice(0, 240),
      });
    }
    out.sort(function (a, b) { return a.lastAt < b.lastAt ? 1 : -1; });
    return JSON.stringify({ threads: out });
  } catch (e) {
    return JSON.stringify({ error: String((e && e.message) || e) });
  }
}

/**
 * Emails an invoice from the owner's Gmail with the two-page PDF attached.
 * payload: { to, isTest, subject, textBody, htmlBody, pdfHtml, filename, replyTo }
 * isTest sends to the account that owns this script instead of the customer.
 * Consumer Gmail allows roughly 100 sends per day.
 */
/**
 * The dashboard account's own email address, without insisting on the
 * userinfo scope: Session first, then the Drive root folder's owner
 * (Drive access is always granted — the shared data files live there).
 */
function ownerEmail_() {
  try { var e = Session.getEffectiveUser().getEmail(); if (e) return e; } catch (err) { /* scope not granted */ }
  try { var e1 = Session.getActiveUser().getEmail(); if (e1) return e1; } catch (errA) { /* ignore */ }
  // A file's owner is always readable under the Drive scope the dashboard
  // already holds — probe one of our own files (creating a throwaway one
  // if none exists yet).
  try {
    var it = DriveApp.getFilesByName(INVOICES_FILE_);
    var f = it.hasNext() ? it.next() : DriveApp.createFile('darcybow-owner-probe.txt', 'safe to delete');
    var owner = f.getOwner();
    var e2 = owner ? owner.getEmail() : '';
    if (f.getName() === 'darcybow-owner-probe.txt') f.setTrashed(true);
    if (e2) return e2;
  } catch (err2) { /* ignore */ }
  return '';
}

/**
 * One-glance health check shown in the send window: proves whether THIS
 * deployment is allowed to use Gmail, and as which account. getAliases is
 * the cheapest call that requires the Gmail scope.
 */
function emailHealth(siteTok) {
  gate_(siteTok);
  var out = { canSend: false, account: '', error: '', detail: '' };
  try {
    GmailApp.getAliases();
    out.canSend = true;
  } catch (e) {
    out.error = String((e && e.message) || e);
  }
  try { out.account = ownerEmail_(); } catch (e2) { /* ignore */ }
  // Diagnostic line: which script, which account, which permissions this
  // running copy actually holds — so a screenshot pins the problem exactly.
  try {
    var scriptId = '';
    try { scriptId = ScriptApp.getScriptId(); } catch (eSid) {}
    var scopes = '';
    try {
      var resp = UrlFetchApp.fetch('https://oauth2.googleapis.com/tokeninfo?access_token=' + ScriptApp.getOAuthToken(),
        { muteHttpExceptions: true });
      var d = JSON.parse(resp.getContentText());
      scopes = String(d.scope || '').split(' ').map(function (s) {
        return s.replace('https://www.googleapis.com/auth/', '').replace('https://mail.google.com/', 'FULL-GMAIL');
      }).join(', ');
      if (!out.account && d.email) out.account = d.email;
    } catch (eTok) { scopes = '(could not read: ' + String(eTok && eTok.message || eTok) + ')'; }
    out.detail = 'account=' + (out.account || '?') + ' · script=…' + String(scriptId).slice(-8) + ' · permissions: ' + (scopes || '?');
  } catch (e3) { /* diagnostics are best-effort */ }
  return JSON.stringify(out);
}

/**
 * Run this from the editor (Run ▸ testEmailSetup) to prove email sending
 * works end to end: it emails "Darcybow test" to the dashboard's own inbox.
 */
function testEmailSetup() {
  var me = ownerEmail_();
  if (!me) throw new Error('Could not work out this account\'s own email address.');
  GmailApp.sendEmail(me, 'Darcybow test', 'The dashboard can send email — all working. (Sent to: ' + me + ')');
}

function sendInvoiceEmail(siteTok, payload) {
  gate_(siteTok);
  try {
    var p = JSON.parse(payload);
    var to = p.isTest ? ownerEmail_() : String(p.to || '').trim();
    if (!to) return JSON.stringify({ error: p.isTest
      ? 'Could not work out your own address for the test — try “Send to customer” with your own email typed in the To box instead.'
      : 'No recipient email.' });
    var pdf = Utilities.newBlob(p.pdfHtml, 'text/html', p.filename + '.html')
      .getAs('application/pdf').setName(p.filename + '.pdf');
    var opts = { htmlBody: p.htmlBody, attachments: [pdf], name: 'Darcybow' };
    if (p.replyTo) opts.replyTo = p.replyTo;
    // Blind copy of every real send to the business inbox (Outlook), so the
    // owner sees exactly what went out even though Gmail did the sending.
    if (p.bcc && !p.isTest && String(p.bcc).toLowerCase() !== to.toLowerCase()) opts.bcc = String(p.bcc).trim();
    // Send from the business address once it's a verified "Send mail as"
    // alias in this Gmail account; until then, fall back and say so.
    var warning = '';
    var from = String(p.fromAddress || '').trim();
    if (from) {
      var me = ownerEmail_();
      var aliases = [];
      try { aliases = GmailApp.getAliases() || []; } catch (eAl) {}
      if (from.toLowerCase() === String(me).toLowerCase() || aliases.join(',').toLowerCase().split(',').indexOf(from.toLowerCase()) !== -1) {
        opts.from = from;
      } else {
        warning = 'Sent from ' + me + ' — to send from ' + from + ', add it in that Gmail account under Settings → Accounts and Import → “Send mail as”, verify it, and it will be used automatically.';
      }
    }
    GmailApp.sendEmail(to, p.subject, p.textBody || '', opts);
    return JSON.stringify({ ok: true, sentTo: to, warning: warning });
  } catch (e) {
    return JSON.stringify({ error: String((e && e.message) || e) });
  }
}

/**
 * Stores all invoices + invoice settings centrally (Drive) so every browser
 * shares them. Called automatically whenever an invoice or the invoice
 * settings are saved.
 */
function saveInvoices(siteTok, json) {
  gate_(siteTok);
  try {
    var files = DriveApp.getFilesByName(INVOICES_FILE_);
    if (files.hasNext()) files.next().setContent(json);
    else DriveApp.createFile(INVOICES_FILE_, json, 'application/json');
    return JSON.stringify({ ok: true });
  } catch (e) {
    return JSON.stringify({ error: String((e && e.message) || e) });
  }
}

/**
 * Stores the staff-confirmed school name corrections (aliases and dismissed
 * match suggestions) centrally, so every browser shares the same school
 * groupings. Called automatically when staff confirm or correct a school.
 */
function saveSchools(siteTok, json) {
  gate_(siteTok);
  try {
    var files = DriveApp.getFilesByName(SCHOOLS_FILE_);
    if (files.hasNext()) files.next().setContent(json);
    else DriveApp.createFile(SCHOOLS_FILE_, json, 'application/json');
    return JSON.stringify({ ok: true });
  } catch (e) {
    return JSON.stringify({ error: String((e && e.message) || e) });
  }
}

/**
 * Gets an Admin API access token, two ways:
 *  - SHOPIFY_TOKEN set → use it directly (legacy custom app shpat_ token).
 *  - Otherwise SHOPIFY_CLIENT_ID + SHOPIFY_CLIENT_SECRET → exchange them
 *    via OAuth client credentials (Dev Dashboard apps). Tokens are cached
 *    until shortly before they expire.
 */
function getAccessToken_(store) {
  var props = PropertiesService.getScriptProperties();
  var token = (props.getProperty('SHOPIFY_TOKEN') || '').trim();
  if (token) return token;
  var id = (props.getProperty('SHOPIFY_CLIENT_ID') || '').trim();
  var secret = (props.getProperty('SHOPIFY_CLIENT_SECRET') || '').trim();
  if (!id || !secret) {
    throw new Error('Not configured yet — in ⚙ Project Settings → Script properties add either SHOPIFY_TOKEN, or SHOPIFY_CLIENT_ID + SHOPIFY_CLIENT_SECRET (from the app\'s Settings → Credentials in the Shopify Dev Dashboard).');
  }
  var cache = CacheService.getScriptCache();
  var cached = cache.get('shopify_cc_token');
  if (cached) return cached;
  var resp = UrlFetchApp.fetch('https://' + store + '/admin/oauth/access_token', {
    method: 'post',
    contentType: 'application/json',
    payload: JSON.stringify({ client_id: id, client_secret: secret, grant_type: 'client_credentials' }),
    muteHttpExceptions: true,
  });
  var code = resp.getResponseCode();
  if (code !== 200) {
    throw new Error('Shopify would not issue an access token from the client credentials (HTTP ' + code + '): ' +
      resp.getContentText().slice(0, 300) +
      ' — check SHOPIFY_CLIENT_ID / SHOPIFY_CLIENT_SECRET, and make sure the app version is released and the app is installed on the store.');
  }
  var body = JSON.parse(resp.getContentText());
  if (!body.access_token) throw new Error('Shopify replied without an access token — response: ' + resp.getContentText().slice(0, 300));
  var ttl = Math.max(60, Math.min(21540, (Number(body.expires_in) || 86400) - 300));
  cache.put('shopify_cc_token', body.access_token, ttl);
  return body.access_token;
}

/**
 * Builds the production board as a real .xlsx and returns it base64-encoded
 * for the browser to download. One block per dress: title, size tally,
 * column headers, rows, blank line.
 */
function exportProductionXlsx(siteTok, payload) {
  gate_(siteTok);
  var ss = null;
  try {
    var p = JSON.parse(payload);
    ss = SpreadsheetApp.create('Darcybow production ' + p.date);
    var sh = ss.getSheets()[0];
    sh.setName('Production');
    var rows = [];
    var bolds = []; // 1-based row numbers to embolden
    rows.push(['DARCYBOW PRODUCTION — ' + p.date, '', '', '', '', '', '', '', '']);
    bolds.push(rows.length);
    rows.push(['', '', '', '', '', '', '', '', '']);
    for (var g = 0; g < p.groups.length; g++) {
      var grp = p.groups[g];
      rows.push([grp.dress.toUpperCase() + '   (' + grp.tally + ')', '', '', '', '', '', '', '', '']);
      bolds.push(rows.length);
      rows.push(['Size', 'Colour', 'Qty', 'Customer', 'Daughter', 'Phone', 'Email', 'Accessories', 'Notes']);
      bolds.push(rows.length);
      for (var r = 0; r < grp.rows.length; r++) {
        var x = grp.rows[r];
        rows.push([x.size, x.colour, x.qty, x.customer, x.daughter, "'" + String(x.phone || ''), x.email, x.accessories, x.notes]);
      }
      rows.push(['', '', '', '', '', '', '', '', '']);
    }
    sh.getRange(1, 1, rows.length, 9).setValues(rows);
    for (var b = 0; b < bolds.length; b++) sh.getRange(bolds[b], 1, 1, 9).setFontWeight('bold');
    for (var c2 = 1; c2 <= 9; c2++) sh.autoResizeColumn(c2);
    SpreadsheetApp.flush();
    var url = 'https://docs.google.com/spreadsheets/d/' + ss.getId() + '/export?format=xlsx';
    var blob = UrlFetchApp.fetch(url, { headers: { Authorization: 'Bearer ' + ScriptApp.getOAuthToken() } }).getBlob();
    var name = 'Darcybow production ' + p.date + '.xlsx';
    DriveApp.getFileById(ss.getId()).setTrashed(true);
    return JSON.stringify({ b64: Utilities.base64Encode(blob.getBytes()), name: name });
  } catch (e) {
    try { if (ss) DriveApp.getFileById(ss.getId()).setTrashed(true); } catch (e2) {}
    return JSON.stringify({ error: String((e && e.message) || e) });
  }
}

/** Follows Shopify's Link-header pagination, 250 records per page. */
function fetchAll_(base, token, resource, extraParams) {
  var url = base + resource + '.json?limit=250' + (extraParams || '');
  var out = [];
  for (var page = 0; page < 40 && url; page++) {
    var resp = UrlFetchApp.fetch(url, {
      headers: { 'X-Shopify-Access-Token': token },
      muteHttpExceptions: true,
    });
    var code = resp.getResponseCode();
    if (code === 429) { // rate limited — wait and retry the same page
      Utilities.sleep(1200);
      page--;
      continue;
    }
    if (code !== 200) {
      throw new Error('Shopify replied ' + code + ' for ' + resource +
        ' — check the store domain and that the token has read_customers + read_orders.');
    }
    var body = JSON.parse(resp.getContentText());
    out = out.concat(body[resource] || []);
    var link = String(resp.getHeaders()['Link'] || resp.getHeaders()['link'] || '');
    var m = link.match(/<([^>]+)>;\s*rel="next"/);
    url = m ? m[1] : null;
  }
  return out;
}
