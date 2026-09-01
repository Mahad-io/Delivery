'use strict';

const express = require('express');
const bcrypt = require('bcryptjs');

const { db, hashEmail } = require('../db');
const config = require('../lib/config');
const mail = require('../lib/mail');
const { audit, recordConsent } = require('../lib/audit');
const { limits } = require('../middleware/security');
const { requireUser } = require('../middleware/auth');
const { getResource } = require('../data/catalogue');

const router = express.Router();

const q = {
  fullUser: db.prepare('SELECT * FROM users WHERE id = ?'),
  consents: db.prepare('SELECT purpose, granted, mechanism, policy_version, created_at FROM consent_events WHERE user_id = ? ORDER BY created_at DESC'),
  downloads: db.prepare('SELECT resource_id, format, created_at FROM downloads WHERE user_id = ? ORDER BY created_at DESC'),
  saved: db.prepare('SELECT resource_id, created_at FROM saved_resources WHERE user_id = ?'),
  progress: db.prepare('SELECT path_id, module_id, status, updated_at FROM module_progress WHERE user_id = ?'),
  assessments: db.prepare('SELECT kind, answers, scores, created_at FROM assessments WHERE user_id = ?'),
  boards: db.prepare('SELECT id, title, template, created_at, updated_at FROM boards WHERE owner_id = ?'),
  boardItems: db.prepare('SELECT board_id, column_id, body, votes, created_at FROM board_items WHERE board_id IN (SELECT id FROM boards WHERE owner_id = ?)'),
  auditRows: db.prepare('SELECT action, detail, created_at FROM audit_log WHERE user_id = ? ORDER BY created_at DESC'),
  setConsents: db.prepare('UPDATE users SET marketing_consent = @marketing, analytics_consent = @analytics WHERE id = @id'),
  deleteUser: db.prepare('DELETE FROM users WHERE id = ?'),
  anonymiseAudit: db.prepare('UPDATE audit_log SET user_id = NULL, actor_email = NULL, ip_hash = NULL, detail = NULL WHERE user_id = ?'),
  receipt: db.prepare('INSERT INTO deletion_receipts (email_hash, requested_at, reason) VALUES (?, ?, ?)')
};

/* --------------------------- cookie consent ---------------------------- */

/**
 * Consent endpoint used by the banner. Rejecting is exactly as easy as
 * accepting (both are a single button), which is the PECR/UK GDPR expectation.
 * No non-essential cookie or storage is set until this has been called with a
 * grant, and the banner does not block use of the site.
 */
router.post('/consent', (req, res) => {
  const decision = String(req.body.decision || '');
  const granular = decision === 'custom';

  const analytics = granular ? !!req.body.analytics : decision === 'accept-all';
  const marketing = granular ? !!req.body.marketing : decision === 'accept-all';

  req.session.consent = {
    essential: true,
    analytics,
    marketing,
    version: config.versions.cookies,
    decidedAt: new Date().toISOString()
  };

  recordConsent(req, {
    purpose: 'analytics',
    granted: analytics,
    mechanism: `cookie banner (${decision})`,
    policyVersion: config.versions.cookies
  });
  recordConsent(req, {
    purpose: 'marketing',
    granted: marketing,
    mechanism: `cookie banner (${decision})`,
    policyVersion: config.versions.cookies
  });

  if (req.user) {
    q.setConsents.run({ id: req.user.id, marketing: marketing ? 1 : 0, analytics: analytics ? 1 : 0 });
  }

  audit(req, 'consent.recorded', { decision, analytics, marketing });

  if (req.accepts(['html', 'json']) === 'json') {
    return res.json({ ok: true, consent: req.session.consent });
  }
  const back = typeof req.body.next === 'string' && req.body.next.startsWith('/') ? req.body.next : '/';
  return res.redirect(303, back);
});

router.get('/cookies', (req, res) => {
  res.render('pages/cookie-settings', {
    title: 'Cookie settings',
    purposes: config.cookiePurposes,
    current: req.session.consent || null
  });
});

/* --------------------------- privacy dashboard -------------------------- */

router.get('/account/privacy', requireUser({ reason: 'manage your data' }), (req, res) => {
  const user = q.fullUser.get(req.user.id);
  res.render('pages/privacy-dashboard', {
    title: 'Your data and privacy',
    account: user,
    consents: q.consents.all(req.user.id),
    counts: {
      downloads: q.downloads.all(req.user.id).length,
      saved: q.saved.all(req.user.id).length,
      progress: q.progress.all(req.user.id).length,
      assessments: q.assessments.all(req.user.id).length,
      boards: q.boards.all(req.user.id).length,
      audit: q.auditRows.all(req.user.id).length
    }
  });
});

/* ---------------------- Art. 15 / 20: access & export ------------------- */

function buildExport(userId) {
  const user = q.fullUser.get(userId);
  if (!user) return null;

  // Never export secrets, even to the data subject: hashes and tokens are not
  // their personal data in any useful sense and exporting them creates risk.
  const {
    password_hash, verify_token, reset_token, verify_expires_at, reset_expires_at, ...account
  } = user;

  return {
    export_generated_at: new Date().toISOString(),
    controller: {
      name: config.org.legalName,
      address: config.org.address,
      ico_registration: config.org.icoRegistration,
      contact: config.org.dpoEmail
    },
    notes: [
      'This is a complete copy of the personal data held about you, in a structured, commonly used, machine-readable format (UK GDPR Art. 20).',
      'Password hashes and one-time tokens are deliberately excluded: they are security credentials, not information about you.',
      'IP addresses are never stored in raw form. Where a hash appears it is an unkeyed HMAC and is not reversible without the server salt.'
    ],
    account,
    consent_history: q.consents.all(userId),
    downloads: q.downloads.all(userId).map((d) => ({
      ...d,
      resource_title: getResource(d.resource_id)?.title || d.resource_id
    })),
    saved_resources: q.saved.all(userId),
    learning_progress: q.progress.all(userId),
    assessments: q.assessments.all(userId).map((a) => ({
      kind: a.kind,
      created_at: a.created_at,
      answers: JSON.parse(a.answers),
      scores: JSON.parse(a.scores)
    })),
    retro_boards: q.boards.all(userId),
    retro_board_items: q.boardItems.all(userId),
    security_and_activity_log: q.auditRows.all(userId)
  };
}

router.get('/account/data.json', limits.dsar, requireUser({ reason: 'export your data' }), async (req, res, next) => {
  try {
    const data = buildExport(req.user.id);
    audit(req, 'gdpr.data_exported', { format: 'json' });
    await mail.deliver(mail.dataExportEmail(req.user));
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="delivery-hub-data-${req.user.id}.json"`);
    res.setHeader('Cache-Control', 'private, no-store');
    res.send(JSON.stringify(data, null, 2));
  } catch (err) { next(err); }
});

router.get('/account/data.txt', limits.dsar, requireUser({ reason: 'export your data' }), (req, res) => {
  const data = buildExport(req.user.id);
  const lines = [];
  const write = (indent, key, value) => lines.push(`${' '.repeat(indent)}${key}: ${value}`);
  lines.push(`Personal data held by ${config.org.legalName}`);
  lines.push(`Generated ${data.export_generated_at}`);
  lines.push('');
  lines.push('ACCOUNT');
  for (const [k, v] of Object.entries(data.account)) write(2, k, v === null ? '(not provided)' : v);
  lines.push('', 'CONSENT HISTORY');
  for (const c of data.consent_history) write(2, c.created_at, `${c.purpose} = ${c.granted ? 'granted' : 'refused'} (${c.mechanism})`);
  lines.push('', 'DOWNLOADS');
  for (const d of data.downloads) write(2, d.created_at, `${d.resource_title} (${d.format})`);
  lines.push('', 'LEARNING PROGRESS');
  for (const p of data.learning_progress) write(2, p.updated_at, `${p.path_id} / ${p.module_id} - ${p.status}`);
  lines.push('', 'ASSESSMENTS');
  for (const a of data.assessments) write(2, a.created_at, `${a.kind} - overall ${a.scores.percent}%`);
  lines.push('', 'RETRO BOARDS');
  for (const b of data.retro_boards) write(2, b.created_at, `${b.title} (${b.template})`);
  lines.push('', 'ACTIVITY AND SECURITY LOG');
  for (const a of data.security_and_activity_log) write(2, a.created_at, a.action);
  lines.push('', 'NOTES');
  for (const n of data.notes) lines.push(`  - ${n}`);
  lines.push('');
  audit(req, 'gdpr.data_exported', { format: 'txt' });
  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.setHeader('Content-Disposition', `attachment; filename="delivery-hub-data-${req.user.id}.txt"`);
  res.setHeader('Cache-Control', 'private, no-store');
  res.send(lines.join('\n'));
});

/* ------------------------ Art. 17: erasure ----------------------------- */

router.get('/account/delete', requireUser({ reason: 'delete your account' }), (req, res) => {
  res.render('pages/delete-account', { title: 'Delete your account', errors: [] });
});

router.post('/account/delete', limits.dsar, requireUser({ reason: 'delete your account' }), async (req, res, next) => {
  try {
    const user = q.fullUser.get(req.user.id);
    const password = String(req.body.password || '');
    const errors = [];

    if (!req.body.confirm) {
      errors.push({ field: 'confirm', message: 'Tick the box to confirm you understand this cannot be undone' });
    }
    if (!password || !(await bcrypt.compare(password, user.password_hash))) {
      errors.push({ field: 'password', message: 'Enter your current password to confirm it is you' });
    }
    if (errors.length) {
      return res.status(400).render('pages/delete-account', { title: 'Delete your account', errors });
    }

    const email = user.email;
    const name = user.name;
    const requestedAt = new Date().toISOString();

    // Real deletion, in one transaction. Foreign keys cascade to downloads,
    // saved resources, progress, assessments, boards and board items. The
    // audit log is anonymised rather than deleted, because retaining a
    // non-attributable security record is a legitimate interest and the rows
    // no longer constitute personal data once the identifiers are gone.
    const erase = db.transaction(() => {
      q.anonymiseAudit.run(user.id);
      q.deleteUser.run(user.id);
      q.receipt.run(hashEmail(email), requestedAt, String(req.body.reason || '').slice(0, 200) || null);
    });
    erase();

    audit(req, 'gdpr.account_deleted');
    await mail.deliver(mail.deletionConfirmationEmail(email, name));

    req.session.destroy(() => {
      res.clearCookie('dh.sid');
      res.status(200).render('pages/delete-done', {
        title: 'Your account has been deleted',
        config,
        user: null,
        consent: null,
        currentPath: '/account/delete',
        flash: null,
        year: new Date().getFullYear(),
        csrfToken: '',
        cspNonce: res.locals.cspNonce
      });
    });
  } catch (err) { next(err); }
});

/* ------------- Art. 18 / 21: restriction, objection, complaint ---------- */

router.get('/account/requests', requireUser({ reason: 'make a data request' }), (req, res) => {
  res.render('pages/data-requests', { title: 'Other data requests', submitted: false, errors: [] });
});

router.post('/account/requests', limits.dsar, requireUser({ reason: 'make a data request' }), async (req, res, next) => {
  try {
    const kind = ['restriction', 'objection', 'rectification', 'portability', 'complaint'].includes(req.body.kind)
      ? req.body.kind
      : null;
    const detail = String(req.body.detail || '').trim().slice(0, 2000);
    if (!kind) {
      return res.status(400).render('pages/data-requests', {
        title: 'Other data requests',
        submitted: false,
        errors: [{ field: 'kind', message: 'Choose the kind of request you are making' }]
      });
    }

    audit(req, 'gdpr.request_submitted', { kind, detail_length: detail.length });
    await mail.deliver({
      to: config.org.dpoEmail,
      subject: `[DSAR] ${kind} request from user ${req.user.id}`,
      text: [
        `Request type: ${kind}`,
        `User id: ${req.user.id}`,
        `Received: ${new Date().toISOString()}`,
        `Statutory deadline: one calendar month from receipt`,
        '',
        'Detail supplied by the data subject:',
        detail || '(none)'
      ].join('\n')
    });

    res.render('pages/data-requests', { title: 'Request received', submitted: true, errors: [], kind });
  } catch (err) { next(err); }
});

module.exports = router;
