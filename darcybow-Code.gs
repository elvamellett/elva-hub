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
    var bookingsCsv = '';
    try {
      var files = DriveApp.getFilesByName(BOOKINGS_FILE_);
      if (files.hasNext()) bookingsCsv = files.next().getBlob().getDataAsString();
    } catch (eDrive) { /* Drive not authorised yet — sync still works without it */ }
    return JSON.stringify({
      customers: fetchAll_(base, token, 'customers', ''),
      orders: fetchAll_(base, token, 'orders', '&status=any'),
      bookingsCsv: bookingsCsv,
      syncedAt: new Date().toISOString(),
    });
  } catch (e) {
    return JSON.stringify({ error: String((e && e.message) || e) });
  }
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
