#!/usr/bin/env node
'use strict';

/*
 * End-to-end smoke test. No test framework, no mocks: it boots the real app on
 * an ephemeral port against a throwaway database and drives it over HTTP the
 * way a browser would, including cookies and CSRF tokens.
 *
 *   npm run smoke
 *
 * Covers every route, and asserts the two things that are easy to get wrong and
 * expensive to get wrong: that downloads are actually gated, and that deleting
 * an account actually deletes the data.
 */

const fs = require('fs');
const os = require('os');
const path = require('path');

const TMP = fs.mkdtempSync(path.join(os.tmpdir(), 'dh-smoke-'));
process.env.DATABASE_PATH = path.join(TMP, 'smoke.db');
process.env.SESSION_SECRET = 'smoke-test-secret-not-used-in-production';
process.env.IP_HASH_SALT = 'smoke-test-salt';
process.env.NODE_ENV = 'test';
process.env.SMTP_URL = '';

const app = require('../server');
const { db } = require('../src/db');

let pass = 0;
let fail = 0;
const failures = [];

function check(name, condition, detail) {
  if (condition) {
    pass += 1;
    console.log(`  ok    ${name}`);
  } else {
    fail += 1;
    failures.push(name + (detail ? ` - ${detail}` : ''));
    console.log(`  FAIL  ${name}${detail ? ' - ' + detail : ''}`);
  }
}

/* --------------------------- tiny http client --------------------------- */

let base = '';
let cookie = '';

async function req(method, url, { body, redirect = 'manual', headers = {} } = {}) {
  const init = { method, redirect, headers: { ...headers } };
  if (cookie) init.headers.cookie = cookie;
  if (body) {
    init.headers['content-type'] = 'application/x-www-form-urlencoded';
    init.body = new URLSearchParams(body).toString();
  }
  const res = await fetch(base + url, init);
  const setCookie = res.headers.getSetCookie ? res.headers.getSetCookie() : [];
  for (const c of setCookie) {
    const pair = c.split(';')[0];
    if (pair.startsWith('dh.sid=')) cookie = pair;
  }
  const text = await res.text();
  return { status: res.status, text, headers: res.headers, location: res.headers.get('location') };
}

async function csrfFrom(url) {
  const r = await req('GET', url);
  const m = r.text.match(/name="_csrf" value="([a-f0-9]+)"/);
  return { token: m ? m[1] : null, page: r };
}

/* -------------------------------- suite -------------------------------- */

async function run() {
  console.log('\nDelivery Hub smoke test\n');

  console.log('Public pages (no account)');
  for (const url of [
    '/', '/toolkit', '/toolkit?category=planning', '/toolkit?q=raid', '/toolkit?tag=metrics',
    '/resources/raid-log', '/resources/retro-pack', '/resources/flow-metrics-starter',
    '/learning', '/learning/new-dm', '/learning/new-dm/what-the-job-is',
    '/learning/metrics/probabilistic-forecasting',
    '/glossary', '/glossary?q=flow',
    '/careers', '/careers/competencies', '/careers/interviews',
    '/tools', '/tools/forecast', '/tools/poker', '/tools/retro', '/tools/assessment',
    '/cookies', '/legal', '/signin', '/signup', '/forgot', '/healthz'
  ]) {
    const r = await req('GET', url);
    check(`GET ${url} -> 200`, r.status === 200, `got ${r.status}`);
  }

  console.log('\nLegal and governance documents');
  for (const slug of ['privacy', 'cookies', 'terms', 'accessibility', 'licence', 'security']) {
    const r = await req('GET', `/legal/${slug}`);
    check(`GET /legal/${slug} -> 200`, r.status === 200, `got ${r.status}`);
  }
  for (const slug of ['ropa', 'dpia', 'retention', 'breach', 'subject-rights', 'subprocessors']) {
    const r = await req('GET', `/governance/${slug}`);
    check(`GET /governance/${slug} -> 200`, r.status === 200, `got ${r.status}`);
  }

  console.log('\nSecurity headers');
  const home = await req('GET', '/');
  const csp = home.headers.get('content-security-policy') || '';
  check('CSP present', csp.length > 0);
  check('CSP has a script nonce', /script-src[^;]*'nonce-/.test(csp), csp.slice(0, 120));
  check('CSP allows no third-party scripts', !/script-src[^;]*https?:/.test(csp));
  check('frame-ancestors none', /frame-ancestors 'none'/.test(csp));
  check('X-Content-Type-Options nosniff', home.headers.get('x-content-type-options') === 'nosniff');
  check('no X-Powered-By', !home.headers.get('x-powered-by'));

  console.log('\nCookie consent');
  check('banner shown before any decision', home.text.includes('Cookies on'));
  const consentCsrf = await csrfFrom('/cookies');
  const rejected = await req('POST', '/consent', {
    body: { _csrf: consentCsrf.token, decision: 'reject', next: '/' }
  });
  check('POST /consent (reject) -> 303', rejected.status === 303, `got ${rejected.status}`);
  const afterReject = await req('GET', '/');
  check('banner gone after a decision', !afterReject.text.includes('Cookies on Delivery Hub'));
  const rejectRow = db.prepare(
    `SELECT granted FROM consent_events WHERE purpose = 'analytics' ORDER BY id DESC LIMIT 1`
  ).get();
  check('refusal recorded in consent log', rejectRow && rejectRow.granted === 0);

  console.log('\nCSRF protection');
  const noToken = await req('POST', '/consent', { body: { decision: 'accept-all' } });
  check('POST without a CSRF token -> 403', noToken.status === 403, `got ${noToken.status}`);
  const badToken = await req('POST', '/consent', { body: { _csrf: 'deadbeef', decision: 'accept-all' } });
  check('POST with a bad CSRF token -> 403', badToken.status === 403, `got ${badToken.status}`);

  console.log('\nDownload gating (the whole point of the signup prompt)');
  const gated = await req('GET', '/download/raid-log.csv');
  check('anonymous download -> 303 redirect', gated.status === 303, `got ${gated.status}`);
  check('redirect goes to signup with a next param',
    (gated.location || '').startsWith('/signup?next='), gated.location);

  console.log('\nSignup validation');
  const signupCsrf = await csrfFrom('/signup');
  const badSignup = await req('POST', '/signup', {
    body: { _csrf: signupCsrf.token, name: '', email: 'not-an-email', password: 'short' }
  });
  check('invalid signup -> 400', badSignup.status === 400, `got ${badSignup.status}`);
  check('error summary rendered', badSignup.text.includes('There is a problem'));
  check('name error shown', badSignup.text.includes('Enter your name'));
  check('email format error shown', badSignup.text.includes('correct format'));
  check('password length error shown', badSignup.text.includes('at least 12 characters'));
  check('terms error shown', badSignup.text.includes('must accept the terms'));

  const commonPw = await req('POST', '/signup', {
    body: {
      _csrf: signupCsrf.token, name: 'Test', email: 'a@example.com',
      password: 'password123', accept_terms: 'yes'
    }
  });
  check('common password rejected', commonPw.text.includes('too common'), `status ${commonPw.status}`);

  console.log('\nSignup and the gated download');
  const csrf2 = await csrfFrom('/signup?next=/download/raid-log.csv');
  const created = await req('POST', '/signup', {
    body: {
      _csrf: csrf2.token,
      next: '/download/raid-log.csv',
      name: 'Smoke Tester',
      email: 'smoke@example.com',
      password: 'correct horse battery staple',
      job_role: 'Delivery manager',
      experience_level: '3-7',
      accept_terms: 'yes',
      marketing_consent: 'yes'
    }
  });
  check('signup -> 303', created.status === 303, `got ${created.status}`);
  check('redirected back to the download they wanted',
    created.location === '/download/raid-log.csv', created.location);

  const user = db.prepare('SELECT * FROM users WHERE email = ?').get('smoke@example.com');
  check('user row created', !!user);
  check('password is hashed, not stored', user && user.password_hash.startsWith('$2') && !user.password_hash.includes('horse'));
  check('terms version recorded', user && user.terms_version);
  check('marketing consent recorded on the account', user && user.marketing_consent === 1);
  const marketingConsent = db.prepare(
    `SELECT granted, mechanism FROM consent_events WHERE user_id = ? AND purpose = 'marketing' ORDER BY id DESC LIMIT 1`
  ).get(user.id);
  check('marketing consent evidenced in the log', marketingConsent && marketingConsent.granted === 1);
  check('no raw IP anywhere in consent log',
    db.prepare(`SELECT COUNT(*) AS n FROM consent_events WHERE ip_hash LIKE '%.%'`).get().n === 0);

  console.log('\nDownloads now work');
  const csv = await req('GET', '/download/raid-log.csv');
  check('CSV download -> 200', csv.status === 200, `got ${csv.status}`);
  check('CSV content type', (csv.headers.get('content-type') || '').includes('text/csv'));
  check('CSV is an attachment', (csv.headers.get('content-disposition') || '').includes('raid-log.csv'));
  check('CSV has the header row', csv.text.includes('Probability (1-5)'));
  check('CSV has blank rows to fill in', csv.text.split('\r\n').filter((l) => /^,+$/.test(l)).length >= 10);

  const md = await req('GET', '/download/retro-pack.md');
  check('Markdown download -> 200', md.status === 200, `got ${md.status}`);
  check('Markdown has the title', md.text.startsWith('# Retrospective pack'));
  check('Markdown carries the licence', md.text.includes('Creative Commons'));

  const badFormat = await req('GET', '/download/retro-pack.csv');
  check('unavailable format -> 404', badFormat.status === 404, `got ${badFormat.status}`);
  const noSuchResource = await req('GET', '/download/does-not-exist.csv');
  check('unknown resource -> 404', noSuchResource.status === 404, `got ${noSuchResource.status}`);

  check('download logged', db.prepare('SELECT COUNT(*) AS n FROM downloads WHERE user_id = ?').get(user.id).n === 2);

  console.log('\nEvery resource renders and every format generates');
  const { RESOURCES } = require('../src/data/catalogue');
  let resourceProblems = 0;
  let formatProblems = 0;
  for (const r of RESOURCES) {
    const page = await req('GET', `/resources/${r.id}`);
    if (page.status !== 200) { resourceProblems += 1; console.log(`        ${r.id} page -> ${page.status}`); }
    for (const f of r.formats) {
      const dl = await req('GET', `/download/${r.id}.${f}`);
      if (dl.status !== 200 || dl.text.length < 50) {
        formatProblems += 1;
        console.log(`        ${r.id}.${f} -> ${dl.status}, ${dl.text.length} bytes`);
      }
    }
  }
  check(`all ${RESOURCES.length} resource pages render`, resourceProblems === 0, `${resourceProblems} failed`);
  check('all downloads generate content', formatProblems === 0, `${formatProblems} failed`);

  console.log('\nEvery learning module renders');
  const { PATHS } = require('../src/data/learning');
  let moduleProblems = 0;
  for (const p of PATHS) {
    const pathPage = await req('GET', `/learning/${p.id}`);
    if (pathPage.status !== 200) moduleProblems += 1;
    for (const m of p.modules) {
      const mp = await req('GET', `/learning/${p.id}/${m.id}`);
      if (mp.status !== 200) { moduleProblems += 1; console.log(`        ${p.id}/${m.id} -> ${mp.status}`); }
    }
  }
  check('all learning paths and modules render', moduleProblems === 0, `${moduleProblems} failed`);

  console.log('\nProgress tracking');
  const modCsrf = await csrfFrom('/learning/new-dm/what-the-job-is');
  const marked = await req('POST', '/learning/new-dm/what-the-job-is/complete', {
    body: { _csrf: modCsrf.token }
  });
  check('marking a module complete -> 303', marked.status === 303, `got ${marked.status}`);
  check('advances to the next module', marked.location === '/learning/new-dm/first-two-weeks', marked.location);
  check('progress row written',
    db.prepare('SELECT COUNT(*) AS n FROM module_progress WHERE user_id = ?').get(user.id).n === 1);

  console.log('\nSave for later');
  const saveCsrf = await csrfFrom('/resources/raid-log');
  const saved = await req('POST', '/resources/raid-log/save', {
    body: { _csrf: saveCsrf.token }, headers: { accept: 'application/json' }
  });
  check('save -> 200', saved.status === 200, `got ${saved.status}`);
  check('save reports saved:true', JSON.parse(saved.text).saved === true);
  const unsaved = await req('POST', '/resources/raid-log/save', {
    body: { _csrf: saveCsrf.token }, headers: { accept: 'application/json' }
  });
  check('save again toggles off', JSON.parse(unsaved.text).saved === false);

  console.log('\nRetro board');
  const retroCsrf = await csrfFrom('/tools/retro');
  const board = await req('POST', '/tools/retro', {
    body: { _csrf: retroCsrf.token, title: 'Smoke retro', template: 'four-ls' }
  });
  check('create board -> 303', board.status === 303, `got ${board.status}`);
  const boardUrl = board.location;
  check('redirects to the board', (boardUrl || '').startsWith('/tools/retro/'), boardUrl);
  const boardPage = await req('GET', boardUrl);
  check('board page renders', boardPage.status === 200, `got ${boardPage.status}`);
  check('board shows the Four Ls columns', boardPage.text.includes('Longed for'));

  const itemCsrf = await csrfFrom(boardUrl);
  const added = await req('POST', `${boardUrl}/items`, {
    body: { _csrf: itemCsrf.token, column_id: 'lacked', body: 'A test environment that works' }
  });
  check('add note -> 303', added.status === 303, `got ${added.status}`);
  const withNote = await req('GET', boardUrl);
  check('note appears on the board', withNote.text.includes('A test environment that works'));

  const exported = await req('GET', `${boardUrl}/export.md`);
  check('markdown export -> 200', exported.status === 200, `got ${exported.status}`);
  check('export contains the note', exported.text.includes('A test environment that works'));
  check('export has an actions table', exported.text.includes('| Action | Owner | Due |'));

  console.log('\nMaturity assessment');
  const assessCsrf = await csrfFrom('/tools/assessment');
  const { ASSESSMENT } = require('../src/data/tools');
  const partial = { _csrf: assessCsrf.token, flow_0: '3' };
  const incomplete = await req('POST', '/tools/assessment', { body: partial });
  check('incomplete assessment -> 400', incomplete.status === 400, `got ${incomplete.status}`);
  check('tells you how many are missing', incomplete.text.includes('You have answered 1'));

  const full = { _csrf: assessCsrf.token };
  ASSESSMENT.dimensions.forEach((d) => d.questions.forEach((_, i) => { full[`${d.id}_${i}`] = '4'; }));
  const scored = await req('POST', '/tools/assessment', { body: full });
  check('complete assessment -> 200', scored.status === 200, `got ${scored.status}`);
  check('shows a percentage', /8\d%/.test(scored.text), 'expected around 80%');
  check('result saved for a signed-in user',
    db.prepare('SELECT COUNT(*) AS n FROM assessments WHERE user_id = ?').get(user.id).n === 1);

  console.log('\nAccount and privacy dashboard');
  for (const url of ['/account', '/account/privacy', '/account/requests', '/account/delete']) {
    const r = await req('GET', url);
    check(`GET ${url} -> 200`, r.status === 200, `got ${r.status}`);
  }

  console.log('\nGDPR: data export');
  const json = await req('GET', '/account/data.json');
  check('JSON export -> 200', json.status === 200, `got ${json.status}`);
  const exportData = JSON.parse(json.text);
  check('export has the account', !!exportData.account);
  check('export excludes the password hash', !('password_hash' in exportData.account));
  check('export excludes tokens', !('verify_token' in exportData.account));
  check('export includes consent history', Array.isArray(exportData.consent_history) && exportData.consent_history.length > 0);
  check('export includes downloads', exportData.downloads.length === 2);
  check('export includes learning progress', exportData.learning_progress.length === 1);
  check('export includes assessments', exportData.assessments.length === 1);
  check('export includes retro boards', exportData.retro_boards.length === 1);
  check('export includes board notes', exportData.retro_board_items.length === 1);
  check('export names the controller', !!exportData.controller.name);

  const txt = await req('GET', '/account/data.txt');
  check('plain-text export -> 200', txt.status === 200, `got ${txt.status}`);
  check('plain-text export is readable', txt.text.includes('CONSENT HISTORY'));

  console.log('\nGDPR: consent withdrawal');
  const consentsCsrf = await csrfFrom('/account/privacy');
  const withdrawn = await req('POST', '/account/consents', { body: { _csrf: consentsCsrf.token } });
  check('withdrawing consent -> 303', withdrawn.status === 303, `got ${withdrawn.status}`);
  const after = db.prepare('SELECT marketing_consent FROM users WHERE id = ?').get(user.id);
  check('marketing consent is now off', after.marketing_consent === 0);
  const withdrawalRow = db.prepare(
    `SELECT granted FROM consent_events WHERE user_id = ? AND purpose = 'marketing' ORDER BY id DESC LIMIT 1`
  ).get(user.id);
  check('withdrawal appended to the consent log, not overwritten', withdrawalRow.granted === 0);
  check('the original grant is still in the log',
    db.prepare(`SELECT COUNT(*) AS n FROM consent_events WHERE user_id = ? AND purpose = 'marketing' AND granted = 1`).get(user.id).n === 1);

  console.log('\nGDPR: other requests');
  const reqCsrf = await csrfFrom('/account/requests');
  const dsar = await req('POST', '/account/requests', {
    body: { _csrf: reqCsrf.token, kind: 'objection', detail: 'I object to the security log.' }
  });
  check('data request -> 200', dsar.status === 200, `got ${dsar.status}`);
  check('confirms receipt', dsar.text.includes('Request received'));

  console.log('\nSign out and back in');
  const outCsrf = await csrfFrom('/account');
  const out = await req('POST', '/signout', { body: { _csrf: outCsrf.token } });
  check('signout -> 303', out.status === 303, `got ${out.status}`);
  const afterOut = await req('GET', '/account');
  check('account is gated after signout', afterOut.status === 303, `got ${afterOut.status}`);

  const inCsrf = await csrfFrom('/signin');
  const wrong = await req('POST', '/signin', {
    body: { _csrf: inCsrf.token, email: 'smoke@example.com', password: 'wrong password entirely' }
  });
  check('wrong password -> 400', wrong.status === 400, `got ${wrong.status}`);
  check('does not say which field was wrong', wrong.text.includes('problem with your email address or password'));

  const unknown = await req('POST', '/signin', {
    body: { _csrf: inCsrf.token, email: 'nobody@example.com', password: 'wrong password entirely' }
  });
  check('unknown account gives an identical message', unknown.text.includes('problem with your email address or password'));

  const forgotCsrf = await csrfFrom('/forgot');
  const forgotUnknown = await req('POST', '/forgot', {
    body: { _csrf: forgotCsrf.token, email: 'nobody@example.com' }
  });
  check('password reset does not disclose account existence',
    forgotUnknown.text.includes('If an account exists'));

  const inCsrf2 = await csrfFrom('/signin');
  const backIn = await req('POST', '/signin', {
    body: { _csrf: inCsrf2.token, email: 'smoke@example.com', password: 'correct horse battery staple' }
  });
  check('correct password -> 303', backIn.status === 303, `got ${backIn.status}`);
  const accountAgain = await req('GET', '/account');
  check('signed in again', accountAgain.status === 200, `got ${accountAgain.status}`);

  console.log('\nGDPR: erasure');
  const delCsrf = await csrfFrom('/account/delete');
  const noPassword = await req('POST', '/account/delete', {
    body: { _csrf: delCsrf.token, confirm: 'yes' }
  });
  check('deletion without a password -> 400', noPassword.status === 400, `got ${noPassword.status}`);
  const noConfirm = await req('POST', '/account/delete', {
    body: { _csrf: delCsrf.token, password: 'correct horse battery staple' }
  });
  check('deletion without confirmation -> 400', noConfirm.status === 400, `got ${noConfirm.status}`);

  const userId = user.id;
  const del2 = await csrfFrom('/account/delete');
  const deleted = await req('POST', '/account/delete', {
    body: {
      _csrf: del2.token,
      password: 'correct horse battery staple',
      confirm: 'yes',
      reason: 'Smoke test'
    }
  });
  check('deletion -> 200', deleted.status === 200, `got ${deleted.status}`);
  check('confirmation page shown', deleted.text.includes('has been deleted'));

  const tables = [
    ['users', 'id'], ['downloads', 'user_id'], ['saved_resources', 'user_id'],
    ['module_progress', 'user_id'], ['assessments', 'user_id'], ['boards', 'owner_id'],
    ['consent_events', 'user_id']
  ];
  let orphans = 0;
  for (const [table, column] of tables) {
    const n = db.prepare(`SELECT COUNT(*) AS n FROM ${table} WHERE ${column} = ?`).get(userId).n;
    if (n > 0) { orphans += n; console.log(`        ${table}.${column} still has ${n} row(s)`); }
  }
  check('deletion cascaded everywhere - no rows reference the user', orphans === 0, `${orphans} orphan rows`);
  check('board notes deleted with the board',
    db.prepare('SELECT COUNT(*) AS n FROM board_items').get().n === 0);
  check('audit log anonymised, not deleted',
    db.prepare('SELECT COUNT(*) AS n FROM audit_log WHERE user_id = ?').get(userId).n === 0 &&
    db.prepare('SELECT COUNT(*) AS n FROM audit_log').get().n > 0);
  check('no email address left in the audit log',
    db.prepare(`SELECT COUNT(*) AS n FROM audit_log WHERE actor_email IS NOT NULL`).get().n === 0);
  check('deletion receipt written',
    db.prepare('SELECT COUNT(*) AS n FROM deletion_receipts').get().n === 1);
  const receipt = db.prepare('SELECT email_hash FROM deletion_receipts LIMIT 1').get();
  check('receipt holds a hash, not an email', !receipt.email_hash.includes('@') && receipt.email_hash.length === 64);

  const reuse = await csrfFrom('/signin');
  const cannotSignIn = await req('POST', '/signin', {
    body: { _csrf: reuse.token, email: 'smoke@example.com', password: 'correct horse battery staple' }
  });
  check('deleted account cannot sign in', cannotSignIn.status === 400, `got ${cannotSignIn.status}`);

  console.log('\n404 handling');
  const missing = await req('GET', '/no-such-page');
  check('unknown page -> 404', missing.status === 404, `got ${missing.status}`);
  check('404 page is helpful', missing.text.includes('Page not found'));
  const missingResource = await req('GET', '/resources/nope');
  check('unknown resource -> 404', missingResource.status === 404, `got ${missingResource.status}`);
  const missingLegal = await req('GET', '/legal/nope');
  check('unknown legal page -> 404', missingLegal.status === 404, `got ${missingLegal.status}`);

  console.log('\nRetention script (dry run)');
  const { execFileSync } = require('child_process');
  try {
    const out = execFileSync(process.execPath, [path.join(__dirname, 'retention.js')], {
      env: { ...process.env },
      encoding: 'utf8'
    });
    check('retention dry run completes', out.includes('Dry run complete'));
    check('retention deletes nothing on a dry run', out.includes('Nothing was deleted'));
  } catch (err) {
    check('retention dry run completes', false, err.message);
  }

  /* ------------------------------- report ------------------------------- */

  console.log(`\n${pass} passed, ${fail} failed\n`);
  if (fail) {
    console.log('Failures:');
    failures.forEach((f) => console.log(`  - ${f}`));
    console.log('');
  }
  return fail === 0;
}

const server = app.listen(0, async () => {
  base = `http://127.0.0.1:${server.address().port}`;
  let ok = false;
  try {
    ok = await run();
  } catch (err) {
    console.error('\nSmoke test crashed:\n', err);
  } finally {
    server.close();
    try { fs.rmSync(TMP, { recursive: true, force: true }); } catch { /* ignore */ }
    process.exit(ok ? 0 : 1);
  }
});
