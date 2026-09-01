'use strict';

/*
 * Resource definitions, part 1 of 2: planning & governance, agile ceremonies.
 *
 * Every resource is data, not a binary blob. src/lib/templates.js turns the
 * `table` spec into CSV and the `doc` spec into Markdown at download time, so
 * there are no checked-in files to drift out of date and nothing to virus-scan.
 *
 * Provenance: these are original templates. Where the structure follows a
 * published framework or standard, `basedOn` names it so users can trace the
 * source - the Scrum Guide (Schwaber & Sutherland, CC BY-SA 4.0), the GOV.UK
 * Service Manual (OGL v3.0), APM/PRINCE2 governance conventions, and the
 * DORA and Kanban flow-metric definitions.
 */

module.exports = [
  /* ------------------------- planning & governance ------------------------- */
  {
    id: 'raid-log',
    title: 'RAID log',
    category: 'planning',
    level: 'core',
    minutes: 15,
    summary: 'One sheet for risks, assumptions, issues and dependencies, with scoring and review cadence built in.',
    why: 'Most teams keep four half-maintained lists. One log with one owner per line is the single biggest governance upgrade available to a new delivery manager.',
    tags: ['governance', 'risk', 'dependencies', 'reporting'],
    basedOn: 'APM Body of Knowledge risk conventions; probability x impact scoring',
    formats: ['csv', 'md'],
    table: {
      columns: ['ID', 'Type', 'Title', 'Description', 'Probability (1-5)', 'Impact (1-5)', 'Score', 'Response', 'Owner', 'Due', 'Status', 'Last reviewed', 'Notes'],
      sampleRows: [
        ['R-001', 'Risk', 'Payments vendor certification slips', 'Vendor has not confirmed a certification date, which sits on the critical path to launch.', '3', '5', '15', 'Mitigate - agree a written date by 12 Sep, hold a fallback provider warm', 'A. Delivery Manager', '2026-09-12', 'Open', '2026-09-01', 'Escalated at the 28 Aug steering group'],
        ['A-001', 'Assumption', 'Data migration volumes are as profiled', 'We are planning on 1.2m records based on a June extract.', '2', '4', '8', 'Validate - re-extract before build starts', 'Tech Lead', '2026-09-08', 'Open', '2026-09-01', 'Becomes an issue if volumes are >20% higher'],
        ['I-001', 'Issue', 'Test environment unavailable', 'Shared staging has been down for three days, blocking regression.', '5', '3', '15', 'Resolve - platform team engaged, temporary namespace agreed', 'Platform on-call', '2026-09-03', 'In progress', '2026-09-01', ''],
        ['D-001', 'Dependency', 'Identity team SSO endpoint', 'We need the new SSO endpoint in staging to finish sign-in.', '3', '4', '12', 'Manage - fortnightly sync, written date in their roadmap', 'A. Delivery Manager', '2026-09-19', 'Open', '2026-09-01', 'Inbound dependency, we are the consumer']
      ]
    },
    doc: {
      intro: 'A RAID log is the delivery manager\'s working memory. It only earns its keep if every line has a named human, a date and a decision - not a status.',
      sections: [
        {
          heading: 'How to use it',
          bullets: [
            'One row per item. Prefix IDs by type (R/A/I/D) so they stay unique as the log grows.',
            'Score = probability x impact. Anything scoring 15 or above goes on the next steering agenda by default.',
            'Response must start with a verb: Accept, Avoid, Mitigate, Transfer, Resolve, Manage, Validate.',
            'Owner is a person, never a team name. Teams do not chase things; people do.',
            'Review weekly with the team, monthly with the sponsor. Stamp the "last reviewed" column each time.'
          ]
        },
        {
          heading: 'Definitions that stop arguments',
          bullets: [
            'Risk - might happen, has not yet. Has a probability.',
            'Issue - has happened. Probability is 5 by definition; you are now managing impact.',
            'Assumption - something you are treating as true without evidence. Every assumption needs a validation date.',
            'Dependency - something you need from someone outside the team, or that they need from you. Record the direction.'
          ]
        },
        {
          heading: 'Anti-patterns to watch for',
          bullets: [
            'A log with 60 open rows and no closures - you are collecting, not managing.',
            '"Monitor" as a response. Monitoring is not a mitigation.',
            'Risks written as fears ("launch might fail") rather than causes ("vendor certification date is unconfirmed").',
            'Scores that never change. If nothing has moved in a month, the log is decorative.'
          ]
        }
      ]
    }
  },

  {
    id: 'raci-matrix',
    title: 'RACI matrix',
    category: 'planning',
    level: 'core',
    minutes: 20,
    summary: 'Decision and activity ownership grid, with the rules that keep it honest: one A per row, no more.',
    why: 'When a delivery slips for "ownership reasons", it is almost always because two people were Accountable, or nobody was.',
    tags: ['governance', 'stakeholders', 'roles'],
    basedOn: 'Standard RACI convention, with the single-accountable rule enforced',
    formats: ['csv', 'md'],
    table: {
      columns: ['Activity or decision', 'Sponsor', 'Product Manager', 'Delivery Manager', 'Tech Lead', 'Designer', 'Security', 'Legal / DPO', 'Notes'],
      sampleRows: [
        ['Approve the business case', 'A', 'R', 'C', 'C', 'I', 'I', 'C', 'Finance sign-off needed above GBP 100k'],
        ['Set and re-order the backlog', 'I', 'A', 'C', 'C', 'C', 'I', 'I', 'Product decides; delivery surfaces the cost'],
        ['Agree the delivery plan and milestones', 'C', 'C', 'A', 'R', 'C', 'I', 'I', ''],
        ['Approve architecture decisions', 'I', 'C', 'C', 'A', 'I', 'C', 'I', 'Recorded as an ADR'],
        ['Accept a risk above the tolerance line', 'A', 'C', 'R', 'C', 'I', 'C', 'C', 'Written acceptance, not a verbal nod'],
        ['Sign off the DPIA', 'C', 'R', 'C', 'C', 'I', 'C', 'A', 'Required before processing personal data'],
        ['Decide to go live', 'A', 'R', 'R', 'C', 'C', 'C', 'C', 'Go/no-go checklist attached'],
        ['Trigger rollback during an incident', 'I', 'I', 'C', 'A', 'I', 'I', 'I', 'On-call engineer has standing authority']
      ]
    },
    doc: {
      intro: 'RACI is cheap to draw and expensive to skip. Fill it in with the people in the room, not afterwards on your own.',
      sections: [
        {
          heading: 'The four letters',
          bullets: [
            'R - Responsible. Does the work. Can be several people.',
            'A - Accountable. Answers for the outcome and makes the call. Exactly one per row.',
            'C - Consulted. Gives input before the decision. Their view is sought, not binding.',
            'I - Informed. Told after the fact. No veto, no delay.'
          ]
        },
        {
          heading: 'Rules that make it work',
          bullets: [
            'One A per row. If you cannot pick, the activity is really two activities - split it.',
            'Cap the Cs. More than three consulted parties and the decision will not happen this quarter.',
            'Run it as a workshop. The disagreements you surface in the session are the entire value.',
            'Revisit at each phase boundary. Ownership in discovery is rarely ownership in live running.'
          ]
        },
        {
          heading: 'When to reach for something else',
          bullets: [
            'For a single high-stakes decision, a one-page decision record beats a grid.',
            'For an autonomous product team, a working agreement plus clear decision rights is lighter and less bureaucratic.',
            'For cross-government or multi-supplier work, extend to RASCI and add the Supporting column.'
          ]
        }
      ]
    }
  },

  {
    id: 'project-brief',
    title: 'Project brief and one-page mandate',
    category: 'planning',
    level: 'core',
    minutes: 45,
    summary: 'The page you write before you plan anything: problem, users, outcome measures, scope boundary, constraints.',
    why: 'A plan without an agreed problem statement is a schedule for building the wrong thing accurately.',
    tags: ['discovery', 'scope', 'outcomes'],
    basedOn: 'GOV.UK Service Manual discovery guidance; outcome-based framing',
    formats: ['md'],
    doc: {
      intro: 'Keep this to one side of A4. If it will not fit, the scope is not agreed yet.',
      sections: [
        { heading: '1. Problem', bullets: ['What is happening today that should not be, or not happening that should?', 'Who feels it, how often, and what does it cost them?', 'What evidence do you have - not anecdote?'] },
        { heading: '2. Users and stakeholders', bullets: ['Primary users and their job to be done.', 'Who else is affected, including people who will have to change how they work.', 'Who can stop this, and why might they want to?'] },
        { heading: '3. Outcome and measures', bullets: ['The change in the world you are aiming at, stated as a direction and a magnitude.', 'Two or three leading measures you can read within a sprint.', 'One lagging measure the sponsor actually cares about.', 'A counter-metric you promise not to damage.'] },
        { heading: '4. Scope boundary', bullets: ['In scope - the smallest thing that tests the bet.', 'Explicitly out of scope - write this down; it is where the arguments live.', 'Deliberately deferred, with the trigger that would bring it back.'] },
        { heading: '5. Constraints and non-negotiables', bullets: ['Dates that are real (legal, regulatory, contractual) versus dates that are hopeful.', 'Budget envelope and the approval route above it.', 'Accessibility, security, privacy and regulatory obligations.', 'Technology or supplier constraints you have inherited.'] },
        { heading: '6. Approach and first slice', bullets: ['Why this shape of delivery - iterative, phased, fixed-scope - and what that costs you.', 'What ships first and what you learn from it.', 'The decision you expect to make after the first slice.'] },
        { heading: '7. Risks you already know about', bullets: ['The three that would actually stop you.', 'For each: who owns it and what the first mitigating action is.'] },
        { heading: '8. Governance', bullets: ['Who is accountable for the outcome.', 'Decision forum, cadence and quorum.', 'What you will report, to whom, how often.'] }
      ]
    }
  },

  {
    id: 'delivery-roadmap',
    title: 'Outcome-based delivery roadmap',
    category: 'planning',
    level: 'core',
    minutes: 30,
    summary: 'Now / next / later roadmap keyed to outcomes and confidence rather than false-precision dates.',
    why: 'Gantt charts promise certainty you do not have. Confidence bands let you be honest and still be plannable.',
    tags: ['roadmap', 'planning', 'communication'],
    formats: ['csv', 'md'],
    table: {
      columns: ['Horizon', 'Outcome', 'Bet / initiative', 'Success measure', 'Confidence', 'Earliest', 'Expected', 'Latest responsible', 'Squad', 'Key dependency', 'Status'],
      sampleRows: [
        ['Now', 'Fewer failed sign-ins', 'Passwordless sign-in for returning users', 'Sign-in failure rate 4.1% -> under 2%', 'High', '2026-09-15', '2026-09-29', '2026-10-13', 'Access', 'Identity SSO endpoint', 'In build'],
        ['Now', 'Faster first order', 'Guest checkout', 'Median time-to-first-order under 4 min', 'High', '2026-09-22', '2026-10-06', '2026-10-20', 'Convert', 'Payments vendor cert', 'In build'],
        ['Next', 'Lower support contact rate', 'Self-service order changes', 'Contacts per 1,000 orders 32 -> 24', 'Medium', '2026-10-20', '2026-11-17', '2026-12-15', 'Care', 'Ops process change', 'Shaping'],
        ['Later', 'Retention', 'Personalised recommendations', 'Week-8 retention +3pp', 'Low', '2027-01-12', '2027-03-02', '-', 'Growth', 'Data platform work', 'Idea']
      ]
    },
    doc: {
      intro: 'A roadmap is a communication artefact, not a commitment ledger. Its job is to let other people plan around you.',
      sections: [
        { heading: 'Confidence, not fake precision', bullets: ['High - in build or next up, dates within a sprint or two of accurate.', 'Medium - shaped, sized, not started. Quote a month, not a day.', 'Low - a bet with a hypothesis. Quote a quarter and say so.', 'Never show a Low-confidence item with a specific date to a stakeholder who will diary it.'] },
        { heading: 'Three dates beat one', bullets: ['Earliest - if the run is clean.', 'Expected - your honest central estimate.', 'Latest responsible - the point beyond which the value decays or the dependency breaks. This is the one to negotiate against.'] },
        { heading: 'Keeping it alive', bullets: ['Re-cut it on a fixed cadence, monthly is usually right, and version it.', 'Every slip gets a one-line reason in the status column. Patterns in those reasons are your real improvement backlog.', 'Archive completed rows rather than deleting them - it is the fastest way to answer "what did you actually ship?"'] }
      ]
    }
  },

  {
    id: 'decision-log',
    title: 'Decision log and decision record',
    category: 'planning',
    level: 'core',
    minutes: 10,
    summary: 'Lightweight log of what was decided, by whom, on what basis, and what was rejected.',
    why: 'Six months later nobody remembers why. The cost of re-litigating a decision is far higher than the cost of writing it down.',
    tags: ['governance', 'documentation', 'architecture'],
    basedOn: 'Architecture Decision Record format (Nygard), generalised beyond architecture',
    formats: ['csv', 'md'],
    table: {
      columns: ['ID', 'Date', 'Decision', 'Context', 'Options considered', 'Chosen because', 'Rejected because', 'Decision maker', 'Consulted', 'Reversibility', 'Review by'],
      sampleRows: [
        ['DEC-014', '2026-08-19', 'Use the existing payments vendor for launch', 'Certification for the new vendor is unconfirmed and sits on the critical path.', '1) New vendor 2) Existing vendor 3) Dual-run', 'Removes the launch-blocking dependency; known operational model.', 'New vendor cheaper but no committed cert date; dual-run doubles support load.', 'Sponsor', 'Tech Lead, Finance, Security', 'Reversible with ~3 weeks of work', '2027-01-31'],
        ['DEC-015', '2026-08-26', 'Ship guest checkout without saved cards', 'Saved cards need a DPIA and a vault decision we cannot land this quarter.', '1) Full scope 2) Guest only 3) Delay both', 'Gets the measurable outcome now; keeps the privacy work honest rather than rushed.', 'Full scope would push launch by six weeks for a secondary benefit.', 'Product Manager', 'DPO, Delivery Manager', 'Easily reversible', '2026-11-30']
      ]
    },
    doc: {
      intro: 'Log the decisions that would be expensive to revisit. Not every choice needs a record - if nobody would ever ask "why did we do that?", skip it.',
      sections: [
        { heading: 'What makes a record worth writing', bullets: ['It closed off an option that someone will want to reopen.', 'It was contested, or made with incomplete information.', 'It has a cost attached - money, scope, risk acceptance, or a constraint on future work.'] },
        { heading: 'Reversibility is the key column', bullets: ['One-way door decisions deserve a proper record, named accountability and a slower process.', 'Two-way door decisions should be made fast and low in the organisation. Say so in the log so nobody escalates them.'] },
        { heading: 'Full decision record structure', bullets: ['Status - proposed, accepted, superseded (by which ID).', 'Context - the forces at play, including the constraints you did not choose.', 'Options - at least two real ones, with the trade-off you accepted.', 'Consequences - what becomes easier, what becomes harder.', 'Review trigger - a date or an event that should make you look again.'] }
      ]
    }
  },

  {
    id: 'dependency-tracker',
    title: 'Cross-team dependency tracker',
    category: 'planning',
    level: 'intermediate',
    minutes: 20,
    summary: 'Tracks inbound and outbound dependencies with the commitment status and the date you agreed, in writing.',
    why: 'Dependencies fail silently. A tracker with a "confirmed by" name turns a hope into a commitment.',
    tags: ['dependencies', 'scaling', 'governance'],
    formats: ['csv', 'md'],
    table: {
      columns: ['ID', 'Direction', 'What is needed', 'From team', 'To team', 'Needed by', 'Committed date', 'Confirmed by (name)', 'Confirmation evidence', 'Criticality', 'Fallback if late', 'Status', 'Last chased'],
      sampleRows: [
        ['DEP-01', 'Inbound', 'SSO endpoint in staging', 'Identity', 'Access squad', '2026-09-19', '2026-09-17', 'J. Identity Lead', 'Ticket IDN-451, roadmap item confirmed 26 Aug', 'Blocking', 'Stub the endpoint and ship behind a flag', 'On track', '2026-08-28'],
        ['DEP-02', 'Outbound', 'Event schema v2 published', 'Access squad', 'Data platform', '2026-10-03', '2026-10-03', 'A. Delivery Manager', 'Agreed in the 20 Aug architecture forum', 'Important', 'Data team consumes v1 for one more month', 'On track', '2026-08-28'],
        ['DEP-03', 'Inbound', 'Payments vendor certification', 'External vendor', 'Convert squad', '2026-09-12', 'Not committed', '-', 'Chased 3x, no written date', 'Blocking', 'Launch with existing vendor - see DEC-014', 'At risk', '2026-08-29']
      ]
    },
    doc: {
      intro: 'The only two states that matter are "committed in writing by a named person" and "not committed". Everything else is optimism.',
      sections: [
        { heading: 'Run the tracker like this', bullets: ['Review every dependency weekly, however calm it looks. Silence is the failure mode.', 'Record the evidence of the commitment - a ticket ID, a roadmap line, a meeting date. "They said yes on a call" is not evidence.', 'Every Blocking dependency needs a fallback written before it is late, not after.', 'Give outbound dependencies the same care. Being someone else\'s at-risk row damages you next quarter.'] },
        { heading: 'Escalation ladder', bullets: ['Chase 1 - delivery manager to delivery manager, in the open.', 'Chase 2 - written note with the date, the impact and the fallback, copied to both leads.', 'Chase 3 - escalate to the shared accountable owner with a decision to make, not a complaint to hear.', 'Never escalate without naming the decision you want.'] }
      ]
    }
  },

  {
    id: 'escalation-matrix',
    title: 'Escalation and decision-rights matrix',
    category: 'planning',
    level: 'intermediate',
    minutes: 20,
    summary: 'Who can decide what, up to what threshold, in what timeframe - and what happens out of hours.',
    why: 'Escalation without pre-agreed thresholds becomes a popularity contest. Agree the ladder while everyone is calm.',
    tags: ['governance', 'incidents', 'decision-rights'],
    formats: ['csv'],
    table: {
      columns: ['Decision type', 'Level 1 - team', 'Level 2 - delivery lead', 'Level 3 - sponsor', 'Level 4 - exec', 'Response time expected', 'Out of hours route'],
      sampleRows: [
        ['Scope change within sprint', 'Product Manager decides', 'Notified', 'Notified', '-', 'Same day', 'n/a'],
        ['Scope change affecting a committed milestone', 'Recommend', 'Decides up to 5 days slip', 'Decides beyond 5 days', '-', '2 working days', 'n/a'],
        ['Unbudgeted spend', '-', 'Up to GBP 5k', 'Up to GBP 50k', 'Above GBP 50k', '5 working days', 'n/a'],
        ['Accepting a risk above tolerance', 'Recommend', 'Recommend', 'Decides', 'Decides if regulatory', '2 working days', 'n/a'],
        ['P1 incident - customer impacting', 'Incident lead decides response', 'Informed within 30 min', 'Informed within 60 min', 'Informed if over 4 hours', 'Immediate', 'On-call rota, page via incident channel'],
        ['Security or data breach', 'Escalate immediately, do not triage alone', 'Informed immediately', 'Informed immediately', 'Informed immediately', 'Immediate', 'Security on-call; DPO within 24h for personal data'],
        ['Go-live decision', 'Recommend', 'Recommend', 'Decides', '-', 'At the go/no-go', 'n/a']
      ]
    }
  },

  {
    id: 'business-case-lite',
    title: 'Lightweight business case',
    category: 'planning',
    level: 'intermediate',
    minutes: 60,
    summary: 'Two pages: the bet, the value, the cost, the confidence, and what you would do instead.',
    why: 'You will be asked "what is the return?" and "what is the cost of not doing it?". Have both answers before the meeting.',
    tags: ['funding', 'prioritisation', 'outcomes'],
    basedOn: 'Five-case model, compressed for iterative delivery',
    formats: ['md'],
    doc: {
      intro: 'Written for a sponsor who has fifteen minutes and three competing asks. Lead with the decision you want from them.',
      sections: [
        { heading: 'The ask', bullets: ['What you want approved, in one sentence, with the number in it.', 'By when, and what happens to the value if the decision slips a quarter.'] },
        { heading: 'Strategic case', bullets: ['The problem, sized. Volume x frequency x cost per occurrence.', 'Which organisational objective this moves and by how much.', 'What happens if you do nothing - quantified, not rhetorical.'] },
        { heading: 'Economic case', bullets: ['Options appraisal: do nothing, do minimum, do the recommended thing, do more.', 'Benefits: cash-releasing, cost-avoiding, and non-financial - kept separate and never summed.', 'Costs: build, run, and the change cost imposed on other teams.', 'Payback period and the assumption it is most sensitive to.'] },
        { heading: 'Confidence and evidence', bullets: ['State the confidence in the benefit and where it comes from - benchmark, experiment, or judgement.', 'Name the one assumption that, if wrong, kills the case.', 'Propose the cheapest test of that assumption and what it costs to run.'] },
        { heading: 'Delivery case', bullets: ['Shape of delivery, first slice, and the decision point after it.', 'Team and skills needed, and where they come from - including who stops doing what.', 'Key dependencies and the ones you cannot control.'] },
        { heading: 'Benefits realisation', bullets: ['Who owns the benefit after go-live - usually not the delivery team.', 'When the measurement happens and who reports it.', 'The trigger that would make you stop and reallocate.'] }
      ]
    }
  },

  /* --------------------------- agile ceremonies --------------------------- */
  {
    id: 'definition-of-ready-done',
    title: 'Definition of Ready and Definition of Done',
    category: 'agile',
    level: 'core',
    minutes: 30,
    summary: 'Two checklists the team writes for itself, plus the facilitation script for agreeing them.',
    why: 'Almost all "we underestimated" is really "we started work that was not ready" or "we called it done before it was".',
    tags: ['scrum', 'quality', 'team-agreements'],
    basedOn: 'Scrum Guide (Definition of Done is a Scrum commitment); Ready is a team convention, not part of Scrum',
    formats: ['md'],
    doc: {
      intro: 'Copy this as a starting point, then run the workshop. A DoD the team did not write is a document the team will not use.',
      sections: [
        { heading: 'Definition of Ready - candidate checklist', bullets: ['The user and the need are stated, not implied.', 'Acceptance criteria are written and testable.', 'Dependencies are identified and either resolved or explicitly stubbed.', 'Design is available at the fidelity the work needs - no more.', 'Accessibility requirements are named for anything user-facing.', 'Non-functional expectations stated where they bite: performance, data volumes, error handling.', 'Small enough to finish inside one sprint with room to spare.', 'The team has discussed it and can articulate what "working" looks like.'] },
        { heading: 'Definition of Done - candidate checklist', bullets: ['Acceptance criteria demonstrably met.', 'Code reviewed by someone who did not write it.', 'Automated tests written and passing in the pipeline.', 'Accessibility checked against WCAG 2.2 AA for anything user-facing, including keyboard-only and screen-reader passes.', 'Security considerations reviewed; no new secrets in code; dependencies scanned.', 'Observability in place - you can tell from telemetry whether it is working.', 'Documentation and runbook updated where behaviour changed.', 'Deployed to production or genuinely deployable on demand.', 'Feature flag state and rollback path known.'] },
        { heading: 'Facilitating the workshop (60 minutes)', bullets: ['5 min - why we are doing this: fewer surprises, faster flow, less rework.', '15 min - silent writing: everyone lists what "done" should mean, one idea per note.', '15 min - cluster and argue. The arguments are the point.', '15 min - cut ruthlessly. A 30-item DoD is theatre; aim for 8 to 12 checkable items.', '10 min - agree where it lives, who challenges it, and when you review it.'] },
        { heading: 'Keeping them useful', bullets: ['Review at every retro where an item was called done and then came back.', 'When you consistently pass an item without thinking, retire it - it is now culture.', 'When something bites you twice, add it. Once is bad luck, twice is a missing check.', 'Undone work is debt. Track it visibly; do not let "done except..." become normal.'] }
      ]
    }
  },

  {
    id: 'retro-pack',
    title: 'Retrospective pack - twelve formats',
    category: 'agile',
    level: 'core',
    minutes: 25,
    summary: 'Twelve retro formats with timings, prompts, when to use each, and how to avoid the same three actions every fortnight.',
    why: 'The same format every sprint produces the same conversation. Rotating format is the cheapest way to surface something new.',
    tags: ['scrum', 'facilitation', 'team-health', 'retrospective'],
    basedOn: 'Derby & Larsen retrospective structure (set the stage, gather data, generate insight, decide what to do, close)',
    formats: ['md'],
    doc: {
      intro: 'Every format below fits the same five-phase spine. Pick the format to suit what the team needs to talk about, not what you ran last time.',
      sections: [
        { heading: 'The spine (60 minutes)', bullets: ['Set the stage - 5 min. Remind everyone of the prime directive and check people are actually present.', 'Gather data - 15 min. Facts and feelings, written silently first to stop the loudest voice anchoring the room.', 'Generate insight - 15 min. Cluster, then ask "why" until you reach something you can change.', 'Decide what to do - 15 min. Two actions maximum, each with an owner and a date.', 'Close - 10 min. How was this retro, and what does the team want next time.'] },
        { heading: 'Formats 1-4: general purpose', bullets: ['Start / Stop / Continue - fast, safe, good for a new team. Wears out quickly.', 'Mad / Sad / Glad - surfaces feeling rather than process. Use when the mood is off but nobody is saying why.', 'Four Ls: Liked, Learned, Lacked, Longed for - the best general default; "lacked" gets at systemic gaps.', 'Sailboat - wind, anchors, rocks, island. Good with mixed technical and non-technical members.'] },
        { heading: 'Formats 5-8: for a specific problem', bullets: ['Timeline - plot the sprint\'s events on a wall, then mark emotional highs and lows. Best after a chaotic sprint.', 'Five Whys on one incident - go deep on a single thing rather than wide on ten.', 'Circles and Soup - sort issues into what we control, what we influence, and what we can only adapt to. The antidote to a team that feels powerless.', 'Lean Coffee - the team sets the agenda by voting. Use when you genuinely do not know what needs discussing.'] },
        { heading: 'Formats 9-12: for particular moments', bullets: ['Futurespective - imagine it is launch day and it went badly. Work backwards. Best before a big release.', 'Appreciations round - only when the team is bruised and needs to recover, not as an avoidance tactic.', 'Team health check radar - score dimensions, compare with last quarter, discuss the biggest move. Good quarterly.', 'Pre-mortem for the next quarter - "how will this fail?" Feeds straight into the RAID log.'] },
        { heading: 'Making actions stick', bullets: ['Two actions, maximum. Five actions is zero actions.', 'Each action needs a named owner, a date and a visible home in the backlog.', 'Open every retro by reviewing the last one\'s actions. This single habit changes everything.', 'If the same theme recurs three times, it is not a retro action - it is an escalation. Take it out of the room.'] },
        { heading: 'Facilitation notes', bullets: ['Write silently before speaking, every time. It doubles the number of ideas and flattens seniority.', 'Facilitate, do not contribute. If you must contribute, hand facilitation to someone else for that item.', 'Remote: use a timer everyone can see, and call on quieter people by name after they have written something.', 'If psychological safety is low, no format will save you. Fix that first, in one-to-ones.'] }
      ]
    }
  },

  {
    id: 'sprint-ceremonies-agendas',
    title: 'Sprint ceremony agendas',
    category: 'agile',
    level: 'core',
    minutes: 20,
    summary: 'Timeboxed agendas for planning, daily scrum, refinement and review, with the facilitation traps for each.',
    why: 'Ceremonies degrade into status theatre by default. A written agenda with a purpose line is what stops the drift.',
    tags: ['scrum', 'facilitation', 'ceremonies'],
    basedOn: 'Scrum Guide 2020 timeboxes',
    formats: ['md'],
    doc: {
      intro: 'Timeboxes below are for a two-week sprint. Halve them for a one-week sprint; do not double them for a four-week one.',
      sections: [
        { heading: 'Sprint planning - up to 4 hours', bullets: ['Purpose: agree why this sprint is valuable, what we will do, and how.', '20 min - Product Manager frames the sprint goal and the outcome it moves.', '20 min - capacity check: leave, on-call, interviews, support load. Plan the team you actually have.', '90 min - select and break down work until the team can commit, not until the hours add up.', '30 min - risks, dependencies, and the first thing each person will pick up.', '10 min - restate the sprint goal in one sentence everyone can repeat.', 'Trap: planning to 100% of capacity. Trap: a sprint goal that is a list of tickets.'] },
        { heading: 'Daily scrum - 15 minutes, standing or not', bullets: ['Purpose: inspect progress towards the sprint goal and re-plan the day. It is not a status report to the delivery manager.', 'Walk the board right to left. Finish work before starting work.', 'Three useful questions: what will stop us hitting the goal, what is stuck, and who needs help.', 'Anything needing more than two minutes goes to an "after party" with only the people involved.', 'Trap: round-the-room updates. Trap: the delivery manager asking each person what they did.'] },
        { heading: 'Backlog refinement - 60 to 90 minutes, once or twice a sprint', bullets: ['Purpose: get the top of the backlog to Ready, one to two sprints ahead. No further.', 'Bring three to six items, pre-read circulated. Refinement is not first-reading.', 'For each: who is it for, what changes for them, how we know it works, what could go wrong.', 'Slice anything that will not fit comfortably in a sprint. Vertical slices only.', 'Output: items meeting the Definition of Ready, or a clear question and an owner to answer it.', 'Trap: refining the whole backlog. Trap: estimating instead of understanding.'] },
        { heading: 'Sprint review - up to 2 hours', bullets: ['Purpose: inspect the increment with stakeholders and adapt the backlog. It is a working session, not a demo.', '10 min - sprint goal, what changed in the world, what we learned.', '40 min - show working software. The person who built it shows it, on the real thing, not slides.', '30 min - stakeholder reaction, questions, and the backlog implications captured live.', '10 min - what this means for the next sprint and the roadmap.', 'Trap: slides instead of software. Trap: no decisions taken, so nothing was really inspected.'] }
      ]
    }
  },

  {
    id: 'working-agreement',
    title: 'Team working agreement',
    category: 'agile',
    level: 'core',
    minutes: 45,
    summary: 'The social contract: core hours, meeting norms, comms expectations, code review turnaround, how disagreement gets resolved.',
    why: 'Most friction in a distributed team is unspoken expectation mismatch. Writing it down removes 80% of it in an hour.',
    tags: ['team-health', 'remote', 'team-agreements'],
    formats: ['md'],
    doc: {
      intro: 'Facilitate this in the team\'s first fortnight, and again whenever a third of the team has changed.',
      sections: [
        { heading: 'Time and availability', bullets: ['Core overlap hours, stated in a named timezone.', 'Ceremony times, and what happens when someone cannot make them.', 'Focus time that is protected from meetings, and who may break it.', 'Expectations outside working hours: the default is none, and this includes senior people.'] },
        { heading: 'Communication', bullets: ['Which channel for which purpose - and what "urgent" means in each.', 'Response-time expectations per channel, written as a maximum not an average.', 'Default to public channels; decisions made in DMs get restated in the open.', 'Meeting norms: agenda or it does not happen, cameras optional, notes and actions within 24 hours.'] },
        { heading: 'How we work', bullets: ['Work in progress limits per person and per column.', 'Code review turnaround target, and what to do when it is missed.', 'Pairing and mobbing: when it is expected rather than optional.', 'Definition of Ready and Definition of Done live here by reference.', 'How we handle interrupts and support: a rota, not the loudest voice.'] },
        { heading: 'Disagreement and decisions', bullets: ['Where decision rights sit - reference the RACI or decision-rights matrix.', 'Disagree and commit: how you signal it and what it obliges you to do.', 'How to raise something uncomfortable, including a route that is not your line manager.', 'How we give feedback: specific, timely, about behaviour, and in private first.'] },
        { heading: 'Keeping it honest', bullets: ['One page, visible, dated, and linked from the team channel.', 'Anyone can propose a change; changes are agreed by the team, not the delivery manager.', 'Review quarterly and after any significant joiner or leaver.', 'An agreement nobody has broken in six months is probably too soft to be doing any work.'] }
      ]
    }
  }
];
