'use strict';

const crypto = require('crypto');
const express = require('express');
const { db } = require('../db');
const { RETRO_TEMPLATES, POKER_DECKS, ASSESSMENT, scoreAssessment } = require('../data/tools');
const { getResource } = require('../data/catalogue');
const { audit } = require('../lib/audit');
const { requireUser } = require('../middleware/auth');

const router = express.Router();

const q = {
  createBoard: db.prepare('INSERT INTO boards (id, owner_id, title, template) VALUES (?, ?, ?, ?)'),
  getBoard: db.prepare('SELECT * FROM boards WHERE id = ? AND owner_id = ?'),
  listBoards: db.prepare('SELECT * FROM boards WHERE owner_id = ? ORDER BY updated_at DESC'),
  touchBoard: db.prepare("UPDATE boards SET updated_at = datetime('now') WHERE id = ?"),
  deleteBoard: db.prepare('DELETE FROM boards WHERE id = ? AND owner_id = ?'),
  items: db.prepare('SELECT * FROM board_items WHERE board_id = ? ORDER BY votes DESC, id ASC'),
  addItem: db.prepare('INSERT INTO board_items (board_id, column_id, body) VALUES (?, ?, ?)'),
  voteItem: db.prepare('UPDATE board_items SET votes = MAX(0, votes + ?) WHERE id = ? AND board_id = ?'),
  deleteItem: db.prepare('DELETE FROM board_items WHERE id = ? AND board_id = ?'),
  saveAssessment: db.prepare('INSERT INTO assessments (user_id, kind, answers, scores) VALUES (?, ?, ?, ?)'),
  listAssessments: db.prepare('SELECT * FROM assessments WHERE user_id = ? ORDER BY created_at DESC LIMIT 12')
};

/* ------------------------------ tools index ----------------------------- */

router.get('/tools', (req, res) => {
  res.render('pages/tools', {
    title: 'Interactive tools',
    retroTemplates: RETRO_TEMPLATES,
    pokerDecks: POKER_DECKS,
    assessment: ASSESSMENT
  });
});

/* ----------------------- calculators (client-side) ---------------------- */
// Little's Law, WIP and Monte Carlo run entirely in the browser: no data about
// anyone's delivery is ever sent to the server. See public/js/calculators.js.

router.get('/tools/forecast', (req, res) => {
  res.render('pages/tool-forecast', { title: 'Forecasting and flow calculators' });
});

router.get('/tools/poker', (req, res) => {
  res.render('pages/tool-poker', { title: 'Estimation and planning poker', decks: POKER_DECKS });
});

/* ------------------------------ retro board ----------------------------- */

router.get('/tools/retro', (req, res) => {
  res.render('pages/tool-retro', {
    title: 'Retro board',
    templates: RETRO_TEMPLATES,
    boards: req.user ? q.listBoards.all(req.user.id) : []
  });
});

router.post(
  '/tools/retro',
  requireUser({ reason: 'create and keep a retro board' }),
  (req, res) => {
    const template = RETRO_TEMPLATES.find((t) => t.id === req.body.template) || RETRO_TEMPLATES[0];
    const title = String(req.body.title || '').trim().slice(0, 120) || `Retro - ${new Date().toISOString().slice(0, 10)}`;
    const id = crypto.randomBytes(9).toString('base64url');
    q.createBoard.run(id, req.user.id, title, template.id);
    audit(req, 'tool.retro_created', { template: template.id });
    res.redirect(303, `/tools/retro/${id}`);
  }
);

router.get('/tools/retro/:id', requireUser({ reason: 'open a saved retro board' }), (req, res, next) => {
  const board = q.getBoard.get(req.params.id, req.user.id);
  if (!board) return next();
  const template = RETRO_TEMPLATES.find((t) => t.id === board.template) || RETRO_TEMPLATES[0];
  res.render('pages/tool-retro-board', {
    title: board.title,
    board,
    template,
    items: q.items.all(board.id)
  });
});

router.post('/tools/retro/:id/items', requireUser({ reason: 'add to a retro board' }), (req, res, next) => {
  const board = q.getBoard.get(req.params.id, req.user.id);
  if (!board) return next();
  const template = RETRO_TEMPLATES.find((t) => t.id === board.template);
  const columnId = template.columns.some((c) => c.id === req.body.column_id) ? req.body.column_id : null;
  const body = String(req.body.body || '').trim().slice(0, 500);
  if (columnId && body) {
    q.addItem.run(board.id, columnId, body);
    q.touchBoard.run(board.id);
  }
  if (req.accepts(['html', 'json']) === 'json') return res.json({ ok: true });
  return res.redirect(303, `/tools/retro/${board.id}`);
});

router.post('/tools/retro/:id/items/:itemId/vote', requireUser({ reason: 'vote on a retro board' }), (req, res, next) => {
  const board = q.getBoard.get(req.params.id, req.user.id);
  if (!board) return next();
  const delta = req.body.direction === 'down' ? -1 : 1;
  q.voteItem.run(delta, Number(req.params.itemId), board.id);
  q.touchBoard.run(board.id);
  if (req.accepts(['html', 'json']) === 'json') return res.json({ ok: true });
  return res.redirect(303, `/tools/retro/${board.id}`);
});

router.post('/tools/retro/:id/items/:itemId/delete', requireUser({ reason: 'edit a retro board' }), (req, res, next) => {
  const board = q.getBoard.get(req.params.id, req.user.id);
  if (!board) return next();
  q.deleteItem.run(Number(req.params.itemId), board.id);
  q.touchBoard.run(board.id);
  return res.redirect(303, `/tools/retro/${board.id}`);
});

router.post('/tools/retro/:id/delete', requireUser({ reason: 'delete a retro board' }), (req, res) => {
  q.deleteBoard.run(req.params.id, req.user.id);
  audit(req, 'tool.retro_deleted');
  req.session.flash = { kind: 'success', title: 'Board deleted', message: 'All its notes were deleted with it.' };
  res.redirect(303, '/tools/retro');
});

/** Export a board as markdown - no account needed beyond owning the board. */
router.get('/tools/retro/:id/export.md', requireUser({ reason: 'export a retro board' }), (req, res, next) => {
  const board = q.getBoard.get(req.params.id, req.user.id);
  if (!board) return next();
  const template = RETRO_TEMPLATES.find((t) => t.id === board.template);
  const items = q.items.all(board.id);
  const lines = [`# ${board.title}`, '', `_${template.name} - exported ${new Date().toISOString().slice(0, 10)}_`, ''];
  for (const col of template.columns) {
    lines.push(`## ${col.name}`, '');
    const inCol = items.filter((i) => i.column_id === col.id);
    if (!inCol.length) lines.push('_Nothing recorded._', '');
    for (const item of inCol) {
      lines.push(`- ${item.body}${item.votes ? ` _(${item.votes} vote${item.votes === 1 ? '' : 's'})_` : ''}`);
    }
    lines.push('');
  }
  lines.push('## Actions', '', '| Action | Owner | Due |', '| --- | --- | --- |', '|  |  |  |', '|  |  |  |', '');
  res.setHeader('Content-Type', 'text/markdown; charset=utf-8');
  res.setHeader('Content-Disposition', `attachment; filename="retro-${board.id}.md"`);
  res.send(lines.join('\n'));
});

/* ------------------------- maturity assessment -------------------------- */

router.get('/tools/assessment', (req, res) => {
  res.render('pages/tool-assessment', {
    title: ASSESSMENT.title,
    assessment: ASSESSMENT,
    history: req.user ? q.listAssessments.all(req.user.id).map((r) => ({ ...r, scores: JSON.parse(r.scores) })) : []
  });
});

/**
 * Scoring happens here, not in the browser. Results are shown to everyone;
 * only *saving* the result requires an account, which is where we prompt.
 */
router.post('/tools/assessment', (req, res) => {
  const result = scoreAssessment(req.body);
  const answered = result.perDimension.reduce((a, d) => a + d.answered, 0);
  const totalQuestions = ASSESSMENT.dimensions.reduce((a, d) => a + d.questions.length, 0);

  if (answered < totalQuestions) {
    return res.status(400).render('pages/tool-assessment', {
      title: ASSESSMENT.title,
      assessment: ASSESSMENT,
      history: req.user ? q.listAssessments.all(req.user.id).map((r) => ({ ...r, scores: JSON.parse(r.scores) })) : [],
      errors: [{ field: null, message: `Answer all ${totalQuestions} statements. You have answered ${answered}.` }],
      values: req.body
    });
  }

  let saved = false;
  if (req.user) {
    q.saveAssessment.run(req.user.id, ASSESSMENT.id, JSON.stringify(req.body), JSON.stringify(result));
    audit(req, 'tool.assessment_completed', { percent: result.percent });
    saved = true;
  }

  res.render('pages/tool-assessment-result', {
    title: 'Your delivery maturity result',
    assessment: ASSESSMENT,
    result,
    saved,
    resourceFor: (id) => getResource(id)
  });
});

module.exports = router;
