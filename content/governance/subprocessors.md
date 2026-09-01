Sub-processors engaged by {{ORG_LEGAL_NAME}} to process personal data on our behalf, published under UK GDPR Article 28 transparency good practice.

**Last reviewed:** {{PRIVACY_VERSION}}. **Review cycle:** annually, and before engaging anyone new.

> **This list must be completed before you go live.** The rows below describe the *categories* of processor this application needs. Replace each with the actual named provider, its country of processing, and the date its Art. 28 terms were signed. An honest empty template is better than a plausible fiction, so we have not invented supplier names.

## Current sub-processors

| # | Processor | Service provided | Personal data processed | Location of processing | Transfer mechanism | Art. 28 terms |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | *(to be completed — application hosting)* | Runs the application server and stores the database and backups | All data described in the ROPA | *(to be completed — must be UK or EEA, or a transfer mechanism recorded)* | UK adequacy / IDTA | *(date signed)* |
| 2 | *(to be completed — transactional email)* | Delivers account confirmation, password reset, deletion confirmation and inactivity warning emails | Email address, name, message content | *(to be completed)* | UK adequacy / IDTA | *(date signed)* |
| 3 | *(to be completed — DNS and TLS / CDN, if used)* | Domain resolution and certificate termination. Sees IP addresses and requested URLs in transit; stores no application data | Connection metadata only | *(to be completed)* | UK adequacy / IDTA | *(date signed)* |

## Sub-processors we deliberately do not use

Listing these is as informative as listing the ones we do:

- **No analytics provider.** No Google Analytics, no Plausible, no Matomo Cloud, nothing. Page counts are held server-side with no third party involved.
- **No advertising, retargeting or data broker of any kind.**
- **No customer messaging, live chat or session-recording tool.**
- **No CRM or marketing automation platform.** Product update emails go through the same transactional provider, from the same database.
- **No third-party font, script, style or image host.** Every asset is served from our own domain. This is why there is no `connect-src` or `script-src` entry for any other origin in our Content-Security-Policy.
- **No AI or machine-learning service.** No personal data from this service is sent to a model provider, for inference or training.

## Requirements we impose on any processor

Before engagement, each processor must:

1. Sign terms containing every element required by Art. 28(3) — process only on our documented instructions, confidentiality obligations on staff, Art. 32 security measures, assistance with data subject rights and DPIAs, breach notification without undue delay, our approval of onward sub-processors, deletion or return of data at the end of the contract, and audit rights.
2. Process only in the UK or EEA, or under a valid transfer mechanism with a completed transfer risk assessment.
3. Provide breach notification without undue delay, and assist with our Art. 33/34 duties.
4. Support encryption in transit and at rest.
5. Support MFA on administrative access.

## Changes

We review this list annually and before any change. Where a new sub-processor would materially change the risk profile — in particular by introducing an international transfer or a new category of data — we update the privacy notice and the DPIA at the same time, and announce the change on the site before it takes effect.

To be told about changes to this list, email {{DPO_EMAIL}}.
