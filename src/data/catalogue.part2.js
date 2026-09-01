'use strict';

/*
 * Resource definitions, part 2 of 2: stakeholders & communication, metrics &
 * reporting, team health, and career development.
 */

module.exports = [
  /* --------------------- stakeholders & communication --------------------- */
  {
    id: 'stakeholder-map',
    title: 'Stakeholder map and influence grid',
    category: 'stakeholders',
    level: 'core',
    minutes: 30,
    summary: 'Interest / influence grid plus a per-stakeholder record: what they need, what they fear, and how they want to hear from you.',
    why: 'Stakeholder trouble is almost always an unmet information need. Map it once and the escalations mostly stop.',
    tags: ['stakeholders', 'communication', 'influence'],
    basedOn: 'Mendelow interest/influence grid, extended with a needs-and-fears column',
    formats: ['csv', 'md'],
    table: {
      columns: ['Name', 'Role', 'Interest (1-5)', 'Influence (1-5)', 'Quadrant', 'What they need from this', 'What they are worried about', 'Current stance', 'Target stance', 'Preferred channel', 'Cadence', 'Owned by', 'Last contact'],
      sampleRows: [
        ['S. Sponsor', 'Director of Operations', '5', '5', 'Manage closely', 'Confidence the launch date holds and the cost envelope is respected', 'Being surprised in front of the exec team', 'Supportive', 'Advocate', '1:1, 30 min', 'Weekly', 'Delivery Manager', '2026-08-28'],
        ['F. Finance', 'Finance Business Partner', '2', '4', 'Keep satisfied', 'Accurate forecast and early warning of variance', 'Unplanned spend appearing at month end', 'Neutral', 'Supportive', 'Written summary', 'Monthly', 'Delivery Manager', '2026-08-14'],
        ['C. Contact Centre', 'Head of Customer Care', '5', '3', 'Keep informed', 'Enough notice to retrain 60 agents', 'A launch that increases contact volume', 'Sceptical', 'Neutral', 'Team meeting slot', 'Fortnightly', 'Product Manager', '2026-08-26'],
        ['L. Legal', 'Legal Counsel / DPO', '3', '5', 'Manage closely', 'Evidence the DPIA and retention rules are handled', 'Regulatory exposure discovered post-launch', 'Neutral', 'Supportive', 'Email with documents attached', 'At each gate', 'Product Manager', '2026-08-20']
      ]
    },
    doc: {
      intro: 'Do this in your first fortnight on any delivery, and redo it whenever the org chart moves.',
      sections: [
        { heading: 'The four quadrants and what each one buys you', bullets: ['High interest, high influence - manage closely. Direct contact, no surprises, ever.', 'Low interest, high influence - keep satisfied. Short, factual, on their terms. They become dangerous when uninformed.', 'High interest, low influence - keep informed. Often your most useful allies and your best early warning system.', 'Low interest, low influence - monitor. Do not spend the effort, but check nothing has changed.'] },
        { heading: 'The two columns people skip', bullets: ['"What they are worried about" is the one that changes your behaviour. Ask them directly; do not guess.', 'Current stance versus target stance turns stakeholder management into something you can plan and review.'] },
        { heading: 'Ethical line', bullets: ['This is a tool for communicating well, not for managing people covertly. Nothing in it should embarrass you if the stakeholder read it.', 'Keep it factual. Do not record personal characteristics or opinions about individuals - that is personal data with no lawful purpose.'] }
      ]
    }
  },

  {
    id: 'comms-plan',
    title: 'Communications plan',
    category: 'stakeholders',
    level: 'core',
    minutes: 25,
    summary: 'Audience-by-audience plan: message, channel, cadence, owner, and the thing you will say when it goes wrong.',
    why: 'A comms plan written before the bad news arrives is worth ten written after.',
    tags: ['communication', 'change', 'stakeholders'],
    formats: ['csv'],
    table: {
      columns: ['Audience', 'What they need to know', 'Key message', 'Channel', 'Cadence', 'Owner', 'First send', 'Success looks like', 'If it goes wrong we will say'],
      sampleRows: [
        ['Exec / steering group', 'Confidence, variance, decisions needed', 'On track for 29 Sep; one blocking dependency with a written fallback', 'One-page written report before the meeting', 'Monthly', 'Delivery Manager', '2026-09-04', 'No questions that could have been answered by the report', 'Here is the new date, the cause, the options and the recommendation'],
        ['Delivery team', 'Priorities, changes, why', 'The sprint goal and what changed in the world since last sprint', 'Team channel + sprint planning', 'Weekly', 'Delivery Manager', '2026-09-01', 'Anyone in the team can state the sprint goal unprompted', 'Straight away, in the open, with what we know and do not know'],
        ['Contact centre', 'What changes for agents and when', 'Two new screens from 29 Sep; training in week commencing 22 Sep', 'Team briefing + one-page guide', 'Fortnightly, then weekly from T-3', 'Product Manager', '2026-09-08', 'No spike in agent-raised tickets in launch week', 'Pause the rollout, brief the floor within the hour'],
        ['Customers', 'Anything visibly different', 'Faster checkout, nothing to relearn', 'In-product notice + help centre update', 'At launch', 'Product Manager', '2026-09-29', 'Contact rate flat or down', 'Status page updated within 15 minutes, plain English, no blame']
      ]
    }
  },

  {
    id: 'status-report',
    title: 'Weekly status report',
    category: 'reporting',
    level: 'core',
    minutes: 20,
    summary: 'One page: RAG with a reason, what shipped, what is next, decisions needed, and the honest list of what is wobbling.',
    why: 'A report that never says amber is not a report. Build the format so bad news is cheap to deliver.',
    tags: ['reporting', 'governance', 'communication'],
    formats: ['md'],
    doc: {
      intro: 'The test of a good status report: a stakeholder can read it in ninety seconds and knows exactly what you need from them.',
      sections: [
        { heading: 'Header block', bullets: ['Delivery name, reporting period, author, date.', 'Overall RAG, and separate RAG for scope, schedule, cost, risk and team health.', 'A RAG rating with no one-line reason next to it is noise. Always give the reason.'] },
        { heading: 'RAG definitions - agree these once', bullets: ['Green - on track against the agreed plan; no help needed.', 'Amber - a credible risk to a commitment, and there is an action or a decision that would fix it. Name it.', 'Red - a commitment will be missed, or has been. A revised plan is attached or dated.', 'Never go green to red. If you do, the amber stage was being hidden.'] },
        { heading: 'Body - four short sections', bullets: ['Shipped this period - outcomes and evidence, not activity. "Guest checkout live to 10% of traffic" beats "worked on checkout".', 'Next period - the two or three things that matter, with dates.', 'Decisions or help needed - each with the decision, the options, the recommendation, and the date it is needed by. This is the most valuable part of the report.', 'Risks and issues changed since last time - deltas only; the full list lives in the RAID log.'] },
        { heading: 'Metrics strip', bullets: ['Three to five numbers, same ones every week, with the direction of travel.', 'At least one outcome measure, not just delivery throughput.', 'Include the counter-metric you promised not to damage.'] },
        { heading: 'Discipline that makes it land', bullets: ['Same format, same day, same time, every week, without exception.', 'Send it before the meeting so the meeting can be about decisions.', 'Keep it to one page. Appendices for anyone who wants the detail.', 'Write it yourself. Delegating the status report is delegating your understanding of the delivery.'] }
      ]
    }
  },

  {
    id: 'steering-pack',
    title: 'Steering group / governance board pack',
    category: 'reporting',
    level: 'intermediate',
    minutes: 40,
    summary: 'Agenda, pre-read structure, decision papers, and the rules that stop a steering group becoming a monthly status recital.',
    why: 'If your steering group makes no decisions, you have a very expensive audience. Design the pack around decisions.',
    tags: ['governance', 'reporting', 'stakeholders'],
    formats: ['md'],
    doc: {
      intro: 'Structure the whole pack around the decisions you need. Everything else is an appendix.',
      sections: [
        { heading: 'Agenda (60 minutes)', bullets: ['5 min - actions from last time, closed or not, no discussion of the closed ones.', '10 min - delivery position: RAG with reasons, one metrics slide.', '30 min - decisions. One paper per decision, each pre-read.', '10 min - risks above tolerance, and any risk the board is being asked to accept.', '5 min - confirm actions, owners and dates back to the room.'] },
        { heading: 'Decision paper structure - one page each', bullets: ['The decision required, phrased as a question with a yes/no or an option choice.', 'Background in three sentences.', 'Options, with cost, benefit and risk for each. At least two real options.', 'Recommendation, and what happens if no decision is taken this month.', 'Who has been consulted, including security, legal and finance where relevant.'] },
        { heading: 'Rules of the room', bullets: ['Pre-read circulated three working days before. No pre-read, no decision - the item rolls.', 'Quorum defined in the terms of reference, including named deputies.', 'Decisions minuted with the accountable name attached, and copied to the decision log.', 'Risk acceptance is written and signed, never verbal.', 'If two consecutive meetings produce no decisions, propose reducing the frequency. Governance should cost what it is worth.'] },
        { heading: 'Terms of reference checklist', bullets: ['Purpose and the decisions this group owns - and, explicitly, the ones it does not.', 'Membership, chair, deputies, quorum.', 'Frequency, escalation route upward, and delegated authority downward with thresholds.', 'How the group holds itself to account: attendance, action closure rate, decision latency.'] }
      ]
    }
  },

  /* ---------------------------- metrics & flow ---------------------------- */
  {
    id: 'flow-metrics-starter',
    title: 'Flow and delivery metrics starter pack',
    category: 'reporting',
    level: 'intermediate',
    minutes: 45,
    summary: 'Definitions, how to collect them, what each one is for, and which ones get gamed the moment you report on them.',
    why: 'Velocity is not a performance measure. Knowing the difference between flow metrics and outcome metrics is a career-defining distinction.',
    tags: ['metrics', 'flow', 'dora', 'kanban'],
    basedOn: 'Kanban flow metrics; DORA four key metrics (Accelerate, Forsgren/Humble/Kim); Scrum Guide on velocity',
    formats: ['md'],
    doc: {
      intro: 'Pick four metrics, instrument them properly, and hold them stable for two quarters. Rotating metrics quarterly teaches you nothing.',
      sections: [
        { heading: 'Flow metrics - how work moves', bullets: ['Cycle time - from work started to work delivered. Report the 50th and 85th percentiles, never the mean.', 'Lead time - from request to delivery. What the customer actually experiences.', 'Throughput - items completed per week. Simple, hard to game, better than velocity for forecasting.', 'Work in progress - items started and not finished. The lever you control; reducing it reduces cycle time, arithmetically.', 'Flow efficiency - touch time divided by total elapsed time. Usually a shocking number, typically 15 to 40%, and the most useful diagnostic you have.'] },
        { heading: 'DORA metrics - how well you deliver software', bullets: ['Deployment frequency - how often you get to production.', 'Lead time for changes - commit to production.', 'Change failure rate - percentage of changes causing degradation.', 'Failed deployment recovery time - how fast you recover.', 'Read the first two together with the second two, always. Speed without stability is a false economy and stability without speed is a slow one.'] },
        { heading: 'Outcome metrics - whether it mattered', bullets: ['One measure of the user behaviour you were trying to change.', 'One measure of business value: revenue, cost, contact rate, retention.', 'One counter-metric you have promised not to damage - accessibility, error rate, complaint volume.', 'Without these, flow metrics only prove you are efficiently producing output.'] },
        { heading: 'Metrics that get gamed', bullets: ['Velocity - inflates the moment it is compared between teams or reported upward. Use throughput instead.', 'Story points per person - meaningless and corrosive. Never collect it.', 'Ticket closure counts - encourages splitting work to look productive.', 'Utilisation - drive it to 100% and queue times go to infinity. This is queuing theory, not opinion.'] },
        { heading: 'Forecasting honestly', bullets: ['Use throughput history and a Monte Carlo simulation, not an average. Ten thousand runs against your last twelve weeks takes minutes.', 'Quote forecasts as ranges with confidence: "85% confident by 17 October".', 'Never quote a single date derived from an average. Half the time it will be wrong, and the half that is late is the half people remember.', 'Recalculate weekly. A forecast is a perishable good.'] },
        { heading: 'Getting started in one sprint', bullets: ['Week 1 - add "started" and "finished" timestamps to your board. That is 80% of flow metrics.', 'Week 2 - draw a cumulative flow diagram and a cycle-time scatterplot. Look for flat lines and outliers.', 'Sprint 2 - set a WIP limit at roughly the number of people divided by two, and hold it for a month.', 'Sprint 3 - bring the scatterplot to a retro and ask the team about the outliers, not the average.'] }
      ]
    }
  },

  {
    id: 'velocity-capacity-tracker',
    title: 'Capacity and throughput tracker',
    category: 'reporting',
    level: 'core',
    minutes: 15,
    summary: 'Sprint-by-sprint capacity model that accounts for leave, on-call, support load and interviews - then forecasts a range.',
    why: 'Teams do not miss sprints because they are slow. They miss because planning assumed ten people and delivered six and a half.',
    tags: ['capacity', 'forecasting', 'planning'],
    formats: ['csv', 'md'],
    table: {
      columns: ['Sprint', 'Start', 'End', 'Team members', 'Working days available', 'Leave (days)', 'On-call / support (days)', 'Interviews & other (days)', 'Net capacity (days)', 'Capacity vs baseline %', 'Items committed', 'Items completed', 'Items carried over', 'Unplanned work %', 'Notes'],
      sampleRows: [
        ['2026-16', '2026-08-04', '2026-08-15', '8', '80', '12', '8', '3', '57', '71%', '14', '11', '3', '18%', 'Summer leave peak; two incidents'],
        ['2026-17', '2026-08-18', '2026-08-29', '8', '80', '6', '8', '5', '61', '76%', '13', '13', '0', '9%', 'Clean sprint'],
        ['2026-18', '2026-09-01', '2026-09-12', '8', '80', '2', '8', '2', '68', '85%', '15', '', '', '', 'Forecast: 12-16 items at 85% confidence']
      ]
    },
    doc: {
      intro: 'Model capacity in days, forecast in item counts, and quote ranges. Never plan to 100%.',
      sections: [
        { heading: 'Building the model', bullets: ['Working days available = team members x sprint working days. Start from the calendar, not from optimism.', 'Deduct booked leave, the on-call rota, and known recruitment or training commitments.', 'Deduct a standing allowance for support and unplanned work, based on your own last six sprints - not a guess.', 'What remains is net capacity. If it is below 70% of baseline, say so at planning rather than at the review.'] },
        { heading: 'Forecasting from it', bullets: ['Track items completed per sprint for at least six sprints before forecasting anything.', 'Forecast a range from your lowest and highest recent throughput, scaled by the capacity ratio.', 'For anything longer than three sprints, use a Monte Carlo simulation over your throughput history.', 'Unplanned work percentage is your most useful early-warning signal. When it climbs above 25%, stop and find out why.'] },
        { heading: 'What not to do with it', bullets: ['Do not compare this tracker between teams. The numbers are only meaningful against the team\'s own history.', 'Do not show it to anyone who will read throughput as productivity without the surrounding context.', 'Do not use it to justify pressure. It exists to make commitments realistic, which is the opposite.'] }
      ]
    }
  },

  {
    id: 'cycle-time-worksheet',
    title: 'Cycle time and flow efficiency worksheet',
    category: 'reporting',
    level: 'intermediate',
    minutes: 30,
    summary: 'Per-item timestamps that produce cycle time percentiles, blocked time and flow efficiency without any tooling.',
    why: 'Flow efficiency of 20% means your problem is queues, not effort. That single realisation redirects most improvement work.',
    tags: ['metrics', 'flow', 'improvement'],
    formats: ['csv', 'md'],
    table: {
      columns: ['Item ID', 'Title', 'Type', 'Requested', 'Started', 'First blocked', 'Total blocked days', 'Total waiting days', 'Delivered', 'Lead time (days)', 'Cycle time (days)', 'Touch time (days)', 'Flow efficiency %', 'Blocked reason'],
      sampleRows: [
        ['ACC-101', 'Passwordless sign-in - happy path', 'Feature', '2026-07-14', '2026-08-04', '2026-08-07', '4', '3', '2026-08-15', '32', '11', '4', '36%', 'Waiting on identity endpoint'],
        ['ACC-104', 'Sign-in error messaging', 'Feature', '2026-07-28', '2026-08-11', '-', '0', '2', '2026-08-14', '17', '3', '2', '67%', '-'],
        ['ACC-108', 'Rate limit sign-in attempts', 'Tech', '2026-08-05', '2026-08-18', '2026-08-20', '5', '1', '2026-08-29', '24', '11', '3', '27%', 'Security review queue'],
        ['ACC-111', 'Audit log for sign-in events', 'Compliance', '2026-08-06', '2026-08-19', '-', '0', '4', '2026-08-28', '22', '9', '3', '33%', 'Waiting on code review']
      ]
    },
    doc: {
      intro: 'You need four timestamps per item: requested, started, delivered, and days blocked. Everything else is derived.',
      sections: [
        { heading: 'Formulas', bullets: ['Lead time = delivered - requested.', 'Cycle time = delivered - started.', 'Touch time = cycle time - blocked days - waiting days.', 'Flow efficiency = touch time / cycle time, as a percentage.'] },
        { heading: 'Reading the numbers', bullets: ['Report the 50th and 85th percentile cycle time. Use the 85th for commitments, the 50th for conversation.', 'Flow efficiency below 30% means the constraint is handoffs and queues. Adding people will make it worse.', 'The gap between lead time and cycle time is how long work sat in your backlog before anyone touched it - often the biggest single number and the least discussed.', 'Group blocked reasons and count them. The top two are your improvement backlog for the quarter.'] },
        { heading: 'Turning it into action', bullets: ['Bring a cycle-time scatterplot to a retro and discuss only the items above the 85th percentile.', 'For each outlier ask what it was waiting for, not who was working on it.', 'Set one WIP limit or one queue-removal experiment per retro. Measure it for four weeks.', 'Never set a cycle-time target for individuals. It converts a diagnostic into a lie.'] }
      ]
    }
  },

  {
    id: 'go-live-checklist',
    title: 'Go-live and go/no-go checklist',
    category: 'reporting',
    level: 'intermediate',
    minutes: 35,
    summary: 'Pre-launch checklist across product, technical, accessibility, security, privacy, support and rollback, with named owners.',
    why: 'The go/no-go meeting should be a reading of evidence already gathered, not a conversation about how everyone feels.',
    tags: ['launch', 'quality', 'risk', 'accessibility'],
    formats: ['csv'],
    table: {
      columns: ['Area', 'Check', 'Evidence required', 'Owner', 'Status', 'Blocking?', 'Notes'],
      sampleRows: [
        ['Product', 'Success measures instrumented and baselined', 'Dashboard link with pre-launch baseline', 'Product Manager', 'Complete', 'Yes', ''],
        ['Product', 'Rollout plan agreed (percentage, stages, hold points)', 'Written plan', 'Product Manager', 'Complete', 'Yes', '10% -> 50% -> 100% over 5 days'],
        ['Technical', 'Load tested at 2x expected peak', 'Test report', 'Tech Lead', 'Complete', 'Yes', ''],
        ['Technical', 'Alerting and dashboards in place for the new paths', 'Alert definitions', 'Tech Lead', 'Complete', 'Yes', ''],
        ['Technical', 'Rollback tested, not just documented', 'Evidence of a rehearsed rollback', 'Tech Lead', 'In progress', 'Yes', 'Rehearsal booked 25 Sep'],
        ['Technical', 'Feature flag defaults verified in production config', 'Config diff', 'Tech Lead', 'Not started', 'Yes', ''],
        ['Accessibility', 'WCAG 2.2 AA audit passed on changed journeys', 'Audit report with issues closed', 'Designer', 'In progress', 'Yes', 'Two AA issues open'],
        ['Accessibility', 'Keyboard-only and screen-reader walkthrough of the full journey', 'Recorded walkthrough', 'Designer', 'Complete', 'Yes', 'NVDA + VoiceOver'],
        ['Accessibility', 'Accessibility statement updated', 'Published page', 'Product Manager', 'Not started', 'No', ''],
        ['Security', 'Penetration test findings closed or accepted', 'Report + acceptance record', 'Security', 'Complete', 'Yes', 'One low accepted by sponsor'],
        ['Security', 'Dependency and secret scanning clean', 'Pipeline output', 'Tech Lead', 'Complete', 'Yes', ''],
        ['Privacy', 'DPIA signed off; ROPA entry updated', 'Signed DPIA', 'DPO', 'Complete', 'Yes', ''],
        ['Privacy', 'Retention and deletion behaviour implemented and tested', 'Test evidence', 'Tech Lead', 'In progress', 'Yes', ''],
        ['Privacy', 'Privacy notice updated and versioned', 'Published page', 'DPO', 'Complete', 'Yes', ''],
        ['Support', 'Runbook written and reviewed by on-call', 'Runbook link', 'Delivery Manager', 'Complete', 'Yes', ''],
        ['Support', 'Frontline trained; guide issued', 'Attendance record', 'Product Manager', 'In progress', 'Yes', 'Training w/c 22 Sep'],
        ['Support', 'Known issues list and holding messages agreed', 'Written list', 'Product Manager', 'Not started', 'No', ''],
        ['Governance', 'Go/no-go decision recorded with named accountability', 'Decision log entry', 'Sponsor', 'Not started', 'Yes', '']
      ]
    }
  },

  /* ------------------------------ team health ------------------------------ */
  {
    id: 'team-health-check',
    title: 'Team health check',
    category: 'team',
    level: 'core',
    minutes: 30,
    summary: 'Eleven dimensions the team scores anonymously each quarter, with the facilitation guide and how to act on the results.',
    why: 'Health checks are for the team, not for management. Run it that way and it becomes the most useful half hour of the quarter.',
    tags: ['team-health', 'psychological-safety', 'facilitation'],
    basedOn: 'Squad health check model (Spotify, CC BY-SA), adapted and extended with delivery-specific dimensions',
    formats: ['csv', 'md'],
    table: {
      columns: ['Dimension', 'Good looks like', 'Bad looks like', 'Score (1-5)', 'Trend vs last quarter', 'Team comment', 'Action', 'Owner'],
      sampleRows: [
        ['Delivering value', 'We ship things users notice and we can see the effect', 'We ship, but nobody can say what changed', '', '', '', '', ''],
        ['Easy to release', 'Releasing is boring and happens on demand', 'Releases are events with a runbook and a prayer', '', '', '', '', ''],
        ['Suitable process', 'Our process helps; we change it when it does not', 'Ceremonies happen because they are in the calendar', '', '', '', '', ''],
        ['Tech quality', 'We are proud of the codebase and can change it safely', 'We are afraid to touch things', '', '', '', '', ''],
        ['Psychological safety', 'I can say "I do not know" or "I disagree" without cost', 'I choose my words carefully in team meetings', '', '', '', '', ''],
        ['Learning', 'We learn something every sprint and it changes what we do', 'We are too busy to learn', '', '', '', '', ''],
        ['Mission', 'I can state what we are for and why it matters', 'We work on whatever arrives', '', '', '', '', ''],
        ['Fun', 'I look forward to most days', 'I am counting down', '', '', '', '', ''],
        ['Support', 'I get help when I need it, quickly', 'I am on my own', '', '', '', '', ''],
        ['Pawns or players', 'We influence what we work on and how', 'Decisions arrive fully formed', '', '', '', '', ''],
        ['Sustainable pace', 'We work hard and stop; last month was not an exception', 'Crunch is normal and unremarked', '', '', '', '', '']
      ]
    },
    doc: {
      intro: 'Run it quarterly, anonymously, and share the aggregate with the team before anyone else sees it.',
      sections: [
        { heading: 'How to run it (30 minutes)', bullets: ['Score individually and anonymously beforehand - a simple form is fine.', 'Show the aggregate and the trend. Do not show individual scores, ever.', 'Discuss the two biggest movers, not the lowest score. Movement is the signal.', 'Pick one dimension and one action. One. Owned by a person, with a date.'] },
        { heading: 'The rules that keep it safe', bullets: ['Anonymous means anonymous. In a team under six, use a scale summary rather than free text.', 'The team sees results first, and decides what to share upward. If management gets the raw data, scores will drift green within two quarters.', 'Never compare teams. Never put it in a performance review. Never use it to rank.', 'If psychological safety scores low, that is the only dimension worth working on this quarter.'] },
        { heading: 'Acting on the results', bullets: ['Low "easy to release" and low "tech quality" together means invest in the pipeline before anything else.', 'Low "pawns or players" is usually a symptom of how work arrives, not of the team. Fix intake.', 'Low "sustainable pace" that persists for two quarters is a staffing or commitment problem and needs escalating, not a wellbeing poster.', 'High everything is not necessarily good news - check that people feel able to score honestly.'] }
      ]
    }
  },

  {
    id: 'one-to-one-template',
    title: 'One-to-one template and question bank',
    category: 'team',
    level: 'core',
    minutes: 20,
    summary: 'Structure for regular one-to-ones plus sixty questions grouped by what you are trying to find out.',
    why: 'One-to-ones are where you learn the things that never appear on a board. Turning up without a question wastes the slot.',
    tags: ['coaching', 'leadership', 'team-health'],
    formats: ['md'],
    doc: {
      intro: 'Their meeting, not yours. Thirty minutes, fortnightly minimum, and it does not get cancelled for delivery pressure - delivery pressure is exactly when it matters.',
      sections: [
        { heading: 'Structure', bullets: ['5 min - how are you, actually. Wait through the first answer; the second one is the real one.', '10 min - their agenda. Ask them to bring one thing.', '10 min - your agenda: feedback, context, a nudge on growth.', '5 min - actions both ways, and confirm the next one is in the diary.'] },
        { heading: 'Questions - how the work is going', bullets: ['What has been the most frustrating part of the last two weeks?', 'Where are you waiting on someone else?', 'What are you working on that you think is not worth doing?', 'If you could delete one meeting, which one?', 'What is taking longer than it should, and why?'] },
        { heading: 'Questions - growth and career', bullets: ['What do you want to be doing in eighteen months that you are not doing now?', 'What skill are you deliberately building at the moment?', 'What work would you take on if you had a spare day a week?', 'Who in the organisation do you learn the most from, and do you get enough time with them?', 'What is the feedback you have had that you disagree with?'] },
        { heading: 'Questions - team and environment', bullets: ['Is there anything the team is avoiding talking about?', 'When did you last feel unable to say what you thought in a meeting?', 'Who has done something recently that deserved more credit than it got?', 'What would you change about how work arrives with us?', 'Is your workload sustainable for the next three months? Be honest with me.'] },
        { heading: 'Questions - about you as their manager', bullets: ['What should I be doing more of, and less of?', 'What do I not know that I should?', 'Have I got in your way recently?', 'What have I asked for that turned out to be a bad idea?'] },
        { heading: 'Doing it well', bullets: ['Take notes and act on them. Nothing kills the value faster than repeated raising of the same unaddressed thing.', 'Keep a running doc per person, shared with them, so neither of you re-runs old ground.', 'Never use the slot for a status update. If you need status, get it from the board.', 'Silence is a tool. Ask, then wait longer than is comfortable.'] }
      ]
    }
  },

  {
    id: 'onboarding-30-60-90',
    title: 'First 30 / 60 / 90 days as a delivery manager',
    category: 'career',
    level: 'core',
    minutes: 30,
    summary: 'What to do, learn, ask and change in your first three months on a new team - and what not to touch yet.',
    why: 'The most common new-DM mistake is changing the process in week two. The second is changing nothing in month three.',
    tags: ['onboarding', 'career', 'leadership'],
    formats: ['md'],
    doc: {
      intro: 'Diagnose before you prescribe. But do set a deadline on the diagnosis, or you will still be observing at Christmas.',
      sections: [
        { heading: 'Days 1-30: understand, change almost nothing', bullets: ['One-to-one with every team member. Ask what is broken and what is working - and write it down.', 'Map the stakeholders and find out what each one is worried about.', 'Attend every ceremony as an observer. Note what is performative.', 'Trace one piece of work end to end, from request to production, and time each wait.', 'Find the RAID log, the roadmap and the last three status reports. Their absence tells you as much as their contents.', 'Fix only the things that are free: a missing agenda, an unowned action, a broken calendar invite.', 'Write down your hypotheses at day 30. You will want them later.'] },
        { heading: 'Days 31-60: make two changes, well', bullets: ['Pick the two highest-leverage problems from your day-30 list. Two, not seven.', 'Change them with the team, in a retro, framed as an experiment with a review date.', 'Get flow metrics in place if they are missing - timestamps on the board is enough to start.', 'Establish the reporting rhythm: same day, same format, one page, and never miss one.', 'Agree the working agreement and the Definition of Done if they do not exist.', 'Start building the relationship you will need for the hard conversation in month four.'] },
        { heading: 'Days 61-90: prove it and set direction', bullets: ['Show the before-and-after on the two changes. Evidence, not assertion.', 'Run a health check and a proper roadmap re-cut with the team.', 'Take one thing off the team\'s plate permanently - a report nobody reads, a meeting with no decisions.', 'Name the structural problem you cannot fix alone and escalate it properly, with options.', 'Agree with your own manager what good looks like at six months.'] },
        { heading: 'Things to resist', bullets: ['Importing the process from your last team wholesale. It worked there because of things you cannot see here.', 'Becoming the team\'s reporting layer. If you are the only route to information, you have made yourself a bottleneck.', 'Taking on the scrum master, product owner and BA roles because they are vacant. Name the gap instead.', 'Being liked at the cost of being useful. The team needs someone who will say the uncomfortable thing to the sponsor.'] }
      ]
    }
  },

  {
    id: 'discovery-plan',
    title: 'Discovery plan',
    category: 'planning',
    level: 'intermediate',
    minutes: 40,
    summary: 'Timeboxed discovery: the questions, the riskiest assumptions, the research plan, and the decision at the end.',
    why: 'Discovery without a stated decision point becomes a research habit. Timebox it and name what you will decide.',
    tags: ['discovery', 'research', 'outcomes'],
    basedOn: 'GOV.UK Service Manual discovery and alpha phases (Open Government Licence v3.0)',
    formats: ['md'],
    doc: {
      intro: 'Discovery is buying information. Be explicit about what information, what it costs, and what decision it unlocks.',
      sections: [
        { heading: 'Frame it', bullets: ['The problem, as currently understood, in one paragraph.', 'The decision this discovery exists to inform, and who makes it.', 'Timebox: weeks, not "until we know". Four to eight weeks is typical.', 'Team: who is on it and for what share of their time.'] },
        { heading: 'Questions and assumptions', bullets: ['List the questions you need answered, ordered by how much the answer would change your plan.', 'List your riskiest assumptions - the ones that, if wrong, invalidate the whole idea.', 'For each: what evidence would change your mind, and the cheapest way to get it.', 'If an assumption cannot be tested inside the timebox, say so and plan around the uncertainty.'] },
        { heading: 'Research plan', bullets: ['Who you will speak to, how many, and how you will recruit them - including people who currently cannot use the service.', 'What existing data you will mine before speaking to anyone: support contacts, analytics, complaints, frontline knowledge.', 'Ethics and consent: recorded consent, data minimisation, no personal data in shared notes, a retention date for recordings.', 'Accessibility: include disabled users and assistive-technology users from the start, not as a later round.'] },
        { heading: 'Outputs', bullets: ['A recommendation, with the option you are rejecting and why.', 'Evidence pack: what you learned, and how confident you are in each finding.', 'A first slice you could build, sized.', 'What you still do not know, and whether it is worth more discovery or better tested by building.'] },
        { heading: 'Stopping rules', bullets: ['Stop early if you learn the problem is not worth solving. This is a success, and should be celebrated as one.', 'Stop at the timebox even if incomplete, and report honestly on what is unresolved.', 'Do not roll discovery into build without an explicit decision. That is how six-month discoveries happen.'] }
      ]
    }
  },

  {
    id: 'incident-postmortem',
    title: 'Blameless post-incident review',
    category: 'team',
    level: 'intermediate',
    minutes: 45,
    summary: 'Timeline, contributing factors, what made it hard, and actions - written so that nobody needs to defend themselves.',
    why: 'The purpose is a safer system, not an accountable individual. Any review that produces "be more careful" has failed.',
    tags: ['incidents', 'learning', 'resilience'],
    basedOn: 'Blameless post-mortem practice; human-factors framing of contributing conditions',
    formats: ['md'],
    doc: {
      intro: 'Run it within five working days, with everyone involved, and circulate it widely. The value is in what other teams learn.',
      sections: [
        { heading: 'Header', bullets: ['Severity, duration of impact, users affected, and what they experienced in plain language.', 'Detection: how you found out, and how long that took.', 'Facilitator, participants, and date of review.'] },
        { heading: 'Timeline', bullets: ['Timestamped, factual, in the tense of the people involved: what was known at the time, not what we know now.', 'Include the moments of confusion and the wrong turns - those are the most instructive entries.', 'Mark detection, first mitigation, and full resolution.'] },
        { heading: 'Contributing factors', bullets: ['Not "root cause" - there is rarely one. List the conditions that combined.', 'Include the ones that made the incident harder to detect or resolve, not just the ones that caused it.', 'Include organisational conditions: a rushed change window, an unstaffed on-call, an alert everyone ignores because it fires daily.', 'Language check: if a sentence names a person, rewrite it to name a condition.'] },
        { heading: 'What went well', bullets: ['Genuinely - what stopped this being worse.', 'Which controls, alerts or instincts worked, so you know what to protect.'] },
        { heading: 'Actions', bullets: ['Maximum five. Each with an owner, a date and a ticket.', 'Prefer actions that remove the possibility over actions that ask for more vigilance.', 'Separate "prevent recurrence" from "detect faster" from "recover faster" - you usually need one of each.', 'Track them to closure in the open. Unclosed incident actions are the strongest predictor of a repeat.'] },
        { heading: 'Facilitation', bullets: ['Say the ground rules out loud: we are examining the system, hindsight is not available to the people in the timeline.', 'Ask "what made that reasonable at the time?" whenever someone made a call that looks wrong now.', 'No senior person speaks first.', 'If someone apologises, thank them and redirect to the condition that made the error possible.'] }
      ]
    }
  },

  {
    id: 'project-closure',
    title: 'Closure report and lessons learned',
    category: 'reporting',
    level: 'intermediate',
    minutes: 40,
    summary: 'How to close properly: outcomes against the original case, handover, cost, and lessons written so someone else can use them.',
    why: 'Nobody reads a lessons-learned log. Write yours so that the next delivery manager could act on it without asking you.',
    tags: ['closure', 'learning', 'benefits'],
    formats: ['csv', 'md'],
    table: {
      columns: ['Area', 'What we expected', 'What happened', 'Variance', 'Why', 'Lesson', 'Who should act on it', 'Recorded where'],
      sampleRows: [
        ['Outcome', 'Sign-in failure rate under 2%', '1.6%', 'Better than target', 'Passwordless removed the largest failure category entirely', 'Fix the biggest failure category before optimising the rest', 'Access squad, Growth squad', 'Decision log DEC-021'],
        ['Schedule', 'Live 29 Sep', 'Live 6 Oct', '+1 week', 'Accessibility fixes found late in the AA audit', 'Book the accessibility audit at the start of the sprint before launch, not in launch week', 'All squads; added to go-live checklist', 'Go-live checklist v3'],
        ['Cost', 'GBP 240k', 'GBP 262k', '+9%', 'Two weeks of unplanned platform work', 'Carry a 10% contingency for shared-platform dependencies', 'Portfolio planning', 'Planning guidance'],
        ['Team', 'Sustainable pace throughout', 'Two weeks of overtime pre-launch', 'Worse', 'Scope was not cut when the dependency slipped', 'Agree the scope-cut list before the launch window opens, not during it', 'Delivery managers', 'Working agreement']
      ]
    },
    doc: {
      intro: 'Closure is a deliverable. Budget two days for it, and do it before the team disperses.',
      sections: [
        { heading: 'Closure report contents', bullets: ['Outcomes against the original business case - including the measures you did not hit.', 'Final scope versus original scope, with the deliberate cuts named.', 'Cost and schedule variance, with causes.', 'What is now in live service, who owns it, and what it costs to run.', 'Open risks and issues transferred, with the accepting owner named.', 'Benefits still to be realised, who owns them, and when they will be measured.'] },
        { heading: 'Handover checklist', bullets: ['Runbook, alerting and on-call ownership confirmed by the receiving team - in writing.', 'Documentation and architecture decision records in the receiving team\'s space, not yours.', 'Access, licences and cost centres transferred.', 'Support model agreed: who answers, in what hours, with what escalation.', 'A dated review point after handover to check it actually stuck.'] },
        { heading: 'Writing lessons that get used', bullets: ['A lesson is an instruction to a future person, not an observation. "Book the accessibility audit a sprint early" beats "accessibility took longer than expected".', 'Name who should act on it and where it has been recorded. A lesson with no home is a lesson lost.', 'Feed lessons into the artefacts people actually use - the go-live checklist, the Definition of Done, planning guidance.', 'Include the lessons that reflect badly on you. Those are the ones with the most information in them.'] },
        { heading: 'Closing well with people', bullets: ['Say what each person contributed, specifically, in writing, where their manager can see it.', 'Run a final retro focused on the whole delivery, not the last sprint.', 'Make sure everyone knows what they are doing next before the last day.'] }
      ]
    }
  }
];
