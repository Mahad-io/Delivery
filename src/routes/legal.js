'use strict';

const fs = require('fs');
const path = require('path');
const express = require('express');
const { marked } = require('marked');
const config = require('../lib/config');

const router = express.Router();

const LEGAL_DIR = path.join(__dirname, '..', '..', 'content', 'legal');
const GOVERNANCE_DIR = path.join(__dirname, '..', '..', 'content', 'governance');

const PAGES = {
  privacy: { file: 'privacy.md', title: 'Privacy notice', version: config.versions.privacy },
  cookies: { file: 'cookies.md', title: 'Cookie policy', version: config.versions.cookies },
  terms: { file: 'terms.md', title: 'Terms of use', version: config.versions.terms },
  accessibility: { file: 'accessibility.md', title: 'Accessibility statement', version: config.versions.privacy },
  licence: { file: 'licence.md', title: 'Licence and attribution', version: config.versions.terms },
  security: { file: 'security.md', title: 'Security and vulnerability disclosure', version: config.versions.terms }
};

const GOVERNANCE_PAGES = {
  ropa: { file: 'ropa.md', title: 'Record of Processing Activities' },
  dpia: { file: 'dpia.md', title: 'Data Protection Impact Assessment' },
  retention: { file: 'retention-schedule.md', title: 'Retention schedule' },
  breach: { file: 'breach-response.md', title: 'Personal data breach response plan' },
  'subject-rights': { file: 'subject-rights-procedure.md', title: 'Data subject rights procedure' },
  subprocessors: { file: 'subprocessors.md', title: 'Sub-processors' }
};

// Substitutions so controller details and policy versions live in one place.
function substitute(md) {
  return md
    .replace(/\{\{SITE_NAME\}\}/g, config.siteName)
    .replace(/\{\{ORG_LEGAL_NAME\}\}/g, config.org.legalName)
    .replace(/\{\{ORG_ADDRESS\}\}/g, config.org.address)
    .replace(/\{\{ICO_REG\}\}/g, config.org.icoRegistration)
    .replace(/\{\{DPO_EMAIL\}\}/g, config.org.dpoEmail)
    .replace(/\{\{SUPPORT_EMAIL\}\}/g, config.org.supportEmail)
    .replace(/\{\{BASE_URL\}\}/g, config.baseUrl)
    .replace(/\{\{PRIVACY_VERSION\}\}/g, config.versions.privacy)
    .replace(/\{\{TERMS_VERSION\}\}/g, config.versions.terms)
    .replace(/\{\{COOKIES_VERSION\}\}/g, config.versions.cookies)
    .replace(/\{\{RETENTION_INACTIVE\}\}/g, String(config.retention.inactiveAccountDays))
    .replace(/\{\{RETENTION_AUDIT\}\}/g, String(config.retention.auditLogDays))
    .replace(/\{\{RETENTION_UNVERIFIED\}\}/g, String(config.retention.unverifiedAccountDays));
}

const cache = new Map();

function slug(text) {
  return text
    .replace(/<[^>]+>/g, '')
    .toLowerCase()
    .replace(/&[a-z]+;/g, ' ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * marked removed its own heading-id option, so we add them here. Deep links
 * into the governance documents (for example the privacy notice pointing at a
 * specific legitimate-interests assessment) depend on these anchors existing.
 */
function addHeadingIds(html) {
  return html.replace(/<h([23])>([\s\S]*?)<\/h\1>/g, (m, level, inner) => {
    const id = slug(inner);
    return id ? `<h${level} id="${id}">${inner}</h${level}>` : m;
  });
}

function renderMarkdown(dir, file) {
  const key = `${dir}:${file}`;
  if (process.env.NODE_ENV === 'production' && cache.has(key)) return cache.get(key);
  const raw = fs.readFileSync(path.join(dir, file), 'utf8');
  const html = addHeadingIds(marked.parse(substitute(raw)));
  cache.set(key, html);
  return html;
}

router.get('/legal', (req, res) => {
  res.render('pages/legal-index', {
    title: 'Legal, privacy and governance',
    pages: PAGES,
    governance: GOVERNANCE_PAGES
  });
});

router.get('/legal/:slug', (req, res, next) => {
  const page = PAGES[req.params.slug];
  if (!page) return next();
  res.render('pages/legal-document', {
    title: page.title,
    heading: page.title,
    version: page.version,
    slug: req.params.slug,
    html: renderMarkdown(LEGAL_DIR, page.file),
    isGovernance: false
  });
});

router.get('/governance/:slug', (req, res, next) => {
  const page = GOVERNANCE_PAGES[req.params.slug];
  if (!page) return next();
  res.render('pages/legal-document', {
    title: page.title,
    heading: page.title,
    version: config.versions.privacy,
    slug: req.params.slug,
    html: renderMarkdown(GOVERNANCE_DIR, page.file),
    isGovernance: true
  });
});

module.exports = router;
