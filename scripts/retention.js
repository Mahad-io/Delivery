#!/usr/bin/env node
'use strict';

/*
 * Retention enforcement. Run daily.
 *
 *   npm run retention           dry run - reports what would be deleted
 *   npm run retention -- --go   actually delete
 *
 * Implements content/governance/retention-schedule.md. If a category is added
 * to the schema, add it here and to that document, or the schedule becomes a
 * work of fiction.
 */

require('dotenv').config();

const { db } = require('../src/db');
const config = require('../src/lib/config');
const mail = require('../src/lib/mail');

const GO = process.argv.includes('--go');
const R = config.retention;

const q = {
  unverified: db.prepare(
    `SELECT id, email, name FROM users
      WHERE email_verified = 0 AND created_at < datetime('now', ?)`
  ),
  inactiveWarn: db.prepare(
    `SELECT id, email, name, last_login_at, created_at FROM users
      WHERE COALESCE(last_seen_at, last_login_at, created_at) < datetime('now', ?)
        AND COALESCE(last_seen_at, last_login_at, created_at) >= datetime('now', ?)`
  ),
  inactiveDelete: db.prepare(
    `SELECT id, email, name FROM users
      WHERE COALESCE(last_seen_at, last_login_at, created_at) < datetime('now', ?)`
  ),
  deleteUser: db.prepare('DELETE FROM users WHERE id = ?'),
  anonymiseAudit: db.prepare(
    `UPDATE audit_log SET user_id = NULL, actor_email = NULL, ip_hash = NULL, detail = NULL WHERE user_id = ?`
  ),
  oldAudit: db.prepare(`SELECT COUNT(*) AS n FROM audit_log WHERE created_at < datetime('now', ?)`),
  deleteOldAudit: db.prepare(`DELETE FROM audit_log WHERE created_at < datetime('now', ?)`),
  orphanConsent: db.prepare(
    `SELECT COUNT(*) AS n FROM consent_events
      WHERE user_id IS NULL AND created_at < datetime('now', '-365 days')`
  ),
  deleteOrphanConsent: db.prepare(
    `DELETE FROM consent_events WHERE user_id IS NULL AND created_at < datetime('now', '-365 days')`
  ),
  oldReceipts: db.prepare(
    `SELECT COUNT(*) AS n FROM deletion_receipts WHERE completed_at < datetime('now', '-2192 days')`
  ),
  deleteOldReceipts: db.prepare(
    `DELETE FROM deletion_receipts WHERE completed_at < datetime('now', '-2192 days')`
  ),
  logRun: db.prepare(
    `INSERT INTO audit_log (action, detail) VALUES ('retention.run', ?)`
  )
};

async function main() {
  const summary = {};
  console.log(`\nRetention run - ${GO ? 'LIVE' : 'DRY RUN'} - ${new Date().toISOString()}\n`);

  /* 1. Unverified accounts */
  const unverified = q.unverified.all(`-${R.unverifiedAccountDays} days`);
  summary.unverified_accounts_deleted = unverified.length;
  console.log(`Unverified accounts older than ${R.unverifiedAccountDays} days: ${unverified.length}`);
  if (GO) {
    for (const u of unverified) {
      db.transaction(() => {
        q.anonymiseAudit.run(u.id);
        q.deleteUser.run(u.id);
      })();
    }
  }

  /* 2. Inactive accounts - warn 30 days before deletion */
  const warnFrom = `-${R.inactiveAccountDays - 30} days`;
  const warnTo = `-${R.inactiveAccountDays} days`;
  const toWarn = q.inactiveWarn.all(warnFrom, warnTo);
  summary.inactive_accounts_warned = toWarn.length;
  console.log(`Inactive accounts entering the 30-day warning window: ${toWarn.length}`);
  if (GO) {
    for (const u of toWarn) {
      await mail.deliver({
        to: u.email,
        subject: `Your ${config.siteName} account will be deleted in 30 days`,
        text: [
          `Hello ${u.name},`,
          '',
          `You have not signed in to ${config.siteName} for nearly ${Math.round(R.inactiveAccountDays / 365 * 10) / 10} years.`,
          'Our retention policy is to delete accounts that have been unused that long, so yours will be',
          'deleted in 30 days along with your download history, saved templates, learning progress',
          'and any retro boards.',
          '',
          `To keep it, just sign in: ${config.baseUrl}/signin`,
          `To take your data with you first: ${config.baseUrl}/account/privacy`,
          `To delete it now: ${config.baseUrl}/account/delete`,
          '',
          `Retention schedule: ${config.baseUrl}/governance/retention`
        ].join('\n')
      });
    }
  }

  const toDelete = q.inactiveDelete.all(warnTo);
  summary.inactive_accounts_deleted = toDelete.length;
  console.log(`Inactive accounts past ${R.inactiveAccountDays} days, for deletion: ${toDelete.length}`);
  if (GO) {
    for (const u of toDelete) {
      db.transaction(() => {
        q.anonymiseAudit.run(u.id);
        q.deleteUser.run(u.id);
      })();
    }
  }

  /* 3. Audit log expiry */
  const auditWindow = `-${R.auditLogDays} days`;
  const oldAudit = q.oldAudit.get(auditWindow).n;
  summary.audit_rows_deleted = oldAudit;
  console.log(`Audit rows older than ${R.auditLogDays} days: ${oldAudit}`);
  if (GO) q.deleteOldAudit.run(auditWindow);

  /* 4. Orphan (pre-signup) consent events */
  const orphan = q.orphanConsent.get().n;
  summary.orphan_consent_rows_deleted = orphan;
  console.log(`Pre-signup consent records older than 365 days: ${orphan}`);
  if (GO) q.deleteOrphanConsent.run();

  /* 5. Deletion receipts past 6 years */
  const receipts = q.oldReceipts.get().n;
  summary.deletion_receipts_deleted = receipts;
  console.log(`Deletion receipts older than 6 years: ${receipts}`);
  if (GO) q.deleteOldReceipts.run();

  console.log('');
  if (GO) {
    // Counts only. Never record who was deleted.
    q.logRun.run(JSON.stringify(summary));
    console.log('Done. Summary written to the audit log (counts only, no identifiers).');
  } else {
    console.log('Dry run complete. Nothing was deleted. Re-run with --go to apply.');
  }
  console.log('');
}

main().catch((err) => {
  console.error('Retention run failed:', err);
  process.exit(1);
});
