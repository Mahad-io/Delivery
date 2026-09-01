# Delivery Hub

A full-stack website of resources, learning material and interactive tools for delivery
managers, scrum masters, project managers and anyone else running delivery.

26 downloadable templates, 33 learning modules across 5 paths, a 49-term glossary, a
competency framework, an interview question bank, four interactive tools, and a complete
UK GDPR / PECR layer that is actually wired up rather than described.

## Running it

Node 20 or later.

```bash
cp .env.example .env      # then edit it - see "Before you go live" below
npm install
npm start                 # http://localhost:3000
```

```bash
npm run dev               # with file watching
npm run smoke             # full end-to-end test suite (see below)
npm run retention         # retention dry run; add -- --go to actually delete
```

Nothing to seed and no migrations to run: the schema is created on first boot and the
content is code, not database rows.

Email is not configured by default. Verification and password-reset links print to the
server console, so you can complete every flow locally without a mail server.

## What it does

**Reading is free; downloading needs an account.** Every template, module and glossary
entry is fully readable anonymously. The account gate sits at the point of download, save,
or persisting tool output — which is where the signup prompt appears, with an explanation of
why and what the account is for. After signing up you are returned to exactly what you were
trying to do.

| Area | Route | What is there |
| --- | --- | --- |
| Toolkit | `/toolkit` | 26 templates across 6 categories, filterable by category, level, topic and free text. Each has a full write-up, a table preview and CSV/Markdown downloads generated on request |
| Learning | `/learning` | 5 paths, 33 modules. Objectives, teaching content, a practice task, check questions, and links to the matching templates. Progress saved per module |
| Tools | `/tools` | Retro board (6 formats, voting, markdown export), planning poker (4 decks), Monte Carlo forecasting and flow calculators, delivery maturity self-assessment |
| Careers | `/careers` | Competency framework (8 competencies × 5 levels), interview bank from both sides, honest certification assessments, how to research pay, communities, reading list |
| Glossary | `/glossary` | 49 terms, searchable |
| Legal | `/legal` | Privacy notice, cookie policy, terms, accessibility statement, licence, security disclosure |
| Governance | `/governance/…` | ROPA, DPIA, retention schedule, breach response plan, subject rights procedure, sub-processor list — all published |
| Your data | `/account/privacy` | What we hold, consent history, self-service export and erasure |

## Architecture

```
server.js                  Express app, session, security, error handling
src/
  db.js                    SQLite schema and connection; IP and email hashing
  lib/config.js            Controller details and policy versions - one source of truth
  lib/templates.js         Turns resource definitions into CSV and Markdown at request time
  lib/audit.js             Append-only consent log and security log
  lib/mail.js              Transport-agnostic; logs to console when SMTP is unset
  middleware/security.js   Helmet, nonce CSP, CSRF, rate limits
  middleware/auth.js       Session user, requireUser gate (the signup prompt)
  data/catalogue*.js       The 26 templates, as data
  data/learning.js         Paths, modules, glossary
  data/careers.js          Competencies, interviews, certifications, pay guidance
  data/tools.js            Retro formats, decks, assessment questions and scoring
  routes/                  pages, auth, downloads, tools, gdpr, legal
views/                     EJS - partials/top and partials/bottom wrap every page
public/                    One stylesheet, four small progressive-enhancement scripts
content/legal/             Policy documents in Markdown, with {{PLACEHOLDER}} substitution
content/governance/        Governance documents, same mechanism
scripts/retention.js       Retention enforcement - run daily
scripts/smoke.js           End-to-end test suite
```

**Ten dependencies, no build step, no bundler, no framework churn.** `express`, `ejs`,
`express-session`, `connect-sqlite3`, `better-sqlite3`, `bcryptjs`, `helmet`,
`express-rate-limit`, `marked`, `dotenv`. There is no npm script that compiles anything;
what you edit is what runs.

**Content is code.** Templates are data structures rendered to CSV or Markdown on request.
There are no uploaded files, so there is no upload surface, nothing to virus-scan, and no
binary that can drift out of date from its description.

## Accessibility

Built to WCAG 2.2 AA, following GOV.UK Design System patterns: skip link, error summary
linked to fields, hint and error text associated by `aria-describedby`, visible high-contrast
focus, one column, real HTML semantics, 44px minimum targets, `prefers-reduced-motion`
honoured, and a dark colour scheme with contrast checked in both.

**Everything works with JavaScript disabled** — every page, form, download and tool, with
one deliberate exception: the forecasting calculators and the estimation cards, which are
client-side precisely so that your delivery data never reaches a server. Those pages carry a
`<noscript>` block with the formulas written out and a link to the equivalent downloads.

The full statement, including the known gaps, is at `/legal/accessibility`. It is written to
be honest rather than reassuring.

## Privacy and GDPR

Not a cookie banner bolted onto a tracking stack. The design decisions:

- **Minimal collection.** Mandatory fields are email, name, password. Job role, organisation
  and experience level are optional, consent-based, and can be left blank forever.
- **No IP addresses stored.** Anywhere. Where abuse detection needs to correlate requests we
  store `HMAC-SHA256(ip, salt)` truncated to 32 characters. Rotating the salt permanently
  de-links every historic entry.
- **No third parties.** No analytics provider, no fonts, scripts, styles or images from
  another origin, no CRM, no AI service. The CSP has no third-party sources because there is
  nothing to allow. No advertising, and no advertiser can influence the content.
- **Consent is append-only.** Purpose, decision, mechanism, policy version and timestamp, per
  Art. 7(1). Withdrawal is recorded as a new event rather than overwriting the grant, and the
  user can see the whole history.
- **Reject is exactly as easy as accept.** Two identical buttons, one click each, plus
  granular control. The banner does not block the content.
- **Access and erasure are self-service and instant.** No form, no identity check beyond
  being signed in, no waiting period. Export in JSON (Art. 20) and plain text.
- **Deletion is real deletion.** No soft-delete flag, no `deleted_at` column, no support
  agent who can undo it. One transaction, foreign-key cascades, audit rows anonymised in
  place, and a one-way hashed receipt as the only trace. The smoke test asserts that no row
  anywhere still references the deleted user.
- **Retention is code, not aspiration.** `scripts/retention.js` implements the published
  schedule and logs counts only, never who.
- **The paperwork is published.** ROPA, DPIA (including the three design changes it caused),
  retention schedule, breach plan, rights procedure and sub-processor list are all on the
  site. Most organisations keep these internal; publishing them is the cheapest way to be
  held to them.

## Security

Nonce-based CSP with no inline scripts anywhere. CSRF synchroniser tokens compared in
constant time on every state-changing request. bcrypt cost 12 with a 12-character minimum and
common-password screening. Session regeneration on sign-in; httpOnly, SameSite=Lax, Secure in
production. Per-account lockout plus per-IP rate limits on credential, reset and data-request
endpoints. Parameterised SQL throughout. No file uploads. Sign-in and password reset do not
disclose whether an account exists, and are timing-equalised.

Disclosure policy, including what is deliberately out of scope and why, is at
`/legal/security`.

## Testing

```bash
npm run smoke
```

Boots the real app on an ephemeral port against a throwaway database and drives it over HTTP
with cookies and CSRF tokens. It checks roughly 140 assertions, including:

- every public page, every one of the 26 resource pages, all 33 learning modules, every legal
  and governance document;
- every download format for every resource actually generates content;
- CSP, CSRF and security headers, including that a POST without a token is refused;
- **that an anonymous download is refused and redirects to signup with the destination
  preserved** — the behaviour the whole signup flow exists for;
- signup validation, common-password rejection, and that the password is hashed not stored;
- that sign-in and password reset do not leak account existence;
- consent recording, withdrawal, and that withdrawal appends rather than overwrites;
- the data export excludes password hashes and tokens and includes every data category;
- **that account deletion cascades everywhere, anonymises the audit log, and leaves a receipt
  containing a hash rather than an email address.**

## Before you go live

1. **Fill in `.env`.** Real `SESSION_SECRET` and `IP_HASH_SALT` (the app refuses to start in
   production with the placeholder secret), and your real organisation details — they appear
   throughout the legal pages.
2. **Have the legal pages reviewed.** They are a complete, honest starting point drafted to
   match exactly what this code does, and they are not legal advice. A qualified adviser
   should read them.
3. **Complete `content/governance/subprocessors.md`.** It is deliberately left with named
   gaps rather than invented supplier names. Nothing else on the site is a placeholder.
4. **Register with the ICO** and put the registration number in `.env`.
5. **Schedule `npm run retention -- --go` daily.** If it has not run for a week, treat that
   as a compliance incident.
6. **Configure SMTP** in `src/lib/mail.js` and set `SMTP_URL`.
7. **Terminate TLS** in front of the app and set `NODE_ENV=production` so HSTS, secure
   cookies and `trust proxy` switch on.
8. **Commission an external accessibility audit** including testing with disabled users, and
   publish the findings. Our own testing is honest but it is our own.

## Licence

The site content — templates, learning modules, glossary, competency framework, interview
bank — is CC BY 4.0. Use it commercially, adapt it, put it in client work; just credit it.
The team health check, being an adaptation of a Share-Alike work, is additionally CC BY-SA
4.0. Provenance for every borrowed structure is at `/legal/licence`.
