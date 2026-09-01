'use strict';

const express = require('express');
const { db } = require('../db');
const { getResource } = require('../data/catalogue');
const { render } = require('../lib/templates');
const { audit } = require('../lib/audit');
const { limits } = require('../middleware/security');

const router = express.Router();

const q = {
  logDownload: db.prepare('INSERT INTO downloads (user_id, resource_id, format) VALUES (?, ?, ?)'),
  countForResource: db.prepare('SELECT COUNT(*) AS n FROM downloads WHERE resource_id = ?'),
  save: db.prepare('INSERT OR IGNORE INTO saved_resources (user_id, resource_id) VALUES (?, ?)'),
  unsave: db.prepare('DELETE FROM saved_resources WHERE user_id = ? AND resource_id = ?'),
  isSaved: db.prepare('SELECT 1 FROM saved_resources WHERE user_id = ? AND resource_id = ?')
};

/**
 * The gate. Anyone can browse a resource page and read the whole thing; the
 * account is only required at the point of download. That is deliberate:
 * gating the content itself would be hostile, and gating the download is what
 * the user was told would happen.
 */
router.get('/download/:id.:format', limits.download, (req, res, next) => {
  const resource = getResource(req.params.id);
  const format = String(req.params.format || '').toLowerCase();

  if (!resource) return next();

  if (!req.user) {
    req.session.pendingIntent = {
      url: req.originalUrl,
      reason: `download "${resource.title}"`,
      resourceTitle: resource.title,
      at: new Date().toISOString()
    };
    return res.redirect(303, `/signup?next=${encodeURIComponent(req.originalUrl)}`);
  }

  const file = render(resource, format);
  if (!file) {
    return res.status(404).render('pages/error', {
      title: 'Format not available',
      status: 404,
      heading: 'That format is not available',
      message: `"${resource.title}" is available as ${(resource.formats || []).join(' and ')}.`
    });
  }

  q.logDownload.run(req.user.id, resource.id, format);
  audit(req, 'resource.downloaded', { resource: resource.id, format });

  res.setHeader('Content-Type', file.mime);
  res.setHeader('Content-Disposition', `attachment; filename="${file.filename}"`);
  res.setHeader('Cache-Control', 'private, no-store');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  return res.send(file.body);
});

/** Save-for-later. Also gated, and also the moment we prompt for signup. */
router.post('/resources/:id/save', (req, res) => {
  const resource = getResource(req.params.id);
  if (!resource) return res.status(404).json({ error: 'not_found' });

  if (!req.user) {
    return res.status(401).json({
      error: 'signup_required',
      reason: `save "${resource.title}" to your account`,
      signupUrl: `/signup?next=${encodeURIComponent(`/resources/${resource.id}`)}`
    });
  }

  const saved = !!q.isSaved.get(req.user.id, resource.id);
  if (saved) {
    q.unsave.run(req.user.id, resource.id);
  } else {
    q.save.run(req.user.id, resource.id);
  }
  audit(req, saved ? 'resource.unsaved' : 'resource.saved', { resource: resource.id });
  return res.json({ saved: !saved });
});

/** Aggregate popularity. No user identifiers leave this query. */
router.get('/api/resources/:id/downloads', (req, res) => {
  const resource = getResource(req.params.id);
  if (!resource) return res.status(404).json({ error: 'not_found' });
  const { n } = q.countForResource.get(resource.id);
  res.json({ resource: resource.id, downloads: n });
});

module.exports = router;
