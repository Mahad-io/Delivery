'use strict';

const crypto = require('crypto');
const { db } = require('../db');

const findUserById = db.prepare(
  `SELECT id, email, name, job_role, organisation, experience_level,
          email_verified, marketing_consent, analytics_consent, created_at, last_login_at
     FROM users WHERE id = ?`
);
const touchSeen = db.prepare(`UPDATE users SET last_seen_at = datetime('now') WHERE id = ?`);

/**
 * Loads the signed-in user onto req.user / res.locals.user, and gives every
 * visitor a pseudonymous session id so pre-signup consent choices can be
 * attributed without identifying anyone.
 */
function attachUser(req, res, next) {
  if (!req.session.anonId) {
    req.session.anonId = crypto.randomUUID();
  }

  if (req.session.userId) {
    const user = findUserById.get(req.session.userId);
    if (user) {
      req.user = user;
      try {
        touchSeen.run(user.id);
      } catch { /* non-fatal */ }
    } else {
      // Account was deleted while the session was live.
      delete req.session.userId;
    }
  }

  res.locals.user = req.user || null;
  res.locals.consent = req.session.consent || null;
  res.locals.currentPath = req.path;
  next();
}

/**
 * Gate for anything that needs an account. Instead of a bare 403 it stashes
 * where the user was heading and sends them to signup with an explanation -
 * this is the "prompt to sign up" behaviour for downloads and saved tools.
 */
function requireUser(options = {}) {
  const { reason = 'to use this feature', resourceTitle = null } = options;
  return (req, res, next) => {
    if (req.user) return next();

    if (req.accepts(['html', 'json']) === 'json' || req.xhr) {
      return res.status(401).json({
        error: 'signup_required',
        reason,
        signupUrl: `/signup?next=${encodeURIComponent(req.originalUrl)}`
      });
    }

    req.session.pendingIntent = {
      url: req.originalUrl,
      reason,
      resourceTitle,
      at: new Date().toISOString()
    };
    return res.redirect(303, `/signup?next=${encodeURIComponent(req.originalUrl)}`);
  };
}

function requireVerified(req, res, next) {
  if (req.user && !req.user.email_verified) {
    return res.status(403).render('pages/verify-required', {
      title: 'Confirm your email address'
    });
  }
  return next();
}

module.exports = { attachUser, requireUser, requireVerified };
