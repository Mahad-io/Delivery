'use strict';

/**
 * Single place for controller / policy metadata. The legal pages and the
 * privacy notice read from here so that there is exactly one copy of the
 * organisation's details and one place to bump a policy version.
 */
const config = {
  siteName: 'Delivery Hub',
  tagline: 'Practical resources for delivery managers, scrum masters and project managers',
  baseUrl: process.env.BASE_URL || `http://localhost:${process.env.PORT || 3000}`,

  org: {
    name: process.env.ORG_NAME || 'Delivery Hub',
    legalName: process.env.ORG_LEGAL_NAME || 'Delivery Hub Ltd',
    address: process.env.ORG_ADDRESS || '1 Example Street, London, EC1A 1AA, United Kingdom',
    icoRegistration: process.env.ORG_ICO_REGISTRATION || 'ZA000000',
    dpoEmail: process.env.DPO_EMAIL || 'privacy@example.com',
    supportEmail: process.env.SUPPORT_EMAIL || 'hello@example.com'
  },

  // Bump these when the wording materially changes. The value the user accepted
  // is stored against their account and in every consent event.
  versions: {
    privacy: '2026-09-01',
    terms: '2026-09-01',
    cookies: '2026-09-01'
  },

  retention: {
    inactiveAccountDays: Number(process.env.RETENTION_INACTIVE_ACCOUNT_DAYS || 730),
    auditLogDays: Number(process.env.RETENTION_AUDIT_LOG_DAYS || 365),
    unverifiedAccountDays: Number(process.env.RETENTION_UNVERIFIED_ACCOUNT_DAYS || 30)
  },

  // Purposes offered in the cookie banner. "essential" is not optional and is
  // listed for transparency only - it has no toggle.
  cookiePurposes: [
    {
      id: 'essential',
      name: 'Essential',
      required: true,
      summary: 'Keeps you signed in, remembers your cookie choices and protects forms from cross-site request forgery.',
      lawfulBasis: 'Strictly necessary - no consent required (PECR reg. 6(4))'
    },
    {
      id: 'analytics',
      name: 'Analytics',
      required: false,
      summary: 'Counts page views and which templates are downloaded, so we know what to build next. Aggregated, no cross-site tracking.',
      lawfulBasis: 'Consent'
    },
    {
      id: 'marketing',
      name: 'Product updates',
      required: false,
      summary: 'Lets us email you when new templates, learning modules or tools are published. One email a month at most.',
      lawfulBasis: 'Consent'
    }
  ]
};

module.exports = config;
