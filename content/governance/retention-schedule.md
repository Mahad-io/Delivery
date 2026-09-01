Retention schedule for {{SITE_NAME}}. Implemented in `scripts/retention.js`, which is intended to run daily.

**Owner:** {{DPO_EMAIL}}. **Last reviewed:** {{PRIVACY_VERSION}}.

## Principle

We keep personal data for the shortest period that still lets us do the thing the user asked for and meet our own legal obligations. Every period below has a stated reason. "In case it is useful later" is not a reason and does not appear in this document.

| Data | Period | Trigger | Reason for the period | Disposal |
| --- | --- | --- | --- | --- |
| Account record | Life of the account | User deletes it | Needed to provide the account | Hard delete, cascading |
| Inactive account | {{RETENTION_INACTIVE}} days since last sign-in | Automatic | Two years covers a normal gap between projects. Beyond that the account is almost certainly abandoned and holding it serves nobody | Warning email at day {{RETENTION_INACTIVE}} minus 30, then hard delete |
| Unconfirmed account | {{RETENTION_UNVERIFIED}} days since creation | Automatic | An address never confirmed may not belong to the person who typed it. Holding it longer is unjustifiable | Hard delete, no notice (we cannot safely email an unconfirmed address about it) |
| Download history | Life of the account | Account deletion | The user's own history is a service feature | Cascaded on account deletion |
| Saved resources | Life of the account | Account deletion | Service feature | Cascaded |
| Learning progress | Life of the account | Account deletion | Service feature | Cascaded |
| Assessment answers and scores | Life of the account | Account deletion | Comparing against your own earlier result is the whole point of keeping it | Cascaded |
| Retro boards and notes | Until deleted by the user | User action or account deletion | User-generated content, theirs to keep or remove | Hard delete, cascading to notes |
| Consent records (account) | Life of the account plus 12 months | Automatic | We must be able to evidence a consent decision after the fact, including one honoured shortly before deletion | Hard delete |
| Consent records (pre-signup, session-keyed) | 12 months | Automatic | Long enough to evidence a cookie decision within a normal complaint window | Hard delete |
| Security and activity log | {{RETENTION_AUDIT}} days | Automatic | A year covers the realistic window for investigating unauthorised access; beyond that it has no investigative value | Hard delete |
| Security log rows for a deleted account | Immediately on deletion | Account deletion | Once the identifiers are removed the rows are no longer personal data | Anonymised in place — user id, email, IP hash and detail nulled |
| Deletion receipt | 6 years | Automatic | Aligned with the general limitation period, so we can evidence compliance if challenged. Contains no recoverable identifier | Hard delete |
| Session records | 30 days from last use | Automatic (session store) | Matches cookie lifetime | Deleted by the session store |
| Rate-limit counters | 15 minutes to 24 hours | Automatic | Held in memory only, for the length of the limit window | Expires from memory; never written to disk |
| Transactional email content | Not retained by us | n/a | We do not keep copies of sent mail | Provider logs, contractually capped at 30 days |
| Backups | Rotated within 35 days | Automatic | Balances recovery capability against the right to erasure. Means any deletion is fully effective within 35 days | Overwritten |
| Aggregate download counts | Indefinite | n/a | Not personal data — no identifier, no reasonable means of re-identification | n/a |

## Running it

```
npm run retention          # dry run: reports what would be deleted
npm run retention -- --go  # actually delete
```

Each run writes a summary to the console and a single `retention.run` entry to the audit log recording the counts deleted per category. It never records who was deleted.

In production, run it daily from cron or a scheduled task. If it has not run for seven days, that is a compliance incident and should be treated as one.

## Deletion means deletion

We do not use soft-delete flags for account deletion. There is no `deleted_at` column on `users` and no "deleted" state a support agent could reverse. When a user deletes their account:

1. Audit rows for that user are anonymised in place.
2. The user row is deleted, cascading to downloads, saved resources, learning progress, assessments, boards and board notes.
3. A deletion receipt containing only a salted one-way hash of the email address is written.
4. All three steps run in one transaction, so a partial deletion is not possible.
5. A confirmation email is sent, explaining exactly what was kept and why.

A smoke test asserts that no row referencing the deleted user id remains anywhere in the database.

## Review

Reviewed annually and whenever a new data category is introduced. Adding a table to the schema without adding a row to this schedule should fail code review.
