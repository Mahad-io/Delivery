'use strict';

const { db, hashIp } = require('../db');

const insertAudit = db.prepare(
  `INSERT INTO audit_log (user_id, actor_email, action, detail, ip_hash)
   VALUES (@user_id, @actor_email, @action, @detail, @ip_hash)`
);

const insertConsent = db.prepare(
  `INSERT INTO consent_events (user_id, anon_id, purpose, granted, mechanism, policy_version, ip_hash, user_agent)
   VALUES (@user_id, @anon_id, @purpose, @granted, @mechanism, @policy_version, @ip_hash, @user_agent)`
);

/**
 * Append an entry to the audit log. Best-effort: auditing must never break a
 * user-facing request, so failures are logged and swallowed.
 */
function audit(req, action, detail, userOverride) {
  try {
    const actor = userOverride || req?.user || null;
    insertAudit.run({
      user_id: actor?.id ?? null,
      actor_email: actor?.email ?? null,
      action,
      detail: detail == null ? null : typeof detail === 'string' ? detail : JSON.stringify(detail),
      ip_hash: hashIp(req?.ip)
    });
  } catch (err) {
    console.error('[audit] failed to write entry', action, err.message);
  }
}

/**
 * Record a consent decision. Append-only by design: this is the Art. 7(1)
 * evidence that consent was freely given, for this purpose, at this time.
 */
function recordConsent(req, { purpose, granted, mechanism, policyVersion }) {
  try {
    insertConsent.run({
      user_id: req?.user?.id ?? null,
      anon_id: req?.session?.anonId ?? null,
      purpose,
      granted: granted ? 1 : 0,
      mechanism,
      policy_version: policyVersion || null,
      ip_hash: hashIp(req?.ip),
      user_agent: (req?.get?.('user-agent') || '').slice(0, 250) || null
    });
  } catch (err) {
    console.error('[consent] failed to write entry', purpose, err.message);
  }
}

module.exports = { audit, recordConsent };
