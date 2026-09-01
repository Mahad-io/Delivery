**Version {{TERMS_VERSION}}.**

## Reporting a vulnerability

Email **{{DPO_EMAIL}}** with:

- what you found and where — a URL and a request is ideal;
- how to reproduce it;
- what you think the impact is;
- how you would like to be credited, if at all.

We will acknowledge within 3 working days, give you an assessment within 10 working days, and keep you updated until it is closed. We will tell you when it is fixed, and we will credit you publicly if you want that.

## Safe harbour

If you make a good-faith effort to comply with this policy during your research, we will:

- not pursue or support any legal action against you;
- work with you to understand and resolve the issue quickly;
- recognise your contribution if you wish.

## Rules of engagement

Please do:

- test only against your own account and data;
- stop as soon as you have confirmed a vulnerability, and report it;
- use a test account with an email address you control;
- give us reasonable time to fix an issue before disclosing it publicly — 90 days is our default, and we will usually be much faster.

Please do not:

- access, modify or delete data belonging to anyone else;
- run automated scanners that degrade the service for other people, or any form of denial-of-service test;
- attempt social engineering, phishing or physical attacks against our staff or suppliers;
- use a vulnerability to pivot further into our systems than needed to demonstrate it.

If you inadvertently access someone else's personal data, stop, do not save a copy, and tell us immediately. We will treat that as a good-faith report, not a breach by you.

## Out of scope

The following are known and accepted, and we would rather not receive reports about them:

- Missing security headers with no demonstrated exploit path.
- Rate-limit findings that require a distributed source to be meaningful.
- Vulnerabilities requiring physical access to a user's unlocked device.
- Self-XSS requiring the victim to paste a payload into their own console.
- Findings from automated scanners with no proof of exploitability.
- Absence of an SPF/DMARC record on a domain we do not send mail from.
- Reports about the deliberate design choices documented below.

## Deliberate design choices

Some things look like findings and are not:

- **`saveUninitialized` is true on the session.** We need a session before sign-in to hold the anti-forgery token and pre-signup cookie choices. The session contains no personal data until you create an account.
- **The signup form reveals that an email is already registered.** This is a considered trade-off: the alternative confuses people who have simply forgotten they have an account, and the same information is obtainable from the reset flow in any usable design. The sign-in and password-reset flows do *not* disclose account existence, and both are timing-equalised.
- **The audit log retains hashed IP addresses after account deletion.** The rows are anonymised at deletion — user id, email and IP hash removed — so what remains is not personal data.
- **Rate limits key on the raw IP address in memory.** It is never written to disk in raw form.

## What we do

- HTTPS everywhere with HSTS in production.
- bcrypt at cost 12 for passwords; a 12-character minimum and screening against a common-password list.
- Nonce-based Content-Security-Policy with no inline scripts and no third-party script or style sources.
- `frame-ancestors 'none'`, `X-Content-Type-Options: nosniff`, strict referrer policy.
- Synchroniser-token CSRF protection on every state-changing request, compared in constant time.
- Session regeneration on sign-in; httpOnly, SameSite=Lax, Secure cookies.
- Parameterised SQL everywhere — no string-built queries anywhere in the codebase.
- Per-account lockout after repeated failures, plus per-IP rate limits on credential, reset and data-request endpoints.
- No file uploads at all. Downloadable templates are generated from data at request time, so there is no upload surface and nothing to virus-scan.
- Dependency scanning in CI, and a small dependency tree by deliberate choice.

## Encryption and infrastructure

Data at rest is encrypted at the volume level by the hosting provider. Backups are encrypted and access-controlled, and are rotated within 35 days. Administrative access to production requires multi-factor authentication and is logged.

## Contact

{{DPO_EMAIL}}
