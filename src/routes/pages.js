'use strict';

const express = require('express');
const { db } = require('../db');
const { RESOURCES, CATEGORIES, listResources, getResource, allTags, categoryById } = require('../data/catalogue');
const { PATHS, GLOSSARY, getPath, getModule, totalModules } = require('../data/learning');
const careers = require('../data/careers');
const { audit } = require('../lib/audit');
const { requireUser } = require('../middleware/auth');

const router = express.Router();

const q = {
  progressForUser: db.prepare('SELECT path_id, module_id FROM module_progress WHERE user_id = ?'),
  markModule: db.prepare(`
    INSERT INTO module_progress (user_id, path_id, module_id, status, updated_at)
    VALUES (?, ?, ?, 'complete', datetime('now'))
    ON CONFLICT(user_id, path_id, module_id) DO UPDATE SET updated_at = datetime('now')`),
  unmarkModule: db.prepare('DELETE FROM module_progress WHERE user_id = ? AND path_id = ? AND module_id = ?'),
  saved: db.prepare(`SELECT resource_id FROM saved_resources WHERE user_id = ? ORDER BY created_at DESC`),
  myDownloads: db.prepare(`
    SELECT resource_id, format, MAX(created_at) AS created_at, COUNT(*) AS times
      FROM downloads WHERE user_id = ? GROUP BY resource_id, format ORDER BY created_at DESC LIMIT 50`),
  popular: db.prepare(`
    SELECT resource_id, COUNT(*) AS n FROM downloads GROUP BY resource_id ORDER BY n DESC LIMIT 6`),
  myAssessments: db.prepare('SELECT created_at, scores FROM assessments WHERE user_id = ? ORDER BY created_at DESC LIMIT 6'),
  myBoards: db.prepare('SELECT id, title, template, updated_at FROM boards WHERE owner_id = ? ORDER BY updated_at DESC LIMIT 10')
};

function progressMap(userId) {
  if (!userId) return new Map();
  const rows = q.progressForUser.all(userId);
  const map = new Map();
  for (const r of rows) {
    if (!map.has(r.path_id)) map.set(r.path_id, new Set());
    map.get(r.path_id).add(r.module_id);
  }
  return map;
}

function pathProgress(map, path) {
  const done = map.get(path.id)?.size || 0;
  return { done, of: path.modules.length, percent: Math.round((done / path.modules.length) * 100) };
}

/* --------------------------------- home --------------------------------- */

router.get('/', (req, res) => {
  const popular = q.popular.all().map((r) => getResource(r.resource_id)).filter(Boolean);
  const map = progressMap(req.user?.id);
  res.render('pages/home', {
    title: `${res.locals.config.siteName} - ${res.locals.config.tagline}`,
    categories: CATEGORIES,
    resourceCount: RESOURCES.length,
    moduleCount: totalModules(),
    paths: PATHS.map((p) => ({ ...p, progress: pathProgress(map, p) })),
    featured: popular.length >= 3
      ? popular.slice(0, 6)
      : ['raid-log', 'retro-pack', 'flow-metrics-starter', 'status-report', 'definition-of-ready-done', 'stakeholder-map'].map(getResource)
  });
});

/* -------------------------------- toolkit ------------------------------- */

router.get('/toolkit', (req, res) => {
  const { category, tag, level, q: query } = req.query;
  const results = listResources({ category, tag, level, q: query });
  const savedIds = req.user ? new Set(q.saved.all(req.user.id).map((r) => r.resource_id)) : new Set();
  res.render('pages/toolkit', {
    title: 'Delivery toolkit',
    categories: CATEGORIES,
    tags: allTags(),
    results,
    savedIds,
    filters: { category: category || '', tag: tag || '', level: level || '', q: query || '' },
    activeCategory: category ? categoryById(category) : null
  });
});

router.get('/resources/:id', (req, res, next) => {
  const resource = getResource(req.params.id);
  if (!resource) return next();
  const savedIds = req.user ? new Set(q.saved.all(req.user.id).map((r) => r.resource_id)) : new Set();
  const related = listResources({ category: resource.category }).filter((r) => r.id !== resource.id).slice(0, 4);
  res.render('pages/resource', {
    title: resource.title,
    resource,
    category: categoryById(resource.category),
    isSaved: savedIds.has(resource.id),
    related,
    relatedModules: PATHS.flatMap((p) =>
      p.modules
        .filter((m) => (m.resources || []).includes(resource.id))
        .map((m) => ({ path: p, module: m }))
    ).slice(0, 4)
  });
});

/* -------------------------------- learning ------------------------------ */

router.get('/learning', (req, res) => {
  const map = progressMap(req.user?.id);
  res.render('pages/learning', {
    title: 'Learning paths',
    paths: PATHS.map((p) => ({ ...p, progress: pathProgress(map, p) })),
    moduleCount: totalModules()
  });
});

router.get('/learning/:pathId', (req, res, next) => {
  const path = getPath(req.params.pathId);
  if (!path) return next();
  const map = progressMap(req.user?.id);
  res.render('pages/learning-path', {
    title: path.title,
    path,
    completed: map.get(path.id) || new Set(),
    progress: pathProgress(map, path)
  });
});

router.get('/learning/:pathId/:moduleId', (req, res, next) => {
  const found = getModule(req.params.pathId, req.params.moduleId);
  if (!found) return next();
  const map = progressMap(req.user?.id);
  res.render('pages/learning-module', {
    title: found.module.title,
    mod: found.module,
    path: found.path,
    index: found.index,
    prev: found.prev,
    next: found.next,
    completed: map.get(found.path.id) || new Set(),
    progress: pathProgress(map, found.path),
    resourceFor: (id) => getResource(id)
  });
});

router.post(
  '/learning/:pathId/:moduleId/complete',
  requireUser({ reason: 'track your progress through a learning path' }),
  (req, res, next) => {
    const found = getModule(req.params.pathId, req.params.moduleId);
    if (!found) return next();
    if (req.body.undo) {
      q.unmarkModule.run(req.user.id, found.path.id, found.module.id);
    } else {
      q.markModule.run(req.user.id, found.path.id, found.module.id);
      audit(req, 'learning.module_completed', { path: found.path.id, module: found.module.id });
    }
    const nextUrl = found.next && !req.body.undo
      ? `/learning/${found.path.id}/${found.next.id}`
      : `/learning/${found.path.id}`;
    res.redirect(303, nextUrl);
  }
);

router.get('/glossary', (req, res) => {
  const query = String(req.query.q || '').toLowerCase().trim();
  const terms = query
    ? GLOSSARY.filter((t) => (t.term + ' ' + t.definition).toLowerCase().includes(query))
    : GLOSSARY;
  res.render('pages/glossary', { title: 'Delivery glossary', terms, query: req.query.q || '', total: GLOSSARY.length });
});

/* --------------------------------- careers ------------------------------ */

router.get('/careers', (req, res) => {
  res.render('pages/careers', { title: 'Career and progression', ...careers });
});

router.get('/careers/competencies', (req, res) => {
  res.render('pages/competencies', { title: 'Competency framework', competencies: careers.COMPETENCIES });
});

router.get('/careers/interviews', (req, res) => {
  res.render('pages/interviews', { title: 'Interview question bank', bank: careers.INTERVIEW_BANK });
});

/* --------------------------------- account ------------------------------ */

router.get('/account', requireUser({ reason: 'see your account' }), (req, res) => {
  const map = progressMap(req.user.id);
  res.render('pages/account', {
    title: 'Your account',
    paths: PATHS.map((p) => ({ ...p, progress: pathProgress(map, p) })),
    saved: q.saved.all(req.user.id).map((r) => getResource(r.resource_id)).filter(Boolean),
    downloads: q.myDownloads.all(req.user.id).map((d) => ({ ...d, resource: getResource(d.resource_id) })),
    assessments: q.myAssessments.all(req.user.id).map((a) => ({ created_at: a.created_at, scores: JSON.parse(a.scores) })),
    boards: q.myBoards.all(req.user.id),
    totalModules: totalModules(),
    modulesDone: [...map.values()].reduce((n, s) => n + s.size, 0)
  });
});

module.exports = router;
