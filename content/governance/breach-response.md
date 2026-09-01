Personal data breach response plan for {{SITE_NAME}}, under UK GDPR Articles 33 and 34.

**Owner:** {{DPO_EMAIL}}. **Last tested:** {{PRIVACY_VERSION}}. **Test cycle:** tabletop exercise every six months.

## What counts as a breach

Any breach of security leading to the accidental or unlawful destruction, loss, alteration, unauthorised disclosure of, or access to personal data. It includes:

- unauthorised access to the database or a backup;
- an email sent to the wrong person;
- a bug that shows one user another user's data;
- loss of a device with production credentials;
- ransomware or any loss of availability;
- a processor telling us they have had a breach.

It is a breach whether or not anyone has been harmed yet, and whether or not it was malicious. A bug that *could* have exposed data but demonstrably did not is a near miss — log it and fix it, but it is not notifiable.

## The clock

**72 hours from the moment we become aware**, not from the moment we understand it. Awareness means a reasonable degree of certainty that a security incident has occurred leading to personal data being compromised. If in doubt, treat the earliest plausible moment as the start.

Incomplete information is not a reason to delay notification. Art. 33(4) explicitly allows notifying in phases.

## Roles

| Role | Who | Responsibility |
| --- | --- | --- |
| Incident lead | First responder until handed over | Contain, coordinate, keep the log |
| Data protection lead | {{DPO_EMAIL}} | Assess risk, decide on notification, own the ICO relationship |
| Technical lead | Engineer on call | Investigate, contain, preserve evidence, remediate |
| Communications | Service owner | Draft user notification and any public statement |

One person may hold several roles in a service this size. Write down who held which, when.

## Step 1 — Contain (immediately)

- Stop the bleeding: revoke credentials, disable the affected endpoint, take the service offline if that is what it takes. Availability is less important than a continuing exposure.
- Preserve evidence before remediating: snapshot logs, capture the database state, note timestamps. Do not overwrite the thing you will need to explain later.
- Open a timestamped incident log. Every action, every decision, every "we do not know yet". This log is the single most valuable artefact if the ICO asks.
- Do not email the whole company. Restrict early information to those who need it.

## Step 2 — Assess (within hours)

Record answers to:

1. What data, whose data, and how many people?
2. What categories — email addresses only, or password hashes, or user-generated content?
3. Was it accessed, or only exposed? Is there evidence of exfiltration?
4. Is the exposure ongoing?
5. Could the data be used to cause harm — identity fraud, account takeover elsewhere through password reuse, distress, reputational damage?
6. Are the data subjects vulnerable in any way?
7. Is the data intelligible to whoever obtained it — encrypted, hashed, or in the clear?

**Risk to individuals is the test for notification, not embarrassment to us.**

| Assessment | Action |
| --- | --- |
| No risk to individuals | Log internally. No notification required. Record the reasoning — this decision must be defensible |
| Risk to individuals | Notify the ICO within 72 hours |
| High risk to individuals | Notify the ICO **and** the affected individuals without undue delay |

For this service specifically: exposure of email addresses alone is likely to be a risk but not a high risk. Exposure of email addresses together with password hashes should be treated as high risk, because of password reuse, and should trigger a forced reset for every affected account regardless of the notification decision.

## Step 3 — Notify the ICO (within 72 hours)

Report through the ICO's online reporting service, or the personal data breach helpline on 0303 123 1113 outside office hours.

Include, per Art. 33(3):

- the nature of the breach, categories and approximate number of data subjects and records;
- the name and contact details of the data protection lead;
- the likely consequences;
- the measures taken or proposed, including mitigation;
- what you do not yet know, and when you expect to know it.

If you miss 72 hours, still report, and explain the delay honestly. A late report with a candid explanation is treated better than a concealed breach.

## Step 4 — Notify the affected people (if high risk)

Plain language. No hedging, no passive voice hiding who did what. Tell them:

- what happened, in one sentence at the top;
- what data of theirs was involved — and specifically what was *not*;
- what the realistic risk to them is;
- what we have done;
- **what they should do**, concretely — change your password here and anywhere you reused it; watch for phishing referencing this service;
- how to contact us, and their right to complain to the ICO.

Do not bury it in a policy update email. Do not describe it as "an incident affecting a small number of users" if you know the number.

## Step 5 — Learn

Within 5 working days of closure, run a blameless post-incident review using the template on this site. Record contributing conditions, not culprits. Actions go in the backlog with owners and dates, and are tracked to closure in the open.

Update the risk register, this plan, and the DPIA if the incident revealed something they did not anticipate.

## Breach register

Every breach and every near miss is recorded, whether or not it was notifiable. Art. 33(5) requires this and the ICO will ask for it. Minimum fields:

| Field |
| --- |
| Reference and date/time discovered |
| How discovered |
| Description and categories of data |
| Number of data subjects affected |
| Risk assessment and reasoning |
| Notification decision, with reasons — including reasons for *not* notifying |
| ICO reference, if reported |
| Containment and remediation actions |
| Date closed |
| Lessons and linked actions |

## Processor breaches

Our contracts require processors to notify us **without undue delay** and to assist with our own notification duties. If a processor reports a breach, our 72-hour clock starts when they tell us. Their assessment is not a substitute for ours.

## Tabletop exercise

Every six months, walk through one scenario in an hour, with the plan open, and note where it was unclear:

1. A researcher emails to say a URL returns another user's saved resources.
2. The hosting provider reports unauthorised access to a backup volume.
3. An inactivity warning email is accidentally sent with all recipients in the To field.
4. A former administrator's credentials are found to still be active.

Record the exercise date and findings here. An untested plan is a document, not a capability.
