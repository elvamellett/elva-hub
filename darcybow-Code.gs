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
 *       SHOPIFY_STORE  = darcybow.myshopify.com   (your .myshopify.com domain)
 *       SHOPIFY_TOKEN  = shpat_...                (custom app Admin API token
 *                                                  with read_customers + read_orders)
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
 * { customers: [...], orders: [...], syncedAt } or { error: "..." }.
 */
function syncShopify() {
  try {
    var props = PropertiesService.getScriptProperties();
    var store = (props.getProperty('SHOPIFY_STORE') || '').trim();
    var token = (props.getProperty('SHOPIFY_TOKEN') || '').trim();
    if (!store || !token) {
      return JSON.stringify({ error: 'Not configured yet — add SHOPIFY_STORE and SHOPIFY_TOKEN in ⚙ Project Settings → Script properties, then sync again.' });
    }
    var base = 'https://' + store.replace(/^https?:\/\//, '').replace(/\/.*$/, '') + '/admin/api/2024-10/';
    return JSON.stringify({
      customers: fetchAll_(base, token, 'customers', ''),
      orders: fetchAll_(base, token, 'orders', '&status=any'),
      syncedAt: new Date().toISOString(),
    });
  } catch (e) {
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
