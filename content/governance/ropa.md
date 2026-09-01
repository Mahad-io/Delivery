Record of Processing Activities maintained under UK GDPR Article 30. Published voluntarily — most controllers keep this internal, but publishing it is the cheapest possible demonstration of accountability, and it keeps us honest.

**Controller:** {{ORG_LEGAL_NAME}}, {{ORG_ADDRESS}}. ICO registration {{ICO_REG}}. Contact {{DPO_EMAIL}}.
**Last reviewed:** {{PRIVACY_VERSION}}. **Review cycle:** annually, and on any change to processing.

---

## RP-01 — Account management

| Field | Detail |
| --- | --- |
| Purpose | Create and operate a user account so a person can download templates, save resources, track learning progress and keep tool output |
| Categories of data subject | Registered users of {{BASE_URL}} |
| Categories of personal data | Email address, name, bcrypt password hash, email confirmation status, account creation and last sign-in timestamps. Optional: job role, organisation, experience level |
| Special category data | None. We do not ask for and do not want any |
| Lawful basis | Art. 6(1)(b) contract for the mandatory fields. Art. 6(1)(a) consent for the three optional profile fields |
| Recipients | Hosting provider (as processor). No other recipients |
| Transfers outside UK | None currently |
| Retention | For the life of the account. {{RETENTION_INACTIVE}} days of inactivity triggers a warning email then deletion. Unconfirmed accounts deleted after {{RETENTION_UNVERIFIED}} days |
| Security measures | bcrypt cost 12, TLS in transit, volume encryption at rest, MFA on admin access, parameterised SQL, rate limiting, per-account lockout |
| Source of data | Directly from the data subject |

## RP-02 — Download and activity history

| Field | Detail |
| --- | --- |
| Purpose | Show a user their own download history and saved items; count aggregate template popularity to prioritise future work |
| Categories of personal data | User id, resource identifier, format, timestamp |
| Lawful basis | Art. 6(1)(b) contract for the individual history. Art. 6(1)(f) legitimate interests for the aggregate count — see LIA-01 |
| Recipients | Hosting provider |
| Retention | For the life of the account. Aggregate counts survive deletion but carry no identifier |
| Security measures | As RP-01. Aggregate queries never select a user identifier |

## RP-03 — Learning progress and assessment results

| Field | Detail |
| --- | --- |
| Purpose | Show a user their progress through learning paths and let them compare a maturity assessment against their own earlier results |
| Categories of personal data | User id, path and module identifiers, completion timestamps, assessment answers (1–5 scores) and derived scores |
| Lawful basis | Art. 6(1)(b) contract |
| Special category risk | The assessment asks about team practices, not individuals. Free-text entry is not offered, specifically so that opinions about named colleagues cannot be recorded |
| Retention | For the life of the account |
| Automated decision-making | None with legal or significant effect. Scores are arithmetic, shown only to the user |

## RP-04 — Retro boards and user-generated notes

| Field | Detail |
| --- | --- |
| Purpose | Store a retro board and its notes so the user can return to it |
| Categories of personal data | User id, board title, note text as typed by the user, vote counts |
| Lawful basis | Art. 6(1)(b) contract |
| Risk note | A user could type another person's personal data into a note. The terms of use prohibit this, the interface warns against it, boards are private to a single account, and the user is the controller for any third-party data they enter |
| Retention | Until the user deletes the board or their account |
| Recipients | Hosting provider. Boards are not shared or published |

## RP-05 — Consent records

| Field | Detail |
| --- | --- |
| Purpose | Evidence that consent was freely given, specific, informed and unambiguous, as required by Art. 7(1) |
| Categories of personal data | User id or pseudonymous session id, purpose, granted/refused, mechanism, policy version, salted IP hash, user-agent string, timestamp |
| Lawful basis | Art. 6(1)(c) legal obligation — we are required to be able to demonstrate consent |
| Retention | Life of the account plus 12 months. Pre-signup records keyed only to a session id are deleted after 12 months |
| Security measures | Append-only table; no update or delete path exists in the application |

## RP-06 — Security and activity log

| Field | Detail |
| --- | --- |
| Purpose | Detect and investigate unauthorised access, credential-stuffing and abuse; give the user visibility of activity on their own account |
| Categories of personal data | User id, email, action, minimal detail, salted IP hash, timestamp |
| Lawful basis | Art. 6(1)(f) legitimate interests — see LIA-02 |
| Retention | {{RETENTION_AUDIT}} days, then deleted. Anonymised immediately on account deletion |
| Data subject rights | Included in the Art. 15 export. Subject to the right to object under Art. 21, which we would weigh against the security need |

## RP-07 — Transactional email

| Field | Detail |
| --- | --- |
| Purpose | Send email confirmation, password reset, deletion confirmation and inactivity warnings |
| Categories of personal data | Email address, name |
| Lawful basis | Art. 6(1)(b) contract |
| Recipients | Email delivery provider (as processor) — see sub-processor list |
| Retention | Not retained beyond delivery. Provider logs per their retention policy, contractually capped at 30 days |

## RP-08 — Product update email

| Field | Detail |
| --- | --- |
| Purpose | Tell users when new templates, modules or tools are published |
| Categories of personal data | Email address, name |
| Lawful basis | Art. 6(1)(a) consent, and PECR reg. 22. Unticked by default at signup; withdrawable in account settings and by one-click unsubscribe in every message |
| Retention | Until consent is withdrawn or the account is deleted |

## RP-09 — Deletion receipts

| Field | Detail |
| --- | --- |
| Purpose | Evidence that an erasure request was honoured, and on what date |
| Categories of personal data | Salted one-way hash of the email address, request and completion timestamps, optional free-text reason |
| Lawful basis | Art. 6(1)(c) legal obligation and Art. 6(1)(f) — we must be able to demonstrate compliance without retaining the data we deleted |
| Retention | 6 years, aligned with the general limitation period |
| Note | The hash is not reversible to an email address without the server salt, and rotating the salt destroys the link. We consider these records pseudonymised rather than anonymous, and treat them as personal data accordingly |

---

## Legitimate interests assessments

### LIA-01 — Aggregate download counts

- **Purpose:** know which templates are used so we can improve the right ones.
- **Necessity:** we cannot prioritise sensibly without it, and no less intrusive method gives the same answer. Consent is not appropriate because a partial count is a misleading count.
- **Balancing:** the query aggregates over all users and returns no identifier. No decision is made about any individual. Impact on the data subject is negligible; the benefit to all users is real. Users are told about it in the privacy notice and can object.
- **Conclusion:** legitimate interests is appropriate.

### LIA-02 — Security and activity log

- **Purpose:** detect and investigate unauthorised access to accounts.
- **Necessity:** without an activity record we could not tell a user whether their account had been accessed, or investigate credential stuffing.
- **Balancing:** we minimise heavily — no raw IP addresses, no request bodies, no page-by-page browsing history, minimal detail per event. The user can see the whole log in their export. It is anonymised on deletion and expires after {{RETENTION_AUDIT}} days. Users generally expect a service to keep a security log of their own account activity.
- **Conclusion:** legitimate interests is appropriate, with the minimisation measures as a condition.
