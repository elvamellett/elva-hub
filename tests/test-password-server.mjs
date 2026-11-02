// Unit test: Code.gs password gate (Script Properties based). Runs the real
// darcybow-Code.gs in a sandbox with Google's services simulated.
import { readFileSync } from 'fs';
import vm from 'vm';
import crypto from 'crypto';
const results = [];
const check = (name, ok) => { results.push([name, ok]); if (!ok) console.log('FAIL:', name); };
const props = {};
const ctx = {
  PropertiesService: { getScriptProperties: () => ({ getProperty: k => (k in props ? props[k] : null) }) },
  Utilities: {
    sleep: () => {}, DigestAlgorithm: { SHA_256: 'sha256' },
    computeDigest: (alg, s) => [...crypto.createHash('sha256').update(s).digest()],
    base64EncodeWebSafe: b => Buffer.from(b).toString('base64url'),
  },
  console,
};
vm.createContext(ctx);
vm.runInContext(readFileSync(new URL('../darcybow-Code.gs', import.meta.url), 'utf8'), ctx);
const gateThrows = t => { try { ctx.gate_(t); return false; } catch (e) { return true; } };

const src = readFileSync(new URL('../darcybow-Code.gs', import.meta.url), 'utf8');
check('no password written in the public code', !/darcy2026|SITE_PASSWORD\s*=/.test(src));
// Not set up yet: nothing gets in, not even an empty token.
let r = JSON.parse(ctx.checkSitePassword(''));
check('unset: login refused with a set-up message', r.ok === false && /SITE_PASSWORD/.test(r.error || ''));
check('unset: empty token is refused', gateThrows(''));
check('unset: missing token is refused', gateThrows(undefined));
// Set up.
props.SITE_PASSWORD = 'Secret-Test-Pass';
r = JSON.parse(ctx.checkSitePassword('wrong'));
check('wrong password refused (no error text leaked)', r.ok === false && !r.error && !r.token);
r = JSON.parse(ctx.checkSitePassword('  Secret-Test-Pass  '));
check('right password (spaces trimmed) gets a token', r.ok === true && !!r.token);
const tok = r.token;
check('that token opens the data', !gateThrows(tok));
check('a forged token is refused', gateThrows('abc123'));
// Changing the property locks out old tokens.
props.SITE_PASSWORD = 'New-Pass';
check('after a password change, old tokens stop working', gateThrows(tok));
const passed = results.filter(x => x[1]).length;
console.log(`\n${passed}/${results.length} checks passed`);
process.exit(passed === results.length ? 0 : 1);
