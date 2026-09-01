How {{SITE_NAME}} handles requests from data subjects exercising their rights under UK GDPR Chapter 3.

**Owner:** {{DPO_EMAIL}}. **Last reviewed:** {{PRIVACY_VERSION}}.

## Design principle

Rights that require a form and a wait are rights on paper. Wherever a right can be exercised safely by the user themselves, it is — instantly, with no request, no identity check beyond being signed in, and no human in the loop.

| Right | Article | How it works here | Human involved? |
| --- | --- | --- | --- |
| Be informed | 13, 14 | Published privacy notice, ROPA and DPIA | No |
| Access | 15 | Self-service export from the account page, in JSON and plain text, instantly | No |
| Rectification | 16 | User edits their own name, role, organisation and experience level. Email change requires contact, to prevent account takeover | Only for email change |
| Erasure | 17 | Self-service, immediate, permanent, from the account page. Requires password re-entry | No |
| Restrict processing | 18 | Request form at `/account/requests`, routed to the data protection lead | Yes |
| Portability | 20 | The same JSON export — structured, commonly used, machine-readable | No |
| Object | 21 | Request form; consent-based purposes can be switched off directly in settings | Yes for legitimate-interest processing |
| Withdraw consent | 7(3) | Account settings and cookie settings page. One click, effective immediately | No |
| Not be subject to automated decisions | 22 | Not applicable — no such processing exists | n/a |

## Timescales

- **One calendar month** from receipt, for anything requiring a human.
- Extendable by a further two months for complex or numerous requests (Art. 12(3)), but only with an explanation sent inside the first month.
- Self-service rights are exercised in seconds, so the statutory clock is largely academic — which is the point.

## Identity verification

We verify identity only where we have genuine doubt (Art. 12(6)). Being signed in is sufficient for anything self-service.

For a request by email where we cannot be confident of identity, we ask for the minimum needed to be satisfied. We **do not** ask for a scan of a passport or driving licence to confirm an email address — that would collect far more data than the request itself concerns, and the ICO takes a dim view of it. Typically we send a confirmation link to the address on the account.

If we cannot verify identity, we say so, explain why, and do not act on the request. We record the reasoning.

## Handling a request that needs a human

1. **Log it** the day it arrives: date received, requester, right invoked, deadline. The deadline is calculated on receipt, not on triage.
2. **Acknowledge** within 3 working days, stating the deadline.
3. **Clarify** only if genuinely necessary. A clarification request does not stop the clock unless the request was genuinely unclear about what data it concerns.
4. **Search** every system in the ROPA. Do not rely on memory of where data lives — work down the list.
5. **Review** for third-party data. If a retro note names another person, redact the third party's data unless they consent or it is reasonable to disclose. Note what was redacted and why.
6. **Respond** in writing, in plain language, stating what we found, what we did, what we withheld and why, and the right to complain to the ICO.
7. **Close and record** the outcome, the date and any lessons.

## Refusing or charging

We do not charge. We may refuse a manifestly unfounded or excessive request (Art. 12(5)) — for example, a repeated identical request with no intervening change — but the bar is high and the burden is on us. Any refusal must:

- be in writing, with the reason;
- be authorised by the data protection lead;
- explain the right to complain to the ICO and to seek a judicial remedy;
- be recorded in the request register with the full reasoning.

We have not refused any request. If we do, it will be recorded here.

## Erasure: what we keep, and why

When an account is deleted we retain exactly two things, and we tell the user both in the confirmation email:

1. **A deletion receipt** — a salted one-way hash of the email address plus the date. This is our evidence that the request was honoured. It cannot be reversed to an email address without the server salt.
2. **Anonymised audit rows** — the security log entries for that account with the user id, email, IP hash and detail removed. What remains is a bare event type and timestamp, which is not personal data.

Everything else goes, in one transaction, cascading to every related table. Backups are overwritten within 35 days, and we say so.

## Requests about someone else

If a request concerns another person's data — an employer asking about an employee, for instance — we do not disclose. The data subject must make their own request, or provide clear written authority. We tell the requester this and do not confirm whether an account exists.

## Request register

| Field |
| --- |
| Reference |
| Date received / deadline |
| Right invoked |
| Identity verified (how) |
| Systems searched |
| Third-party data redacted (what and why) |
| Outcome |
| Date responded |
| Complaint received (y/n) |
| Lessons |

## Training

Anyone who might receive a request — which in a small service is everyone — should be able to recognise one and know that the clock starts on receipt, not on recognition. A request does not have to say "subject access request" or cite an article. "Can you tell me what you've got on me?" is a valid Art. 15 request and starts the clock.
