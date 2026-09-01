'use strict';

const crypto = require('crypto');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

/**
 * Content-Security-Policy is nonce-based: there are no inline scripts or inline
 * event handlers anywhere in the views. If you add one, give it the nonce
 * rather than loosening the policy.
 */
function cspNonce(req, res, next) {
  res.locals.cspNonce = crypto.randomBytes(16).toString('base64');
  next();
}

function securityHeaders() {
  const directives = {
    defaultSrc: ["'self'"],
    baseUri: ["'self'"],
    objectSrc: ["'none'"],
    frameAncestors: ["'none'"],
    formAction: ["'self'"],
    scriptSrc: ["'self'", (req, res) => `'nonce-${res.locals.cspNonce}'`],
    styleSrc: ["'self'"],
    imgSrc: ["'self'", 'data:'],
    fontSrc: ["'self'"],
    connectSrc: ["'self'"],
    manifestSrc: ["'self'"]
  };
  if (process.env.NODE_ENV === 'production') {
    directives.upgradeInsecureRequests = [];
  }

  return helmet({
    contentSecurityPolicy: { useDefaults: false, directives },
    crossOriginEmbedderPolicy: false,
    referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
    hsts:
      process.env.NODE_ENV === 'production'
        ? { maxAge: 31536000, includeSubDomains: true, preload: false }
        : false
  });
}

/* ------------------------------------------------------------------ *
 * CSRF: synchroniser token pattern, stored in the session.
 * ------------------------------------------------------------------ */

const SAFE_METHODS = new Set(['GET', 'HEAD', 'OPTIONS']);

function csrf(req, res, next) {
  if (!req.session.csrfToken) {
    req.session.csrfToken = crypto.randomBytes(32).toString('hex');
  }
  res.locals.csrfToken = req.session.csrfToken;

  if (SAFE_METHODS.has(req.method)) return next();

  const supplied =
    req.body?._csrf || req.get('x-csrf-token') || req.query?._csrf || '';
  const expected = req.session.csrfToken;

  const ok =
    supplied.length === expected.length &&
    crypto.timingSafeEqual(Buffer.from(supplied), Buffer.from(expected));

  if (!ok) {
    const err = new Error('Invalid or missing CSRF token');
    err.status = 403;
    err.userMessage =
      'Your session expired or the form was submitted from another page. Please go back, reload and try again.';
    return next(err);
  }
  return next();
}

/* ------------------------------------------------------------------ *
 * Rate limits. Tight on credential endpoints, generous elsewhere.
 * ------------------------------------------------------------------ */

const limiter = (windowMs, max, message) =>
  rateLimit({
    windowMs,
    max,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: message },
    // Do not key on the raw IP any longer than the window itself.
    keyGenerator: (req) => req.ip
  });

const limits = {
  global: limiter(15 * 60 * 1000, 1000, 'Too many requests. Please slow down.'),
  auth: limiter(15 * 60 * 1000, 20, 'Too many attempts. Please wait 15 minutes and try again.'),
  passwordReset: limiter(60 * 60 * 1000, 5, 'Too many reset requests. Please try again in an hour.'),
  download: limiter(60 * 60 * 1000, 200, 'Download limit reached for this hour.'),
  dsar: limiter(24 * 60 * 60 * 1000, 10, 'Too many data requests today. Please email us instead.')
};

module.exports = { cspNonce, securityHeaders, csrf, limits };
