// Elva Hub — Cloudflare Worker: Claude proxy + Apple (iCloud) Calendar bridge.
//
// Secrets (Worker → Settings → Variables and Secrets, type "Secret"):
//   ANTHROPIC_KEY        your key from console.anthropic.com
//   HUB_TOKEN            any password you choose; paste the same one into Hub → Settings → Claude
//   ICLOUD_USER          your Apple ID email
//   ICLOUD_APP_PASSWORD  an app-specific password from account.apple.com → Sign-In and Security
// Optional plain variable:
//   TZ                   fallback time zone for events with an unknown zone (default Europe/Dublin)
//
// Routes:
//   POST /                  → Claude (anything not under /cal/)
//   POST /cal/calendars     → [{url,name,col}]
//   POST /cal/events        {from,to,cals:[url]} → [{uid,href,etag,cal,title,start,end,allDay,location,recurring}]
//   POST /cal/create        {cal,title,start,end,allDay,location,notes} → {href,etag}
//   POST /cal/update        {href,title,start,end,allDay,location} → {href,etag}
//   POST /cal/delete        {href} → {ok}
// Timed start/end are UTC ISO strings ("2026-10-06T09:00:00Z"); all-day ones are "YYYY-MM-DD" (end exclusive).

const ALLOWED = ['https://elvamellett.github.io', 'http://localhost', 'null'];

export default {
  async fetch(req, env) {
    const origin = req.headers.get('Origin') || '';
    const cors = {
      'Access-Control-Allow-Origin': ALLOWED.some(a => origin.startsWith(a)) ? origin : ALLOWED[0],
      'Access-Control-Allow-Headers': 'Content-Type, x-hub-token',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
    };
    const json = (o, status = 200) => new Response(JSON.stringify(o), { status, headers: { ...cors, 'content-type': 'application/json' } });
    if (req.method === 'OPTIONS') return new Response(null, { headers: cors });
    if (req.method !== 'POST') return new Response('POST only', { status: 405, headers: cors });

    const path = new URL(req.url).pathname;
    const isCal = path.startsWith('/cal/');
    // Calendar routes always need the token; Claude keeps its old behaviour (token only if set).
    if ((isCal || env.HUB_TOKEN) && (!env.HUB_TOKEN || req.headers.get('x-hub-token') !== env.HUB_TOKEN))
      return json({ error: env.HUB_TOKEN ? 'Wrong Hub token' : 'Set HUB_TOKEN on the Worker first' }, 401);

    let body;
    try { body = await req.json(); } catch { return json({ error: 'Bad JSON' }, 400); }

    if (isCal) {
      if (!env.ICLOUD_USER || !env.ICLOUD_APP_PASSWORD) return json({ error: 'Add ICLOUD_USER and ICLOUD_APP_PASSWORD to the Worker' }, 500);
      try {
        const cal = new ICloud(env);
        switch (path) {
          case '/cal/calendars': return json(await cal.calendars());
          case '/cal/events': return json(await cal.events(body));
          case '/cal/create': return json(await cal.create(body));
          case '/cal/update': return json(await cal.update(body));
          case '/cal/delete': return json(await cal.remove(body));
          default: return json({ error: 'Unknown calendar route' }, 404);
        }
      } catch (e) {
        return json({ error: e.message || String(e) }, e.status || 502);
      }
    }

    const r = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-api-key': env.ANTHROPIC_KEY, 'anthropic-version': '2023-06-01' },
      body: JSON.stringify({
        model: body.model || 'claude-sonnet-4-6',
        max_tokens: Math.min(body.max_tokens || 1200, 4000),
        system: body.system || '',
        messages: body.messages || [],
      }),
    });
    const text = await r.text();
    return new Response(text, { status: r.status, headers: { ...cors, 'content-type': 'application/json' } });
  },
};

// ── iCloud CalDAV ──
let HOME_CACHE = null; // {user, url} — survives between requests on a warm isolate

class ICloud {
  constructor(env) {
    this.user = env.ICLOUD_USER;
    this.auth = 'Basic ' + btoa(`${env.ICLOUD_USER}:${env.ICLOUD_APP_PASSWORD}`);
    this.tz = env.TZ || 'Europe/Dublin';
    this.base = env.CALDAV_BASE || 'https://caldav.icloud.com/';
  }
  // Credentials only ever go to Apple.
  check(u) {
    const url = new URL(u, this.base);
    const apple = url.protocol === 'https:' && (url.hostname === 'icloud.com' || url.hostname.endsWith('.icloud.com'));
    if (!apple && url.origin !== new URL(this.base).origin)
      throw Object.assign(new Error('Not an iCloud calendar URL'), { status: 400 });
    return url.href;
  }
  async dav(method, url, body, headers = {}) {
    const r = await fetch(this.check(url), {
      method,
      headers: { Authorization: this.auth, ...(body ? { 'Content-Type': method === 'PUT' ? 'text/calendar; charset=utf-8' : 'application/xml; charset=utf-8' } : {}), ...headers },
      body,
    });
    if (r.status === 401) throw Object.assign(new Error('iCloud rejected the Apple ID or app-specific password'), { status: 401 });
    return r;
  }
  async home() {
    if (HOME_CACHE && HOME_CACHE.user === this.user) return HOME_CACHE.url;
    let r = await this.dav('PROPFIND', this.base, '<?xml version="1.0"?><d:propfind xmlns:d="DAV:"><d:prop><d:current-user-principal/></d:prop></d:propfind>', { Depth: '0' });
    let x = await r.text();
    const principal = tag(tag(x, 'current-user-principal') || '', 'href');
    if (!principal) throw new Error('Could not find your iCloud calendar account (' + r.status + ')');
    const pUrl = new URL(decodeXml(principal), r.url || this.base).href;
    r = await this.dav('PROPFIND', pUrl, '<?xml version="1.0"?><d:propfind xmlns:d="DAV:" xmlns:c="urn:ietf:params:xml:ns:caldav"><d:prop><c:calendar-home-set/></d:prop></d:propfind>', { Depth: '0' });
    x = await r.text();
    const home = tag(tag(x, 'calendar-home-set') || '', 'href');
    if (!home) throw new Error('Could not find your iCloud calendars (' + r.status + ')');
    const url = new URL(decodeXml(home), r.url || pUrl).href;
    HOME_CACHE = { user: this.user, url };
    return url;
  }
  async calendars() {
    const home = await this.home();
    const r = await this.dav('PROPFIND', home, `<?xml version="1.0"?><d:propfind xmlns:d="DAV:" xmlns:c="urn:ietf:params:xml:ns:caldav" xmlns:a="http://apple.com/ns/ical/"><d:prop><d:displayname/><d:resourcetype/><c:supported-calendar-component-set/><a:calendar-color/><d:current-user-privilege-set/></d:prop></d:propfind>`, { Depth: '1' });
    const x = await r.text();
    const out = [];
    for (const res of responses(x)) {
      const rt = tag(res, 'resourcetype') || '';
      if (!/<(?:[\w-]+:)?calendar[\s/>]/.test(rt)) continue;
      const comps = tag(res, 'supported-calendar-component-set');
      if (comps && !/VEVENT/.test(comps)) continue; // skip Reminders lists
      const href = tag(res, 'href');
      const priv = tag(res, 'current-user-privilege-set') || '';
      out.push({
        url: new URL(decodeXml(href), home).href,
        name: decodeXml(tag(res, 'displayname') || 'Calendar'),
        col: ((tag(res, 'calendar-color') || '#857B6C').trim()).slice(0, 7),
        readOnly: !!priv && !/<(?:[\w-]+:)?(write|write-content|all)\b/.test(priv),
      });
    }
    return out;
  }
  async events({ from, to, cals }) {
    const fromD = new Date(from + 'T00:00:00Z'), toD = new Date(to + 'T00:00:00Z');
    if (isNaN(fromD) || isNaN(toD)) throw Object.assign(new Error('from/to must be YYYY-MM-DD'), { status: 400 });
    const list = cals && cals.length ? cals : (await this.calendars()).map(c => c.url);
    const q = `<?xml version="1.0"?><c:calendar-query xmlns:d="DAV:" xmlns:c="urn:ietf:params:xml:ns:caldav"><d:prop><d:getetag/><c:calendar-data/></d:prop><c:filter><c:comp-filter name="VCALENDAR"><c:comp-filter name="VEVENT"><c:time-range start="${icsUtc(fromD)}" end="${icsUtc(toD)}"/></c:comp-filter></c:comp-filter></c:filter></c:calendar-query>`;
    const all = await Promise.all(list.map(async cal => {
      const r = await this.dav('REPORT', cal, q, { Depth: '1' });
      if (!r.ok && r.status !== 207) return [];
      const x = await r.text();
      const evs = [];
      for (const res of responses(x)) {
        const data = tag(res, 'calendar-data');
        if (!data) continue;
        const href = new URL(decodeXml(tag(res, 'href')), cal).href;
        const etag = decodeXml(tag(res, 'getetag') || '');
        const ics = decodeXml(data), recurring = /^RRULE:/m.test(unfold(ics));
        for (const e of expandIcs(ics, fromD, toD, this.tz)) evs.push({ ...e, recurring, href, etag, cal });
      }
      return evs;
    }));
    return all.flat().sort((a, b) => (a.start < b.start ? -1 : 1));
  }
  async create({ cal, title, start, end, allDay, location, notes }) {
    if (!cal || !title || !start) throw Object.assign(new Error('cal, title and start are required'), { status: 400 });
    const uid = crypto.randomUUID().toUpperCase();
    const ics = buildIcs({ uid, title, start, end, allDay, location, notes });
    const href = new URL(uid + '.ics', cal.endsWith('/') ? cal : cal + '/').href;
    const r = await this.dav('PUT', href, ics, { 'If-None-Match': '*' });
    if (!r.ok) throw new Error('iCloud refused the new event (' + r.status + ')');
    return { href, etag: r.headers.get('ETag') || '', uid };
  }
  async update({ href, title, start, end, allDay, location }) {
    const g = await this.dav('GET', href);
    if (!g.ok) throw new Error('Event not found in iCloud (' + g.status + ')');
    const ics = unfold(await g.text());
    if (/^RRULE:/m.test(ics)) throw Object.assign(new Error('Repeating event — edit it in Apple Calendar'), { status: 400 });
    const stamp = icsUtc(new Date());
    const set = [];
    if (title !== undefined) set.push(`SUMMARY:${escText(title)}`);
    if (location !== undefined && location !== '') set.push(`LOCATION:${escText(location)}`);
    if (start) set.push(...timeLines(start, end, allDay));
    const drop = new Set(['DTSTAMP', 'LAST-MODIFIED', 'SEQUENCE']);
    if (title !== undefined) drop.add('SUMMARY');
    if (location !== undefined) drop.add('LOCATION');
    if (start) { drop.add('DTSTART'); drop.add('DTEND'); drop.add('DURATION'); }
    const seq = +((ics.match(/^SEQUENCE:(\d+)/m) || [])[1] || 0) + 1;
    let inEvent = false;
    const out = [];
    for (const line of ics.split(/\r?\n/)) {
      if (line === 'BEGIN:VEVENT') { inEvent = true; out.push(line); continue; }
      if (line === 'END:VEVENT' && inEvent) { out.push(...set, `DTSTAMP:${stamp}`, `LAST-MODIFIED:${stamp}`, `SEQUENCE:${seq}`, line); inEvent = false; continue; }
      if (inEvent && drop.has(line.split(/[;:]/)[0])) continue;
      if (line !== '') out.push(line);
    }
    const r = await this.dav('PUT', href, fold(out).join('\r\n') + '\r\n', g.headers.get('ETag') ? { 'If-Match': g.headers.get('ETag') } : {});
    if (!r.ok) throw new Error('iCloud refused the change (' + r.status + ')');
    return { href, etag: r.headers.get('ETag') || '' };
  }
  async remove({ href }) {
    const r = await this.dav('DELETE', href);
    if (!r.ok && r.status !== 404) throw new Error('iCloud refused the delete (' + r.status + ')');
    return { ok: true };
  }
}

// ── XML helpers (tolerant of any namespace prefix) ──
function responses(x) {
  return x.split(/<(?:[\w-]+:)?response(?=[\s>])[^>]*>/).slice(1).map(s => s.split(/<\/(?:[\w-]+:)?response>/)[0]);
}
function tag(x, name) {
  const m = x.match(new RegExp(`<(?:[\\w-]+:)?${name}(?:\\s[^>]*)?>([\\s\\S]*?)</(?:[\\w-]+:)?${name}>`));
  return m ? m[1].trim() : null;
}
function decodeXml(s) {
  s = String(s || '');
  const cd = s.match(/^<!\[CDATA\[([\s\S]*)\]\]>$/);
  if (cd) return cd[1];
  return s.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&apos;/g, "'")
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCharCode(parseInt(h, 16))).replace(/&#(\d+);/g, (_, d) => String.fromCharCode(+d)).replace(/&amp;/g, '&');
}

// ── iCalendar ──
const pad = n => String(n).padStart(2, '0');
const icsUtc = d => `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}T${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}${pad(d.getUTCSeconds())}Z`;
const icsDate = s => s.replace(/-/g, '').slice(0, 8);
const isoDate = d => `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())}`;
const escText = s => String(s).replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\r?\n/g, '\\n');
const unescText = s => String(s).replace(/\\n/gi, '\n').replace(/\\([,;\\])/g, '$1');
const unfold = s => s.replace(/\r?\n[ \t]/g, '');
function fold(lines) {
  return lines.flatMap(l => { const out = []; while (l.length > 74) { out.push(l.slice(0, 74)); l = ' ' + l.slice(74); } out.push(l); return out; });
}
function timeLines(start, end, allDay) {
  if (allDay) {
    const s = start.slice(0, 10);
    let e = (end || '').slice(0, 10);
    if (!e || e <= s) { const d = new Date(s + 'T00:00:00Z'); d.setUTCDate(d.getUTCDate() + 1); e = isoDate(d); }
    return [`DTSTART;VALUE=DATE:${icsDate(s)}`, `DTEND;VALUE=DATE:${icsDate(e)}`];
  }
  const s = new Date(start), e = end ? new Date(end) : new Date(s.getTime() + 36e5);
  if (isNaN(s)) throw Object.assign(new Error('Bad start time'), { status: 400 });
  return [`DTSTART:${icsUtc(s)}`, `DTEND:${icsUtc(e > s ? e : new Date(s.getTime() + 36e5))}`];
}
function buildIcs({ uid, title, start, end, allDay, location, notes }) {
  const now = icsUtc(new Date());
  return fold([
    'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Elva Hub//EN', 'CALSCALE:GREGORIAN',
    'BEGIN:VEVENT', `UID:${uid}`, `DTSTAMP:${now}`, `CREATED:${now}`, `LAST-MODIFIED:${now}`,
    `SUMMARY:${escText(title)}`, ...timeLines(start, end, allDay),
    ...(location ? [`LOCATION:${escText(location)}`] : []),
    ...(notes ? [`DESCRIPTION:${escText(notes)}`] : []),
    'END:VEVENT', 'END:VCALENDAR',
  ]).join('\r\n') + '\r\n';
}

// Parse "NAME;P=V;P2=V2:value"
function prop(line) {
  const i = line.search(/:(?=(?:[^"]*"[^"]*")*[^"]*$)/);
  const head = line.slice(0, i), value = line.slice(i + 1);
  const [name, ...ps] = head.split(';');
  const params = {};
  for (const p of ps) { const j = p.indexOf('='); params[p.slice(0, j).toUpperCase()] = p.slice(j + 1).replace(/^"|"$/g, ''); }
  return { name: name.toUpperCase(), params, value };
}

// Offset (ms) of a zone at a UTC instant.
const DTF = {};
function tzOffset(ts, tz) {
  const f = DTF[tz] || (DTF[tz] = new Intl.DateTimeFormat('en-US', { timeZone: tz, hourCycle: 'h23', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' }));
  const p = Object.fromEntries(f.formatToParts(new Date(ts)).map(x => [x.type, x.value]));
  return Date.UTC(+p.year, +p.month - 1, +p.day, +p.hour % 24, +p.minute, +p.second) - Math.floor(ts / 1000) * 1000;
}
function validTz(tz) { try { new Intl.DateTimeFormat('en-US', { timeZone: tz }); return true; } catch { return false; } }
// Wall-clock fields in a zone → UTC ms.
function zoned(w, tz) {
  const guess = Date.UTC(w.y, w.m - 1, w.d, w.h, w.mi, w.s);
  if (tz === 'UTC') return guess;
  let t = guess - tzOffset(guess, tz);
  const o2 = tzOffset(t, tz);
  if (guess - o2 !== t) t = guess - o2;
  return t;
}
// Parse a DATE or DATE-TIME property into {wall, tz, allDay}
function parseDt(p, fallbackTz) {
  const v = p.value.trim();
  const m = v.match(/^(\d{4})(\d{2})(\d{2})(?:T(\d{2})(\d{2})(\d{2})(Z)?)?$/);
  if (!m) return null;
  const wall = { y: +m[1], m: +m[2], d: +m[3], h: +(m[4] || 0), mi: +(m[5] || 0), s: +(m[6] || 0) };
  const allDay = p.params.VALUE === 'DATE' || !m[4];
  let tz = m[7] ? 'UTC' : (p.params.TZID || fallbackTz);
  if (tz !== 'UTC' && !validTz(tz)) tz = fallbackTz;
  return { wall, tz, allDay };
}
const wallKey = w => `${w.y}${pad(w.m)}${pad(w.d)}T${pad(w.h)}${pad(w.mi)}`;
function addWall(w, days, months = 0) {
  const d = new Date(Date.UTC(w.y, w.m - 1 + months, w.d + days));
  return { ...w, y: d.getUTCFullYear(), m: d.getUTCMonth() + 1, d: d.getUTCDate() };
}
function durationMs(s) {
  const m = s.match(/^([+-])?P(?:(\d+)W)?(?:(\d+)D)?(?:T(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?)?$/);
  if (!m) return 0;
  return (m[1] === '-' ? -1 : 1) * (((+m[2] || 0) * 7 + (+m[3] || 0)) * 864e5 + (+m[4] || 0) * 36e5 + (+m[5] || 0) * 6e4 + (+m[6] || 0) * 1e3);
}

function parseIcs(text) {
  const evs = [];
  let cur = null, depth = 0;
  for (const line of unfold(text).split(/\r?\n/)) {
    if (line === 'BEGIN:VEVENT') { cur = { props: {}, exdates: [] }; depth = 0; continue; }
    if (!cur) continue;
    if (line.startsWith('BEGIN:')) { depth++; continue; } // VALARM etc.
    if (line.startsWith('END:') && depth) { depth--; continue; }
    if (line === 'END:VEVENT') { evs.push(cur); cur = null; continue; }
    if (depth || !line.includes(':')) continue;
    const p = prop(line);
    if (p.name === 'EXDATE') p.value.split(',').forEach(v => cur.exdates.push({ ...p, value: v }));
    else cur.props[p.name] = p;
  }
  return evs;
}

const DAYS = ['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA'];
// Occurrence start wall-times for an RRULE, in order, from dtstart up to `until` wall key.
function* rruleWalls(rule, start, untilKey) {
  const r = Object.fromEntries(rule.split(';').map(x => x.split('=')).map(([k, v]) => [k.toUpperCase(), v]));
  const freq = r.FREQ, iv = Math.max(1, +r.INTERVAL || 1);
  const count = r.COUNT ? +r.COUNT : Infinity;
  const until = r.UNTIL ? r.UNTIL.replace(/Z$/, '').padEnd(15, 'T235959').slice(0, 13) : null;
  const byday = r.BYDAY ? r.BYDAY.split(',').map(x => { const m = x.match(/^([+-]?\d+)?(\w\w)$/); return { n: m[1] ? +m[1] : 0, wd: DAYS.indexOf(m[2]) }; }) : null;
  const bymd = r.BYMONTHDAY ? r.BYMONTHDAY.split(',').map(Number) : null;
  const bymonth = r.BYMONTH ? r.BYMONTH.split(',').map(Number) : null;
  const startKey = wallKey(start);
  let n = 0, guard = 0;
  const emit = w => { const k = wallKey(w); return k >= startKey; };
  const dow = w => new Date(Date.UTC(w.y, w.m - 1, w.d)).getUTCDay();
  const dim = (y, m) => new Date(Date.UTC(y, m, 0)).getUTCDate();
  for (let i = 0; guard++ < 3000; i += iv) {
    let cands;
    if (freq === 'DAILY') cands = [addWall(start, i)];
    else if (freq === 'WEEKLY') {
      const wk0 = addWall(start, i * 7 - ((dow(start) + 6) % 7)); // Monday of the period (WKST=MO)
      cands = byday ? byday.map(b => addWall(wk0, (b.wd + 6) % 7)).sort((a, b) => wallKey(a) < wallKey(b) ? -1 : 1) : [addWall(start, i * 7)];
    } else if (freq === 'MONTHLY' || freq === 'YEARLY') {
      const months = freq === 'MONTHLY' ? [addWall({ ...start, d: 1 }, 0, i)] : (bymonth || [start.m]).map(mo => ({ ...start, y: start.y + i, m: mo, d: 1 }));
      cands = [];
      for (const m0 of months) {
        const len = dim(m0.y, m0.m);
        if (byday) {
          for (const b of byday) {
            const days = []; for (let d = 1; d <= len; d++) if (dow({ ...m0, d }) === b.wd) days.push(d);
            const pick = b.n > 0 ? [days[b.n - 1]] : b.n < 0 ? [days[days.length + b.n]] : days;
            pick.filter(Boolean).forEach(d => cands.push({ ...m0, d }));
          }
        } else if (bymd) bymd.forEach(d => { const dd = d < 0 ? len + d + 1 : d; if (dd >= 1 && dd <= len) cands.push({ ...m0, d: dd }); });
        else if (start.d <= len) cands.push({ ...m0, d: start.d });
      }
      cands.sort((a, b) => wallKey(a) < wallKey(b) ? -1 : 1);
    } else { yield start; return; }
    for (const w of cands) {
      if (!emit(w)) continue;
      const k = wallKey(w);
      if (until && k > until) return;
      if (k > untilKey) return;
      if (n++ >= count) return;
      yield w;
    }
  }
}

function expandIcs(text, fromD, toD, fallbackTz) {
  const vevents = parseIcs(text);
  const out = [];
  const overrides = new Map(); // uid → Set of recurrence-id ms
  for (const v of vevents) {
    const rid = v.props['RECURRENCE-ID'];
    if (rid) { const d = parseDt(rid, fallbackTz); if (d) { const uid = v.props.UID?.value; if (!overrides.has(uid)) overrides.set(uid, new Set()); overrides.get(uid).add(zoned(d.wall, d.tz)); } }
  }
  for (const v of vevents) {
    const P = v.props;
    if (!P.DTSTART) continue;
    if ((P.STATUS?.value || '').toUpperCase() === 'CANCELLED') continue;
    const ds = parseDt(P.DTSTART, fallbackTz);
    if (!ds) continue;
    const de = P.DTEND ? parseDt(P.DTEND, fallbackTz) : null;
    const startMs = zoned(ds.wall, ds.allDay ? 'UTC' : ds.tz);
    let dur = de ? zoned(de.wall, de.allDay ? 'UTC' : de.tz) - startMs : P.DURATION ? durationMs(P.DURATION.value) : (ds.allDay ? 864e5 : 0);
    if (dur < 0) dur = 0;
    const base = { uid: P.UID?.value || '', title: unescText(P.SUMMARY?.value || '(no title)'), location: unescText(P.LOCATION?.value || ''), allDay: ds.allDay };
    const push = s => {
      const e = s + dur;
      // all-day: compare as dates; timed: real overlap with window
      if (ds.allDay ? (e <= fromD.getTime() || s >= toD.getTime()) : (e < fromD.getTime() || s >= toD.getTime() || (dur && e === fromD.getTime()))) return;
      out.push(ds.allDay
        ? { ...base, start: isoDate(new Date(s)), end: isoDate(new Date(Math.max(e, s + 864e5))) }
        : { ...base, start: new Date(s).toISOString(), end: new Date(e).toISOString() });
    };
    if (P['RECURRENCE-ID'] || !P.RRULE) { push(startMs); continue; }
    const ex = new Set(v.exdates.map(x => parseDt(x, fallbackTz)).filter(Boolean).map(d => d.allDay ? Date.UTC(d.wall.y, d.wall.m - 1, d.wall.d) : zoned(d.wall, d.tz)));
    const skip = overrides.get(base.uid) || new Set();
    // wall-clock window end, generous enough for any zone
    const endWall = new Date(toD.getTime() + 2 * 864e5);
    const untilKey = `${endWall.getUTCFullYear()}${pad(endWall.getUTCMonth() + 1)}${pad(endWall.getUTCDate())}T0000`;
    for (const w of rruleWalls(P.RRULE.value, ds.wall, untilKey)) {
      const s = zoned(w, ds.allDay ? 'UTC' : ds.tz);
      const dayMs = Date.UTC(w.y, w.m - 1, w.d);
      if (ex.has(s) || ex.has(dayMs) || skip.has(s)) continue;
      const before = out.length;
      push(s);
      if (out.length > before) out[out.length - 1].recurring = true;
    }
  }
  return out;
}

export { expandIcs, parseIcs, buildIcs, responses, tag, decodeXml, ICloud };
