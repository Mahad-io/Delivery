'use strict';

const crypto = require('crypto');
const express = require('express');
const bcrypt = require('bcryptjs');

const { db } = require('../db');
const config = require('../lib/config');
const mail = require('../lib/mail');
const { audit, recordConsent } = require('../lib/audit');
const { limits } = require('../middleware/security');

const router = express.Router();

const q = {
  byEmail: db.prepare('SELECT * FROM users WHERE email = ?'),
  insert: db.prepare(`
    INSERT INTO users (email, password_hash, name, job_role, organisation, experience_level,
                       marketing_consent, analytics_consent, terms_version, privacy_version,
                       verify_token, verify_expires_at)
    VALUES (@email, @password_hash, @name, @job_role, @organisation, @experience_level,
            @marketing_consent, @analytics_consent, @terms_version, @privacy_version,
            @verify_token, datetime('now', '+1 day'))`),
  markVerified: db.prepare(`
    UPDATE users SET email_verified = 1, verify_token = NULL, verify_expires_at = NULL WHERE id = ?`),
  byVerifyToken: db.prepare(`
    SELECT * FROM users WHERE verify_token = ? AND verify_expires_at > datetime('now')`),
  setVerifyToken: db.prepare(`
    UPDATE users SET verify_token = ?, verify_expires_at = datetime('now','+1 day') WHERE id = ?`),
  loginOk: db.prepare(`
    UPDATE users SET last_login_at = datetime('now'), failed_logins = 0, locked_until = NULL WHERE id = ?`),
  loginFail: db.prepare(`
    UPDATE users SET failed_logins = failed_logins + 1,
      locked_until = CASE WHEN failed_logins + 1 >= 8 THEN datetime('now','+15 minutes') ELSE locked_until END
    WHERE id = ?`),
  setResetToken: db.prepare(`
    UPDATE users SET reset_token = ?, reset_expires_at = datetime('now','+1 hour') WHERE id = ?`),
  byResetToken: db.prepare(`
    SELECT * FROM users WHERE reset_token = ? AND reset_expires_at > datetime('now')`),
  setPassword: db.prepare(`
    UPDATE users SET password_hash = ?, reset_token = NULL, reset_expires_at = NULL,
      failed_logins = 0, locked_until = NULL WHERE id = ?`),
  updateProfile: db.prepare(`
    UPDATE users SET name = @name, job_role = @job_role, organisation = @organisation,
      experience_level = @experience_level WHERE id = @id`),
  setConsents: db.prepare(`
    UPDATE users SET marketing_consent = @marketing, analytics_consent = @analytics WHERE id = @id`)
};

/* --------------------------- validation helpers -------------------------- */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const EXPERIENCE = ['new', '1-3', '3-7', '7+'];

// Common-password screening, per NCSC guidance. In production, replace with the
// full Have I Been Pwned k-anonymity range check.
const BANNED_PASSWORDS = new Set([
  'password', 'password1', 'password123', '123456', '12345678', '123456789',
  'qwerty', 'qwerty123', 'letmein', 'welcome', 'monkey', 'dragon', 'football',
  'iloveyou', 'admin', 'abc123', 'passw0rd', 'delivery', 'deliverymanager',
  'scrummaster', 'agile123', 'sprint123'
]);

function validateSignup(body) {
  const errors = [];
  const email = String(body.email || '').trim().toLowerCase();
  const name = String(body.name || '').trim();
  const password = String(body.password || '');
  const jobRole = String(body.job_role || '').trim().slice(0, 80);
  const organisation = String(body.organisation || '').trim().slice(0, 120);
  const experience = EXPERIENCE.includes(body.experience_level) ? body.experience_level : null;

  if (!name) errors.push({ field: 'name', message: 'Enter your name' });
  if (name.length > 80) errors.push({ field: 'name', message: 'Name must be 80 characters or fewer' });
  if (!email) errors.push({ field: 'email', message: 'Enter your email address' });
  else if (!EMAIL_RE.test(email) || email.length > 200)
    errors.push({ field: 'email', message: 'Enter an email address in the correct format, like name@example.com' });

  if (password.length < 12)
    errors.push({ field: 'password', message: 'Password must be at least 12 characters. A short phrase of three random words works well.' });
  if (password.length > 200)
    errors.push({ field: 'password', message: 'Password must be 200 characters or fewer' });
  if (BANNED_PASSWORDS.has(password.toLowerCase()))
    errors.push({ field: 'password', message: 'That password is too common. Choose something less guessable.' });
  if (password && email && password.toLowerCase().includes(email.split('@')[0]))
    errors.push({ field: 'password', message: 'Password must not contain your email address' });

  if (!body.accept_terms)
    errors.push({ field: 'accept_terms', message: 'You must accept the terms of use and confirm you have read the privacy notice' });

  return {
    errors,
    values: { email, name, password, jobRole, organisation, experience }
  };
}

function safeNext(next) {
  // Only ever redirect to a local path. Prevents open-redirect abuse.
  if (typeof next !== 'string' || !next.startsWith('/') || next.startsWith('//')) return '/account';
  return next;
}

/* -------------------------------- signup -------------------------------- */

router.get('/signup', (req, res) => {
  if (req.user) return res.redirect(303, safeNext(req.query.next));
  res.render('pages/signup', {
    title: 'Create your free account',
    next: typeof req.query.next === 'string' ? req.query.next : '',
    intent: req.session.pendingIntent || null,
    errors: [],
    values: {}
  });
});

router.post('/signup', limits.auth, async (req, res, next) => {
  try {
    const { errors, values } = validateSignup(req.body);
    const nextUrl = safeNext(req.body.next);

    if (!errors.length && q.byEmail.get(values.email)) {
      // Do not confirm account existence beyond what the user already implied
      // by trying to register; point them at sign-in instead.
      errors.push({
        field: 'email',
        message: 'An account already exists for that email address. Sign in instead, or reset your password.'
      });
    }

    if (errors.length) {
      return res.status(400).render('pages/signup', {
        title: 'Create your free account',
        next: req.body.next || '',
        intent: req.session.pendingIntent || null,
        errors,
        values: { ...values, password: '' }
      });
    }

    const verifyToken = crypto.randomBytes(32).toString('hex');
    const info = q.insert.run({
      email: values.email,
      password_hash: await bcrypt.hash(values.password, 12),
      name: values.name,
      job_role: values.jobRole || null,
      organisation: values.organisation || null,
      experience_level: values.experience,
      marketing_consent: req.body.marketing_consent ? 1 : 0,
      analytics_consent: req.session?.consent?.analytics ? 1 : 0,
      terms_version: config.versions.terms,
      privacy_version: config.versions.privacy,
      verify_token: verifyToken
    });

    req.session.userId = info.lastInsertRowid;
    req.user = { id: info.lastInsertRowid, email: values.email, name: values.name };

    recordConsent(req, {
      purpose: 'account_terms',
      granted: true,
      mechanism: 'signup form checkbox',
      policyVersion: `terms ${config.versions.terms} / privacy ${config.versions.privacy}`
    });
    recordConsent(req, {
      purpose: 'marketing',
      granted: !!req.body.marketing_consent,
      mechanism: 'signup form checkbox (unticked by default)',
      policyVersion: config.versions.privacy
    });
    audit(req, 'account.created', { experience: values.experience });

    await mail.deliver(mail.verificationEmail(req.user, verifyToken));

    const intent = req.session.pendingIntent;
    delete req.session.pendingIntent;
    req.session.flash = {
      kind: 'success',
      title: 'Account created',
      message: intent
        ? `You can now ${intent.reason}. Check your email to confirm your address - some features stay locked until you do.`
        : 'Check your email to confirm your address.'
    };

    return res.redirect(303, nextUrl);
  } catch (err) {
    return next(err);
  }
});

/* ------------------------------ verification ----------------------------- */

router.get('/verify', (req, res) => {
  const user = q.byVerifyToken.get(String(req.query.token || ''));
  if (!user) {
    return res.status(400).render('pages/error', {
      title: 'Confirmation link not valid',
      status: 400,
      heading: 'That confirmation link is not valid',
      message: 'It may have expired or already been used. Sign in and request a new one from your account page.'
    });
  }
  q.markVerified.run(user.id);
  req.session.userId = user.id;
  audit(req, 'account.verified', null, user);
  req.session.flash = { kind: 'success', title: 'Email confirmed', message: 'Everything is unlocked. Welcome aboard.' };
  res.redirect(303, '/account');
});

router.post('/verify/resend', limits.passwordReset, async (req, res, next) => {
  try {
    if (!req.user) return res.redirect(303, '/signin');
    const token = crypto.randomBytes(32).toString('hex');
    q.setVerifyToken.run(token, req.user.id);
    await mail.deliver(mail.verificationEmail(req.user, token));
    audit(req, 'account.verification_resent');
    req.session.flash = { kind: 'success', title: 'Confirmation email sent', message: 'It should arrive within a couple of minutes.' };
    res.redirect(303, '/account');
  } catch (err) { next(err); }
});

/* -------------------------------- sign in ------------------------------- */

router.get('/signin', (req, res) => {
  if (req.user) return res.redirect(303, safeNext(req.query.next));
  res.render('pages/signin', {
    title: 'Sign in',
    next: typeof req.query.next === 'string' ? req.query.next : '',
    errors: [],
    values: {}
  });
});

router.post('/signin', limits.auth, async (req, res, next) => {
  try {
    const email = String(req.body.email || '').trim().toLowerCase();
    const password = String(req.body.password || '');
    const nextUrl = safeNext(req.body.next);
    const fail = (message, status = 400) =>
      res.status(status).render('pages/signin', {
        title: 'Sign in',
        next: req.body.next || '',
        errors: [{ field: 'email', message }],
        values: { email }
      });

    if (!email || !password) return fail('Enter your email address and password');

    const user = q.byEmail.get(email);

    // Constant-ish work whether or not the account exists, so response timing
    // does not disclose account existence.
    const hash = user ? user.password_hash : '$2a$12$invalidinvalidinvalidinvalidinvalidinvalidinvalidinvalidinv';
    const ok = await bcrypt.compare(password, hash);

    if (user && user.locked_until && user.locked_until > new Date().toISOString().slice(0, 19).replace('T', ' ')) {
      audit(req, 'auth.locked_attempt', null, user);
      return fail('This account is temporarily locked after too many failed attempts. Try again in 15 minutes, or reset your password.', 429);
    }

    if (!user || !ok) {
      if (user) q.loginFail.run(user.id);
      audit(req, 'auth.failed', { email_supplied: !!email });
      return fail('There is a problem with your email address or password');
    }

    q.loginOk.run(user.id);
    req.session.regenerate((err) => {
      if (err) return next(err);
      req.session.userId = user.id;
      req.session.anonId = crypto.randomUUID();
      req.session.flash = { kind: 'success', title: `Welcome back, ${user.name.split(' ')[0]}`, message: null };
      audit(req, 'auth.success', null, user);
      return res.redirect(303, nextUrl);
    });
  } catch (err) { next(err); }
});

router.post('/signout', (req, res) => {
  audit(req, 'auth.signout');
  req.session.destroy(() => {
    res.clearCookie('dh.sid');
    res.redirect(303, '/');
  });
});

/* ---------------------------- password reset ---------------------------- */

router.get('/forgot', (req, res) => {
  res.render('pages/forgot', { title: 'Reset your password', errors: [], values: {}, sent: false });
});

router.post('/forgot', limits.passwordReset, async (req, res, next) => {
  try {
    const email = String(req.body.email || '').trim().toLowerCase();
    const user = email ? q.byEmail.get(email) : null;
    if (user) {
      const token = crypto.randomBytes(32).toString('hex');
      q.setResetToken.run(token, user.id);
      await mail.deliver(mail.resetEmail(user, token));
      audit(req, 'auth.reset_requested', null, user);
    } else {
      audit(req, 'auth.reset_requested_unknown_email');
    }
    // Identical response either way: never disclose whether an account exists.
    res.render('pages/forgot', { title: 'Check your email', errors: [], values: { email }, sent: true });
  } catch (err) { next(err); }
});

router.get('/reset', (req, res) => {
  const token = String(req.query.token || '');
  if (!q.byResetToken.get(token)) {
    return res.status(400).render('pages/error', {
      title: 'Reset link not valid',
      status: 400,
      heading: 'That reset link is not valid',
      message: 'Reset links expire after one hour and can only be used once. Request a new one.'
    });
  }
  res.render('pages/reset', { title: 'Choose a new password', token, errors: [] });
});

router.post('/reset', limits.passwordReset, async (req, res, next) => {
  try {
    const token = String(req.body.token || '');
    const password = String(req.body.password || '');
    const user = q.byResetToken.get(token);
    if (!user) {
      return res.status(400).render('pages/error', {
        title: 'Reset link not valid',
        status: 400,
        heading: 'That reset link is not valid',
        message: 'Request a new reset link and use it within the hour.'
      });
    }
    const errors = [];
    if (password.length < 12) errors.push({ field: 'password', message: 'Password must be at least 12 characters' });
    if (BANNED_PASSWORDS.has(password.toLowerCase())) errors.push({ field: 'password', message: 'That password is too common' });
    if (password !== String(req.body.password_confirm || '')) errors.push({ field: 'password_confirm', message: 'Passwords do not match' });
    if (errors.length) {
      return res.status(400).render('pages/reset', { title: 'Choose a new password', token, errors });
    }

    q.setPassword.run(await bcrypt.hash(password, 12), user.id);
    audit(req, 'auth.password_reset', null, user);
    req.session.flash = { kind: 'success', title: 'Password changed', message: 'Sign in with your new password.' };
    res.redirect(303, '/signin');
  } catch (err) { next(err); }
});

/* ------------------------------- profile -------------------------------- */

router.post('/account/profile', (req, res) => {
  if (!req.user) return res.redirect(303, '/signin');
  q.updateProfile.run({
    id: req.user.id,
    name: String(req.body.name || '').trim().slice(0, 80) || req.user.name,
    job_role: String(req.body.job_role || '').trim().slice(0, 80) || null,
    organisation: String(req.body.organisation || '').trim().slice(0, 120) || null,
    experience_level: EXPERIENCE.includes(req.body.experience_level) ? req.body.experience_level : null
  });
  audit(req, 'account.profile_updated');
  req.session.flash = { kind: 'success', title: 'Profile updated', message: null };
  res.redirect(303, '/account');
});

router.post('/account/consents', (req, res) => {
  if (!req.user) return res.redirect(303, '/signin');
  const marketing = req.body.marketing_consent ? 1 : 0;
  const analytics = req.body.analytics_consent ? 1 : 0;
  q.setConsents.run({ id: req.user.id, marketing, analytics });
  req.session.consent = { ...(req.session.consent || {}), analytics: !!analytics, marketing: !!marketing, essential: true };
  recordConsent(req, { purpose: 'marketing', granted: !!marketing, mechanism: 'account settings', policyVersion: config.versions.privacy });
  recordConsent(req, { purpose: 'analytics', granted: !!analytics, mechanism: 'account settings', policyVersion: config.versions.cookies });
  audit(req, 'account.consents_updated', { marketing, analytics });
  req.session.flash = { kind: 'success', title: 'Preferences saved', message: 'Changes take effect immediately.' };
  res.redirect(303, '/account/privacy');
});

module.exports = router;
