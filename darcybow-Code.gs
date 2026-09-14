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

function doGet() {
  return HtmlService.createHtmlOutputFromFile('index')
    .setTitle('Darcybow — Customers & Events')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

/**
 * Called from the page via google.script.run. Returns a JSON string:
 * { customers: [...], orders: [...], bookingsCsv, syncedAt } or { error }.
 * bookingsCsv is the shared Appointly export (see saveBookingsCsv), so every
 * browser that opens the dashboard gets the imported bookings — not just the
 * browser that did the import.
 */
function syncShopify() {
  try {
    var props = PropertiesService.getScriptProperties();
    var store = (props.getProperty('SHOPIFY_STORE') || '').trim().replace(/^https?:\/\//, '').replace(/\/.*$/, '');
    if (!store) {
      return JSON.stringify({ error: 'Not configured yet — add SHOPIFY_STORE (your .myshopify.com domain) in ⚙ Project Settings → Script properties, then sync again.' });
    }
    var token = getAccessToken_(store);
    var base = 'https://' + store + '/admin/api/2024-10/';
    var bookingsCsv = '', schoolsJson = '', invoicesJson = '';
    try {
      var files = DriveApp.getFilesByName(BOOKINGS_FILE_);
      if (files.hasNext()) bookingsCsv = files.next().getBlob().getDataAsString();
      var sFiles = DriveApp.getFilesByName(SCHOOLS_FILE_);
      if (sFiles.hasNext()) schoolsJson = sFiles.next().getBlob().getDataAsString();
      var iFiles = DriveApp.getFilesByName(INVOICES_FILE_);
      if (iFiles.hasNext()) invoicesJson = iFiles.next().getBlob().getDataAsString();
    } catch (eDrive) { /* Drive not authorised yet — sync still works without it */ }
    return JSON.stringify({
      customers: fetchAll_(base, token, 'customers', ''),
      orders: fetchAll_(base, token, 'orders', '&status=any'),
      products: fetchCatalogue_(store),
      bookingsCsv: bookingsCsv,
      schoolsJson: schoolsJson,
      invoicesJson: invoicesJson,
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
function saveBookingsCsv(text) {
  try {
    var files = DriveApp.getFilesByName(BOOKINGS_FILE_);
    if (files.hasNext()) files.next().setContent(text);
    else DriveApp.createFile(BOOKINGS_FILE_, text, 'text/csv');
    return JSON.stringify({ ok: true });
  } catch (e) {
    return JSON.stringify({ error: String((e && e.message) || e) });
  }
}

var SCHOOLS_FILE_ = 'darcybow-schools.json';
var INVOICES_FILE_ = 'darcybow-invoices.json';

/**
 * Emails an invoice from the owner's Gmail with the two-page PDF attached.
 * payload: { to, isTest, subject, textBody, htmlBody, pdfHtml, filename, replyTo }
 * isTest sends to the account that owns this script instead of the customer.
 * Consumer Gmail allows roughly 100 sends per day.
 */
function sendInvoiceEmail(payload) {
  try {
    var p = JSON.parse(payload);
    var to = p.isTest ? Session.getEffectiveUser().getEmail() : String(p.to || '').trim();
    if (!to) return JSON.stringify({ error: 'No recipient email.' });
    var pdf = Utilities.newBlob(p.pdfHtml, 'text/html', p.filename + '.html')
      .getAs('application/pdf').setName(p.filename + '.pdf');
    var opts = { htmlBody: p.htmlBody, attachments: [pdf], name: 'Darcybow' };
    if (p.replyTo) opts.replyTo = p.replyTo;
    // Send from the business address once it's a verified "Send mail as"
    // alias in this Gmail account; until then, fall back and say so.
    var warning = '';
    var from = String(p.fromAddress || '').trim();
    if (from) {
      var me = '';
      try { me = Session.getEffectiveUser().getEmail(); } catch (eMe) {}
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
function saveInvoices(json) {
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
function saveSchools(json) {
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
function exportProductionXlsx(payload) {
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
