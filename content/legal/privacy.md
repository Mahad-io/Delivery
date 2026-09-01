**Version {{PRIVACY_VERSION}}.** This notice explains what personal data {{SITE_NAME}} collects, why, how long we keep it, and the rights you have over it. It is written to be read, not to be survived.

> **Before you publish this site.** These legal pages are a complete, honest starting point drafted to match what the code actually does. They are not legal advice. Have them reviewed by a qualified adviser, replace the placeholder controller details in `.env`, and register with the ICO before you process anyone's data.

## Who we are

{{ORG_LEGAL_NAME}} is the data controller for the personal data described here.

- **Address:** {{ORG_ADDRESS}}
- **ICO registration:** {{ICO_REG}}
- **Data protection contact:** {{DPO_EMAIL}}
- **General contact:** {{SUPPORT_EMAIL}}

## The short version

- You can browse everything on this site — every template, every learning module, every glossary entry — without an account and without giving us any personal data.
- You only need an account to **download** a template, **save** progress or a resource, or **keep** a retro board or an assessment result.
- We ask for your name, email address and a password. Job role, organisation and experience level are optional and you can leave them blank forever.
- We do not sell your data, we do not share it with advertisers, and we do not use third-party tracking or advertising cookies. There is no advertising on this site.
- We never store your IP address in raw form.
- You can export everything we hold, or delete your account completely, from your account page, without asking us.

## What we collect, why, and on what lawful basis

### Account data

| Data | Why we need it | Lawful basis |
| --- | --- | --- |
| Email address | To identify your account, let you sign in, confirm it is really you, and let you reset a forgotten password | Contract (UK GDPR Art. 6(1)(b)) — we cannot provide an account without it |
| Name | To address you in the interface and in emails about your account | Contract |
| Password (stored only as a bcrypt hash, cost 12) | To secure your account | Contract, and legal obligation to keep data secure (Art. 32) |
| Job role, organisation, experience level | Optional. Helps us understand who the site is for and which resources to build next | Consent — you can leave these blank or clear them at any time |
| Email confirmation status | So we know your address is real and reachable | Contract |
| Failed sign-in count and temporary lock | To slow down password-guessing against your account | Legitimate interests (Art. 6(1)(f)) — security of the service |

### Activity data

| Data | Why we need it | Lawful basis |
| --- | --- | --- |
| Which templates you downloaded, and when | To show your own download history on your account page, and to count aggregate popularity so we know what to improve | Contract for your history; legitimate interests for the aggregate count |
| Resources you saved | To show your saved list | Contract |
| Learning modules you completed | To show your progress and completion percentages | Contract |
| Assessment answers and scores | So you can compare a result with your own previous results over time | Contract. **Note:** the assessment is about your team's practices, not about you. Please do not name individuals in any free-text field |
| Retro boards and their notes | So a board you created is still there when you come back | Contract. Boards are private to your account and are not shared with anyone, including us, except as needed to operate the service |

### Consent records

Every time you make a consent decision — in the cookie banner, at signup, or in your settings — we record the purpose, whether you granted or refused it, how you were asked, the policy version in force, a salted hash of your IP address, and your browser's user-agent string. This is the evidence UK GDPR Art. 7(1) requires us to keep. It is append-only: we record that you changed your mind rather than overwriting the old answer.

### Security and activity log

We record account events — created, signed in, sign-in failed, password reset, data exported, account deleted — with a timestamp and a salted hash of the IP address. This lets us investigate suspicious access to your account and is a legitimate interest under Art. 6(1)(f). We balanced this against your interests by hashing IP addresses rather than storing them, by keeping the log for a limited period, and by making it visible to you in your data export.

### About IP addresses

We do not store IP addresses. Where we need to detect abuse, we store `HMAC-SHA256(ip, secret_salt)` truncated to 32 characters. That lets us recognise that two events came from the same source without holding an identifier that could be used to locate anyone. Rotating the salt permanently breaks the link to all historic entries, and we treat that as a routine control rather than an emergency measure.

## Cookies and local storage

We use three cookies or storage items at most, and only the first is set before you decide anything.

| Name | Purpose | Type | Expiry |
| --- | --- | --- | --- |
| `dh.sid` | Keeps you signed in, holds your cookie choices and the anti-forgery token for forms | Strictly necessary | 30 days, refreshed while you use the site |
| Consent record (inside the session) | Remembers what you chose so we do not ask again | Strictly necessary | With the session |
| `dh.prefs` (local storage) | Remembers interface preferences such as your last toolkit filter. Set only if you allow analytics | Optional | Until you clear it |

We do not use Google Analytics or any third-party analytics, advertising, social or tracking scripts. Nothing on this site talks to another domain. Full detail is in the [cookie policy]({{BASE_URL}}/legal/cookies), and you can change your choices at any time at [{{BASE_URL}}/cookies]({{BASE_URL}}/cookies).

## Who we share it with

Nobody, other than the infrastructure providers needed to run the service. We do not sell personal data, we do not share it for marketing, and we do not use it to train machine-learning models.

The current list of sub-processors, what each one does, and where it processes data is published at [{{BASE_URL}}/governance/subprocessors]({{BASE_URL}}/governance/subprocessors). Each is engaged under a written contract containing the Art. 28 processor terms.

We may disclose data where we are legally required to — a court order, or a statutory request we are obliged to answer. If that happens and we are permitted to tell you, we will.

## Where your data is processed

Data is processed in the United Kingdom and the European Economic Area. If we ever need to transfer personal data outside the UK, we will rely on UK adequacy regulations or the International Data Transfer Addendum to the EU Standard Contractual Clauses, complete a transfer risk assessment, and update the sub-processor list before the transfer begins.

## How long we keep it

| Data | Retention | Then what |
| --- | --- | --- |
| Your account and everything attached to it | While your account is open | Deleted immediately when you delete your account |
| An account that has not been signed into | {{RETENTION_INACTIVE}} days | We email you a warning first, then delete it |
| An account whose email was never confirmed | {{RETENTION_UNVERIFIED}} days | Deleted without notice |
| Security and activity log | {{RETENTION_AUDIT}} days | Deleted |
| Consent records | For the life of the account, plus 12 months | Deleted. Kept slightly longer than the account so we can evidence that a consent decision was honoured |
| Deletion receipt (a one-way hash of your email plus the date) | 6 years | Deleted. This is our proof that we honoured a deletion request. It cannot be reversed to recover your email address |
| Backups | Rotated within 35 days | Overwritten. A deletion is fully effective across backups within 35 days |

The complete schedule, including the reasoning behind each period, is at [{{BASE_URL}}/governance/retention]({{BASE_URL}}/governance/retention).

## Your rights

Under the UK GDPR you have the right to:

- **Be informed** — this notice.
- **Access your data (Art. 15)** — download everything we hold, instantly, from your account page. No form, no wait, no identity check beyond being signed in.
- **Rectification (Art. 16)** — correct your name, role, organisation or experience level yourself at any time. If your email address is wrong, contact us.
- **Erasure (Art. 17)** — delete your account and all associated data yourself, immediately, from your account page.
- **Restrict processing (Art. 18)** — ask us to stop using your data while a dispute is resolved.
- **Data portability (Art. 20)** — the JSON export is structured, commonly used and machine-readable, and is the same data in the same shape we hold it in.
- **Object (Art. 21)** — object to processing based on our legitimate interests, including the security log.
- **Withdraw consent (Art. 7(3))** — for anything we rely on consent for, at any time, as easily as you gave it. Use your account settings or the cookie settings page.

Requests we cannot fulfil automatically go to {{DPO_EMAIL}} or through the form at [{{BASE_URL}}/account/requests]({{BASE_URL}}/account/requests). We respond within one calendar month, and will tell you if we need to extend that for a complex request, as Art. 12(3) allows.

There is no charge. We will only ask you to verify your identity if we have a genuine doubt about who is making the request, and we will explain why if we do.

## Automated decision-making

We do not carry out any automated decision-making or profiling that produces legal effects or otherwise significantly affects you. The maturity assessment score is arithmetic applied to answers you typed, shown only to you, and used for nothing else.

## Children

This service is for people doing a job, and is not directed at children. We do not knowingly collect data from anyone under 16. If you believe we have, contact {{DPO_EMAIL}} and we will delete it.

## Security

- All traffic is served over HTTPS with HSTS in production.
- Passwords are hashed with bcrypt at cost 12 and are never logged, emailed or recoverable.
- Sessions are httpOnly, `SameSite=Lax`, secure in production, and regenerated on sign-in.
- Every state-changing form is protected against cross-site request forgery.
- A strict nonce-based Content-Security-Policy is applied; there are no inline scripts and no third-party script sources.
- Credential endpoints are rate limited, and repeated failures temporarily lock the individual account.
- Access to production data is limited to named administrators and logged.

Report a vulnerability to {{DPO_EMAIL}}. Our disclosure policy is at [{{BASE_URL}}/legal/security]({{BASE_URL}}/legal/security). We will not pursue anyone acting in good faith under that policy.

## If something goes wrong

If personal data is breached, we follow the plan at [{{BASE_URL}}/governance/breach]({{BASE_URL}}/governance/breach): we notify the ICO within 72 hours where the breach is likely to result in a risk to you, and we tell you directly and without undue delay where the risk is high.

## Complaints

Tell us first, at {{DPO_EMAIL}} — we would rather fix it. You also have the right to complain directly to the Information Commissioner's Office at any time, and doing so does not affect any other rights you have.

**Information Commissioner's Office**, Wycliffe House, Water Lane, Wilmslow, Cheshire, SK9 5AF. Helpline 0303 123 1113. ico.org.uk

## Changes to this notice

Material changes are versioned, dated and announced on the site. The version you agreed to is recorded against your account, so we can always tell you which wording applied when. Previous versions are available on request.
